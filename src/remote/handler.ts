/**
 * HTTP router of the remote connector over standard Web `Request`/`Response`: OAuth discovery, registration,
 * authorization with the login page, token exchange and the protected `/mcp` endpoint.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { errorMessage, logWarning, redactSecrets } from '../core/redact.js';
import { escapeHtml, renderLoginPage, type LoginPageText } from './login-page.js';
import {
  mcpUnauthorizedResponse,
  serveMcpRequest,
  serveToolCatalog,
  TOOL_CATALOG_PATH,
} from './mcp-endpoint.js';
import {
  readToolCallRequest,
  streamedToolResponse,
  type StreamedToolContent,
  type ToolCallRequest,
} from './streamed-tool.js';
import {
  authorizationServerMetadata,
  parseAuthorizeQuery,
  protectedResourceMetadata,
  registerClient,
  type AuthorizeRequest,
  type OAuthSettings,
} from './oauth.js';
import {
  issueAuthorizationCode,
  openAuthorizeRequest,
  readAccessGrant,
  redeemTokenRequest,
  sealAuthorizeRequest,
  type SealedGrant,
} from './tokens.js';

/** Login where the user pastes the service credential on the `/authorize` page (e.g. the Canvas token). */
export interface SecretLogin {
  readonly kind: 'secret';
  readonly text: LoginPageText;
  /** Checks the credential against the service; rejects with a user-facing message if it does not work. */
  readonly verify: (secret: string) => Promise<void>;
}

/** Login delegated to an identity provider (e.g. GitHub); the sealed secret is the accepted identity. */
export interface UpstreamLogin {
  readonly kind: 'upstream';
  /** Provider address the browser is sent to, carrying the sealed request in `state`. */
  readonly start: (state: string, callbackUrl: string) => string;
  /** Finishes the login with the callback query; returns the secret or rejects with a user-facing message. */
  readonly finish: (query: URLSearchParams, callbackUrl: string) => Promise<string>;
}

/** Outcome of renewing the credential: `revoked` when the service refused it (the refresh becomes `invalid_grant`). */
export type SecretRenewal = 'kept' | 'revoked';

/** What a connector hands to the remote server. */
export interface RemoteConnector {
  readonly login: SecretLogin | UpstreamLogin;
  /** Creates the MCP server with the tools bound to the user's credential and the permissions they opted into. */
  readonly createServer: (
    secret: string,
    grants: readonly string[],
  ) => McpServer | Promise<McpServer>;
  /** Optional: server that only lists the tools, for the public catalog at `GET /tools` (no credential). */
  readonly catalogServer?: () => McpServer;
  /** Optional: the connector's own browser pages (`METHOD path` → handler), served without CORS. */
  readonly pages?: Readonly<Record<string, (request: Request) => Promise<Response>>>;
  /** Optional: extends the credential lifetime at the service on each OAuth refresh. */
  readonly renewSecret?: (secret: string) => Promise<SecretRenewal>;
  /** Optional: checks on each `/mcp` whether the secret is still valid (e.g. email still on the owner's list). */
  readonly acceptsSecret?: (secret: string) => boolean;
  /**
   * Optional: answers a `tools/call` as a stream (large files, ADR 0023); `null` leaves it to the MCP server,
   * which also reports any error.
   */
  readonly streamTool?: (
    secret: string,
    call: ToolCallRequest,
  ) => Promise<StreamedToolContent | null>;
}

/** Callback path of the delegated login (register `<issuer>/oauth/callback` with the provider). */
export const UPSTREAM_CALLBACK_PATH = '/oauth/callback';

/** Router dependencies: OAuth configuration, connector and a clock in Unix seconds. */
export interface RemoteApp {
  readonly settings: OAuthSettings;
  readonly connector: RemoteConnector;
  readonly now: () => number;
}

/** Function that serves a request. */
export type RemoteRoute = (app: RemoteApp, request: Request) => Promise<Response>;

