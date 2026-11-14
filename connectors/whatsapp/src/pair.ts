/**
 * Rotas do `/pair`: login do dono pelo GitHub (mesma lista `ALLOWED_EMAILS` do OAuth), sessão em cookie selado,
 * token anti-CSRF e checagem de origem nos POSTs, e as ações de pareamento repassadas à ponte.
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

/** Dependências do `/pair`. */
export interface PairApp {
  readonly settings: OAuthSettings;
  readonly github: GithubLoginSettings;
  readonly bridge: BridgeFetch;
  /** Relógio em segundos Unix. */
  readonly now: () => number;
  readonly timeoutMs: number;
}

/** Nomes dos cookies (prefixo `__Host-`: só https, sem domínio, caminho `/`). */
export const PAIR_SESSION_COOKIE = '__Host-wa_pair';
export const PAIR_NONCE_COOKIE = '__Host-wa_pair_nonce';

/** Validade da sessão do `/pair` e do login em andamento, em segundos. */
export const PAIR_SESSION_TTL_SECONDS = 30 * 60;
export const PAIR_LOGIN_TTL_SECONDS = 10 * 60;

/** Caminho do retorno do GitHub para o `/pair` (subcaminho do retorno cadastrado no OAuth App). */
export const PAIR_CALLBACK_PATH = '/oauth/callback/pair';

/** Lê os cookies de um header `Cookie`. */
export function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const part of (header ?? '').split(';').map((item) => item.trim())) {
    const at = part.indexOf('=');
    if (at > 0) cookies[part.slice(0, at)] = part.slice(at + 1);
  }
  return cookies;
}

