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
import type { Fetcher, GmailDeps, OwnerDeps } from './context.js';
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
  isConfirmedInThisBrowser,
  openLinkTicket,
  redeemConfirmedTicket,
  redeemLinkTicket,
  showLinkConfirmation,
  startAccountLink,
  storeGoogleAccount,
  takeLinkRequest,
  usedTicketKey,
} from './link-flow.js';
import { loadOwnerAccounts, saveOwnerAccounts, sha256Hex } from './token-store.js';

const SCOPE = 'openid email https://www.googleapis.com/auth/gmail.modify';
const TOKENS: GoogleTokens = {
  accessToken: 'a',
  expiresIn: 3600,
  refreshToken: 'new-refresh',
  idToken: null,
  scope: SCOPE,
};
const EXP = { exp: 1_700_000_000 + 600 };
const LINK = { owner: TEST_OWNER, verifier: 'v', nonce: 'n' };

/** `fetch` whose Google returns, on code exchange, an id_token for the given email with `holder`'s nonce. */
function googleFor(
  email: string,
  extra: Record<string, unknown> = {},
  holder = { nonce: 'n' },
): Fetcher {
  return fakeFetch([
    tokenRoute(() =>
      Response.json({
        access_token: 'a',
        refresh_token: 'new-refresh',
        scope: SCOPE,
        id_token: validIdToken(email, holder.nonce, EXP),
        ...extra,
      }),
    ),
  ]);
}

/** Opens the link (GET) and returns the confirmation form fields and the cookie the browser keeps. */
async function confirmation(deps: GmailDeps, url = issueLinkUrl(deps as OwnerDeps)) {
  const page = await showLinkConfirmation(deps, new Request(url));
  const html = await page.text();
  const cookie = (page.headers.getSetCookie()[0] ?? '').split(';')[0] ?? '';
  const [ticket, confirm] = [formField(html, 'ticket'), formField(html, 'confirm')];
  return { page, html, ticket, confirm, cookie };
}

/** Value of a hidden form field in the page. */
function formField(html: string, name: string): string {
  return new RegExp(`name="${name}" value="([^"]+)"`).exec(html)?.[1] ?? '';
}

/** The confirmation POST the page sends (with the given cookie). */
function confirmPost(fields: { ticket: string; confirm: string }, cookie: string | null): Request {
  return new Request('https://gmail.test/accounts/link', {
    method: 'POST',
    body: new URLSearchParams(fields).toString(),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      ...(cookie === null ? {} : { cookie }),
    },
  });
}

/** Opens the link, confirms and returns the `state`, `nonce` and cookie Google/the browser would send. */
async function begin(deps: ReturnType<typeof testDeps>) {
  const shown = await confirmation(deps);
  const response = await startAccountLink(deps, confirmPost(shown, shown.cookie));
  const google = new URL(response.headers.get('location') ?? '');
  const cookie = shown.cookie;
  return {
    response,
    google,
    state: google.searchParams.get('state') ?? '',
    nonce: google.searchParams.get('nonce') ?? '',
    cookie,
  };
}

/** Google callback request with the given parameters and cookie. */
function callback(params: Record<string, string>, cookie: string | null): Request {
  const url = new URL('https://gmail.test/google/callback');
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return new Request(url, { headers: cookie === null ? {} : { cookie } });
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('helpers', () => {
  it('nowSeconds, linkRequestKey and readCookie', () => {
    expect(nowSeconds(testDeps(fakeFetch([])))).toBe(TEST_NOW_MS / 1000);
    expect(linkRequestKey('abc')).toBe(`link:${sha256Hex('abc')}`);
    expect(readCookie('a=1; __Host-gmail-link=x=y; b=2', LINK_COOKIE)).toBe('x=y');
    expect(readCookie(null, LINK_COOKIE)).toBeNull();
  });

  it('linkCookie is __Host-, Secure, HttpOnly, SameSite and deletable', () => {
    expect(linkCookie('v')).toBe(
      '__Host-gmail-link=v; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=600',
    );
    expect(linkCookie(null)).toContain('Max-Age=0');
  });

  it('invalidTicketPage tells the user to ask for another link', async () => {
    const page = invalidTicketPage();
    expect(page.status).toBe(400);
    expect(await page.text()).toContain('link_account');
  });

  it('linkRefusalReason requires the Gmail scope and the refresh token', () => {
    expect(linkRefusalReason(TOKENS)).toBeNull();
    expect(linkRefusalReason({ ...TOKENS, scope: 'openid email' })).toMatch(/permission/);
    const readOnly = 'openid email https://www.googleapis.com/auth/gmail.readonly';
    expect(linkRefusalReason({ ...TOKENS, scope: readOnly })).toMatch(/manage Gmail/);
    expect(linkRefusalReason({ ...TOKENS, refreshToken: null })).toMatch(/refresh token/);
  });

  it('storeGoogleAccount adds or replaces the user account', async () => {
    const deps = testDeps(fakeFetch([]));
    await saveOwnerAccounts(deps.kv, TEST_TOKEN_KEY, {
      owner: TEST_OWNER,
      accounts: [testAccount('owner@example.com')],
    });
    await storeGoogleAccount(deps, 'music@example.com', TOKENS);
    await storeGoogleAccount(deps, 'owner@example.com', TOKENS);
    const accounts = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, TEST_OWNER);
    expect(accounts.map((a) => [a.email, a.refreshToken])).toEqual([
      ['music@example.com', 'new-refresh'],
      ['owner@example.com', 'new-refresh'],
    ]);
  });
});

