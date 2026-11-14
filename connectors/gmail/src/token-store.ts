/**
 * Contas Gmail vinculadas por usuário do conector, num único registro do KV por usuário. O registro é selado
 * com AES-256-GCM (`TOKEN_ENC_KEY`) junto do id do usuário, conferido na leitura: o registro de um usuário
 * nunca abre para outro. A chave do KV guarda só o hash do id.
 */
import { createHash } from 'node:crypto';
import { openSealed, sealPayload } from '../../../src/remote/seal.js';
import type { KvStore } from './context.js';

/** Tipo do selo do registro de contas de um usuário. */
export const OWNER_RECORD_TYP = 'gmail_owner';

/** Validade técnica do selo (ano 2100): as contas valem até serem desvinculadas ou revogadas. */
export const OWNER_RECORD_EXP = 4_102_444_800;

/** Mais contas Gmail que um usuário pode vincular. */
export const MAX_LINKED_ACCOUNTS = 10;

/** Estado do vínculo: ativo, ou revogado no Google (precisa vincular de novo). */
export type LinkStatus = 'active' | 'revoked';

/** Conta Gmail vinculada a um usuário do conector. */
export interface LinkedAccount {
  readonly email: string;
  readonly refreshToken: string;
  readonly scope: string;
  /** Data do vínculo em ISO 8601. */
  readonly linkedAt: string;
  readonly status: LinkStatus;
}

/** SHA-256 em hexadecimal (o KV só guarda hashes de ids, `state` e cookies). */
export function sha256Hex(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

/** Chave do registro do usuário no KV (hash do id do Google, `sub`). */
export function ownerKey(owner: string): string {
  return `owner:${sha256Hex(owner)}`;
}

/** Converte um item do selo em conta vinculada; nulo se faltar e-mail ou refresh token. */
export function toLinkedAccount(value: unknown): LinkedAccount | null {
  const item = (typeof value === 'object' && value !== null ? value : {}) as Record<
    string,
    unknown
  >;
  if (typeof item.email !== 'string' || typeof item.refreshToken !== 'string') return null;
  return {
    email: item.email,
    refreshToken: item.refreshToken,
    scope: typeof item.scope === 'string' ? item.scope : '',
    linkedAt: typeof item.linkedAt === 'string' ? item.linkedAt : '',
    status: item.status === 'revoked' ? 'revoked' : 'active',
  };
}

/** Sela as contas de um usuário para gravar no KV. */
export function sealOwnerAccounts(
  owner: string,
  accounts: readonly LinkedAccount[],
  key: Buffer,
): string {
  return sealPayload({ typ: OWNER_RECORD_TYP, exp: OWNER_RECORD_EXP, owner, accounts }, key);
}

/** Abre o registro do usuário; lista vazia se a chave, o conteúdo ou o dono não conferem. */
export function openOwnerAccounts(sealed: string, key: Buffer, owner: string): LinkedAccount[] {
  const claims = openSealed(sealed, key, { typ: OWNER_RECORD_TYP, now: 0 });
  if (claims?.owner !== owner || !Array.isArray(claims.accounts)) return [];
  return claims.accounts.map(toLinkedAccount).filter((a): a is LinkedAccount => a !== null);
}

/** Lê as contas vinculadas do usuário (vazio se ele ainda não vinculou nenhuma). */
export async function loadOwnerAccounts(
  kv: KvStore,
  key: Buffer,
  owner: string,
): Promise<LinkedAccount[]> {
  const sealed = await kv.get(ownerKey(owner));
  return sealed === null ? [] : openOwnerAccounts(sealed, key, owner);
}

/** Grava as contas do usuário; sem contas, apaga o registro. */
export async function saveOwnerAccounts(
  kv: KvStore,
  key: Buffer,
  record: { readonly owner: string; readonly accounts: readonly LinkedAccount[] },
): Promise<void> {
  const name = ownerKey(record.owner);
  if (record.accounts.length === 0) await kv.delete(name);
  else await kv.put(name, sealOwnerAccounts(record.owner, record.accounts, key));
}

/** Põe ou troca a conta (pelo e-mail) na lista; recusa passar do limite de contas. */
export function upsertAccount(
  accounts: readonly LinkedAccount[],
  account: LinkedAccount,
): LinkedAccount[] {
  const others = accounts.filter((a) => a.email !== account.email);
  if (others.length >= MAX_LINKED_ACCOUNTS) {
    throw new Error(`Limit of ${MAX_LINKED_ACCOUNTS} linked accounts reached; unlink one first.`);
  }
  return [...others, account];
}
