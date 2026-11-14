import { beforeEach, describe, expect, it } from 'vitest';
import { sealPayload } from '../../../src/remote/seal.js';
import { clearAccessTokenCache } from './access-token.js';
import {
  fakeFetch,
  TEST_NOW_MS,
  TEST_OWNER,
  TEST_TOKEN_KEY,
  testAccount,
  testDeps,
  tokenRoute,
  validIdToken,
} from './fixtures/fake-google.js';
import type { Fetcher } from './context.js';
import type { GoogleTokens } from './google-oauth.js';
import {
  finishAccountLink,
  invalidTicketPage,
  issueLinkUrl,
  LINK_COOKIE,
  linkCookie,
  linkFromCode,
  linkRefusalReason,
  linkRequestKey,
  linkSafely,
  nowSeconds,
  readCookie,
  redeemLinkTicket,
  startAccountLink,
  storeGoogleAccount,
  takeLinkRequest,
} from './link-flow.js';
import { loadOwnerAccounts, saveOwnerAccounts, sha256Hex } from './token-store.js';

const SCOPE = 'openid email https://www.googleapis.com/auth/gmail.modify';
const TOKENS: GoogleTokens = {
  accessToken: 'a',
  expiresIn: 3600,
  refreshToken: 'novo-refresh',
  idToken: null,
  scope: SCOPE,
};
const EXP = { exp: 1_700_000_000 + 600 };
const LINK = { owner: TEST_OWNER, verifier: 'v', nonce: 'n' };

/** `fetch` cujo Google devolve, na troca de código, um id_token do e-mail dado com o nonce de `holder`. */
function googleFor(
  email: string,
  extra: Record<string, unknown> = {},
  holder = { nonce: 'n' },
): Fetcher {
  return fakeFetch([
    tokenRoute(() =>
      Response.json({
        access_token: 'a',
        refresh_token: 'novo-refresh',
        scope: SCOPE,
        id_token: validIdToken(email, holder.nonce, EXP),
        ...extra,
      }),
    ),
  ]);
}

/** Abre o link de vínculo e devolve o `state`, o `nonce` e o cookie que o Google/navegador mandariam. */
async function begin(deps: ReturnType<typeof testDeps>) {
  const response = await startAccountLink(deps, new Request(issueLinkUrl(deps)));
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
  it('nowSeconds, linkRequestKey e readCookie', () => {
    expect(nowSeconds(testDeps(fakeFetch([])))).toBe(TEST_NOW_MS / 1000);
    expect(linkRequestKey('abc')).toBe(`link:${sha256Hex('abc')}`);
    expect(readCookie('a=1; __Host-gmail-link=x=y; b=2', LINK_COOKIE)).toBe('x=y');
    expect(readCookie(null, LINK_COOKIE)).toBeNull();
  });

  it('linkCookie é __Host-, seguro, HttpOnly, SameSite e apagável', () => {
    expect(linkCookie('v')).toBe(
      '__Host-gmail-link=v; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=600',
    );
    expect(linkCookie(null)).toContain('Max-Age=0');
  });

  it('invalidTicketPage orienta a pedir outro link', async () => {
    const page = invalidTicketPage();
    expect(page.status).toBe(400);
    expect(await page.text()).toContain('link_account');
  });

  it('linkRefusalReason exige o escopo do Gmail e o refresh token', () => {
    expect(linkRefusalReason(TOKENS)).toBeNull();
    expect(linkRefusalReason({ ...TOKENS, scope: 'openid email' })).toMatch(/permissão/);
    const readOnly = 'openid email https://www.googleapis.com/auth/gmail.readonly';
    expect(linkRefusalReason({ ...TOKENS, scope: readOnly })).toMatch(/gerenciar o Gmail/);
    expect(linkRefusalReason({ ...TOKENS, refreshToken: null })).toMatch(/refresh token/);
  });

  it('storeGoogleAccount acrescenta ou troca a conta do usuário', async () => {
    const deps = testDeps(fakeFetch([]));
    await saveOwnerAccounts(deps.kv, TEST_TOKEN_KEY, {
      owner: TEST_OWNER,
      accounts: [testAccount('dono@example.com')],
    });
    await storeGoogleAccount(deps, 'musica@example.com', TOKENS);
    await storeGoogleAccount(deps, 'dono@example.com', TOKENS);
    const accounts = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, TEST_OWNER);
    expect(accounts.map((a) => [a.email, a.refreshToken])).toEqual([
      ['musica@example.com', 'novo-refresh'],
      ['dono@example.com', 'novo-refresh'],
    ]);
  });
});

