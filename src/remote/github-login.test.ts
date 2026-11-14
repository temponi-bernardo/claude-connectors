import { describe, expect, it, vi } from 'vitest';
import {
  GITHUB_USER_AGENT,
  exchangeGithubCode,
  fetchGithubEmails,
  finishGithubLogin,
  githubAuthorizeUrl,
  githubUpstreamLogin,
  parseEmailList,
  pickAllowedEmail,
  type GithubLoginSettings,
} from './github-login.js';

const CALLBACK = 'https://wa.example.dev/oauth/callback';

function settingsWith(fetchFn: typeof fetch): GithubLoginSettings {
  return {
    clientId: 'cid',
    clientSecret: 'csecret',
    allowedEmails: ['owner@example.dev'],
    fetchFn,
  };
}

function fakeGithub(emails: unknown, tokenStatus = 200): typeof fetch {
  return vi.fn((input: string) => {
    const url = input;
    if (url.includes('access_token')) {
      const body = tokenStatus === 200 ? { access_token: 'gho_x' } : { error: 'bad' };
      return Promise.resolve(Response.json(body, { status: tokenStatus }));
    }
    return Promise.resolve(Response.json(emails));
  }) as typeof fetch;
}

describe('githubAuthorizeUrl', () => {
  it('asks only for user:email, with state, callback and no new sign-ups', () => {
    const url = new URL(githubAuthorizeUrl(settingsWith(fetch), 'st', CALLBACK));
    expect(url.origin + url.pathname).toBe('https://github.com/login/oauth/authorize');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      client_id: 'cid',
      redirect_uri: CALLBACK,
      scope: 'user:email',
      state: 'st',
      allow_signup: 'false',
    });
  });
});

describe('parseEmailList and pickAllowedEmail', () => {
  it('normalizes the list and ignores items without @', () => {
    expect(parseEmailList(' Owner@Example.dev, ,x ,b@c.d')).toEqual(['owner@example.dev', 'b@c.d']);
    expect(parseEmailList(null)).toEqual([]);
  });

  it('only accepts a verified email on the list, case-insensitively', () => {
    const allowed = ['owner@example.dev'];
    expect(pickAllowedEmail([{ email: 'OWNER@example.dev', verified: true }], allowed)).toBe(
      'owner@example.dev',
    );
    expect(pickAllowedEmail([{ email: 'owner@example.dev', verified: false }], allowed)).toBeNull();
    expect(pickAllowedEmail([{ email: 'other@example.dev', verified: true }], allowed)).toBeNull();
  });
});

describe('exchangeGithubCode and fetchGithubEmails', () => {
  it('exchanges the code sending the secret, callback and User-Agent', async () => {
    const fetchFn = fakeGithub([]);
    await expect(exchangeGithubCode(settingsWith(fetchFn), 'c1', CALLBACK)).resolves.toBe('gho_x');
    const init = vi.mocked(fetchFn).mock.calls[0]?.[1];
    expect(JSON.parse(init?.body as string)).toMatchObject({
      code: 'c1',
      client_secret: 'csecret',
    });
    expect(new Headers(init?.headers).get('user-agent')).toBe(GITHUB_USER_AGENT);
  });

  it('rejects when GitHub returns no token', async () => {
    const settings = settingsWith(fakeGithub([], 400));
    await expect(exchangeGithubCode(settings, 'c', CALLBACK)).rejects.toThrow('did not confirm');
    const notJson = vi.fn(() => Promise.resolve(new Response('x'))) as unknown as typeof fetch;
    await expect(exchangeGithubCode(settingsWith(notJson), 'c', CALLBACK)).rejects.toThrow();
  });

  it('reads the emails; a non-list response becomes empty and an HTTP error rejects', async () => {
    await expect(fetchGithubEmails(settingsWith(fakeGithub({})), 't')).resolves.toEqual([]);
    const fail = vi.fn(() =>
      Promise.resolve(new Response('', { status: 401 })),
    ) as unknown as typeof fetch;
    await expect(fetchGithubEmails(settingsWith(fail), 't')).rejects.toThrow('401');
  });
});

describe('finishGithubLogin and githubUpstreamLogin', () => {
  it('returns the accepted email', async () => {
    const settings = settingsWith(fakeGithub([{ email: 'owner@example.dev', verified: true }]));
    const query = new URLSearchParams({ code: 'c' });
    await expect(finishGithubLogin(settings, query, CALLBACK)).resolves.toBe('owner@example.dev');
    const login = githubUpstreamLogin(settings);
    expect(login.kind).toBe('upstream');
    expect(login.start('st', CALLBACK)).toContain('state=st');
    await expect(login.finish(query, CALLBACK)).resolves.toBe('owner@example.dev');
  });

  it('rejects a cancelled login and an account off the list', async () => {
    const settings = settingsWith(fakeGithub([{ email: 'x@y.z', verified: true }]));
    await expect(
      finishGithubLogin(settings, new URLSearchParams({ error: 'access_denied' }), CALLBACK),
    ).rejects.toThrow('cancelled');
    await expect(
      finishGithubLogin(settings, new URLSearchParams({ code: 'c' }), CALLBACK),
    ).rejects.toThrow('ALLOWED_EMAILS');
  });
});
