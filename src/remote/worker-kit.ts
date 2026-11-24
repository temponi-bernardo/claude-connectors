/**
 * Pieces shared by the connectors that run on `@cloudflare/workers-oauth-provider` (Gmail, Spotify): KV and
 * `fetch` types, random and hashed ids, secret reading, the redirect-URI check of dynamic registration, the
 * public origin and the rate-limit keys. Pure or thin: no state between requests.
 */
import { createHash } from 'node:crypto';
import type {
  ClientRegistrationCallbackOptions,
  ClientRegistrationCallbackResult,
} from '@cloudflare/workers-oauth-provider';
import { envValue, toEnvVars, type EnvVars } from '../core/env.js';
import { DEFAULT_REDIRECT_HOSTS, isAllowedRedirect, readRedirectUris } from './oauth.js';

/** The subset of Workers KV the connectors use. */
export interface KvStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

/** Injectable `fetch`. */
export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

/** Minimum length of the secret that signs the remembered-consent cookie. */
export const MIN_CONSENT_SECRET_CHARS = 32;

/** Random base64url text with `bytes` bytes of entropy (state, nonce, PKCE verifier, ids). */
export function randomToken(bytes = 32): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(bytes))).toString('base64url');
}

/** SHA-256 in hex (KV only keeps hashes of ids, `state` and cookies). */
export function sha256Hex(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

/** Reads a required variable; throws explaining how to set it. */
export function requiredSecret(env: EnvVars, name: string): string {
  const value = envValue(env, name);
  if (value === null) throw new Error(`Set the secret ${name}: npx wrangler secret put ${name}`);
  return value;
}

/** Reads the remembered-consent secret and enforces the minimum length. */
export function readConsentSecret(env: EnvVars): string {
  const secret = requiredSecret(env, 'CONSENT_SECRET');
  if (secret.length < MIN_CONSENT_SECRET_CHARS) {
    throw new Error(`CONSENT_SECRET must have at least ${MIN_CONSENT_SECRET_CHARS} characters.`);
  }
  return secret;
}

/** 500 response for an invalid configuration (the message names the missing secret, never the value). */
export function configErrorResponse(error: unknown): Response {
  const message = error instanceof Error ? error.message : String(error);
  return new Response(`Invalid Worker configuration: ${message}`, { status: 500 });
}

/** Refuses dynamic registration of clients whose callback is not Claude's (claude.ai, claude.com, localhost). */
export function checkClientRegistration(
  options: ClientRegistrationCallbackOptions,
): ClientRegistrationCallbackResult | undefined {
  const uris = readRedirectUris(options.clientMetadata);
  if (uris?.every((uri) => isAllowedRedirect(uri, DEFAULT_REDIRECT_HOSTS))) return undefined;
  return {
    code: 'invalid_redirect_uri',
    description: 'Missing or disallowed redirect URI.',
    status: 400,
  };
}

/** Canonical public origin: `PUBLIC_URL` (no trailing slash) or, without it, the request origin. */
export function publicOrigin(env: Readonly<Record<string, unknown>>, request: Request): string {
  const configured = envValue(toEnvVars(env), 'PUBLIC_URL');
  return configured ? new URL(configured).origin : new URL(request.url).origin;
}

/** Public limit key: the client IP reported by Cloudflare (or `unknown`). */
export function clientIpKey(request: Request): string {
  return `ip:${request.headers.get('cf-connecting-ip') ?? 'unknown'}`;
}

/** Tells whether the route is token-protected (`/mcp`), which has the per-session limit instead of the per-IP one. */
export function isMcpPath(request: Request): boolean {
  const { pathname } = new URL(request.url);
  return pathname === '/mcp' || pathname.startsWith('/mcp/');
}