/** CORS headers of the API routes: they use no cookies, so any origin may call them (pages get none). */
export const CORS_HEADERS: Readonly<Record<string, string>> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
  'access-control-allow-headers':
    'authorization, content-type, mcp-protocol-version, mcp-session-id',
  'access-control-expose-headers': 'www-authenticate, mcp-session-id',
};

/** JSON response with a status. */
export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

/** Page CSP; `form-action` includes the redirect origin, otherwise the browser blocks the 302 after submit. */
export function pageSecurityPolicy(formTarget: string | null): string {
  const formAction = formTarget ? `'self' ${formTarget}` : "'self'";
  return `default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action ${formAction}; frame-ancestors 'none'`;
}

/** HTML response with a status, no cache and not framed by other sites. */
export function htmlResponse(
  html: string,
  status = 200,
  formTarget: string | null = null,
): Response {
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'content-security-policy': pageSecurityPolicy(formTarget),
    },
  });
}

/** Reads a form body (`application/x-www-form-urlencoded`). */
export async function readForm(request: Request): Promise<URLSearchParams> {
  return new URLSearchParams(await request.text());
}

/** Reads a JSON body; null if it is not valid JSON. */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    const body: unknown = await request.json();
    return body;
  } catch {
    return null;
  }
}

/** Builds the login page of a validated request (with an optional error). */
export function loginPageFor(
  app: RemoteApp,
  request: AuthorizeRequest,
  error: string | null,
): Response {
  if (app.connector.login.kind !== 'secret') return htmlResponse('<p>Not found.</p>', 404);
  return htmlResponse(
    renderLoginPage({
      text: app.connector.login.text,
      pending: sealAuthorizeRequest(request, app.settings, app.now()),
      clientHost: new URL(request.redirectUri).host,
      error: error === null ? null : redactSecrets(error),
    }),
    200,
    new URL(request.redirectUri).origin,
  );
}

/** Redirects back to the client with the code and the `state`. */
export function redirectWithCode(request: AuthorizeRequest, code: string): Response {
  const target = new URL(request.redirectUri);
  target.searchParams.set('code', code);
  if (request.state !== null) target.searchParams.set('state', request.state);
  return new Response(null, { status: 302, headers: { location: target.toString() } });
}

/** `POST /register`: dynamic client registration. */
export async function handleRegister(app: RemoteApp, request: Request): Promise<Response> {
  const result = registerClient(await readJsonBody(request), app.settings, app.now());
  if (!result.ok)
    return jsonResponse({ error: result.error, error_description: result.description }, 400);
  return jsonResponse(result.value, 201);
}

/** Redirects the browser to the identity provider with the sealed request in `state`. */
export function redirectToUpstream(
  app: RemoteApp,
  login: UpstreamLogin,
  request: AuthorizeRequest,
): Response {
  const state = sealAuthorizeRequest(request, app.settings, app.now());
  const target = login.start(state, `${app.settings.issuer}${UPSTREAM_CALLBACK_PATH}`);
  return new Response(null, { status: 302, headers: { location: target } });
}

/** `GET /authorize`: validates the request and shows the login page or goes to the provider (errors do not redirect). */
export function handleAuthorizePage(app: RemoteApp, request: Request): Promise<Response> {
  const result = parseAuthorizeQuery(new URL(request.url).searchParams, app.settings, app.now());
  if (!result.ok) return Promise.resolve(htmlResponse(`<p>${result.description}</p>`, 400));
  const login = app.connector.login;
  if (login.kind === 'upstream')
    return Promise.resolve(redirectToUpstream(app, login, result.value));
  return Promise.resolve(loginPageFor(app, result.value, null));
}

/** `GET /oauth/callback`: finishes the delegated login and returns the code to the client, or explains the refusal. */
export async function handleUpstreamCallback(app: RemoteApp, request: Request): Promise<Response> {
  const login = app.connector.login;
  if (login.kind !== 'upstream') return htmlResponse('<p>Not found.</p>', 404);
  const query = new URL(request.url).searchParams;
  const pending = openAuthorizeRequest(query.get('state') ?? '', app.settings, app.now());
  if (!pending)
    return htmlResponse('<p>The request expired. Go back to Claude and connect again.</p>', 400);
  let secret: string;
  try {
    secret = await login.finish(query, `${app.settings.issuer}${UPSTREAM_CALLBACK_PATH}`);
  } catch (error) {
    return htmlResponse(`<p>${escapeHtml(redactSecrets(errorMessage(error)))}</p>`, 403);
  }
  return redirectWithCode(
    pending,
    issueAuthorizationCode({ request: pending, secret, grants: [] }, app.settings, app.now()),
  );
}

