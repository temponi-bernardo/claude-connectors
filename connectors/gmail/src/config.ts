/**
 * Configuração do conector Gmail remoto, lida dos secrets do Worker. Pura: só valida e transforma texto.
 */
import { envValue, type EnvVars } from '../../../src/core/env.js';
import { parseSealKey } from '../../../src/remote/seal.js';

/** Escopo do Gmail somente leitura (o único escopo de dados pedido). */
export const GMAIL_READONLY_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';

/** Escopos pedidos ao Google para vincular uma conta: identidade e Gmail só leitura. */
export const GMAIL_LINK_SCOPES: readonly string[] = ['openid', 'email', GMAIL_READONLY_SCOPE];

/** Escopos pedidos ao Google só para identificar o dono no login do conector. */
export const SIGN_IN_SCOPES: readonly string[] = ['openid', 'email'];

/** Tamanho mínimo do segredo que assina o cookie de consentimento lembrado. */
export const MIN_CONSENT_SECRET_CHARS = 32;

/** Conta permitida: apelido usado nas ferramentas (`dono`) e o e-mail completo. */
export interface AllowedAccount {
  readonly alias: string;
  readonly email: string;
}

/** Configuração validada do conector. */
export interface GmailSettings {
  readonly googleClientId: string;
  readonly googleClientSecret: string;
  readonly tokenKey: Buffer;
  readonly accounts: readonly AllowedAccount[];
  readonly consentSecret: string;
}

/** Apelido de uma conta: a parte antes do `@`, em minúsculas (`musica`). */
export function accountAlias(email: string): string {
  return email.slice(0, email.indexOf('@')).toLowerCase();
}

/** Diz se o texto parece um e-mail simples (`nome@dominio.tld`, sem espaços). */
export function isEmailAddress(text: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

/** Lê `ALLOWED_EMAILS` (separados por vírgula): exige e-mails válidos e apelidos sem repetição. */
export function parseAllowedEmails(raw: string | null): AllowedAccount[] {
  const emails = (raw ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (emails.length === 0)
    throw new Error('Defina ALLOWED_EMAILS com os e-mails do dono, separados por vírgula.');
  const invalid = emails.find((email) => !isEmailAddress(email));
  if (invalid !== undefined) throw new Error('ALLOWED_EMAILS tem um item que não é e-mail.');
  const accounts = emails.map((email) => ({ alias: accountAlias(email), email }));
  if (
    new Set(accounts.map((a) => a.alias)).size !== accounts.length ||
    accounts.some((a) => a.alias === 'all')
  ) {
    throw new Error('ALLOWED_EMAILS: a parte antes do @ precisa ser única e diferente de "all".');
  }
  return accounts;
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
    accounts: parseAllowedEmails(envValue(env, 'ALLOWED_EMAILS')),
    consentSecret: readConsentSecret(env),
  };
}

/** Conta permitida com o e-mail dado (comparação sem maiúsculas), ou nula. */
export function findAllowedAccount(
  accounts: readonly AllowedAccount[],
  email: string,
): AllowedAccount | null {
  return accounts.find((account) => account.email === email.toLowerCase()) ?? null;
}

/** Contas pedidas numa ferramenta: `all` são todas; um apelido desconhecido vira erro com os válidos. */
export function resolveAccounts(
  accounts: readonly AllowedAccount[],
  requested: string,
): AllowedAccount[] {
  const wanted = requested.trim().toLowerCase();
  if (wanted === 'all') return [...accounts];
  const found = accounts.find((account) => account.alias === wanted);
  if (found) return [found];
  const valid = [...accounts.map((a) => `"${a.alias}"`), '"all"'].join(', ');
  throw new Error(`Conta "${requested}" desconhecida. Use ${valid}.`);
}
