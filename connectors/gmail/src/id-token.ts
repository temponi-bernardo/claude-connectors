/**
 * Validation of the Google `id_token` (OpenID Connect): RS256 signature with Google's public keys, issuer,
 * audience, expiry, `nonce` and verified email. Only after that is the email trustworthy.
 */
import type { webcrypto } from 'node:crypto';
import { UPSTREAM_USER_AGENT, type GmailDeps } from './context.js';

/** Public keys (JWKS) that sign Google `id_token`s. */
export const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

/** Issuers accepted in Google `id_token`s. */
export const GOOGLE_ISSUERS: readonly string[] = [
  'https://accounts.google.com',
  'accounts.google.com',
];

/** Clock skew accepted on the token expiry, in seconds. */
export const CLOCK_SKEW_SECONDS = 60;

/** Decoded parts of a JWT. */
export interface DecodedJwt {
  readonly header: Record<string, unknown>;
  readonly payload: Record<string, unknown>;
  readonly signingInput: string;
  readonly signature: Uint8Array<ArrayBuffer>;
}

/** Identity confirmed by the `id_token`: stable id (`sub`) and verified email. */
export interface GoogleIdentity {
  readonly sub: string;
  readonly email: string;
}

/** What the `id_token` must match. */
export interface IdTokenExpectation {
  readonly clientId: string;
  readonly nonce: string;
  /** Current time in Unix seconds. */
  readonly now: number;
}

/** Decodes a base64url JSON part into an object; throws if it is not an object. */
export function decodeJwtJson(part: string): Record<string, unknown> {
  const value: unknown = JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
  if (typeof value !== 'object' || value === null) throw new Error('Malformed JWT.');
  return value as Record<string, unknown>;
}

/** Splits and decodes a JWT (`header.payload.signature`); throws if malformed. */
export function decodeJwt(token: string): DecodedJwt {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed Google id_token.');
  const [header = '', payload = '', signature = ''] = parts;
  return {
    header: decodeJwtJson(header),
    payload: decodeJwtJson(payload),
    signingInput: `${header}.${payload}`,
    signature: new Uint8Array(Buffer.from(signature, 'base64url')),
  };
}

/** Names of the `id_token` checks that failed (empty when all pass). */
export function idTokenProblems(
  payload: Readonly<Record<string, unknown>>,
  expected: IdTokenExpectation,
): string[] {
  const exp = typeof payload.exp === 'number' ? payload.exp : 0;
  const checks: [string, boolean][] = [
    ['issuer', GOOGLE_ISSUERS.includes(String(payload.iss))],
    ['audience', payload.aud === expected.clientId],
    ['expiry', exp + CLOCK_SKEW_SECONDS > expected.now],
    ['nonce', payload.nonce === expected.nonce],
    ['verified email', payload.email_verified === true && typeof payload.email === 'string'],
    ['sub', typeof payload.sub === 'string' && payload.sub.length > 0],
  ];
  return checks.filter(([, ok]) => !ok).map(([name]) => name);
}

/** Checks issuer, audience, expiry, `nonce`, `sub` and verified email; returns the identity. */
export function checkIdTokenClaims(
  payload: Readonly<Record<string, unknown>>,
  expected: IdTokenExpectation,
): GoogleIdentity {
  const problems = idTokenProblems(payload, expected);
  if (problems.length > 0) throw new Error(`Invalid Google id_token (${problems.join(', ')}).`);
  return { sub: String(payload.sub), email: String(payload.email).toLowerCase() };
}

/** Fetches the Google public key with the given `kid`; throws if it does not exist. */
export async function fetchGoogleKey(deps: GmailDeps, kid: string): Promise<webcrypto.JsonWebKey> {
  const response = await deps.fetch(GOOGLE_JWKS_URL, {
    headers: { 'user-agent': UPSTREAM_USER_AGENT },
  });
  if (!response.ok) throw new Error(`Could not fetch the Google keys (HTTP ${response.status}).`);
  const { keys } = (await response.json()) as {
    keys?: (webcrypto.JsonWebKey & { kid?: string })[];
  };
  const key = keys?.find((candidate) => candidate.kid === kid);
  if (!key) throw new Error('id_token key not found at Google.');
  return key;
}

/** Checks the JWT RS256 signature with the given public key. */
export async function verifyRs256(jwt: DecodedJwt, jwk: webcrypto.JsonWebKey): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  return crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    jwt.signature,
    new TextEncoder().encode(jwt.signingInput),
  );
}

/** Validates the Google `id_token` (signature and claims) and returns the verified identity. */
export async function verifyGoogleIdToken(
  deps: GmailDeps,
  idToken: string,
  nonce: string,
): Promise<GoogleIdentity> {
  const jwt = decodeJwt(idToken);
  if (jwt.header.alg !== 'RS256') throw new Error('Google id_token with an unexpected algorithm.');
  const jwk = await fetchGoogleKey(deps, String(jwt.header.kid));
  if (!(await verifyRs256(jwt, jwk))) throw new Error('Invalid Google id_token signature.');
  const now = Math.floor(deps.now() / 1000);
  return checkIdTokenClaims(jwt.payload, { clientId: deps.settings.googleClientId, nonce, now });
}
