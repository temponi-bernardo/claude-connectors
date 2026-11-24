/**
 * The connected Spotify account of each connector user: their own app credentials (Client ID and Secret), the
 * refresh token and when it was authorized. One sealed vault record per user (see `vault.ts`).
 */
import { deleteVault, readVault, writeVault, type VaultDeps } from './vault.js';

/** Vault type of the account record. */
export const ACCOUNT_TYP = 'account';

/** Spotify refresh tokens last 6 months from the authorization; refreshing does not extend them. */
export const REFRESH_TOKEN_LIFETIME_MS = 182 * 24 * 3600 * 1000;

/** A user's connected Spotify account. */
export interface SpotifyAccount {
  readonly spotifyUserId: string;
  readonly displayName: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly refreshToken: string;
  readonly scope: string;
  /** When the user authorized (Unix ms); the refresh token expires 6 months later. */
  readonly authorizedAt: number;
}

/** Validates a stored account (all fields present); null otherwise. */
export function toSpotifyAccount(value: unknown): SpotifyAccount | null {
  const item = (typeof value === 'object' && value !== null ? value : {}) as Record<
    string,
    unknown
  >;
  const texts = ['spotifyUserId', 'clientId', 'clientSecret', 'refreshToken'] as const;
  if (!texts.every((name) => typeof item[name] === 'string')) return null;
  if (typeof item.authorizedAt !== 'number') return null;
  return {
    spotifyUserId: item.spotifyUserId as string,
    displayName: typeof item.displayName === 'string' ? item.displayName : '',
    clientId: item.clientId as string,
    clientSecret: item.clientSecret as string,
    refreshToken: item.refreshToken as string,
    scope: typeof item.scope === 'string' ? item.scope : '',
    authorizedAt: item.authorizedAt,
  };
}

/** Reads the user's account; null when they never connected or disconnected. */
export async function loadAccount(deps: VaultDeps, owner: string): Promise<SpotifyAccount | null> {
  return toSpotifyAccount(await readVault(deps, { typ: ACCOUNT_TYP, owner }));
}

/** Stores (or replaces) the user's account. */
export async function saveAccount(
  deps: VaultDeps,
  owner: string,
  account: SpotifyAccount,
): Promise<void> {
  await writeVault(deps, { typ: ACCOUNT_TYP, owner }, account);
}

/** Deletes the user's account record. */
export async function deleteAccount(deps: VaultDeps, owner: string): Promise<void> {
  await deleteVault(deps, { typ: ACCOUNT_TYP, owner });
}

/** Estimated instant (ISO 8601) the refresh token stops working. */
export function refreshExpiryIso(account: SpotifyAccount): string {
  return new Date(account.authorizedAt + REFRESH_TOKEN_LIFETIME_MS).toISOString();
}

/** Masks a credential for display: only the first 4 characters. */
export function maskCredential(text: string): string {
  return `${text.slice(0, 4)}…`;
}
