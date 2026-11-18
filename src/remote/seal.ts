/**
 * Authenticated seal (AES-256-GCM) for the stateless OAuth blobs: `client_id`, code and tokens.
 * Whoever holds the server key opens and verifies them; nobody else can read or change the content.
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/** Key size in bytes (AES-256). */
export const SEAL_KEY_BYTES = 32;

/** Bytes of the GCM initialization vector and authentication tag. */
const IV_BYTES = 12;
const TAG_BYTES = 16;

/** Sealed content: an object with a type (`typ`) and an expiry in Unix seconds (`exp`). */
export type SealedClaims = Readonly<Record<string, unknown>> & {
  readonly typ: string;
  readonly exp: number;
};

/** What `openSealed` requires: the expected type, the current time (Unix seconds) and, optionally, the audience. */
export interface SealExpectation {
  readonly typ: string;
  readonly now: number;
  /** Who the seal is for (the connector issuer); a seal for another connector does not open. */
  readonly aud?: string;
}

/**
 * Until this instant (2027-01-01 UTC) a seal issued before `aud` existed still opens where an audience is
 * expected, so nobody is disconnected by the upgrade; every older access or refresh token expires before it.
 */
export const LEGACY_AUDLESS_UNTIL = 1_798_761_600;

/** Decodes a seal key (base64 or base64url) and requires 32 bytes; `name` is the variable, for the error. */
export function parseSealKey(raw: string | null, name = 'SEAL_KEY'): Buffer {
  if (!raw) {
    throw new Error(
      `Set ${name} to 32 random bytes in base64: \`node -e "console.log(crypto.randomBytes(32).toString('base64'))"\`.`,
    );
  }
  const key = Buffer.from(raw, 'base64');
  if (key.length !== SEAL_KEY_BYTES) throw new Error(`${name} must be 32 bytes in base64.`);
  return key;
}

/** Seals a JSON value: `iv + tag + ciphertext` in base64url. */
export function sealPayload(payload: unknown, key: Buffer): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url');
}

/** Opens a seal; returns null if the key does not match, the text was tampered with or it is not an object. */
export function unsealPayload(sealed: string, key: Buffer): Record<string, unknown> | null {
  try {
    const raw = Buffer.from(sealed, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', key, raw.subarray(0, IV_BYTES));
    decipher.setAuthTag(raw.subarray(IV_BYTES, IV_BYTES + TAG_BYTES));
    const text = Buffer.concat([
      decipher.update(raw.subarray(IV_BYTES + TAG_BYTES)),
      decipher.final(),
    ]);
    const value: unknown = JSON.parse(text.toString('utf8'));
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Opens a seal of the expected type that has not expired yet; otherwise null. */
export function openSealed(
  sealed: string,
  key: Buffer,
  expected: SealExpectation,
): SealedClaims | null {
  const claims = unsealPayload(sealed, key);
  if (claims?.typ !== expected.typ || typeof claims.exp !== 'number') return null;
  if (!audienceMatches(claims, expected)) return null;
  return claims.exp > expected.now ? (claims as SealedClaims) : null;
}

/** Says whether the seal's `aud` is the expected one (a seal without `aud` passes only before the legacy cutoff). */
export function audienceMatches(
  claims: Readonly<Record<string, unknown>>,
  expected: SealExpectation,
): boolean {
  if (expected.aud === undefined) return true;
  if (claims.aud === undefined) return expected.now < LEGACY_AUDLESS_UNTIL;
  return claims.aud === expected.aud;
}
