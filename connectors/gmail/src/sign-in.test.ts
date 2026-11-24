import {
  AuthorizationError,
  type AuthRequest,
  type OAuthHelpers,
} from '@cloudflare/workers-oauth-provider';
import { describe, expect, it } from 'vitest';
import {
  fakeFetch,
  TEST_SETTINGS,
  TEST_TOKEN_KEY,
  testDeps,
  tokenRoute,
  validIdToken,
} from './fixtures/fake-google.js';
import type { GoogleTokens } from './google-oauth.js';
import { loadOwnerAccounts } from './token-store.js';
import {
  accessDeniedPage,
  beginGoogleSignIn,
  completeSignIn,
  finishSignIn,
  linkSignedInAccount,
  showAuthorize,
  submitAuthorize,
  type SignInData,
} from './sign-in.js';
import { authorizationErrorResponse } from '../../../src/remote/pages.js';

const AUTH: AuthRequest = {
  responseType: 'code',
  clientId: 'c1',
  redirectUri: 'https://claude.ai/api/mcp/auth_callback',
  scope: [],
  state: 'claude-state',
};
const EXP = { exp: 1_700_000_000 + 600 };
const GMAIL_SCOPE = 'openid email https://www.googleapis.com/auth/gmail.modify';
const PRIVATE = { ...TEST_SETTINGS, allowedEmails: ['owner@example.com'] };

/** Fake `OAuthHelpers` that records what it gets and returns fixed values. */
function fakeOAuth(overrides: Partial<OAuthHelpers> = {}) {
  const seen: Record<string, unknown> = {};
  const oauth = {
    parseAuthRequest: () => Promise.resolve(AUTH),
    isConsentRemembered: () => Promise.resolve(false),
    describeConsent: () =>
      Promise.resolve({
        clientId: 'c1',
        clientName: 'Claude',
        redirectUri: AUTH.redirectUri,
        redirectHost: 'claude.ai',
        redirectIsLoopback: false,
        scope: [],
      }),
    beginConsent: () => Promise.resolve({ handle: 'h1', headers: new Headers() }),
    approveConsent: () => Promise.resolve({ request: AUTH, headers: new Headers() }),
    denyConsent: () =>
      Promise.resolve({
        request: AUTH,
        redirectTo: 'https://claude.ai/cb?error=x',
        headers: new Headers(),
      }),
    beginUpstream: (_req: AuthRequest, options?: { data?: unknown }) => {
      seen.data = options?.data;
      return Promise.resolve({ state: 'up-state', headers: new Headers() });
    },
    finishUpstream: () =>
      Promise.resolve({ request: AUTH, data: seen.data, headers: new Headers() }),
    completeAuthorization: (options: unknown) => {
      seen.completed = options;
      return Promise.resolve({ redirectTo: 'https://claude.ai/cb?code=ok' });
    },
    ...overrides,
  } as unknown as OAuthHelpers;
  return { oauth, seen };
}

/** Google whose code exchange returns the given email's id_token with the nonce kept in `seen.data`. */
function googleFor(email: string, seen: Record<string, unknown>) {
  return fakeFetch([
    tokenRoute(() => {
      const nonce = (seen.data as SignInData | undefined)?.nonce ?? '';
      return Response.json({
        access_token: 'a',
        refresh_token: 'r-login',
        scope: GMAIL_SCOPE,
        id_token: validIdToken(email, nonce, EXP),
      });
    }),
  ]);
}

/** Consent form submission. */
function form(body: string): Request {
  return new Request('https://gmail.test/authorize', {
    method: 'POST',
    body,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });
}

describe('authorizationErrorResponse', () => {
  it('shows the library error description', async () => {
    const error = new AuthorizationError('invalid_request', { description: 'bad client' });
    const response = authorizationErrorResponse(error);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('bad client');
  });
});

describe('beginGoogleSignIn', () => {
  it('keeps verifier and nonce in the transaction and asks to manage Gmail with offline access', async () => {
    const { oauth, seen } = fakeOAuth();
    const response = await beginGoogleSignIn(testDeps(fakeFetch([])), oauth, {
      request: AUTH,
      headers: new Headers(),
    });
    const google = new URL(response.headers.get('location') ?? '');
    expect(google.searchParams.get('scope')).toBe(GMAIL_SCOPE);
    expect(google.searchParams.get('state')).toBe('up-state');
    expect(google.searchParams.get('nonce')).toBe((seen.data as SignInData).nonce);
    expect(google.searchParams.get('access_type')).toBe('offline');
  });
});

describe('showAuthorize', () => {
  it('shows the consent or goes straight on when remembered', async () => {
    const deps = testDeps(fakeFetch([]));
    const page = await showAuthorize(
      deps,
      fakeOAuth().oauth,
      new Request('https://gmail.test/authorize'),
    );
    expect(await page.text()).toContain('value="h1"');
    const remembered = fakeOAuth({ isConsentRemembered: () => Promise.resolve(true) }).oauth;
    const direct = await showAuthorize(
      deps,
      remembered,
      new Request('https://gmail.test/authorize'),
    );
    expect(direct.status).toBe(302);
  });

  it('an invalid request becomes a 400 page', async () => {
    const failing = fakeOAuth({ parseAuthRequest: () => Promise.reject(new Error('x')) }).oauth;
    const response = await showAuthorize(
      testDeps(fakeFetch([])),
      failing,
      new Request('https://g/a'),
    );
    expect(response.status).toBe(400);
  });
});

