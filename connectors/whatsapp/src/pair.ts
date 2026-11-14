/**
 * `/pair` routes: owner login via GitHub (same `ALLOWED_EMAILS` list as OAuth), session in a sealed cookie,
 * anti-CSRF token and origin check on POSTs, and the pairing actions forwarded to the bridge.
 */
import {
  finishGithubLogin,
  githubAuthorizeUrl,
  type GithubLoginSettings,
} from '../../../src/remote/github-login.js';
import { htmlResponse, readForm } from '../../../src/remote/handler.js';
import { escapeHtml } from '../../../src/remote/login-page.js';
import type { OAuthSettings } from '../../../src/remote/oauth.js';
import { openSealed, sealPayload } from '../../../src/remote/seal.js';
import { bridgeJson, jsonPost, type BridgeFetch } from './bridge-client.js';
import { normalizePhone } from './config.js';
import type { BridgeStatus } from './format.js';
import { renderPairPage, type PairPageView } from './pair-page.js';

/** `/pair` dependencies. */
export interface PairApp {
  readonly settings: OAuthSettings;
  readonly github: GithubLoginSettings;
  readonly bridge: BridgeFetch;
  /** Clock in Unix seconds. */
  readonly now: () => number;
  readonly timeoutMs: number;
}

/** Cookie names (`__Host-` prefix: https only, no domain, path `/`). */
export const PAIR_SESSION_COOKIE = '__Host-wa_pair';
export const PAIR_NONCE_COOKIE = '__Host-wa_pair_nonce';

/** Lifetime of the `/pair` session and of a login in progress, in seconds. */
export const PAIR_SESSION_TTL_SECONDS = 30 * 60;
export const PAIR_LOGIN_TTL_SECONDS = 10 * 60;

/** GitHub callback path for `/pair` (subpath of the callback registered in the OAuth App). */
export const PAIR_CALLBACK_PATH = '/oauth/callback/pair';

/** Reads the cookies from a `Cookie` header. */
export function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const part of (header ?? '').split(';').map((item) => item.trim())) {
    const at = part.indexOf('=');
    if (at > 0) cookies[part.slice(0, at)] = part.slice(at + 1);
  }
  return cookies;
}

