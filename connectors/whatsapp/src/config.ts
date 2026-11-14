/**
 * WhatsApp connector settings read from the Worker environment (`wrangler.toml` variables and secrets). Pure:
 * validates everything at the edge and returns domain types, with messages that say how to fix them.
 */
import { envValue, parseFlag, type EnvVars } from '../../../src/core/env.js';
import { parseEmailList } from '../../../src/remote/github-login.js';

/** Full connector settings. */
export interface WhatsAppSettings {
  readonly allowedEmails: readonly string[];
  readonly githubClientId: string;
  readonly githubClientSecret: string;
  /** Idle time until the container sleeps, in the `Container` format (`"5m"`, `"90s"`). */
  readonly sleepAfter: string;
  /** End-to-end cap of each tool call (ms). */
  readonly toolTimeoutMs: number;
  /** How long to wait for the pending-message sync before answering with what is available (ms). */
  readonly syncWaitMs: number;
  readonly enableSend: boolean;
  /** Recipients allowed for sending, as JIDs; empty = any contact or group. */
  readonly sendAllowlist: readonly string[];
  readonly sendMaxPerHour: number;
  /** Cron expression of the optional periodic sync; empty = off. */
  readonly syncCron: string | null;
}

/** Defaults: sleep after 5 minutes, 25 s per tool, 8 s waiting for the sync, up to 10 sends per hour. */
export const WHATSAPP_DEFAULTS = {
  sleepAfter: '5m',
  toolTimeoutMs: 25_000,
  syncWaitMs: 8_000,
  sendMaxPerHour: 10,
} as const;

/** Reads a required variable or throws saying how to set it. */
export function requireEnv(env: EnvVars, key: string, how: string): string {
  const value = envValue(env, key);
  if (!value) throw new Error(`Set ${key}: ${how}`);
  return value;
}

/** Reads an integer within a range; missing uses the default, out of range throws. */
export function readIntInRange(
  env: EnvVars,
  key: string,
  range: { readonly min: number; readonly max: number; readonly fallback: number },
): number {
  const raw = envValue(env, key);
  if (raw === null) return range.fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < range.min || value > range.max) {
    throw new Error(`${key} must be an integer between ${range.min} and ${range.max}.`);
  }
  return value;
}

/** Validates `SLEEP_AFTER` (`30s` to `60m`, or `1h`); missing means `5m`. */
export function readSleepAfter(env: EnvVars): string {
  const raw = envValue(env, 'SLEEP_AFTER') ?? WHATSAPP_DEFAULTS.sleepAfter;
  const match = /^(\d+)(s|m|h)$/.exec(raw);
  const seconds = match
    ? Number(match[1]) * { s: 1, m: 60, h: 3600 }[match[2] as 's' | 'm' | 'h']
    : 0;
  if (seconds < 30 || seconds > 3600) {
    throw new Error('SLEEP_AFTER must be a duration between 30s and 1h (e.g. "5m").');
  }
  return raw;
}

/** Normalizes a phone number or contact JID to digits only; null if it does not look like a number. */
export function normalizePhone(raw: string): string | null {
  const digits = raw
    .trim()
    .replace(/@s\.whatsapp\.net$/, '')
    .replace(/[\s()+-]/g, '');
  return /^\d{8,15}$/.test(digits) ? digits : null;
}

/** JIDs accepted as recipient: contact, LID and group (including the old `creator-timestamp` format). */
const RECIPIENT_JID = /^(?:\d{5,30}@(?:s\.whatsapp\.net|lid|g\.us)|\d{5,30}-\d{5,30}@g\.us)$/;

/** Normalizes a send recipient to a JID (a number becomes a contact); null if neither contact nor group. */
export function normalizeRecipient(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed.includes('@')) {
    const phone = normalizePhone(trimmed);
    return phone ? `${phone}@s.whatsapp.net` : null;
  }
  return RECIPIENT_JID.test(trimmed) ? trimmed : null;
}

/** Reads `SEND_ALLOWLIST` (comma-separated numbers or JIDs; empty = anyone); an invalid item throws. */
export function readSendAllowlist(env: EnvVars): string[] {
  const items = (envValue(env, 'SEND_ALLOWLIST') ?? '').split(',').filter((item) => item.trim());
  return items.map((item) => {
    const jid = normalizeRecipient(item);
    if (!jid) throw new Error(`SEND_ALLOWLIST has an invalid recipient: "${item.trim()}".`);
    return jid;
  });
}