/** Monta um `Set-Cookie` seguro (HttpOnly, Secure, SameSite=Lax); `maxAge` 0 apaga. */
export function pairCookie(name: string, value: string, maxAge: number): string {
  return `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

/** Redirecionamento com cookies. */
export function redirectWithCookies(location: string, cookies: readonly string[]): Response {
  const headers = new Headers({ location, 'cache-control': 'no-store' });
  for (const cookie of cookies) headers.append('set-cookie', cookie);
  return new Response(null, { status: 302, headers });
}

/** E-mail da sessão do `/pair` no cookie; nulo se ausente, vencida ou de quem saiu da lista. */
export function readPairSession(app: PairApp, request: Request): string | null {
  const sealed = parseCookies(request.headers.get('cookie'))[PAIR_SESSION_COOKIE] ?? '';
  const claims = openSealed(sealed, app.settings.key, { typ: 'pair_session', now: app.now() });
  const email = typeof claims?.email === 'string' ? claims.email : null;
  return email && app.github.allowedEmails.includes(email) ? email : null;
}

/** Token anti-CSRF amarrado ao e-mail da sessão. */
export function issuePairCsrf(app: PairApp, email: string): string {
  return sealPayload(
    { typ: 'pair_csrf', exp: app.now() + PAIR_SESSION_TTL_SECONDS, email },
    app.settings.key,
  );
}

/** Confere o token anti-CSRF do formulário e a origem da requisição. */
export function isTrustedPost(
  app: PairApp,
  request: Request,
  input: { csrf: string; email: string },
): boolean {
  const claims = openSealed(input.csrf, app.settings.key, { typ: 'pair_csrf', now: app.now() });
  const origin = request.headers.get('origin');
  return claims?.email === input.email && origin === new URL(app.settings.issuer).origin;
}

/** Começa o login do `/pair`: manda ao GitHub com `state` selado e amarra o navegador por um nonce em cookie. */
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

/** Retorno do GitHub no `/pair`: confere `state` e nonce, conclui o login e abre a sessão. */
/** Confere o `state` do retorno do GitHub e o nonce do cookie deste navegador. */
export function isValidPairLogin(app: PairApp, request: Request): boolean {
  const query = new URL(request.url).searchParams;
  const claims = openSealed(query.get('state') ?? '', app.settings.key, {
    typ: 'pair_login',
    now: app.now(),
  });
  const nonce = parseCookies(request.headers.get('cookie'))[PAIR_NONCE_COOKIE];
  return claims !== null && nonce !== undefined && claims.nonce === nonce;
}

/** Abre a sessão do `/pair` para o e-mail aceito e volta à página. */
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

/** Retorno do GitHub no `/pair`: confere `state` e nonce, conclui o login e abre a sessão. */
export async function handlePairCallback(app: PairApp, request: Request): Promise<Response> {
  if (!isValidPairLogin(app, request)) {
    return htmlResponse(
      '<p>Login expirado ou de outro navegador. <a href="/pair">Tente de novo</a>.</p>',
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

/** Prazo (ms Unix) de uma chamada do `/pair` à ponte. */
export function pairDeadline(app: PairApp): number {
  return Date.now() + app.timeoutMs;
}

/** Lê o status da ponte; nulo se ela não responder a tempo. */
export async function fetchPairStatus(app: PairApp): Promise<BridgeStatus | null> {
  try {
    return await bridgeJson<BridgeStatus>(app.bridge, '/status', { deadline: pairDeadline(app) });
  } catch {
    return null;
  }
}

/** Mostra a página com o status atual e o resultado de uma ação (código, QR, mensagem ou erro). */
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

/** Uma ação do `/pair`: recebe o formulário e devolve o que mostrar na página. */
export type PairAction = (app: PairApp, form: URLSearchParams) => Promise<Partial<PairPageView>>;

/** Mensagem de erro de uma ação. */
export function pairActionError(error: unknown): Partial<PairPageView> {
  return { error: error instanceof Error ? error.message : String(error) };
}

/** Ações do `/pair` por caminho. */
export const PAIR_ACTIONS: Readonly<Record<string, PairAction>> = {
  '/pair/code': async (app, form) => {
    const phone = normalizePhone(form.get('phone') ?? '');
    if (!phone) return { error: 'Número inválido: use DDI + DDD + número, só dígitos.' };
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
    return { message: 'Aparelho desvinculado. Pareie de novo quando quiser.' };
  },
  '/pair/reset': async (app, form) => {
    if (form.get('confirm') !== 'APAGAR') return { error: 'Digite APAGAR para confirmar.' };
    await bridgeJson(app.bridge, '/__reset', {
      init: { method: 'POST' },
      deadline: pairDeadline(app),
    });
    return { message: 'Backup arquivado. O WhatsApp vai pedir pareamento de novo.' };
  },
};

/** Atende um POST do `/pair` já autenticado: sair, ou executar a ação e mostrar a página. */
export async function handlePairPost(
  app: PairApp,
  request: Request,
  email: string,
): Promise<Response> {
  const form = await readForm(request);
  if (!isTrustedPost(app, request, { csrf: form.get('csrf') ?? '', email })) {
    return htmlResponse(
      '<p>Formulário expirado. <a href="/pair">Recarregue a página</a>.</p>',
      403,
    );
  }
  const path = new URL(request.url).pathname;
  if (path === '/pair/signout')
    return redirectWithCookies('/', [pairCookie(PAIR_SESSION_COOKIE, '', 0)]);
  const action = PAIR_ACTIONS[path];
  if (!action) return htmlResponse('<p>Não encontrado.</p>', 404);
  const extra = await action(app, form).catch(pairActionError);
  return pairPage(app, email, extra);
}

/** Roteia as requisições do `/pair`; nulo se o caminho não é do `/pair`. */
/** Roteia um POST do `/pair`: sem sessão volta ao login; com sessão, executa a ação. */
export function routePairPost(
  app: PairApp,
  request: Request,
  email: string | null,
): Promise<Response> {
  if (!email) return Promise.resolve(redirectWithCookies('/pair', []));
  return handlePairPost(app, request, email);
}

/** Diz se o caminho pertence ao `/pair`. */
export function isPairPath(path: string): boolean {
  return path === '/pair' || path.startsWith('/pair/') || path === PAIR_CALLBACK_PATH;
}

/** Roteia as requisições do `/pair`; nulo se o caminho não é do `/pair`. */
export async function routePairRequest(app: PairApp, request: Request): Promise<Response | null> {
  const path = new URL(request.url).pathname.replace(/(.)\/+$/, '$1');
  if (!isPairPath(path)) return null;
  const route = `${request.method} ${path === PAIR_CALLBACK_PATH || path === '/pair' ? path : '/pair/*'}`;
  const email = readPairSession(app, request);
  if (route === `GET ${PAIR_CALLBACK_PATH}`) return handlePairCallback(app, request);
  if (route === 'GET /pair') return email ? pairPage(app, email) : startPairLogin(app);
  if (route === 'POST /pair/*') return routePairPost(app, request, email);
  return htmlResponse('<p>Não encontrado.</p>', 404);
}
