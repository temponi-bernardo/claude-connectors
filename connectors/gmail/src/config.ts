/**
 * Remote Gmail connector settings, read from the Worker secrets. Pure: it only validates and transforms text.
 * The connector is public and multi-user: `ALLOWED_EMAILS` is optional and, when set, restricts who signs in.
 */
import { envValue, type EnvVars } from '../../../src/core/env.js';
import { parseSealKey } from '../../../src/remote/seal.js';
import { readConsentSecret, requiredSecret } from '../../../src/remote/worker-kit.js';

/**
 * Gmail management scope (the only data scope requested): read, send, drafts, labels and trash. It does not
 * allow permanent deletion (only `https://mail.google.com/` would).
 */
export const GMAIL_MODIFY_SCOPE = 'https://www.googleapis.com/auth/gmail.modify';

/** Scopes requested from Google at sign-in and account linking: identity and Gmail management. */
export const GMAIL_SCOPES: readonly string[] = ['openid', 'email', GMAIL_MODIFY_SCOPE];

/** Tells whether the granted scopes (space-separated) include Gmail management (`gmail.modify`). */
export function hasModifyScope(scope: string): boolean {
  return scope.split(' ').includes(GMAIL_MODIFY_SCOPE);
}

/** Validated connector settings. */
export interface GmailSettings {
  readonly googleClientId: string;
  readonly googleClientSecret: string;
  readonly tokenKey: Buffer;
  /** Emails allowed to sign in (private mode), or null for any Google account (public mode). */
  readonly allowedEmails: readonly string[] | null;
  readonly consentSecret: string;
}

/** Tells whether the text looks like a simple email (`name@domain.tld`, no spaces). */
export function isEmailAddress(text: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

/** Reads `ALLOWED_EMAILS` (optional, comma-separated): null if absent; throws on an invalid item. */
export function parseAllowedEmails(raw: string | null): string[] | null {
  const emails = (raw ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (emails.length === 0) return null;
  if (!emails.every(isEmailAddress))
    throw new Error('ALLOWED_EMAILS has an item that is not an email.');
  return emails;
}

/** Builds the settings from the Worker secrets. */
export function readGmailSettings(env: EnvVars): GmailSettings {
  return {
    googleClientId: requiredSecret(env, 'GOOGLE_CLIENT_ID'),
    googleClientSecret: requiredSecret(env, 'GOOGLE_CLIENT_SECRET'),
    tokenKey: parseSealKey(envValue(env, 'TOKEN_ENC_KEY'), 'TOKEN_ENC_KEY'),
    allowedEmails: parseAllowedEmails(envValue(env, 'ALLOWED_EMAILS')),
    consentSecret: readConsentSecret(env),
  };
}

/** Tells whether the email may sign in: always in public mode; only the listed ones in private mode. */
export function isEmailAllowed(settings: GmailSettings, email: string): boolean {
  return settings.allowedEmails === null || settings.allowedEmails.includes(email.toLowerCase());
}