describe('ticket de vínculo', () => {
  it('issueLinkUrl gera link do Worker com ticket que não expõe o usuário', () => {
    const url = new URL(issueLinkUrl(testDeps(fakeFetch([]))));
    expect(url.origin + url.pathname).toBe('https://gmail.test/accounts/link');
    expect(url.searchParams.get('ticket')).not.toContain(TEST_OWNER);
  });

  it('redeemLinkTicket devolve o usuário uma vez só', async () => {
    const deps = testDeps(fakeFetch([]));
    const ticket = new URL(issueLinkUrl(deps)).searchParams.get('ticket') ?? '';
    expect(await redeemLinkTicket(deps, ticket)).toBe(TEST_OWNER);
    expect(await redeemLinkTicket(deps, ticket)).toBeNull();
    expect(await redeemLinkTicket(deps, 'lixo')).toBeNull();
  });

  it('redeemLinkTicket recusa ticket vencido ou sem jti', async () => {
    const deps = testDeps(fakeFetch([]));
    const old = sealPayload(
      { typ: 'gmail_link_ticket', exp: 1, owner: 'x', jti: 'j' },
      TEST_TOKEN_KEY,
    );
    expect(await redeemLinkTicket(deps, old)).toBeNull();
    const noJti = sealPayload({ typ: 'gmail_link_ticket', exp: 4e9, owner: 'x' }, TEST_TOKEN_KEY);
    expect(await redeemLinkTicket(deps, noJti)).toBeNull();
  });
});

describe('startAccountLink', () => {
  it('pede acesso offline para gerenciar o Gmail e guarda o pedido selado com validade', async () => {
    const deps = testDeps(fakeFetch([]));
    const { response, google, state, cookie } = await begin(deps);
    expect(response.status).toBe(302);
    expect(google.origin + google.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth');
    expect(google.searchParams.get('scope')).toBe(SCOPE);
    expect(google.searchParams.get('access_type')).toBe('offline');
    expect(state.startsWith('link.')).toBe(true);
    expect(cookie.startsWith(`${LINK_COOKIE}=`)).toBe(true);
    const entry = deps.kv.entries.get(linkRequestKey(state));
    expect(entry?.expiresAt).toBe(TEST_NOW_MS + 600_000);
    expect(entry?.value).not.toContain(TEST_OWNER);
  });

  it('sem ticket válido mostra a página de link inválido', async () => {
    const deps = testDeps(fakeFetch([]));
    const response = await startAccountLink(deps, new Request('https://gmail.test/accounts/link'));
    expect(response.status).toBe(400);
  });
});

describe('takeLinkRequest', () => {
  it('é de uso único, exige o cookie do mesmo navegador e devolve o usuário', async () => {
    const deps = testDeps(fakeFetch([]));
    const first = await begin(deps);
    expect(await takeLinkRequest(deps, callback({ state: first.state }, 'outro=1'))).toBeNull();
    const again = await begin(deps);
    const taken = await takeLinkRequest(deps, callback({ state: again.state }, again.cookie));
    expect(taken?.owner).toBe(TEST_OWNER);
    expect(await takeLinkRequest(deps, callback({ state: again.state }, again.cookie))).toBeNull();
  });

  it('recusa pedido vencido', async () => {
    const deps = testDeps(fakeFetch([]));
    const expired = sealPayload({ typ: 'gmail_link', exp: 1, owner: 'x' }, TEST_TOKEN_KEY);
    await deps.kv.put(linkRequestKey('link.velho'), expired);
    const request = callback({ state: 'link.velho' }, `${LINK_COOKIE}=x`);
    expect(await takeLinkRequest(deps, request)).toBeNull();
  });
});

describe('linkFromCode, linkSafely e finishAccountLink', () => {
  it('vincula a conta ao usuário do ticket e apaga o cookie', async () => {
    const holder = { nonce: '' };
    const deps = testDeps((url, init) => googleFor('musica@example.com', {}, holder)(url, init));
    const started = await begin(deps);
    holder.nonce = started.nonce;
    const request = callback({ state: started.state, code: 'c' }, started.cookie);
    const response = await finishAccountLink(deps, request);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('musica@example.com foi vinculada');
    expect(response.headers.getSetCookie().at(-1)).toContain('Max-Age=0');
    const accounts = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, TEST_OWNER);
    expect(accounts.map((a) => a.email)).toEqual(['musica@example.com']);
  });

  it('recusa sem id_token, sem escopo ou sem refresh token', async () => {
    const noId = testDeps(googleFor('dono@example.com', { id_token: undefined }));
    expect(await (await linkFromCode(noId, 'c', LINK)).text()).toContain('Sem id_token');
    const noScope = testDeps(googleFor('dono@example.com', { scope: 'openid email' }));
    expect(await (await linkFromCode(noScope, 'c', LINK)).text()).toContain('Permissão faltando');
    const noRefresh = testDeps(googleFor('dono@example.com', { refresh_token: undefined }));
    expect(await (await linkFromCode(noRefresh, 'c', LINK)).text()).toContain('refresh token');
    expect(noRefresh.kv.entries.size).toBe(0);
  });

  it('linkSafely converte falha do Google em página 400 sem gravar', async () => {
    const deps = testDeps(() => Promise.resolve(new Response('', { status: 503 })));
    const response = await linkSafely(deps, 'c', LINK);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('Nada foi gravado');
    expect(deps.kv.entries.size).toBe(0);
  });

  it('pedido expirado ou recusa no Google não gravam nada', async () => {
    const deps = testDeps(fakeFetch([]));
    const expired = await finishAccountLink(deps, callback({ state: 'link.x', code: 'c' }, null));
    expect(await expired.text()).toContain('Link inválido');
    const started = await begin(deps);
    const denied = await finishAccountLink(
      deps,
      callback({ state: started.state, error: 'access_denied' }, started.cookie),
    );
    expect(await denied.text()).toContain('Vínculo cancelado');
  });
});
