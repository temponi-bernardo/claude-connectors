/**
 * Gmail accounts linked per connector user, in a single KV record per user. The record is sealed with
 * AES-256-GCM (`TOKEN_ENC_KEY`) together with the user id, checked on read: one user's record never opens
 * for another. The KV key holds only the hash of the id.
 */
import { createHash } from 'node:crypto';
import { openSealed, sealPayload } from '../../../src/remote/seal.js';
import type { KvStore } from './context.js';

/** Seal type of a user's account record. */
export const OWNER_RECORD_TYP = 'gmail_owner';

/** Technical seal expiry (year 2100): accounts stay valid until unlinked or revoked. */
export const OWNER_RECORD_EXP = 4_102_444_800;

/** Maximum number of Gmail accounts a user can link. */
export const MAX_LINKED_ACCOUNTS = 10;

/** Link status: active, or revoked at Google (needs relinking). */
export type LinkStatus = 'active' | 'revoked';

/** Gmail account linked to a connector user. */
export interface LinkedAccount {
  readonly email: string;
  readonly refreshToken: string;
  readonly scope: string;
  /** Link date in ISO 8601. */
  readonly linkedAt: string;
  readonly status: LinkStatus;
}

/** SHA-256 in hex (KV only keeps hashes of ids, `state` and cookies). */
export function sha256Hex(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

/** KV key of the user record (hash of the Google id, `sub`). */
export function ownerKey(owner: string): string {
  return `owner:${sha256Hex(owner)}`;
}

/** Converts a sealed item into a linked account; null if the email or refresh token is missing. */
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

/** Seals a user's accounts for storing in KV. */
export function sealOwnerAccounts(
  owner: string,
  accounts: readonly LinkedAccount[],
  key: Buffer,
): string {
  return sealPayload({ typ: OWNER_RECORD_TYP, exp: OWNER_RECORD_EXP, owner, accounts }, key);
}

/** Opens the user record; empty list if the key, the content or the owner do not match. */
export function openOwnerAccounts(sealed: string, key: Buffer, owner: string): LinkedAccount[] {
  const claims = openSealed(sealed, key, { typ: OWNER_RECORD_TYP, now: 0 });
  if (claims?.owner !== owner || !Array.isArray(claims.accounts)) return [];
  return claims.accounts.map(toLinkedAccount).filter((a): a is LinkedAccount => a !== null);
}

/** Reads the user's linked accounts (empty if none linked yet). */
export async function loadOwnerAccounts(
  kv: KvStore,
  key: Buffer,
  owner: string,
): Promise<LinkedAccount[]> {
  const sealed = await kv.get(ownerKey(owner));
  return sealed === null ? [] : openOwnerAccounts(sealed, key, owner);
}

/** Stores the user's accounts; with no accounts, deletes the record. */
export async function saveOwnerAccounts(
  kv: KvStore,
  key: Buffer,
  record: { readonly owner: string; readonly accounts: readonly LinkedAccount[] },
): Promise<void> {
  const name = ownerKey(record.owner);
  if (record.accounts.length === 0) await kv.delete(name);
  else await kv.put(name, sealOwnerAccounts(record.owner, record.accounts, key));
}

/** Adds or replaces the account (by email) in the list; refuses to exceed the account limit. */
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