/** `POST /authorize`: checks the credential and returns the code to the client, or the page with the error. */
export async function handleAuthorizeSubmit(app: RemoteApp, request: Request): Promise<Response> {
  const form = await readForm(request);
  const login = app.connector.login;
  if (login.kind !== 'secret') return htmlResponse('<p>Not found.</p>', 404);
  const pending = openAuthorizeRequest(form.get('pending') ?? '', app.settings, app.now());
  if (!pending)
    return htmlResponse('<p>The request expired. Go back to Claude and connect again.</p>', 400);
  const secret = (form.get('secret') ?? '').trim();
  try {
    await login.verify(secret);
  } catch (error) {
    return loginPageFor(app, pending, errorMessage(error));
  }
  const grants = chosenGrants(login, form);
  return redirectWithCode(
    pending,
    issueAuthorizationCode({ request: pending, secret, grants }, app.settings, app.now()),
  );
}

/** Permissions the user ticked on the login page: only the one the connector offers, never anything else. */
export function chosenGrants(login: SecretLogin, form: URLSearchParams): string[] {
  const offered = login.text.grantOption?.name;
  return offered !== undefined && form.getAll('grant').includes(offered) ? [offered] : [];
}

/** Renews the credential through the connector, if it can; a failure only logs a warning (the refresh goes on). */
export async function renewSecretQuietly(
  connector: RemoteConnector,
  secret: string,
): Promise<SecretRenewal> {
  try {
    return (await connector.renewSecret?.(secret)) ?? 'kept';
  } catch (error) {
    logWarning('Could not renew the credential:', error);
    return 'kept';
  }
}

/** Error description when the service revoked the credential sealed in a refresh token. */
export const REVOKED_SECRET_DESCRIPTION =
  'The service no longer accepts the credential behind this refresh token (revoked or expired): connect the connector again.';

/** `POST /token`: exchanges a code or refresh token for tokens; on refresh, renews the credential. */
export async function handleToken(app: RemoteApp, request: Request): Promise<Response> {
  const result = redeemTokenRequest(await readForm(request), app.settings, app.now());
  if (!result.ok)
    return jsonResponse({ error: result.error, error_description: result.description }, 400);
  const revoked =
    result.value.refreshed &&
    (await renewSecretQuietly(app.connector, result.value.grant.secret)) === 'revoked';
  if (revoked)
    return jsonResponse(
      { error: 'invalid_grant', error_description: REVOKED_SECRET_DESCRIPTION },
      400,
    );
  return jsonResponse(result.value.tokens);
}

/** `/mcp`: requires the access token and serves with the user's MCP server. */
export function handleMcp(app: RemoteApp, request: Request): Promise<Response> {
  const grant = readAccessGrant(request.headers.get('authorization'), app.settings, app.now());
  if (grant === null) return Promise.resolve(mcpUnauthorizedResponse(app.settings.issuer));
  if (app.connector.acceptsSecret?.(grant.secret) === false) {
    return Promise.resolve(jsonResponse({ error: 'access_revoked' }, 403));
  }
  return serveMcpWithStreaming(app.connector, grant, request);
}

/** Serves `/mcp`: a call the connector streams goes straight out; the rest goes to a new MCP server. */
export async function serveMcpWithStreaming(
  connector: RemoteConnector,
  grant: SealedGrant,
  request: Request,
): Promise<Response> {
  const streamed = await streamToolQuietly(connector, grant.secret, request);
  if (streamed) return streamed;
  return serveMcpRequest(await connector.createServer(grant.secret, grant.grants), request);
}

