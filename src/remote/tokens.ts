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
import { openSealed, sealPayload, type SealedClaims } from './seal.js';

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

/** What the tokens carry: the user's secret and the optional permissions they opted into (e.g. `write`). */
export interface SealedGrant {
  readonly secret: string;
  readonly grants: readonly string[];
}

/** Result of `/token`: the new tokens, the grant sealed in them and whether it came from a refresh. */
export interface RedeemedGrant {
  readonly tokens: TokenSet;
  readonly grant: SealedGrant;
  readonly refreshed: boolean;
}

/** Approved request: the validated request plus the secret and permissions the user provided. */
export interface ApprovedGrant extends SealedGrant {
  readonly request: AuthorizeRequest;
}

/** Reads secret and permissions from opened claims (a token without `grants` has none: read-only). */
export function grantFromClaims(claims: SealedClaims): SealedGrant {
  const raw = Array.isArray(claims.grants) ? (claims.grants as unknown[]) : [];
  return {
    secret: String(claims.secret),
    grants: raw.filter((item): item is string => typeof item === 'string'),
  };
}

/** Seals the authorization request so it travels in the login form without being tampered with. */
export function sealAuthorizeRequest(
  request: AuthorizeRequest,
  settings: OAuthSettings,
  now: number,
): string {
  return sealPayload(
    { typ: 'pending', aud: settings.issuer, exp: now + PENDING_TTL_SECONDS, request },
    settings.key,
  );
}

/** Opens the sealed request from the form; null if invalid or expired. */
export function openAuthorizeRequest(
  sealed: string,
  settings: OAuthSettings,
  now: number,
): AuthorizeRequest | null {
  const claims = openSealed(sealed, settings.key, { typ: 'pending', now, aud: settings.issuer });
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
      aud: settings.issuer,
      exp: now + CODE_TTL_SECONDS,
      clientId,
      redirectUri,
      codeChallenge,
      secret: grant.secret,
      grants: grant.grants,
    },
    settings.key,
  );
}

/** Issues the access token (1 hour) + refresh token (30 days) pair for a grant, bound to this issuer. */
export function issueTokenSet(grant: SealedGrant, settings: OAuthSettings, now: number): TokenSet {
  const claims = { aud: settings.issuer, secret: grant.secret, grants: grant.grants };
  return {
    access_token: sealPayload(
      { typ: 'access', exp: now + ACCESS_TTL_SECONDS, ...claims },
      settings.key,
    ),
    token_type: 'Bearer',
    expires_in: ACCESS_TTL_SECONDS,
    refresh_token: sealPayload(
      { typ: 'refresh', exp: now + REFRESH_TTL_SECONDS, ...claims },
      settings.key,
    ),
  };
}

/** Checks the code against client, redirect and PKCE verifier; returns its grant. */
export function redeemAuthorizationCode(
  form: URLSearchParams,
  settings: OAuthSettings,
  now: number,
): OAuthResult<SealedGrant> {
  const expected = { typ: 'code', now, aud: settings.issuer };
  const claims = openSealed(form.get('code') ?? '', settings.key, expected);
  const matches =
    claims !== null &&
    claims.clientId === form.get('client_id') &&
    claims.redirectUri === form.get('redirect_uri') &&
    claims.codeChallenge === pkceChallenge(form.get('code_verifier') ?? '');
  if (!matches)
    return oauthError('invalid_grant', 'Invalid or expired code, or code from another client.');
  return { ok: true, value: grantFromClaims(claims) };
}

/** Checks the refresh token; returns its grant. */
export function redeemRefreshToken(
  form: URLSearchParams,
  settings: OAuthSettings,
  now: number,
): OAuthResult<SealedGrant> {
  const expected = { typ: 'refresh', now, aud: settings.issuer };
  const claims = openSealed(form.get('refresh_token') ?? '', settings.key, expected);
  if (!claims)
    return oauthError('invalid_grant', 'Invalid or expired refresh token: connect again.');
  return { ok: true, value: grantFromClaims(claims) };
}

/** Serves `/token`: exchanges a code or refresh token for a new token pair. */
export function redeemTokenRequest(
  form: URLSearchParams,
  settings: OAuthSettings,
  now: number,
): OAuthResult<RedeemedGrant> {
  const grantType = form.get('grant_type');
  let grant: OAuthResult<SealedGrant>;
  if (grantType === 'authorization_code') grant = redeemAuthorizationCode(form, settings, now);
  else if (grantType === 'refresh_token') grant = redeemRefreshToken(form, settings, now);
  else return oauthError('unsupported_grant_type', 'Use authorization_code or refresh_token.');
  if (!grant.ok) return grant;
  const tokens = issueTokenSet(grant.value, settings, now);
  return {
    ok: true,
    value: { tokens, grant: grant.value, refreshed: grantType === 'refresh_token' },
  };
}

/** Reads the grant from an `Authorization: Bearer <access token>` header; null if missing, invalid or foreign. */
export function readAccessGrant(
  authorization: string | null,
  settings: OAuthSettings,
  now: number,
): SealedGrant | null {
  const match = /^Bearer\s+(\S+)$/i.exec(authorization ?? '');
  if (!match?.[1]) return null;
  const claims = openSealed(match[1], settings.key, { typ: 'access', now, aud: settings.issuer });
  return claims ? grantFromClaims(claims) : null;
}
