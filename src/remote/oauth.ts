/**
 * Regras do servidor de autorização OAuth 2.1 sem estado: metadados, PKCE, registro dinâmico de cliente
 * e validação do pedido de autorização. Os clientes ficam selados no próprio `client_id`.
 */
import { createHash } from 'node:crypto';
import { openSealed, sealPayload } from './seal.js';

/** Validade do `client_id` registrado (10 anos, em segundos). */
export const CLIENT_TTL_SECONDS = 10 * 365 * 24 * 3600;

/** Configuração do servidor de autorização. */
export interface OAuthSettings {
  /** URL pública do servidor, sem barra final (ex.: `https://canvas.exemplo.dev`). */
  readonly issuer: string;
  /** Chave do selo (`SEAL_KEY`). */
  readonly key: Buffer;
  /** Hosts aceitos como retorno do OAuth (`localhost` libera também `127.0.0.1` em http). */
  readonly redirectHosts: readonly string[];
}

/** Resultado de uma validação: valor, ou erro OAuth (`error` + `error_description`). */
export type OAuthResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string; readonly description: string };

/** Pedido de autorização já validado. */
export interface AuthorizeRequest {
  readonly clientId: string;
  readonly redirectUri: string;
  readonly codeChallenge: string;
  readonly state: string | null;
}

/** Resposta do registro dinâmico (RFC 7591). */
export interface ClientRegistration {
  readonly client_id: string;
  readonly redirect_uris: readonly string[];
  readonly token_endpoint_auth_method: 'none';
  readonly grant_types: readonly string[];
  readonly response_types: readonly string[];
}

/** Monta um erro OAuth. */
export function oauthError<T>(error: string, description: string): OAuthResult<T> {
  return { ok: false, error, description };
}

/** Metadados do servidor de autorização (RFC 8414). */
export function authorizationServerMetadata(issuer: string): Record<string, unknown> {
  return {
    issuer,
    authorization_endpoint: `${issuer}/authorize`,
    token_endpoint: `${issuer}/token`,
    registration_endpoint: `${issuer}/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none'],
  };
}

/** Metadados do recurso protegido `/mcp` (RFC 9728). */
export function protectedResourceMetadata(issuer: string): Record<string, unknown> {
  return {
    resource: `${issuer}/mcp`,
    authorization_servers: [issuer],
    bearer_methods_supported: ['header'],
  };
}

/** Diz se um endereço de retorno é aceito: https num host listado (ou subdomínio), ou localhost em http. */
export function isAllowedRedirect(uri: string, hosts: readonly string[]): boolean {
  if (!URL.canParse(uri)) return false;
  const { protocol, hostname } = new URL(uri);
  if (protocol === 'http:') {
    return hosts.includes('localhost') && ['localhost', '127.0.0.1'].includes(hostname);
  }
  return (
    protocol === 'https:' &&
    hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))
  );
}

/** Desafio PKCE S256 de um verificador: SHA-256 em base64url. */
export function pkceChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}

/** Extrai `redirect_uris` (lista de textos) do corpo do registro; nulo se ausente ou malformado. */
export function readRedirectUris(body: unknown): string[] | null {
  if (typeof body !== 'object' || body === null) return null;
  const uris = (body as { redirect_uris?: unknown }).redirect_uris;
  if (!Array.isArray(uris) || uris.length === 0) return null;
  return uris.every((uri): uri is string => typeof uri === 'string') ? uris : null;
}

/** Registra um cliente: valida os endereços de retorno e sela-os no `client_id`. */
export function registerClient(
  body: unknown,
  settings: OAuthSettings,
  now: number,
): OAuthResult<ClientRegistration> {
  const uris = readRedirectUris(body);
  if (!uris?.every((uri) => isAllowedRedirect(uri, settings.redirectHosts))) {
    return oauthError('invalid_redirect_uri', 'Endereço de retorno ausente ou não permitido.');
  }
  const clientId = sealPayload(
    { typ: 'client', exp: now + CLIENT_TTL_SECONDS, redirect_uris: uris },
    settings.key,
  );
  return {
    ok: true,
    value: {
      client_id: clientId,
      redirect_uris: uris,
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
    },
  };
}

/** Endereços de retorno registrados num `client_id`; nulo se o cliente não é deste servidor. */
export function clientRedirectUris(
  clientId: string,
  settings: OAuthSettings,
  now: number,
): string[] | null {
  const claims = openSealed(clientId, settings.key, { typ: 'client', now });
  return claims ? readRedirectUris(claims) : null;
}

/** Valida a query do `/authorize`: cliente, retorno registrado, `response_type=code` e PKCE S256. */
export function parseAuthorizeQuery(
  query: URLSearchParams,
  settings: OAuthSettings,
  now: number,
): OAuthResult<AuthorizeRequest> {
  const clientId = query.get('client_id') ?? '';
  const uris = clientRedirectUris(clientId, settings, now);
  if (!uris)
    return oauthError('invalid_client', 'Cliente desconhecido: registre o conector de novo.');
  const redirectUri = query.get('redirect_uri') ?? '';
  if (!uris.includes(redirectUri))
    return oauthError('invalid_request', 'redirect_uri não registrado.');
  const challenge = readCodeChallenge(query);
  if (!challenge.ok) return challenge;
  const codeChallenge = challenge.value;
  return { ok: true, value: { clientId, redirectUri, codeChallenge, state: query.get('state') } };
}

/** Confere `response_type=code` e PKCE S256; devolve o `code_challenge`. */
export function readCodeChallenge(query: URLSearchParams): OAuthResult<string> {
  if (query.get('response_type') !== 'code') {
    return oauthError('unsupported_response_type', 'Só response_type=code é aceito.');
  }
  const codeChallenge = query.get('code_challenge') ?? '';
  if (!codeChallenge || query.get('code_challenge_method') !== 'S256') {
    return oauthError('invalid_request', 'PKCE com code_challenge_method=S256 é obrigatório.');
  }
  return { ok: true, value: codeChallenge };
}
