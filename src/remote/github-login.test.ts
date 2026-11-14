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

const CALLBACK = 'https://wa.exemplo.dev/oauth/callback';

function settingsWith(fetchFn: typeof fetch): GithubLoginSettings {
  return {
    clientId: 'cid',
    clientSecret: 'csecret',
    allowedEmails: ['dono@exemplo.dev'],
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
  it('pede só user:email, com state, retorno e sem cadastro novo', () => {
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

describe('parseEmailList e pickAllowedEmail', () => {
  it('normaliza a lista e ignora itens sem @', () => {
    expect(parseEmailList(' Dono@Exemplo.dev, ,x ,b@c.d')).toEqual(['dono@exemplo.dev', 'b@c.d']);
    expect(parseEmailList(null)).toEqual([]);
  });

  it('só aceita e-mail verificado e da lista, sem diferenciar maiúsculas', () => {
    const allowed = ['dono@exemplo.dev'];
    expect(pickAllowedEmail([{ email: 'DONO@exemplo.dev', verified: true }], allowed)).toBe(
      'dono@exemplo.dev',
    );
    expect(pickAllowedEmail([{ email: 'dono@exemplo.dev', verified: false }], allowed)).toBeNull();
    expect(pickAllowedEmail([{ email: 'outro@exemplo.dev', verified: true }], allowed)).toBeNull();
  });
});

describe('exchangeGithubCode e fetchGithubEmails', () => {
  it('troca o código mandando segredo, retorno e User-Agent', async () => {
    const fetchFn = fakeGithub([]);
    await expect(exchangeGithubCode(settingsWith(fetchFn), 'c1', CALLBACK)).resolves.toBe('gho_x');
    const init = vi.mocked(fetchFn).mock.calls[0]?.[1];
    expect(JSON.parse(init?.body as string)).toMatchObject({
      code: 'c1',
      client_secret: 'csecret',
    });
    expect(new Headers(init?.headers).get('user-agent')).toBe(GITHUB_USER_AGENT);
  });

  it('recusa quando o GitHub não devolve token', async () => {
    const settings = settingsWith(fakeGithub([], 400));
    await expect(exchangeGithubCode(settings, 'c', CALLBACK)).rejects.toThrow('não confirmou');
    const notJson = vi.fn(() => Promise.resolve(new Response('x'))) as unknown as typeof fetch;
    await expect(exchangeGithubCode(settingsWith(notJson), 'c', CALLBACK)).rejects.toThrow();
  });

  it('lê os e-mails; resposta que não é lista vira vazia e erro HTTP rejeita', async () => {
    await expect(fetchGithubEmails(settingsWith(fakeGithub({})), 't')).resolves.toEqual([]);
    const fail = vi.fn(() =>
      Promise.resolve(new Response('', { status: 401 })),
    ) as unknown as typeof fetch;
    await expect(fetchGithubEmails(settingsWith(fail), 't')).rejects.toThrow('401');
  });
});

describe('finishGithubLogin e githubUpstreamLogin', () => {
  it('devolve o e-mail aceito', async () => {
    const settings = settingsWith(fakeGithub([{ email: 'dono@exemplo.dev', verified: true }]));
    const query = new URLSearchParams({ code: 'c' });
    await expect(finishGithubLogin(settings, query, CALLBACK)).resolves.toBe('dono@exemplo.dev');
    const login = githubUpstreamLogin(settings);
    expect(login.kind).toBe('upstream');
    expect(login.start('st', CALLBACK)).toContain('state=st');
    await expect(login.finish(query, CALLBACK)).resolves.toBe('dono@exemplo.dev');
  });

  it('recusa login cancelado e conta fora da lista', async () => {
    const settings = settingsWith(fakeGithub([{ email: 'x@y.z', verified: true }]));
    await expect(
      finishGithubLogin(settings, new URLSearchParams({ error: 'access_denied' }), CALLBACK),
    ).rejects.toThrow('cancelado');
    await expect(
      finishGithubLogin(settings, new URLSearchParams({ code: 'c' }), CALLBACK),
    ).rejects.toThrow('ALLOWED_EMAILS');
  });
});
