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
  ALLOWED_EMAILS: 'Dono@Exemplo.dev',
  GITHUB_CLIENT_ID: 'cid',
  GITHUB_CLIENT_SECRET: 'csecret',
};

describe('requireEnv e readIntInRange', () => {
  it('exige a variável e explica como definir', () => {
    expect(requireEnv({ A: 'x' }, 'A', 'como')).toBe('x');
    expect(() => requireEnv({}, 'A', 'faça assim.')).toThrow('Defina A: faça assim.');
  });

  it('lê inteiros no intervalo, usa o padrão se ausente e recusa o resto', () => {
    const range = { min: 1, max: 10, fallback: 5 };
    expect(readIntInRange({}, 'N', range)).toBe(5);
    expect(readIntInRange({ N: '7' }, 'N', range)).toBe(7);
    expect(() => readIntInRange({ N: '11' }, 'N', range)).toThrow('entre 1 e 10');
    expect(() => readIntInRange({ N: '2.5' }, 'N', range)).toThrow();
  });
});

describe('readSleepAfter', () => {
  it('aceita de 30s a 1h e usa 5m por padrão', () => {
    expect(readSleepAfter({})).toBe('5m');
    expect(readSleepAfter({ SLEEP_AFTER: '90s' })).toBe('90s');
    expect(readSleepAfter({ SLEEP_AFTER: '1h' })).toBe('1h');
  });

  it('recusa formatos inválidos e durações fora do limite', () => {
    for (const value of ['10s', '2h', '5 min', 'x']) {
      expect(() => readSleepAfter({ SLEEP_AFTER: value })).toThrow('SLEEP_AFTER');
    }
  });
});

describe('normalizePhone e readSendAllowlist', () => {
  it('deixa só dígitos e aceita JID de contato', () => {
    expect(normalizePhone('+55 (31) 99999-9999')).toBe('5531999999999');
    expect(normalizePhone('5531999999999@s.whatsapp.net')).toBe('5531999999999');
    expect(normalizePhone('123')).toBeNull();
    expect(normalizePhone('abc@g.us')).toBeNull();
  });

  it('normaliza destinatário: número, contato, LID e grupo viram JID; o resto é nulo', () => {
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

  it('lê a allowlist (números e grupos) e recusa item inválido', () => {
    const raw = '+55 31 99999-9999, 120363000000000001@g.us';
    expect(readSendAllowlist({ SEND_ALLOWLIST: raw })).toEqual([
      '5531999999999@s.whatsapp.net',
      '120363000000000001@g.us',
    ]);
    expect(readSendAllowlist({})).toEqual([]);
    expect(() => readSendAllowlist({ SEND_ALLOWLIST: '12' })).toThrow('inválido');
  });
});

describe('readAllowedEmails', () => {
  it('exige pelo menos um e-mail', () => {
    expect(readAllowedEmails(BASE)).toEqual(['dono@exemplo.dev']);
    expect(() => readAllowedEmails({})).toThrow('ALLOWED_EMAILS');
  });
});

describe('readWhatsAppSettings', () => {
  it('usa os padrões seguros: envio desligado, sem cron', () => {
    const settings = readWhatsAppSettings(BASE);
    expect(settings).toMatchObject({
      allowedEmails: ['dono@exemplo.dev'],
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

  it('lê prazos, envio e cron quando configurados', () => {
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

  it('falha sem o OAuth App do GitHub', () => {
    expect(() => readWhatsAppSettings({ ALLOWED_EMAILS: 'a@b.c' })).toThrow('GITHUB_CLIENT_ID');
  });
});

describe('containerEnvVars', () => {
  it('repassa só as chaves da ponte e o endereço do snapshot de saída', () => {
    const vars = containerEnvVars({
      BRIDGE_TOKEN: 't'.repeat(32),
      SNAPSHOT_KEY: 'k',
      TIMEZONE: 'America/Sao_Paulo',
      GITHUB_CLIENT_SECRET: 'não vai',
    });
    expect(vars).toEqual({
      BRIDGE_TOKEN: 't'.repeat(32),
      SNAPSHOT_KEY: 'k',
      TIMEZONE: 'America/Sao_Paulo',
      SNAPSHOT_PUSH_URL,
    });
    expect(BRIDGE_ENV_KEYS).not.toContain('GITHUB_CLIENT_SECRET');
  });

  it('exige BRIDGE_TOKEN longo e SNAPSHOT_KEY', () => {
    expect(() => containerEnvVars({ SNAPSHOT_KEY: 'k' })).toThrow('BRIDGE_TOKEN');
    expect(() => containerEnvVars({ BRIDGE_TOKEN: 'curto', SNAPSHOT_KEY: 'k' })).toThrow('32');
    expect(() => containerEnvVars({ BRIDGE_TOKEN: 't'.repeat(32) })).toThrow('SNAPSHOT_KEY');
  });
});