describe('submitAuthorize', () => {
  it('approving goes to Google; denying returns to the client', async () => {
    const deps = testDeps(fakeFetch([]));
    const approved = await submitAuthorize(
      deps,
      fakeOAuth().oauth,
      form('handle=h1&decision=approve'),
    );
    expect(approved.headers.get('location')).toMatch(/^https:\/\/accounts\.google\.com/);
    const denied = await submitAuthorize(deps, fakeOAuth().oauth, form('handle=h1&decision=deny'));
    expect(denied.headers.get('location')).toBe('https://claude.ai/cb?error=x');
  });
});

describe('accessDeniedPage and linkSignedInAccount', () => {
  const identity = { sub: 'sub-1', email: 'owner@example.com' };
  const tokens: GoogleTokens = {
    accessToken: 'a',
    expiresIn: 3600,
    refreshToken: 'r',
    idToken: null,
    scope: GMAIL_SCOPE,
  };

  it('accessDeniedPage gives 403', () => {
    expect(accessDeniedPage().status).toBe(403);
  });

  it('links the sign-in account, or skips it without Gmail, without blocking sign-in', async () => {
    const deps = testDeps(fakeFetch([]));
    expect(await linkSignedInAccount(deps, identity, tokens)).toBe(true);
    expect(await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, 'sub-1')).toHaveLength(1);
    const noGmail = { ...tokens, scope: 'openid email' };
    expect(await linkSignedInAccount(testDeps(fakeFetch([])), identity, noGmail)).toBe(false);
  });

  it('a write failure does not block sign-in', async () => {
    const deps = testDeps(fakeFetch([]));
    const failingKv = {
      get: () => Promise.reject(new Error('KV down')),
      put: () => Promise.resolve(),
      delete: () => Promise.resolve(),
    };
    const broken = { ...deps, kv: failingKv };
    expect(await linkSignedInAccount(broken, identity, tokens)).toBe(false);
  });
});

describe('completeSignIn and finishSignIn', () => {
  it('completes with the sub as user, links the account and sets a session id', async () => {
    const { oauth, seen } = fakeOAuth();
    seen.data = { verifier: 'v', nonce: 'n' };
    const deps = testDeps(googleFor('anyone@example.com', seen));
    const redirect = await completeSignIn(deps, oauth, {
      request: AUTH,
      data: seen.data as SignInData,
      code: 'c',
    });
    expect(redirect).toBe('https://claude.ai/cb?code=ok');
    const completed = seen.completed as {
      userId: string;
      props: { owner: string; email: string; sid: string };
    };
    expect(completed.userId).toBe('sub-anyone@example.com');
    expect(completed.props).toMatchObject({
      owner: 'sub-anyone@example.com',
      email: 'anyone@example.com',
    });
    expect(completed.props.sid).toMatch(/^[A-Za-z0-9_-]{22}$/);
    const linked = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, 'sub-anyone@example.com');
    expect(linked.map((a) => a.email)).toEqual(['anyone@example.com']);
  });

  it('in private mode returns null for an unlisted email; fails without id_token', async () => {
    const { oauth, seen } = fakeOAuth();
    seen.data = { verifier: 'v', nonce: 'n' };
    const outsider = { ...testDeps(googleFor('intruder@example.com', seen)), settings: PRIVATE };
    const args = { request: AUTH, data: seen.data as SignInData, code: 'c' };
    expect(await completeSignIn(outsider, oauth, args)).toBeNull();
    expect(outsider.kv.entries.size).toBe(0);
    const noId = testDeps(fakeFetch([tokenRoute(() => Response.json({ access_token: 'a' }))]));
    await expect(completeSignIn(noId, oauth, args)).rejects.toThrow(/id_token/);
  });

  it('finishSignIn redirects, denies with 403 or returns access_denied without a code', async () => {
    const { oauth, seen } = fakeOAuth();
    seen.data = { verifier: 'v', nonce: 'n' };
    const ok = testDeps(googleFor('owner@example.com', seen));
    function callback(query: string): Request {
      return new Request(`https://gmail.test/google/callback?${query}`);
    }
    expect(
      (await finishSignIn(ok, oauth, callback('state=s&code=c'))).headers.get('location'),
    ).toBe('https://claude.ai/cb?code=ok');
    const outsider = { ...testDeps(googleFor('intruder@example.com', seen)), settings: PRIVATE };
    expect((await finishSignIn(outsider, oauth, callback('state=s&code=c'))).status).toBe(403);
    const denied = await finishSignIn(ok, oauth, callback('state=s&error=access_denied'));
    expect(denied.headers.get('location')).toContain('error=access_denied');
  });
});
