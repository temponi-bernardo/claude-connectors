/**
 * Roteador HTTP do conector remoto sobre `Request`/`Response` (Web padrão): descoberta OAuth, registro,
 * autorização com a página de login, troca de tokens e o endpoint `/mcp` protegido.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { renderLoginPage, type LoginPageText } from './login-page.js';
import { mcpUnauthorizedResponse, serveMcpRequest } from './mcp-endpoint.js';
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
  readAccessSecret,
  redeemTokenRequest,
  sealAuthorizeRequest,
} from './tokens.js';

/** O que um conector entrega ao servidor remoto. */
export interface RemoteConnector {
  readonly loginText: LoginPageText;
  /** Confere a credencial no serviço; rejeita com mensagem para o usuário se ela não servir. */
  readonly verifySecret: (secret: string) => Promise<void>;
  /** Cria o servidor MCP com as ferramentas ligadas à credencial do usuário. */
  readonly createServer: (secret: string) => McpServer;
  /** Opcional: estende a validade da credencial no serviço a cada refresh do OAuth. */
  readonly renewSecret?: (secret: string) => Promise<void>;
}

/** Dependências do roteador: configuração OAuth, conector e relógio em segundos Unix. */
export interface RemoteApp {
  readonly settings: OAuthSettings;
  readonly connector: RemoteConnector;
  readonly now: () => number;
}

/** Função que atende uma requisição. */
export type RemoteRoute = (app: RemoteApp, request: Request) => Promise<Response>;

/** Headers CORS: os endpoints não usam cookies, então qualquer origem pode chamá-los. */
export const CORS_HEADERS: Readonly<Record<string, string>> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
  'access-control-allow-headers':
    'authorization, content-type, mcp-protocol-version, mcp-session-id',
  'access-control-expose-headers': 'www-authenticate, mcp-session-id',
};

/** Resposta JSON com status. */
export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

/** CSP das páginas; o `form-action` inclui a origem do retorno, senão o navegador barra o 302 do envio. */
export function pageSecurityPolicy(formTarget: string | null): string {
  const formAction = formTarget ? `'self' ${formTarget}` : "'self'";
  return `default-src 'none'; style-src 'unsafe-inline'; form-action ${formAction}; frame-ancestors 'none'`;
}

/** Resposta HTML com status, sem cache e sem ser exibida em frames de outros sites. */
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

/** Lê o corpo de um formulário (`application/x-www-form-urlencoded`). */
export async function readForm(request: Request): Promise<URLSearchParams> {
  return new URLSearchParams(await request.text());
}

/** Lê um corpo JSON; nulo se não for JSON válido. */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    const body: unknown = await request.json();
    return body;
  } catch {
    return null;
  }
}

/** Monta a página de login de um pedido validado (com erro opcional). */
export function loginPageFor(
  app: RemoteApp,
  request: AuthorizeRequest,
  error: string | null,
): Response {
  return htmlResponse(
    renderLoginPage({
      text: app.connector.loginText,
      pending: sealAuthorizeRequest(request, app.settings, app.now()),
      clientHost: new URL(request.redirectUri).host,
      error,
    }),
    200,
    new URL(request.redirectUri).origin,
  );
}

/** Redireciona de volta ao cliente com o código e o `state`. */
export function redirectWithCode(request: AuthorizeRequest, code: string): Response {
  const target = new URL(request.redirectUri);
  target.searchParams.set('code', code);
  if (request.state !== null) target.searchParams.set('state', request.state);
  return new Response(null, { status: 302, headers: { location: target.toString() } });
}

/** `POST /register`: registro dinâmico de cliente. */
export async function handleRegister(app: RemoteApp, request: Request): Promise<Response> {
  const result = registerClient(await readJsonBody(request), app.settings, app.now());
  if (!result.ok)
    return jsonResponse({ error: result.error, error_description: result.description }, 400);
  return jsonResponse(result.value, 201);
}

/** `GET /authorize`: valida o pedido e mostra a página de login (erros não redirecionam). */
export function handleAuthorizePage(app: RemoteApp, request: Request): Promise<Response> {
  const result = parseAuthorizeQuery(new URL(request.url).searchParams, app.settings, app.now());
  if (!result.ok) return Promise.resolve(htmlResponse(`<p>${result.description}</p>`, 400));
  return Promise.resolve(loginPageFor(app, result.value, null));
}

/** `POST /authorize`: confere a credencial e devolve o código ao cliente, ou a página com o erro. */
export async function handleAuthorizeSubmit(app: RemoteApp, request: Request): Promise<Response> {
  const form = await readForm(request);
  const pending = openAuthorizeRequest(form.get('pending') ?? '', app.settings, app.now());
  if (!pending)
    return htmlResponse('<p>O pedido expirou. Volte ao Claude e conecte de novo.</p>', 400);
  const secret = (form.get('secret') ?? '').trim();
  try {
    await app.connector.verifySecret(secret);
  } catch (error) {
    return loginPageFor(app, pending, error instanceof Error ? error.message : String(error));
  }
  return redirectWithCode(
    pending,
    issueAuthorizationCode({ request: pending, secret }, app.settings, app.now()),
  );
}

/** Renova a credencial pelo conector, se ele souber; falha só vira aviso no log (o refresh segue). */
export async function renewSecretQuietly(
  connector: RemoteConnector,
  secret: string,
): Promise<void> {
  try {
    await connector.renewSecret?.(secret);
  } catch (error) {
    console.warn(
      'Não consegui renovar a credencial:',
      error instanceof Error ? error.message : error,
    );
  }
}

/** `POST /token`: troca código ou refresh token por tokens; no refresh, renova a credencial. */
export async function handleToken(app: RemoteApp, request: Request): Promise<Response> {
  const result = redeemTokenRequest(await readForm(request), app.settings, app.now());
  if (!result.ok)
    return jsonResponse({ error: result.error, error_description: result.description }, 400);
  if (result.value.refreshed) await renewSecretQuietly(app.connector, result.value.secret);
  return jsonResponse(result.value.tokens);
}

/** `/mcp`: exige o access token e atende com o servidor MCP do usuário. */
export function handleMcp(app: RemoteApp, request: Request): Promise<Response> {
  const secret = readAccessSecret(request.headers.get('authorization'), app.settings, app.now());
  if (secret === null) return Promise.resolve(mcpUnauthorizedResponse(app.settings.issuer));
  return serveMcpRequest(app.connector.createServer(secret), request);
}

/** Tabela de rotas: `MÉTODO caminho` → função. */
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
  'GET /mcp': handleMcp,
  'POST /mcp': handleMcp,
  'DELETE /mcp': handleMcp,
};

/** Acrescenta os headers CORS a uma resposta. */
export function withCors(response: Response): Response {
  for (const [name, value] of Object.entries(CORS_HEADERS)) response.headers.set(name, value);
  return response;
}

/** Escolhe a rota pelo método e caminho; preflight CORS dá 204 e caminho desconhecido dá 404. */
export async function routeRemoteRequest(app: RemoteApp, request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') return withCors(new Response(null, { status: 204 }));
  const path = new URL(request.url).pathname.replace(/(.)\/+$/, '$1');
  const route = REMOTE_ROUTES[`${request.method} ${path}`];
  if (!route) return new Response('Não encontrado', { status: 404 });
  return withCors(await route(app, request));
}

/** Cria o handler `(Request) => Promise<Response>` do conector remoto. */
export function createRemoteHandler(app: RemoteApp): (request: Request) => Promise<Response> {
  return (request) => routeRemoteRequest(app, request);
}
