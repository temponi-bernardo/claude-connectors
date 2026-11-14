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
  authorizationErrorResponse,
  beginGoogleSignIn,
  completeSignIn,
  finishSignIn,
  linkSignedInAccount,
  showAuthorize,
  submitAuthorize,
  type SignInData,
} from './sign-in.js';

const AUTH: AuthRequest = {
  responseType: 'code',
  clientId: 'c1',
  redirectUri: 'https://claude.ai/api/mcp/auth_callback',
  scope: [],
  state: 'claude-state',
};
const EXP = { exp: 1_700_000_000 + 600 };
const GMAIL_SCOPE = 'openid email https://www.googleapis.com/auth/gmail.modify';
const PRIVATE = { ...TEST_SETTINGS, allowedEmails: ['dono@example.com'] };

/** `OAuthHelpers` falso que registra o que recebe e devolve valores fixos. */
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

/** Google cuja troca de código devolve o id_token do e-mail dado com o nonce guardado em `seen.data`. */
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

/** Envio do formulário de consentimento. */
function form(body: string): Request {
  return new Request('https://gmail.test/authorize', {
    method: 'POST',
    body,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });
}

describe('authorizationErrorResponse', () => {
  it('mostra a descrição do erro da biblioteca', async () => {
    const error = new AuthorizationError('invalid_request', { description: 'cliente ruim' });
    const response = authorizationErrorResponse(error);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('cliente ruim');
  });
});

describe('beginGoogleSignIn', () => {
  it('guarda verificador e nonce na transação e pede gerenciar o Gmail com acesso offline', async () => {
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
  it('mostra o consentimento ou segue direto quando lembrado', async () => {
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

  it('pedido inválido vira página 400', async () => {
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
  it('aprovar segue ao Google; negar volta ao cliente', async () => {
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

describe('accessDeniedPage e linkSignedInAccount', () => {
  const identity = { sub: 'sub-1', email: 'dono@example.com' };
  const tokens: GoogleTokens = {
    accessToken: 'a',
    expiresIn: 3600,
    refreshToken: 'r',
    idToken: null,
    scope: GMAIL_SCOPE,
  };

  it('accessDeniedPage dá 403', () => {
    expect(accessDeniedPage().status).toBe(403);
  });

  it('vincula a conta do login, ou não vincula sem o Gmail, sem barrar o login', async () => {
    const deps = testDeps(fakeFetch([]));
    expect(await linkSignedInAccount(deps, identity, tokens)).toBe(true);
    expect(await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, 'sub-1')).toHaveLength(1);
    const noGmail = { ...tokens, scope: 'openid email' };
    expect(await linkSignedInAccount(testDeps(fakeFetch([])), identity, noGmail)).toBe(false);
  });

  it('falha ao gravar não impede o login', async () => {
    const deps = testDeps(fakeFetch([]));
    const failingKv = {
      get: () => Promise.reject(new Error('KV fora')),
      put: () => Promise.resolve(),
      delete: () => Promise.resolve(),
    };
    const broken = { ...deps, kv: failingKv };
    expect(await linkSignedInAccount(broken, identity, tokens)).toBe(false);
  });
});

describe('completeSignIn e finishSignIn', () => {
  it('conclui com o sub como usuário, vincula a conta e põe id de sessão', async () => {
    const { oauth, seen } = fakeOAuth();
    seen.data = { verifier: 'v', nonce: 'n' };
    const deps = testDeps(googleFor('qualquer@example.com', seen));
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
    expect(completed.userId).toBe('sub-qualquer@example.com');
    expect(completed.props).toMatchObject({
      owner: 'sub-qualquer@example.com',
      email: 'qualquer@example.com',
    });
    expect(completed.props.sid).toMatch(/^[A-Za-z0-9_-]{22}$/);
    const linked = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, 'sub-qualquer@example.com');
    expect(linked.map((a) => a.email)).toEqual(['qualquer@example.com']);
  });

  it('no modo privado devolve nulo para e-mail fora da lista; falha sem id_token', async () => {
    const { oauth, seen } = fakeOAuth();
    seen.data = { verifier: 'v', nonce: 'n' };
    const outsider = { ...testDeps(googleFor('intruso@example.com', seen)), settings: PRIVATE };
    const args = { request: AUTH, data: seen.data as SignInData, code: 'c' };
    expect(await completeSignIn(outsider, oauth, args)).toBeNull();
    expect(outsider.kv.entries.size).toBe(0);
    const noId = testDeps(fakeFetch([tokenRoute(() => Response.json({ access_token: 'a' }))]));
    await expect(completeSignIn(noId, oauth, args)).rejects.toThrow(/id_token/);
  });

  it('finishSignIn redireciona, nega com 403 ou devolve access_denied sem código', async () => {
    const { oauth, seen } = fakeOAuth();
    seen.data = { verifier: 'v', nonce: 'n' };
    const ok = testDeps(googleFor('dono@example.com', seen));
    function callback(query: string): Request {
      return new Request(`https://gmail.test/google/callback?${query}`);
    }
    expect(
      (await finishSignIn(ok, oauth, callback('state=s&code=c'))).headers.get('location'),
    ).toBe('https://claude.ai/cb?code=ok');
    const outsider = { ...testDeps(googleFor('intruso@example.com', seen)), settings: PRIVATE };
    expect((await finishSignIn(outsider, oauth, callback('state=s&code=c'))).status).toBe(403);
    const denied = await finishSignIn(ok, oauth, callback('state=s&error=access_denied'));
    expect(denied.headers.get('location')).toContain('error=access_denied');
  });
});