/** Reads the owner list (`ALLOWED_EMAILS`); empty throws, because nobody could sign in. */
export function readAllowedEmails(env: EnvVars): string[] {
  const emails = parseEmailList(envValue(env, 'ALLOWED_EMAILS'));
  if (emails.length === 0) {
    throw new Error('Set ALLOWED_EMAILS to the verified email of your GitHub account.');
  }
  return emails;
}

/** Reads the timings: container sleep, per-tool cap and sync wait. */
export function readTimingSettings(
  env: EnvVars,
): Pick<WhatsAppSettings, 'sleepAfter' | 'toolTimeoutMs' | 'syncWaitMs'> {
  const d = WHATSAPP_DEFAULTS;
  return {
    sleepAfter: readSleepAfter(env),
    toolTimeoutMs: readIntInRange(env, 'TOOL_TIMEOUT_MS', {
      min: 5_000,
      max: 55_000,
      fallback: d.toolTimeoutMs,
    }),
    syncWaitMs: readIntInRange(env, 'SYNC_WAIT_MS', {
      min: 0,
      max: 20_000,
      fallback: d.syncWaitMs,
    }),
  };
}

/** Reads the send settings: on or off, optional allowlist and hourly limit. */
export function readSendSettings(
  env: EnvVars,
): Pick<WhatsAppSettings, 'enableSend' | 'sendAllowlist' | 'sendMaxPerHour'> {
  return {
    enableSend: parseFlag(envValue(env, 'ENABLE_SEND')),
    sendAllowlist: readSendAllowlist(env),
    sendMaxPerHour: readIntInRange(env, 'SEND_MAX_PER_HOUR', {
      min: 1,
      max: 60,
      fallback: WHATSAPP_DEFAULTS.sendMaxPerHour,
    }),
  };
}

/** Reads and validates the connector settings from the Worker environment. */
export function readWhatsAppSettings(env: EnvVars): WhatsAppSettings {
  return {
    allowedEmails: readAllowedEmails(env),
    githubClientId: requireEnv(env, 'GITHUB_CLIENT_ID', 'create an OAuth App on GitHub (README).'),
    githubClientSecret: requireEnv(
      env,
      'GITHUB_CLIENT_SECRET',
      'wrangler secret put GITHUB_CLIENT_SECRET.',
    ),
    ...readTimingSettings(env),
    ...readSendSettings(env),
    syncCron: envValue(env, 'SYNC_CRON'),
  };
}

/** Variables forwarded from the Worker configuration to the bridge container (`bridge/API.md`). */
export const BRIDGE_ENV_KEYS: readonly string[] = [
  'BRIDGE_TOKEN',
  'SNAPSHOT_KEY',
  'TIMEZONE',
  'HISTORY_DAYS',
  'MAX_MEDIA_BYTES',
  'ENABLE_SEND',
  'SEND_ALLOWLIST',
  'SEND_MAX_PER_HOUR',
];

/** Internal address (intercepted by the Worker) where the bridge sends the snapshot on `SIGTERM`. */
export const SNAPSHOT_PUSH_URL = 'http://snapshot.internal/push';

/** Builds the container environment: only the bridge keys, plus the outgoing snapshot address. */
export function containerEnvVars(env: EnvVars): Record<string, string> {
  const token = requireEnv(
    env,
    'BRIDGE_TOKEN',
    'wrangler secret put BRIDGE_TOKEN (32+ random characters).',
  );
  if (token.length < 32) throw new Error('BRIDGE_TOKEN must have at least 32 random characters.');
  requireEnv(env, 'SNAPSHOT_KEY', 'wrangler secret put SNAPSHOT_KEY (32 bytes in base64).');
  const pairs = BRIDGE_ENV_KEYS.map((key) => [key, envValue(env, key)] as const);
  const present = pairs.filter((pair): pair is readonly [string, string] => pair[1] !== null);
  return { ...Object.fromEntries(present), SNAPSHOT_PUSH_URL };
}
