/**
 * Contas Gmail vinculadas no KV: o refresh token do Google é guardado selado com AES-256-GCM
 * (`TOKEN_ENC_KEY`), junto do e-mail, que é conferido na leitura para um registro não servir a outra conta.
 */
import { openSealed, sealPayload } from '../../../src/remote/seal.js';
import { accountAlias, type AllowedAccount } from './config.js';
import type { KvStore } from './context.js';

/** Tipo do selo de uma conta vinculada. */
export const LINKED_ACCOUNT_TYP = 'gmail_account';

/** Validade técnica do selo (ano 2100): a conta vale até ser revogada ou vinculada de novo. */
export const LINKED_ACCOUNT_EXP = 4_102_444_800;

/** Estado do vínculo: ativo, ou revogado no Google (precisa vincular de novo). */
export type LinkStatus = 'active' | 'revoked';

/** Conta vinculada, como fica (selada) no KV. */
export interface LinkedAccount {
  readonly email: string;
  readonly refreshToken: string;
  readonly scope: string;
  /** Data do vínculo em ISO 8601. */
  readonly linkedAt: string;
  readonly status: LinkStatus;
}

/** Chave da conta no KV (pelo apelido; o e-mail só existe dentro do selo). */
export function accountKey(alias: string): string {
  return `account:${alias}`;
}

/** Sela uma conta vinculada para gravar no KV. */
export function sealLinkedAccount(account: LinkedAccount, key: Buffer): string {
  return sealPayload({ typ: LINKED_ACCOUNT_TYP, exp: LINKED_ACCOUNT_EXP, ...account }, key);
}

/** Abre o selo de uma conta e confere o e-mail esperado; nulo se a chave, o conteúdo ou o e-mail não conferem. */
export function openLinkedAccount(
  sealed: string,
  key: Buffer,
  email: string,
): LinkedAccount | null {
  const claims = openSealed(sealed, key, { typ: LINKED_ACCOUNT_TYP, now: 0 });
  if (claims?.email !== email || typeof claims.refreshToken !== 'string') return null;
  return {
    email,
    refreshToken: claims.refreshToken,
    scope: typeof claims.scope === 'string' ? claims.scope : '',
    linkedAt: typeof claims.linkedAt === 'string' ? claims.linkedAt : '',
    status: claims.status === 'revoked' ? 'revoked' : 'active',
  };
}

/** Grava a conta vinculada (selada) no KV. */
export async function saveLinkedAccount(
  kv: KvStore,
  key: Buffer,
  account: LinkedAccount,
): Promise<void> {
  await kv.put(accountKey(accountAlias(account.email)), sealLinkedAccount(account, key));
}

/** Lê a conta vinculada do KV; nula se não houver vínculo ou o registro não abrir. */
export async function loadLinkedAccount(
  kv: KvStore,
  key: Buffer,
  account: AllowedAccount,
): Promise<LinkedAccount | null> {
  const sealed = await kv.get(accountKey(account.alias));
  return sealed === null ? null : openLinkedAccount(sealed, key, account.email);
}