/** Builds a secure `Set-Cookie` (HttpOnly, Secure, SameSite=Lax); `maxAge` 0 deletes it. */
export function pairCookie(name: string, value: string, maxAge: number): string {
  return `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

/** Redirect with cookies. */
export function redirectWithCookies(location: string, cookies: readonly string[]): Response {
  const headers = new Headers({ location, 'cache-control': 'no-store' });
  for (const cookie of cookies) headers.append('set-cookie', cookie);
  return new Response(null, { status: 302, headers });
}

/** Email of the `/pair` session in the cookie; null if missing, expired or no longer on the list. */
export function readPairSession(app: PairApp, request: Request): string | null {
  const sealed = parseCookies(request.headers.get('cookie'))[PAIR_SESSION_COOKIE] ?? '';
  const claims = openSealed(sealed, app.settings.key, { typ: 'pair_session', now: app.now() });
  const email = typeof claims?.email === 'string' ? claims.email : null;
  return email && app.github.allowedEmails.includes(email) ? email : null;
}

/** Anti-CSRF token bound to the session email. */
export function issuePairCsrf(app: PairApp, email: string): string {
  return sealPayload(
    { typ: 'pair_csrf', exp: app.now() + PAIR_SESSION_TTL_SECONDS, email },
    app.settings.key,
  );
}

/** Checks the form's anti-CSRF token and the request origin. */
export function isTrustedPost(
  app: PairApp,
  request: Request,
  input: { csrf: string; email: string },
): boolean {
  const claims = openSealed(input.csrf, app.settings.key, { typ: 'pair_csrf', now: app.now() });
  const origin = request.headers.get('origin');
  return claims?.email === input.email && origin === new URL(app.settings.issuer).origin;
}

/** Starts the `/pair` login: sends to GitHub with a sealed `state` and binds the browser with a nonce cookie. */
export function startPairLogin(app: PairApp): Response {
  const nonce = crypto.randomUUID();
  const state = sealPayload(
    { typ: 'pair_login', exp: app.now() + PAIR_LOGIN_TTL_SECONDS, nonce },
    app.settings.key,
  );
  const target = githubAuthorizeUrl(
    app.github,
    state,
    `${app.settings.issuer}${PAIR_CALLBACK_PATH}`,
  );
  return redirectWithCookies(target, [
    pairCookie(PAIR_NONCE_COOKIE, nonce, PAIR_LOGIN_TTL_SECONDS),
  ]);
}

/** Checks the `state` of the GitHub callback and this browser's nonce cookie. */
export function isValidPairLogin(app: PairApp, request: Request): boolean {
  const query = new URL(request.url).searchParams;
  const claims = openSealed(query.get('state') ?? '', app.settings.key, {
    typ: 'pair_login',
    now: app.now(),
  });
  const nonce = parseCookies(request.headers.get('cookie'))[PAIR_NONCE_COOKIE];
  return claims !== null && nonce !== undefined && claims.nonce === nonce;
}

/** Opens the `/pair` session for the accepted email and returns to the page. */
export function openPairSession(app: PairApp, email: string): Response {
  const session = sealPayload(
    { typ: 'pair_session', exp: app.now() + PAIR_SESSION_TTL_SECONDS, email },
    app.settings.key,
  );
  return redirectWithCookies('/pair', [
    pairCookie(PAIR_SESSION_COOKIE, session, PAIR_SESSION_TTL_SECONDS),
    pairCookie(PAIR_NONCE_COOKIE, '', 0),
  ]);
}

/** GitHub callback for `/pair`: checks `state` and nonce, finishes the login and opens the session. */
export async function handlePairCallback(app: PairApp, request: Request): Promise<Response> {
  if (!isValidPairLogin(app, request)) {
    return htmlResponse(
      '<p>Login expired or from another browser. <a href="/pair">Try again</a>.</p>',
      400,
    );
  }
  const query = new URL(request.url).searchParams;
  try {
    return openPairSession(
      app,
      await finishGithubLogin(app.github, query, `${app.settings.issuer}${PAIR_CALLBACK_PATH}`),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return htmlResponse(`<p>${escapeHtml(message)}</p>`, 403);
  }
}

/** Deadline (Unix ms) of a `/pair` call to the bridge. */
export function pairDeadline(app: PairApp): number {
  return Date.now() + app.timeoutMs;
}

/** Reads the bridge status; null if it does not answer in time. */
export async function fetchPairStatus(app: PairApp): Promise<BridgeStatus | null> {
  try {
    return await bridgeJson<BridgeStatus>(app.bridge, '/status', { deadline: pairDeadline(app) });
  } catch {
    return null;
  }
}

/** Shows the page with the current status and the result of an action (code, QR, message or error). */
export async function pairPage(
  app: PairApp,
  email: string,
  extra: Partial<PairPageView> = {},
): Promise<Response> {
  const view: PairPageView = {
    email,
    csrf: issuePairCsrf(app, email),
    status: await fetchPairStatus(app),
    ...extra,
  };
  return htmlResponse(renderPairPage(view));
}

/** A `/pair` action: takes the form and returns what to show on the page. */
export type PairAction = (app: PairApp, form: URLSearchParams) => Promise<Partial<PairPageView>>;

/** Error message of an action. */
export function pairActionError(error: unknown): Partial<PairPageView> {
  return { error: error instanceof Error ? error.message : String(error) };
}

/** `/pair` actions by path. */
export const PAIR_ACTIONS: Readonly<Record<string, PairAction>> = {
  '/pair/code': async (app, form) => {
    const phone = normalizePhone(form.get('phone') ?? '');
    if (!phone)
      return { error: 'Invalid number: use country code + area code + number, digits only.' };
    const init = jsonPost({ phone });
    const res = await bridgeJson<{ code: string }>(app.bridge, '/pair/code', {
      init,
      deadline: pairDeadline(app),
    });
    return { code: res.code };
  },
  '/pair/qr': async (app) => {
    const res = await bridgeJson<{ png_base64: string }>(app.bridge, '/pair/qr', {
      deadline: pairDeadline(app),
    });
    return { qrPng: res.png_base64 };
  },
  '/pair/logout': async (app) => {
    await bridgeJson(app.bridge, '/logout', {
      init: { method: 'POST' },
      deadline: pairDeadline(app),
    });
    return { message: 'Device unlinked. Pair again whenever you want.' };
  },
  '/pair/reset': async (app, form) => {
    if (form.get('confirm') !== 'ERASE') return { error: 'Type ERASE to confirm.' };
    await bridgeJson(app.bridge, '/__reset', {
      init: { method: 'POST' },
      deadline: pairDeadline(app),
    });
    return { message: 'Backup archived. WhatsApp will ask for pairing again.' };
  },
};

/** Handles an authenticated `/pair` POST: sign out, or run the action and show the page. */
export async function handlePairPost(
  app: PairApp,
  request: Request,
  email: string,
): Promise<Response> {
  const form = await readForm(request);
  if (!isTrustedPost(app, request, { csrf: form.get('csrf') ?? '', email })) {
    return htmlResponse('<p>Form expired. <a href="/pair">Reload the page</a>.</p>', 403);
  }
  const path = new URL(request.url).pathname;
  if (path === '/pair/signout')
    return redirectWithCookies('/', [pairCookie(PAIR_SESSION_COOKIE, '', 0)]);
  const action = PAIR_ACTIONS[path];
  if (!action) return htmlResponse('<p>Not found.</p>', 404);
  const extra = await action(app, form).catch(pairActionError);
  return pairPage(app, email, extra);
}

/** Routes a `/pair` POST: without a session goes back to login; with a session, runs the action. */
export function routePairPost(
  app: PairApp,
  request: Request,
  email: string | null,
): Promise<Response> {
  if (!email) return Promise.resolve(redirectWithCookies('/pair', []));
  return handlePairPost(app, request, email);
}

/** Tells whether the path belongs to `/pair`. */
export function isPairPath(path: string): boolean {
  return path === '/pair' || path.startsWith('/pair/') || path === PAIR_CALLBACK_PATH;
}

/** Routes `/pair` requests; null if the path is not under `/pair`. */
export async function routePairRequest(app: PairApp, request: Request): Promise<Response | null> {
  const path = new URL(request.url).pathname.replace(/(.)\/+$/, '$1');
  if (!isPairPath(path)) return null;
  const route = `${request.method} ${path === PAIR_CALLBACK_PATH || path === '/pair' ? path : '/pair/*'}`;
  const email = readPairSession(app, request);
  if (route === `GET ${PAIR_CALLBACK_PATH}`) return handlePairCallback(app, request);
  if (route === 'GET /pair') return email ? pairPage(app, email) : startPairLogin(app);
  if (route === 'POST /pair/*') return routePairPost(app, request, email);
  return htmlResponse('<p>Not found.</p>', 404);
}
