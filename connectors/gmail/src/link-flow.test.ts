import { beforeEach, describe, expect, it } from 'vitest';
import { sealPayload } from '../../../src/remote/seal.js';
import { clearAccessTokenCache } from './access-token.js';
import {
  fakeFetch,
  TEST_ACCOUNTS,
  TEST_TOKEN_KEY,
  testDeps,
  tokenRoute,
  validIdToken,
} from './fixtures/fake-google.js';
import type { GoogleTokens } from './google-oauth.js';
import {
  accessDeniedPage,
  finishAccountLink,
  LINK_COOKIE,
  linkCookie,
  linkFromCode,
  linkRefusal,
  linkSafely,
  linkRequestKey,
  readCookie,
  sha256Hex,
  startAccountLink,
  storeLinkedAccount,
  takeLinkRequest,
} from './link-flow.js';
import { loadLinkedAccount } from './token-store.js';

const SCOPE = 'openid email https://www.googleapis.com/auth/gmail.readonly';
const TOKENS: GoogleTokens = {
  accessToken: 'a',
  expiresIn: 3600,
  refreshToken: 'novo-refresh',
  idToken: null,
  scope: SCOPE,
};
const NOW_EXP = { exp: 1_700_000_000 + 600 };

/** `fetch` cujo Google devolve, na troca de código, um id_token do e-mail dado (nonce lido do pedido). */
function googleFor(email: string, extra: Record<string, unknown> = {}, nonce = 'n') {
  return fakeFetch([
    tokenRoute(() =>
      Response.json({
        access_token: 'a',
        refresh_token: 'novo-refresh',
        scope: SCOPE,
        id_token: validIdToken(email, nonce, NOW_EXP),
        ...extra,
      }),
    ),
  ]);
}

/** Começa um vínculo e devolve o `state`, o `nonce` e o cookie que o Google/navegador mandariam de volta. */
async function begin(deps: ReturnType<typeof testDeps>) {
  const response = await startAccountLink(deps);
  const google = new URL(response.headers.get('location') ?? '');
  const cookie = (response.headers.getSetCookie()[0] ?? '').split(';')[0] ?? '';
  return {
    response,
    google,
    state: google.searchParams.get('state') ?? '',
    nonce: google.searchParams.get('nonce') ?? '',
    cookie,
  };
}

