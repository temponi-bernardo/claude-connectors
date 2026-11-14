/**
 * Authorization code, access token and refresh token of the stateless OAuth: all are seals that carry
 * the user's secret for the target service (e.g. the Canvas token) and only open with the server key.
 */
import {
  oauthError,
  pkceChallenge,
  type AuthorizeRequest,
  type OAuthResult,
  type OAuthSettings,
} from './oauth.js';
import { openSealed, sealPayload } from './seal.js';

/** Lifetimes in seconds: pending request, code, access token and refresh token. */
export const PENDING_TTL_SECONDS = 15 * 60;
export const CODE_TTL_SECONDS = 5 * 60;
export const ACCESS_TTL_SECONDS = 60 * 60;
export const REFRESH_TTL_SECONDS = 30 * 24 * 3600;

/** Response of the `/token` endpoint. */
export interface TokenSet {
  readonly access_token: string;
  readonly token_type: 'Bearer';
  readonly expires_in: number;
  readonly refresh_token: string;
}

/** Result of `/token`: the new tokens, the secret sealed in them and whether it came from a refresh. */
export interface RedeemedGrant {
  readonly tokens: TokenSet;
  readonly secret: string;
  readonly refreshed: boolean;
}

/** Approved request: the validated request and the secret the user provided. */
export interface ApprovedGrant {
  readonly request: AuthorizeRequest;
  readonly secret: string;
}

/** Seals the authorization request so it travels in the login form without being tampered with. */
export function sealAuthorizeRequest(
  request: AuthorizeRequest,
  settings: OAuthSettings,
  now: number,
): string {
  return sealPayload({ typ: 'pending', exp: now + PENDING_TTL_SECONDS, request }, settings.key);
}

/** Opens the sealed request from the form; null if invalid or expired. */
export function openAuthorizeRequest(
  sealed: string,
  settings: OAuthSettings,
  now: number,
): AuthorizeRequest | null {
  const claims = openSealed(sealed, settings.key, { typ: 'pending', now });
  return claims ? (claims.request as AuthorizeRequest) : null;
}

/** Issues the authorization code (5 minutes) bound to client, redirect and PKCE challenge. */
export function issueAuthorizationCode(
  grant: ApprovedGrant,
  settings: OAuthSettings,
  now: number,
): string {
  const { clientId, redirectUri, codeChallenge } = grant.request;
  return sealPayload(
    {
      typ: 'code',
      exp: now + CODE_TTL_SECONDS,
      clientId,
      redirectUri,
      codeChallenge,
      secret: grant.secret,
    },
    settings.key,
  );
}

/** Issues the access token (1 hour) + refresh token (30 days) pair for a secret. */
export function issueTokenSet(secret: string, settings: OAuthSettings, now: number): TokenSet {
  return {
    access_token: sealPayload(
      { typ: 'access', exp: now + ACCESS_TTL_SECONDS, secret },
      settings.key,
    ),
    token_type: 'Bearer',
    expires_in: ACCESS_TTL_SECONDS,
    refresh_token: sealPayload(
      { typ: 'refresh', exp: now + REFRESH_TTL_SECONDS, secret },
      settings.key,
    ),
  };
}

/** Checks the code against client, redirect and PKCE verifier; returns its secret. */
export function redeemAuthorizationCode(
  form: URLSearchParams,
  settings: OAuthSettings,
  now: number,
): OAuthResult<string> {
  const claims = openSealed(form.get('code') ?? '', settings.key, { typ: 'code', now });
  const matches =
    claims !== null &&
    claims.clientId === form.get('client_id') &&
    claims.redirectUri === form.get('redirect_uri') &&
    claims.codeChallenge === pkceChallenge(form.get('code_verifier') ?? '');
  if (!matches)
    return oauthError('invalid_grant', 'Invalid or expired code, or code from another client.');
  return { ok: true, value: String(claims.secret) };
}

/** Checks the refresh token; returns its secret. */
export function redeemRefreshToken(
  form: URLSearchParams,
  settings: OAuthSettings,
  now: number,
): OAuthResult<string> {
  const claims = openSealed(form.get('refresh_token') ?? '', settings.key, { typ: 'refresh', now });
  if (!claims)
    return oauthError('invalid_grant', 'Invalid or expired refresh token: connect again.');
  return { ok: true, value: String(claims.secret) };
}

/** Serves `/token`: exchanges a code or refresh token for a new token pair. */
export function redeemTokenRequest(
  form: URLSearchParams,
  settings: OAuthSettings,
  now: number,
): OAuthResult<RedeemedGrant> {
  const grantType = form.get('grant_type');
  let secret: OAuthResult<string>;
  if (grantType === 'authorization_code') secret = redeemAuthorizationCode(form, settings, now);
  else if (grantType === 'refresh_token') secret = redeemRefreshToken(form, settings, now);
  else return oauthError('unsupported_grant_type', 'Use authorization_code or refresh_token.');
  if (!secret.ok) return secret;
  const tokens = issueTokenSet(secret.value, settings, now);
  return {
    ok: true,
    value: { tokens, secret: secret.value, refreshed: grantType === 'refresh_token' },
  };
}

/** Reads the secret from an `Authorization: Bearer <access token>` header; null if missing or invalid. */
export function readAccessSecret(
  authorization: string | null,
  settings: OAuthSettings,
  now: number,
): string | null {
  const match = /^Bearer\s+(\S+)$/i.exec(authorization ?? '');
  if (!match?.[1]) return null;
  const claims = openSealed(match[1], settings.key, { typ: 'access', now });
  return claims ? String(claims.secret) : null;
}
