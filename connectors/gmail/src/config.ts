/**
 * Configuração do conector Gmail remoto, lida dos secrets do Worker. Pura: só valida e transforma texto.
 * O conector é público e multiusuário: `ALLOWED_EMAILS` é opcional e, quando definido, restringe quem entra.
 */
import { envValue, type EnvVars } from '../../../src/core/env.js';
import { parseSealKey } from '../../../src/remote/seal.js';

/** Escopo do Gmail somente leitura (o único escopo de dados pedido). */
export const GMAIL_READONLY_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';

/** Escopos pedidos ao Google no login e no vínculo de conta: identidade e Gmail só leitura. */
export const GMAIL_SCOPES: readonly string[] = ['openid', 'email', GMAIL_READONLY_SCOPE];

/** Tamanho mínimo do segredo que assina o cookie de consentimento lembrado. */
export const MIN_CONSENT_SECRET_CHARS = 32;

/** Configuração validada do conector. */
export interface GmailSettings {
  readonly googleClientId: string;
  readonly googleClientSecret: string;
  readonly tokenKey: Buffer;
  /** E-mails que podem entrar (modo privado), ou nulo para qualquer conta Google (modo público). */
  readonly allowedEmails: readonly string[] | null;
  readonly consentSecret: string;
}

/** Diz se o texto parece um e-mail simples (`nome@dominio.tld`, sem espaços). */
export function isEmailAddress(text: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

/** Lê `ALLOWED_EMAILS` (opcional, separados por vírgula): nulo se ausente; lança erro se houver item inválido. */
export function parseAllowedEmails(raw: string | null): string[] | null {
  const emails = (raw ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (emails.length === 0) return null;
  if (!emails.every(isEmailAddress))
    throw new Error('ALLOWED_EMAILS tem um item que não é e-mail.');
  return emails;
}

/** Lê uma variável obrigatória; lança erro dizendo como defini-la. */
export function requiredSecret(env: EnvVars, name: string): string {
  const value = envValue(env, name);
  if (value === null) throw new Error(`Defina o secret ${name}: npx wrangler secret put ${name}`);
  return value;
}

/** Lê o segredo do consentimento lembrado e exige o tamanho mínimo. */
export function readConsentSecret(env: EnvVars): string {
  const secret = requiredSecret(env, 'CONSENT_SECRET');
  if (secret.length < MIN_CONSENT_SECRET_CHARS) {
    throw new Error(
      `CONSENT_SECRET precisa ter pelo menos ${MIN_CONSENT_SECRET_CHARS} caracteres.`,
    );
  }
  return secret;
}

/** Monta a configuração a partir dos secrets do Worker. */
export function readGmailSettings(env: EnvVars): GmailSettings {
  return {
    googleClientId: requiredSecret(env, 'GOOGLE_CLIENT_ID'),
    googleClientSecret: requiredSecret(env, 'GOOGLE_CLIENT_SECRET'),
    tokenKey: parseSealKey(envValue(env, 'TOKEN_ENC_KEY'), 'TOKEN_ENC_KEY'),
    allowedEmails: parseAllowedEmails(envValue(env, 'ALLOWED_EMAILS')),
    consentSecret: readConsentSecret(env),
  };
}

/** Diz se o e-mail pode entrar no conector: sempre no modo público; só os listados no modo privado. */
export function isEmailAllowed(settings: GmailSettings, email: string): boolean {
  return settings.allowedEmails === null || settings.allowedEmails.includes(email.toLowerCase());
}
