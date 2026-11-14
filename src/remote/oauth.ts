/**
 * Rules of the stateless OAuth 2.1 authorization server: metadata, PKCE, dynamic client registration
 * and authorization request validation. Clients are sealed into the `client_id` itself.
 */
import { createHash } from 'node:crypto';
import { envValue, type EnvVars } from '../core/env.js';
import { openSealed, parseSealKey, sealPayload } from './seal.js';

/** Lifetime of a registered `client_id` (10 years, in seconds). */
export const CLIENT_TTL_SECONDS = 10 * 365 * 24 * 3600;

/** OAuth redirect hosts accepted by default: Claude on the web and Claude Code (localhost). */
export const DEFAULT_REDIRECT_HOSTS: readonly string[] = ['claude.ai', 'claude.com', 'localhost'];

/** Authorization server configuration. */
export interface OAuthSettings {
  /** Public URL of the server, without a trailing slash (e.g. `https://canvas.example.dev`). */
  readonly issuer: string;
  /** Seal key (`SEAL_KEY`). */
  readonly key: Buffer;
  /** Hosts accepted as OAuth redirect (`localhost` also allows `127.0.0.1` over http). */
  readonly redirectHosts: readonly string[];
}

/** Builds the OAuth configuration from the environment (`SEAL_KEY`, `OAUTH_REDIRECT_HOSTS`) with the given issuer. */
export function readOAuthSettings(env: EnvVars, issuer: string): OAuthSettings {
  const hosts = envValue(env, 'OAUTH_REDIRECT_HOSTS')
    ?.split(',')
    .map((host) => host.trim())
    .filter(Boolean);
  return {
    issuer,
    key: parseSealKey(envValue(env, 'SEAL_KEY')),
    redirectHosts: hosts ?? DEFAULT_REDIRECT_HOSTS,
  };
}

/** OAuth issuer: `PUBLIC_URL` without a trailing slash or, without it, the request origin (e.g. `*.workers.dev`). */
export function resolveIssuer(env: EnvVars, origin: string): string {
  return envValue(env, 'PUBLIC_URL')?.replace(/\/+$/, '') ?? origin;
}

/** Result of a validation: a value, or an OAuth error (`error` + `error_description`). */
export type OAuthResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string; readonly description: string };

/** Validated authorization request. */
export interface AuthorizeRequest {
  readonly clientId: string;
  readonly redirectUri: string;
  readonly codeChallenge: string;
  readonly state: string | null;
}

/** Dynamic registration response (RFC 7591). */
export interface ClientRegistration {
  readonly client_id: string;
  readonly redirect_uris: readonly string[];
  readonly token_endpoint_auth_method: 'none';
  readonly grant_types: readonly string[];
  readonly response_types: readonly string[];
}

/** Builds an OAuth error. */
export function oauthError<T>(error: string, description: string): OAuthResult<T> {
  return { ok: false, error, description };
}

/** Authorization server metadata (RFC 8414). */
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

/** Metadata of the protected `/mcp` resource (RFC 9728). */
export function protectedResourceMetadata(issuer: string): Record<string, unknown> {
  return {
    resource: `${issuer}/mcp`,
    authorization_servers: [issuer],
    bearer_methods_supported: ['header'],
  };
}

/** Says whether a redirect address is accepted: https on a listed host (or subdomain), or localhost over http. */
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

/** PKCE S256 challenge of a verifier: SHA-256 in base64url. */
export function pkceChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}

/** Extracts `redirect_uris` (a list of strings) from the registration body; null if missing or malformed. */
export function readRedirectUris(body: unknown): string[] | null {
  if (typeof body !== 'object' || body === null) return null;
  const uris = (body as { redirect_uris?: unknown }).redirect_uris;
  if (!Array.isArray(uris) || uris.length === 0) return null;
  return uris.every((uri): uri is string => typeof uri === 'string') ? uris : null;
}

/** Registers a client: validates the redirect addresses and seals them into the `client_id`. */
export function registerClient(
  body: unknown,
  settings: OAuthSettings,
  now: number,
): OAuthResult<ClientRegistration> {
  const uris = readRedirectUris(body);
  if (!uris?.every((uri) => isAllowedRedirect(uri, settings.redirectHosts))) {
    return oauthError('invalid_redirect_uri', 'Missing or disallowed redirect address.');
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

/** Redirect addresses registered in a `client_id`; null if the client is not from this server. */
export function clientRedirectUris(
  clientId: string,
  settings: OAuthSettings,
  now: number,
): string[] | null {
  const claims = openSealed(clientId, settings.key, { typ: 'client', now });
  return claims ? readRedirectUris(claims) : null;
}

/** Validates the `/authorize` query: client, registered redirect, `response_type=code` and PKCE S256. */
export function parseAuthorizeQuery(
  query: URLSearchParams,
  settings: OAuthSettings,
  now: number,
): OAuthResult<AuthorizeRequest> {
  const clientId = query.get('client_id') ?? '';
  const uris = clientRedirectUris(clientId, settings, now);
  if (!uris) return oauthError('invalid_client', 'Unknown client: register the connector again.');
  const redirectUri = query.get('redirect_uri') ?? '';
  if (!uris.includes(redirectUri))
    return oauthError('invalid_request', 'redirect_uri is not registered.');
  const challenge = readCodeChallenge(query);
  if (!challenge.ok) return challenge;
  const codeChallenge = challenge.value;
  return { ok: true, value: { clientId, redirectUri, codeChallenge, state: query.get('state') } };
}

/** Checks `response_type=code` and PKCE S256; returns the `code_challenge`. */
export function readCodeChallenge(query: URLSearchParams): OAuthResult<string> {
  if (query.get('response_type') !== 'code') {
    return oauthError('unsupported_response_type', 'Only response_type=code is accepted.');
  }
  const codeChallenge = query.get('code_challenge') ?? '';
  if (!codeChallenge || query.get('code_challenge_method') !== 'S256') {
    return oauthError('invalid_request', 'PKCE with code_challenge_method=S256 is required.');
  }
  return { ok: true, value: codeChallenge };
}
