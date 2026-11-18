/**
 * Central redaction of secrets before any text leaves the server: tool errors, logs and HTML pages. Pure, except
 * `logWarning`, which writes the already redacted text to the console.
 */

/** Secret patterns and what replaces them (order matters: specific forms before the generic long token). */
export const SECRET_PATTERNS: readonly (readonly [RegExp, string])[] = [
  [/\bBearer\s+[^\s"',;]+/gi, 'Bearer [redacted]'],
  [
    /\b(access_token|refresh_token|client_secret|id_token)(["']?\s*[:=]\s*["']?)[^"'&\s,;}]+/gi,
    '$1$2[redacted]',
  ],
  [/\beyJ[\w-]{4,}\.[\w-]{4,}\.[\w-]*/g, '[redacted-jwt]'],
  [/\bya29\.[\w.-]+/g, '[redacted-google-token]'],
  [/\b1\/\/0[\w-]+/g, '[redacted-google-token]'],
  [/\b\d{1,8}~[A-Za-z0-9]{16,}/g, '[redacted-canvas-token]'],
  [/[A-Za-z0-9_-]{80,}/g, '[redacted]'],
];

/** Email addresses (masked only in logs, which other people may read). */
export const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/** Replaces tokens, keys and credentials in a text (Bearer, Canvas, Google, JWT, OAuth fields, long seals). */
export function redactSecrets(text: string): string {
  return SECRET_PATTERNS.reduce((out, [pattern, mask]) => out.replace(pattern, mask), text);
}

/** Redacts secrets and also masks email addresses, for text that goes to the logs. */
export function redactForLog(text: string): string {
  return redactSecrets(text).replace(EMAIL_PATTERN, '[email]');
}

/** Message of an unknown error (an `Error` message or the value as text). */
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Writes a warning with the redacted error message (never the stack or the raw object). */
export function logWarning(context: string, error: unknown): void {
  console.warn(context, redactForLog(errorMessage(error)));
}
