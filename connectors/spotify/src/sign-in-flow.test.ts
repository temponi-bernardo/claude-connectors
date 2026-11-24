/**
 * The sign-in handlers called directly with a stub of the OAuth library's helpers (the full browser flow is in
 * worker.test.ts): what each one asks the library and what it answers.
 */
import type { OAuthHelpers } from '@cloudflare/workers-oauth-provider';
import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import { loadAccount } from './account-store.js';
import { fakeSpotify, TEST_APP, testSpotifyDeps } from './fixtures/fake-spotify.js';
import {
  beginSpotifyAuthorization,
  completeSpotifySignIn,
  connectSpotifyAccount,
  credentialsRetryPage,
  finishSpotifySignIn,
  resumeSpotifySignIn,
  sealPendingApp,
  showSpotifyAuthorize,
  submitSpotifyAuthorize,
} from './sign-in.js';
import { vaultOf } from './vault.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

const AUTH_REQUEST = {
  clientId: 'claude',
  redirectUri: 'https://claude.ai/cb',
  scope: [],
  state: 's',
};
const DETAILS = {
  clientId: 'claude',
  clientName: 'Claude',
  redirectUri: 'https://claude.ai/cb',
  redirectHost: 'claude.ai',
  redirectIsLoopback: false,
  scope: [],
};

/** OAuth helper stub that records what was asked. */
function stubOAuth(calls: string[], data: unknown = {}): OAuthHelpers {
  return {
    parseAuthRequest: () => Promise.resolve(AUTH_REQUEST),
    describeConsent: () => Promise.resolve(DETAILS),
    beginConsent: () => Promise.resolve({ handle: 'h1', headers: new Headers() }),
    approveConsent: () => {
      calls.push('approve');
      return Promise.resolve({ request: AUTH_REQUEST, headers: new Headers() });
    },
    denyConsent: () => {
      calls.push('deny');
      return Promise.resolve({
        redirectTo: 'https://claude.ai/cb?error=access_denied',
        headers: new Headers(),
      });
    },
    beginUpstream: () => {
      calls.push('upstream');
      return Promise.resolve({ state: 'st', headers: new Headers() });
    },
    finishUpstream: () => Promise.resolve({ request: AUTH_REQUEST, data, headers: new Headers() }),
    completeAuthorization: (options: { userId: string }) => {
      calls.push(`complete:${options.userId}`);
      return Promise.resolve({ redirectTo: 'https://claude.ai/cb?code=c' });
    },
  } as unknown as OAuthHelpers;
}

const SPOTIFY = fakeSpotify([
  ['GET', /\/v1\/me$/, () => Response.json({ id: 'u1', account_id: 'acc1', display_name: 'U' })],
  ['POST', /\/api\/token$/, () => Response.json({ access_token: 'a1', refresh_token: 'r1' })],
]);

function form(fields: Record<string, string>): Request {
  return new Request('https://spotify.test/authorize?client_id=claude', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString(),
  });
}

describe('sign-in handlers', () => {
  it('showSpotifyAuthorize renders the credentials page with the consent handle', async () => {
    const page = await showSpotifyAuthorize(
      testSpotifyDeps(SPOTIFY),
      stubOAuth([]),
      new Request('https://spotify.test/authorize?client_id=claude'),
    );
    expect(await page.text()).toContain('value="h1"');
  });

  it('submitSpotifyAuthorize denies, retries on bad input or begins the authorization', async () => {
    const calls: string[] = [];
    const deps = testSpotifyDeps(SPOTIFY);
    const oauth = stubOAuth(calls);
    expect(
      (
        await submitSpotifyAuthorize(deps, oauth, form({ handle: 'h1', decision: 'deny' }))
      ).headers.get('location'),
    ).toContain('access_denied');
    expect(
      (
        await submitSpotifyAuthorize(
          deps,
          oauth,
          form({ handle: 'h1', decision: 'approve', client_id: 'x' }),
        )
      ).status,
    ).toBe(400);
    const ok = await submitSpotifyAuthorize(
      deps,
      oauth,
      form({
        handle: 'h1',
        decision: 'approve',
        client_id: TEST_APP.clientId,
        client_secret: TEST_APP.clientSecret,
      }),
    );
    expect(ok.headers.get('location')).toContain('accounts.spotify.com');
    expect(calls).toEqual(['deny', 'approve', 'upstream']);
  });

  it('credentialsRetryPage and beginSpotifyAuthorization', async () => {
    const deps = testSpotifyDeps(SPOTIFY);
    const retry = await credentialsRetryPage(deps, stubOAuth([]), {
      request: form({}),
      handle: 'h9',
      error: 'bad',
    });
    expect(await retry.text()).toContain('value="h9"');
    const begin = await beginSpotifyAuthorization(deps, stubOAuth([]), {
      request: form({}),
      handle: 'h',
      app: TEST_APP,
    });
    expect(new URL(begin.headers.get('location') ?? '').searchParams.get('state')).toBe('st');
  });

  it('connectSpotifyAccount stores the account and completeSpotifySignIn completes for that user', async () => {
    const deps = testSpotifyDeps(SPOTIFY);
    const identity = await connectSpotifyAccount(deps, TEST_APP, 'code-1');
    expect(identity.owner).toBe('spotify_acc1');
    expect((await loadAccount(vaultOf(deps), 'spotify_acc1'))?.clientSecret).toBe(
      TEST_APP.clientSecret,
    );
    const calls: string[] = [];
    expect(
      await completeSpotifySignIn(deps, stubOAuth(calls), {
        request: AUTH_REQUEST as never,
        app: TEST_APP,
        code: 'c',
      }),
    ).toContain('code=c');
    expect(calls).toEqual(['complete:spotify_acc1']);
    const noRefresh = testSpotifyDeps(
      fakeSpotify([['POST', /\/api\/token$/, () => Response.json({ access_token: 'a' })]]),
    );
    await expect(connectSpotifyAccount(noRefresh, TEST_APP, 'c')).rejects.toThrow('refresh token');
  });

  it('resumeSpotifySignIn and finishSpotifySignIn handle refusal, expiry and success', async () => {
    const deps = testSpotifyDeps(SPOTIFY);
    const sealed = sealPendingApp(deps, TEST_APP);
    const refused = await resumeSpotifySignIn(
      deps,
      stubOAuth([], { app: sealed }),
      new Request('https://spotify.test/spotify/callback?error=access_denied'),
    );
    expect(refused.headers.get('location')).toContain('access_denied');
    const expired = await resumeSpotifySignIn(
      deps,
      stubOAuth([], { app: 'x' }),
      new Request('https://spotify.test/spotify/callback?code=c'),
    );
    expect(expired.status).toBe(400);
    const done = await finishSpotifySignIn(
      deps,
      stubOAuth([], { app: sealed }),
      new Request('https://spotify.test/spotify/callback?code=c'),
    );
    expect(done.headers.get('location')).toContain('code=c');
  });
});