describe('link ticket', () => {
  it('issueLinkUrl builds a Worker link with a ticket that does not expose the user', () => {
    const url = new URL(issueLinkUrl(testDeps(fakeFetch([]))));
    expect(url.origin + url.pathname).toBe('https://gmail.test/accounts/link');
    expect(url.searchParams.get('ticket')).not.toContain(TEST_OWNER);
  });

  it('redeemLinkTicket returns the user only once', async () => {
    const deps = testDeps(fakeFetch([]));
    const ticket = new URL(issueLinkUrl(deps)).searchParams.get('ticket') ?? '';
    expect(await redeemLinkTicket(deps, ticket)).toMatchObject({
      owner: TEST_OWNER,
      email: 'owner@example.com',
    });
    expect(await redeemLinkTicket(deps, ticket)).toBeNull();
    expect(await redeemLinkTicket(deps, 'junk')).toBeNull();
  });

  it('redeemLinkTicket rejects an expired ticket or one without jti', async () => {
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
  it('asks for offline access to manage Gmail and keeps the sealed request with an expiry', async () => {
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

  it('without a valid ticket shows the invalid link page', async () => {
    const deps = testDeps(fakeFetch([]));
    const response = await startAccountLink(deps, confirmPost({ ticket: '', confirm: '' }, null));
    expect(response.status).toBe(400);
  });
});

describe('link confirmation (a forwarded link cannot link someone else into the owner)', () => {
  it('GET only shows whose connector receives the account and spends nothing', async () => {
    const deps = testDeps(fakeFetch([]));
    const shown = await confirmation(deps);
    expect(shown.page.status).toBe(200);
    expect(shown.html).toContain('ow***@example.com');
    expect(shown.html).not.toContain('owner@example.com');
    expect(shown.html).toContain('If someone sent you this link, close this page');
    expect(shown.page.headers.get('content-security-policy')).toContain('accounts.google.com');
    expect(await redeemLinkTicket(deps, shown.ticket)).not.toBeNull();
  });

  it('refuses the POST without the cookie of the browser that saw the page (cross-site auto-submit)', async () => {
    const deps = testDeps(fakeFetch([]));
    const shown = await confirmation(deps);
    expect((await startAccountLink(deps, confirmPost(shown, null))).status).toBe(400);
    const other = await confirmation(deps);
    expect((await startAccountLink(deps, confirmPost(shown, other.cookie))).status).toBe(400);
    expect((await startAccountLink(deps, confirmPost(shown, shown.cookie))).status).toBe(302);
  });

  it('refuses a confirmation made for another ticket, and a ticket used twice', async () => {
    const deps = testDeps(fakeFetch([]));
    const a = await confirmation(deps);
    const b = await confirmation(deps);
    const mixed = { ticket: b.ticket, confirm: a.confirm };
    expect((await startAccountLink(deps, confirmPost(mixed, a.cookie))).status).toBe(400);
    expect((await startAccountLink(deps, confirmPost(a, a.cookie))).status).toBe(302);
    expect((await startAccountLink(deps, confirmPost(a, a.cookie))).status).toBe(400);
    expect(
      (await confirmation(deps, `https://gmail.test/accounts/link?ticket=${a.ticket}`)).page.status,
    ).toBe(400);
  });

  it('refuses a ticket issued by another Worker, even sealed with the same key', async () => {
    const deps = testDeps(fakeFetch([]));
    const foreign = issueLinkUrl({ ...deps, origin: 'https://other-gmail.test' });
    const ticket = new URL(foreign).searchParams.get('ticket') ?? '';
    expect(openLinkTicket(deps, ticket)).toBeNull();
    expect(
      (await confirmation(deps, `https://gmail.test/accounts/link?ticket=${ticket}`)).page.status,
    ).toBe(400);
  });

  it('isConfirmedInThisBrowser and redeemConfirmedTicket need the page fields and the same cookie', async () => {
    const deps = testDeps(fakeFetch([]));
    const shown = await confirmation(deps);
    const fields = new URLSearchParams({ ticket: shown.ticket, confirm: shown.confirm });
    const binding = shown.cookie.slice(`${LINK_COOKIE}=`.length);
    expect(isConfirmedInThisBrowser(deps, fields, binding)).toBe(true);
    expect(isConfirmedInThisBrowser(deps, fields, 'other-binding')).toBe(false);
    expect(isConfirmedInThisBrowser(deps, fields, null)).toBe(false);
    expect(await redeemConfirmedTicket(deps, confirmPost(shown, null))).toBeNull();
    expect(await redeemConfirmedTicket(deps, confirmPost(shown, shown.cookie))).toEqual({
      owner: TEST_OWNER,
      binding,
    });
    expect(usedTicketKey('j')).toBe(`ticket:${sha256Hex('j')}`);
  });

  it('expires after 10 minutes', () => {
    const deps = testDeps(fakeFetch([]));
    const ticket = new URL(issueLinkUrl(deps)).searchParams.get('ticket') ?? '';
    const later = { ...deps, now: () => TEST_NOW_MS + 601_000 };
    expect(openLinkTicket(later, ticket)).toBeNull();
  });
});

describe('takeLinkRequest', () => {
  it('is single-use, requires the same browser cookie and returns the user', async () => {
    const deps = testDeps(fakeFetch([]));
    const first = await begin(deps);
    expect(await takeLinkRequest(deps, callback({ state: first.state }, 'other=1'))).toBeNull();
    const again = await begin(deps);
    const taken = await takeLinkRequest(deps, callback({ state: again.state }, again.cookie));
    expect(taken?.owner).toBe(TEST_OWNER);
    expect(await takeLinkRequest(deps, callback({ state: again.state }, again.cookie))).toBeNull();
  });

  it('rejects an expired request', async () => {
    const deps = testDeps(fakeFetch([]));
    const expired = sealPayload({ typ: 'gmail_link', exp: 1, owner: 'x' }, TEST_TOKEN_KEY);
    await deps.kv.put(linkRequestKey('link.old'), expired);
    const request = callback({ state: 'link.old' }, `${LINK_COOKIE}=x`);
    expect(await takeLinkRequest(deps, request)).toBeNull();
  });
});

describe('linkFromCode, linkSafely and finishAccountLink', () => {
  it('links the account to the ticket user and deletes the cookie', async () => {
    const holder = { nonce: '' };
    const deps = testDeps((url, init) => googleFor('music@example.com', {}, holder)(url, init));
    const started = await begin(deps);
    holder.nonce = started.nonce;
    const request = callback({ state: started.state, code: 'c' }, started.cookie);
    const response = await finishAccountLink(deps, request);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('music@example.com was linked');
    expect(response.headers.getSetCookie().at(-1)).toContain('Max-Age=0');
    const accounts = await loadOwnerAccounts(deps.kv, TEST_TOKEN_KEY, TEST_OWNER);
    expect(accounts.map((a) => a.email)).toEqual(['music@example.com']);
  });

  it('refuses without id_token, scope or refresh token', async () => {
    const noId = testDeps(googleFor('owner@example.com', { id_token: undefined }));
    expect(await (await linkFromCode(noId, 'c', LINK)).text()).toContain('No id_token');
    const noScope = testDeps(googleFor('owner@example.com', { scope: 'openid email' }));
    expect(await (await linkFromCode(noScope, 'c', LINK)).text()).toContain('Missing permission');
    const noRefresh = testDeps(googleFor('owner@example.com', { refresh_token: undefined }));
    expect(await (await linkFromCode(noRefresh, 'c', LINK)).text()).toContain('refresh token');
    expect(noRefresh.kv.entries.size).toBe(0);
  });

  it('linkSafely turns a Google failure into a 400 page without storing', async () => {
    const deps = testDeps(() => Promise.resolve(new Response('', { status: 503 })));
    const response = await linkSafely(deps, 'c', LINK);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('Nothing was stored');
    expect(deps.kv.entries.size).toBe(0);
  });

  it('an expired request or a Google refusal stores nothing', async () => {
    const deps = testDeps(fakeFetch([]));
    const expired = await finishAccountLink(deps, callback({ state: 'link.x', code: 'c' }, null));
    expect(await expired.text()).toContain('Invalid or expired link');
    const started = await begin(deps);
    const denied = await finishAccountLink(
      deps,
      callback({ state: started.state, error: 'access_denied' }, started.cookie),
    );
    expect(await denied.text()).toContain('Linking canceled');
  });
});
