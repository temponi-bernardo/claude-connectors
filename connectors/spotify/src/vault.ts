/**
 * Per-user encrypted records in KV. Every value is sealed with AES-256-GCM (`TOKEN_ENC_KEY`) together with its
 * type and its owner, both checked on read: one user's record never opens for another, and a record of one type
 * never opens as another. KV keys hold only a hash of the owner.
 */
import { openSealed, sealPayload } from '../../../src/remote/seal.js';
import { sha256Hex, type KvStore } from '../../../src/remote/worker-kit.js';

/** KV with key listing (Workers KV has it), needed to erase everything a user owns. */
export interface ListableKv extends KvStore {
  list(options: { prefix: string; cursor?: string }): Promise<{
    keys: { name: string }[];
    list_complete: boolean;
    cursor?: string;
  }>;
}

/** Every vault type, so `disconnect` erases all of them. */
export const VAULT_TYPES: readonly string[] = [
  'account',
  'genres',
  'scan',
  'plans',
  'backups',
  'backup',
  'stale',
];

/** Technical seal expiry (year 2100) for records that only end when deleted. */
export const VAULT_FOREVER_EXP = 4_102_444_800;

/** Where a record lives: its type, its owner and, for one-of-many records, its id. */
export interface VaultRef {
  readonly typ: string;
  readonly owner: string;
  readonly id?: string;
}

/** What the vault needs: KV, the seal key and the clock (Unix ms). */
export interface VaultDeps {
  readonly kv: ListableKv;
  readonly tokenKey: Buffer;
  readonly now: () => number;
}

/** Hash of the owner used in every KV key (never the owner itself). */
export function ownerHash(owner: string): string {
  return sha256Hex(`spotify\n${owner}`);
}

/** KV key of a record: type, hash of the owner and optional id (never the owner itself). */
export function vaultKey(ref: VaultRef): string {
  const base = `${ref.typ}:${ownerHash(ref.owner)}`;
  return ref.id === undefined ? base : `${base}:${ref.id}`;
}

/** Reads and opens a record; null when missing, expired, tampered with or owned by someone else. */
export async function readVault(deps: VaultDeps, ref: VaultRef): Promise<unknown> {
  const sealed = await deps.kv.get(vaultKey(ref));
  if (sealed === null) return null;
  const now = Math.floor(deps.now() / 1000);
  const claims = openSealed(sealed, deps.tokenKey, { typ: `spotify_${ref.typ}`, now });
  if (claims?.owner !== ref.owner || claims.id !== (ref.id ?? null)) return null;
  return claims.data ?? null;
}

/** Seals and stores a record; with `ttlSeconds` it also expires in KV. */
export async function writeVault(
  deps: VaultDeps,
  ref: VaultRef & { readonly ttlSeconds?: number },
  data: unknown,
): Promise<void> {
  const ttl = ref.ttlSeconds;
  const exp = ttl ? Math.floor(deps.now() / 1000) + ttl : VAULT_FOREVER_EXP;
  const claims = { typ: `spotify_${ref.typ}`, exp, owner: ref.owner, id: ref.id ?? null, data };
  const sealed = sealPayload(claims, deps.tokenKey);
  await deps.kv.put(vaultKey(ref), sealed, ttl ? { expirationTtl: ttl } : undefined);
}

/** Deletes a record. */
export async function deleteVault(deps: VaultDeps, ref: VaultRef): Promise<void> {
  await deps.kv.delete(vaultKey(ref));
}

/** Vault source of `vaultOf`. */
export interface VaultSource {
  readonly kv: ListableKv;
  readonly settings: { readonly tokenKey: Buffer };
  readonly now: () => number;
}

/** Vault dependencies from the connector dependencies. */
export function vaultOf(deps: VaultSource): VaultDeps {
  return { kv: deps.kv, tokenKey: deps.settings.tokenKey, now: deps.now };
}

/** Deletes every key under a prefix (all pages); returns how many. */
export async function deletePrefix(kv: ListableKv, prefix: string): Promise<number> {
  let deleted = 0;
  let cursor: string | undefined;
  do {
    const page = await kv.list(cursor === undefined ? { prefix } : { prefix, cursor });
    for (const key of page.keys) await kv.delete(key.name);
    deleted += page.keys.length;
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor !== undefined);
  return deleted;
}

/** Erases every record a user owns, of every type; returns how many keys were deleted. */
export async function eraseOwner(kv: ListableKv, owner: string): Promise<number> {
  let deleted = 0;
  for (const typ of VAULT_TYPES) deleted += await deletePrefix(kv, `${typ}:${ownerHash(owner)}`);
  return deleted;
}