/** Streamed response of a `tools/call` the connector takes; `null` (with a warning on failure) otherwise. */
export async function streamToolQuietly(
  connector: RemoteConnector,
  secret: string,
  request: Request,
): Promise<Response | null> {
  if (!connector.streamTool) return null;
  const call = await readToolCallRequest(request);
  if (!call) return null;
  try {
    const content = await connector.streamTool(secret, call);
    return content && streamedToolResponse(call.id, content);
  } catch (error) {
    logWarning('Streamed tool fell back:', error);
    return null;
  }
}

/** Route table: `METHOD path` → function. */
export const REMOTE_ROUTES: Readonly<Record<string, RemoteRoute>> = {
  'GET /': () => Promise.resolve(new Response('ok')),
  'GET /.well-known/oauth-authorization-server': (app) =>
    Promise.resolve(jsonResponse(authorizationServerMetadata(app.settings.issuer))),
  'GET /.well-known/oauth-protected-resource': (app) =>
    Promise.resolve(jsonResponse(protectedResourceMetadata(app.settings.issuer))),
  'GET /.well-known/oauth-protected-resource/mcp': (app) =>
    Promise.resolve(jsonResponse(protectedResourceMetadata(app.settings.issuer))),
  'POST /register': handleRegister,
  'GET /authorize': handleAuthorizePage,
  'POST /authorize': handleAuthorizeSubmit,
  'POST /token': handleToken,
  [`GET ${UPSTREAM_CALLBACK_PATH}`]: handleUpstreamCallback,
  'GET /mcp': handleMcp,
  'POST /mcp': handleMcp,
  'DELETE /mcp': handleMcp,
  [`GET ${TOOL_CATALOG_PATH}`]: handleToolCatalog,
};

/** `GET /tools`: the public tool catalog (names, schemas, annotations; never user data), or 404 without one. */
export function handleToolCatalog(app: RemoteApp, request: Request): Promise<Response> {
  const catalog = app.connector.catalogServer;
  if (!catalog) return Promise.resolve(new Response('Not found', { status: 404 }));
  return serveToolCatalog(catalog(), new URL(request.url).origin);
}

/** The connector's own page for `METHOD path`, or undefined when it has none. */
export function connectorPage(
  app: RemoteApp,
  key: string,
): ((request: Request) => Promise<Response>) | undefined {
  return app.connector.pages?.[key];
}

/** Adds the CORS headers to a response. */
export function withCors(response: Response): Response {
  for (const [name, value] of Object.entries(CORS_HEADERS)) response.headers.set(name, value);
  return response;
}

/** Browser pages (login and provider return): navigated to, never fetched, so they get no CORS headers. */
export const BROWSER_PAGE_PATHS: readonly string[] = ['/authorize', UPSTREAM_CALLBACK_PATH];

/** Says whether a path is an API route that other origins may call (everything but the browser pages). */
export function allowsCors(path: string): boolean {
  return !BROWSER_PAGE_PATHS.includes(path);
}

/** Picks the route by method and path; a CORS preflight gives 204 (API routes only) and an unknown path 404. */
export async function routeRemoteRequest(app: RemoteApp, request: Request): Promise<Response> {
  const path = new URL(request.url).pathname.replace(/(.)\/+$/, '$1');
  if (request.method === 'OPTIONS') {
    const preflight = new Response(null, { status: 204 });
    return allowsCors(path) ? withCors(preflight) : preflight;
  }
  const key = `${request.method} ${path}`;
  const route = REMOTE_ROUTES[key];
  // A connector page never shadows an OAuth or MCP route; pages are navigated to, so they get no CORS.
  const page = route ? undefined : connectorPage(app, key);
  if (page) return page(request);
  if (!route) return new Response('Not found', { status: 404 });
  const response = await route(app, request);
  return allowsCors(path) ? withCors(response) : response;
}

/** Creates the `(Request) => Promise<Response>` handler of the remote connector. */
export function createRemoteHandler(app: RemoteApp): (request: Request) => Promise<Response> {
  return (request) => routeRemoteRequest(app, request);
}