/** Requisição da volta do Google com os parâmetros e o cookie dados. */
function callback(params: Record<string, string>, cookie: string | null): Request {
  const url = new URL('https://gmail.test/google/callback');
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return new Request(url, { headers: cookie === null ? {} : { cookie } });
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('auxiliares', () => {
  it('sha256Hex e linkRequestKey', () => {
    expect(sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
    expect(linkRequestKey('abc')).toBe(`link:${sha256Hex('abc')}`);
  });

  it('readCookie acha o valor certo', () => {
    expect(readCookie('a=1; __Host-gmail-link=x=y; b=2', LINK_COOKIE)).toBe('x=y');
    expect(readCookie(null, LINK_COOKIE)).toBeNull();
  });

  it('linkCookie é __Host-, seguro, HttpOnly, SameSite e apagável', () => {
    expect(linkCookie('v')).toBe(
      '__Host-gmail-link=v; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=600',
    );
    expect(linkCookie(null)).toContain('Max-Age=0');
  });

  it('accessDeniedPage dá 403', () => {
    expect(accessDeniedPage().status).toBe(403);
  });

  it('linkRefusal exige o escopo do Gmail e o refresh token', () => {
    expect(linkRefusal(TOKENS)).toBeNull();
    expect(linkRefusal({ ...TOKENS, scope: 'openid email' })?.status).toBe(400);
    expect(linkRefusal({ ...TOKENS, refreshToken: null })?.status).toBe(400);
  });

  it('storeLinkedAccount grava a conta ativa', async () => {
    const deps = testDeps(fakeFetch([]));
    await storeLinkedAccount(deps, TEST_ACCOUNTS[1]!.email, TOKENS);
    const linked = await loadLinkedAccount(deps.kv, TEST_TOKEN_KEY, TEST_ACCOUNTS[1]!);
    expect(linked).toMatchObject({ refreshToken: 'novo-refresh', status: 'active', scope: SCOPE });
  });
});

describe('startAccountLink', () => {
  it('pede acesso offline só leitura ao Google e guarda o pedido selado com validade', async () => {
    const deps = testDeps(fakeFetch([]));
    const { response, google, state, cookie } = await begin(deps);
    expect(response.status).toBe(302);
    expect(google.origin + google.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth');
    expect(google.searchParams.get('scope')).toBe(SCOPE);
    expect(google.searchParams.get('access_type')).toBe('offline');
    expect(state.startsWith('link.')).toBe(true);
    expect(cookie.startsWith(`${LINK_COOKIE}=`)).toBe(true);
    const entry = deps.kv.entries.get(linkRequestKey(state));
    expect(entry?.expiresAt).toBe(1_700_000_000_000 + 600_000);
    expect(entry?.value).not.toContain(google.searchParams.get('nonce'));
  });
});

describe('takeLinkRequest', () => {
  it('é de uso único e exige o cookie do mesmo navegador', async () => {
    const deps = testDeps(fakeFetch([]));
    const { state, cookie } = await begin(deps);
    expect(await takeLinkRequest(deps, callback({ state }, 'outro=1'))).toBeNull();
    const again = await begin(deps);
    expect(
      await takeLinkRequest(deps, callback({ state: again.state }, again.cookie)),
    ).not.toBeNull();
    expect(await takeLinkRequest(deps, callback({ state: again.state }, again.cookie))).toBeNull();
    expect(await takeLinkRequest(deps, callback({ state }, cookie))).toBeNull();
  });

  it('recusa pedido vencido ou adulterado', async () => {
    const deps = testDeps(fakeFetch([]));
    const expired = sealPayload({ typ: 'gmail_link', exp: 1, verifier: 'v' }, TEST_TOKEN_KEY);
    await deps.kv.put(linkRequestKey('link.velho'), expired);
    const request = callback({ state: 'link.velho' }, `${LINK_COOKIE}=x`);
    expect(await takeLinkRequest(deps, request)).toBeNull();
  });
});

describe('linkFromCode e finishAccountLink', () => {
  it('vincula a conta permitida e apaga o cookie', async () => {
    const holder = { nonce: '' };
    const deps = testDeps((url, init) =>
      googleFor('musica@example.com', {}, holder.nonce)(url, init),
    );
    const started = await begin(deps);
    holder.nonce = started.nonce;
    const response = await finishAccountLink(
      deps,
      callback({ state: started.state, code: 'c' }, started.cookie),
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('&quot;musica&quot; foi vinculada');
    expect(response.headers.getSetCookie().at(-1)).toContain('Max-Age=0');
    expect(await loadLinkedAccount(deps.kv, TEST_TOKEN_KEY, TEST_ACCOUNTS[1]!)).toMatchObject({
      refreshToken: 'novo-refresh',
    });
  });

  it('recusa conta fora da allowlist sem gravar nada', async () => {
    const deps = testDeps(googleFor('intruso@example.com'));
    const link = { verifier: 'v', nonce: 'n', bindingHash: 'h' };
    expect((await linkFromCode(deps, 'c', link)).status).toBe(403);
    expect([...deps.kv.entries.keys()]).toEqual([]);
  });

  it('recusa sem id_token, sem escopo ou sem refresh token', async () => {
    const link = { verifier: 'v', nonce: 'n', bindingHash: 'h' };
    const noId = testDeps(googleFor('dono@example.com', { id_token: undefined }));
    expect(await (await linkFromCode(noId, 'c', link)).text()).toContain('Sem id_token');
    const noScope = testDeps(googleFor('dono@example.com', { scope: 'openid email' }));
    expect(await (await linkFromCode(noScope, 'c', link)).text()).toContain('Permissão faltando');
    const noRefresh = testDeps(googleFor('dono@example.com', { refresh_token: undefined }));
    expect(await (await linkFromCode(noRefresh, 'c', link)).text()).toContain('refresh token');
  });

  it('pedido expirado ou recusa no Google não gravam nada', async () => {
    const deps = testDeps(fakeFetch([]));
    const expired = await finishAccountLink(deps, callback({ state: 'link.x', code: 'c' }, null));
    expect(await expired.text()).toContain('Pedido expirado');
    const started = await begin(deps);
    const denied = await finishAccountLink(
      deps,
      callback({ state: started.state, error: 'access_denied' }, started.cookie),
    );
    expect(await denied.text()).toContain('Vínculo cancelado');
  });

  it('linkSafely converte falha do Google em página 400', async () => {
    const deps = testDeps(() => Promise.resolve(new Response('', { status: 503 })));
    const response = await linkSafely(deps, 'c', { verifier: 'v', nonce: 'n', bindingHash: 'h' });
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('Nada foi gravado');
    expect([...deps.kv.entries.keys()]).toEqual([]);
  });
});
