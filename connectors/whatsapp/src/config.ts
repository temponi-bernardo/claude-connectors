/**
 * Configuração do conector WhatsApp lida do ambiente do Worker (variáveis de `wrangler.toml` e secrets). Pura:
 * valida tudo na borda e devolve tipos do domínio, com mensagens que dizem como corrigir.
 */
import { envValue, parseFlag, type EnvVars } from '../../../src/core/env.js';
import { parseEmailList } from '../../../src/remote/github-login.js';

/** Configuração completa do conector. */
export interface WhatsAppSettings {
  readonly allowedEmails: readonly string[];
  readonly githubClientId: string;
  readonly githubClientSecret: string;
  /** Tempo sem uso até o container dormir, no formato do `Container` (`"5m"`, `"90s"`). */
  readonly sleepAfter: string;
  /** Teto de cada chamada de ferramenta, de ponta a ponta (ms). */
  readonly toolTimeoutMs: number;
  /** Quanto esperar a sincronização de pendências antes de responder com o que houver (ms). */
  readonly syncWaitMs: number;
  readonly enableSend: boolean;
  /** Destinatários permitidos para envio, só dígitos (DDI + número). */
  readonly sendAllowlist: readonly string[];
  readonly sendMaxPerHour: number;
  /** Expressão cron do sync periódico opcional; vazia = desligado. */
  readonly syncCron: string | null;
}

/** Padrões: dormir em 5 minutos, 25 s por ferramenta, 8 s esperando o sync, até 10 envios por hora. */
export const WHATSAPP_DEFAULTS = {
  sleepAfter: '5m',
  toolTimeoutMs: 25_000,
  syncWaitMs: 8_000,
  sendMaxPerHour: 10,
} as const;

/** Lê uma variável obrigatória ou lança dizendo como defini-la. */
export function requireEnv(env: EnvVars, key: string, how: string): string {
  const value = envValue(env, key);
  if (!value) throw new Error(`Defina ${key}: ${how}`);
  return value;
}

/** Lê um inteiro dentro de um intervalo; ausente vale o padrão, fora do intervalo lança. */
export function readIntInRange(
  env: EnvVars,
  key: string,
  range: { readonly min: number; readonly max: number; readonly fallback: number },
): number {
  const raw = envValue(env, key);
  if (raw === null) return range.fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < range.min || value > range.max) {
    throw new Error(`${key} precisa ser um inteiro entre ${range.min} e ${range.max}.`);
  }
  return value;
}

/** Valida `SLEEP_AFTER` (`30s` a `60m`, ou `1h`); ausente vale `5m`. */
export function readSleepAfter(env: EnvVars): string {
  const raw = envValue(env, 'SLEEP_AFTER') ?? WHATSAPP_DEFAULTS.sleepAfter;
  const match = /^(\d+)(s|m|h)$/.exec(raw);
  const seconds = match
    ? Number(match[1]) * { s: 1, m: 60, h: 3600 }[match[2] as 's' | 'm' | 'h']
    : 0;
  if (seconds < 30 || seconds > 3600) {
    throw new Error('SLEEP_AFTER precisa ser uma duração entre 30s e 1h (ex.: "5m").');
  }
  return raw;
}

/** Normaliza um número de telefone ou JID de contato para só dígitos; nulo se não parecer um número. */
export function normalizePhone(raw: string): string | null {
  const digits = raw
    .trim()
    .replace(/@s\.whatsapp\.net$/, '')
    .replace(/[\s()+-]/g, '');
  return /^\d{8,15}$/.test(digits) ? digits : null;
}

/** Lê `SEND_ALLOWLIST` (números separados por vírgula); item inválido lança. */
export function readSendAllowlist(env: EnvVars): string[] {
  const items = (envValue(env, 'SEND_ALLOWLIST') ?? '').split(',').filter((item) => item.trim());
  return items.map((item) => {
    const phone = normalizePhone(item);
    if (!phone) throw new Error(`SEND_ALLOWLIST tem um número inválido: "${item.trim()}".`);
    return phone;
  });
}

/** Lê a lista de donos (`ALLOWED_EMAILS`); vazia lança, porque ninguém conseguiria entrar. */
export function readAllowedEmails(env: EnvVars): string[] {
  const emails = parseEmailList(envValue(env, 'ALLOWED_EMAILS'));
  if (emails.length === 0) {
    throw new Error('Defina ALLOWED_EMAILS com o e-mail verificado da sua conta do GitHub.');
  }
  return emails;
}

/** Lê os prazos: sono do container, teto por ferramenta e espera do sync. */
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

/** Lê a configuração de envio (fase 2): ligado ou não, allowlist e limite por hora. */
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

/** Lê e valida a configuração do conector a partir do ambiente do Worker. */
export function readWhatsAppSettings(env: EnvVars): WhatsAppSettings {
  return {
    allowedEmails: readAllowedEmails(env),
    githubClientId: requireEnv(env, 'GITHUB_CLIENT_ID', 'crie um OAuth App no GitHub (README).'),
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

/** Variáveis repassadas da configuração do Worker para o container da ponte (`bridge/API.md`). */
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

/** Endereço interno (interceptado pelo Worker) para onde a ponte envia o snapshot no `SIGTERM`. */
export const SNAPSHOT_PUSH_URL = 'http://snapshot.internal/push';

/** Monta o ambiente do container: só as chaves da ponte, mais o endereço do snapshot de saída. */
export function containerEnvVars(env: EnvVars): Record<string, string> {
  const token = requireEnv(
    env,
    'BRIDGE_TOKEN',
    'wrangler secret put BRIDGE_TOKEN (32+ caracteres aleatórios).',
  );
  if (token.length < 32)
    throw new Error('BRIDGE_TOKEN precisa ter pelo menos 32 caracteres aleatórios.');
  requireEnv(env, 'SNAPSHOT_KEY', 'wrangler secret put SNAPSHOT_KEY (32 bytes em base64).');
  const pairs = BRIDGE_ENV_KEYS.map((key) => [key, envValue(env, key)] as const);
  const present = pairs.filter((pair): pair is readonly [string, string] => pair[1] !== null);
  return { ...Object.fromEntries(present), SNAPSHOT_PUSH_URL };
}
