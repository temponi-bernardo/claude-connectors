import { describe, expect, it } from 'vitest';
import {
  BRIDGE_ENV_KEYS,
  containerEnvVars,
  normalizePhone,
  normalizeRecipient,
  readAllowedEmails,
  readIntInRange,
  readSendAllowlist,
  readSendSettings,
  readSleepAfter,
  readTimingSettings,
  readWhatsAppSettings,
  requireEnv,
  SNAPSHOT_PUSH_URL,
  WHATSAPP_DEFAULTS,
} from './config.js';

const BASE = {
  ALLOWED_EMAILS: 'Owner@Example.dev',
  GITHUB_CLIENT_ID: 'cid',
  GITHUB_CLIENT_SECRET: 'csecret',
};

describe('requireEnv and readIntInRange', () => {
  it('requires the variable and explains how to set it', () => {
    expect(requireEnv({ A: 'x' }, 'A', 'how')).toBe('x');
    expect(() => requireEnv({}, 'A', 'do this.')).toThrow('Set A: do this.');
  });

  it('reads integers in range, uses the default when missing and rejects the rest', () => {
    const range = { min: 1, max: 10, fallback: 5 };
    expect(readIntInRange({}, 'N', range)).toBe(5);
    expect(readIntInRange({ N: '7' }, 'N', range)).toBe(7);
    expect(() => readIntInRange({ N: '11' }, 'N', range)).toThrow('between 1 and 10');
    expect(() => readIntInRange({ N: '2.5' }, 'N', range)).toThrow();
  });
});

describe('readSleepAfter', () => {
  it('accepts 30s to 1h and defaults to 5m', () => {
    expect(readSleepAfter({})).toBe('5m');
    expect(readSleepAfter({ SLEEP_AFTER: '90s' })).toBe('90s');
    expect(readSleepAfter({ SLEEP_AFTER: '1h' })).toBe('1h');
  });

  it('rejects invalid formats and out-of-range durations', () => {
    for (const value of ['10s', '2h', '5 min', 'x']) {
      expect(() => readSleepAfter({ SLEEP_AFTER: value })).toThrow('SLEEP_AFTER');
    }
  });
});

describe('normalizePhone and readSendAllowlist', () => {
  it('keeps only digits and accepts a contact JID', () => {
    expect(normalizePhone('+55 (31) 99999-9999')).toBe('5531999999999');
    expect(normalizePhone('5531999999999@s.whatsapp.net')).toBe('5531999999999');
    expect(normalizePhone('123')).toBeNull();
    expect(normalizePhone('abc@g.us')).toBeNull();
  });

  it('normalizes recipients: number, contact, LID and group become JIDs; the rest is null', () => {
    expect(normalizeRecipient('+55 (31) 99999-9999')).toBe('5531999999999@s.whatsapp.net');
    expect(normalizeRecipient('5531999999999@s.whatsapp.net')).toBe('5531999999999@s.whatsapp.net');
    expect(normalizeRecipient(' 120363000000000001@g.us ')).toBe('120363000000000001@g.us');
    expect(normalizeRecipient('5531999999999-1500000000@g.us')).toBe(
      '5531999999999-1500000000@g.us',
    );
    expect(normalizeRecipient('123456789012345@lid')).toBe('123456789012345@lid');
    for (const bad of ['123', 'status@broadcast', 'abc@g.us', '5531999999999@x.com', '']) {
      expect(normalizeRecipient(bad)).toBeNull();
    }
  });

  it('reads the allowlist (numbers and groups) and rejects an invalid item', () => {
    const raw = '+55 31 99999-9999, 120363000000000001@g.us';
    expect(readSendAllowlist({ SEND_ALLOWLIST: raw })).toEqual([
      '5531999999999@s.whatsapp.net',
      '120363000000000001@g.us',
    ]);
    expect(readSendAllowlist({})).toEqual([]);
    expect(() => readSendAllowlist({ SEND_ALLOWLIST: '12' })).toThrow('invalid');
  });
});

describe('readAllowedEmails', () => {
  it('requires at least one email', () => {
    expect(readAllowedEmails(BASE)).toEqual(['owner@example.dev']);
    expect(() => readAllowedEmails({})).toThrow('ALLOWED_EMAILS');
  });
});

describe('readWhatsAppSettings', () => {
  it('uses the safe defaults: sending off, no cron', () => {
    const settings = readWhatsAppSettings(BASE);
    expect(settings).toMatchObject({
      allowedEmails: ['owner@example.dev'],
      githubClientId: 'cid',
      sleepAfter: WHATSAPP_DEFAULTS.sleepAfter,
      toolTimeoutMs: WHATSAPP_DEFAULTS.toolTimeoutMs,
      syncWaitMs: WHATSAPP_DEFAULTS.syncWaitMs,
      enableSend: false,
      sendAllowlist: [],
      sendMaxPerHour: 10,
      syncCron: null,
    });
  });

  it('reads timings, sending and cron when configured', () => {
    const env = { ...BASE, TOOL_TIMEOUT_MS: '30000', SYNC_WAIT_MS: '0', SYNC_CRON: '0 */6 * * *' };
    expect(readTimingSettings(env)).toMatchObject({ toolTimeoutMs: 30_000, syncWaitMs: 0 });
    const send = { ENABLE_SEND: 'true', SEND_ALLOWLIST: '5531999999999', SEND_MAX_PER_HOUR: '3' };
    expect(readSendSettings(send)).toEqual({
      enableSend: true,
      sendAllowlist: ['5531999999999@s.whatsapp.net'],
      sendMaxPerHour: 3,
    });
    expect(readWhatsAppSettings(env).syncCron).toBe('0 */6 * * *');
  });

  it('fails without the GitHub OAuth App', () => {
    expect(() => readWhatsAppSettings({ ALLOWED_EMAILS: 'a@b.c' })).toThrow('GITHUB_CLIENT_ID');
  });
});

describe('containerEnvVars', () => {
  it('forwards only the bridge keys and the outgoing snapshot address', () => {
    const vars = containerEnvVars({
      BRIDGE_TOKEN: 't'.repeat(32),
      SNAPSHOT_KEY: 'k',
      TIMEZONE: 'America/Sao_Paulo',
      GITHUB_CLIENT_SECRET: 'not forwarded',
    });
    expect(vars).toEqual({
      BRIDGE_TOKEN: 't'.repeat(32),
      SNAPSHOT_KEY: 'k',
      TIMEZONE: 'America/Sao_Paulo',
      SNAPSHOT_PUSH_URL,
    });
    expect(BRIDGE_ENV_KEYS).not.toContain('GITHUB_CLIENT_SECRET');
  });

  it('requires a long BRIDGE_TOKEN and SNAPSHOT_KEY', () => {
    expect(() => containerEnvVars({ SNAPSHOT_KEY: 'k' })).toThrow('BRIDGE_TOKEN');
    expect(() => containerEnvVars({ BRIDGE_TOKEN: 'short', SNAPSHOT_KEY: 'k' })).toThrow('32');
    expect(() => containerEnvVars({ BRIDGE_TOKEN: 't'.repeat(32) })).toThrow('SNAPSHOT_KEY');
  });
});
