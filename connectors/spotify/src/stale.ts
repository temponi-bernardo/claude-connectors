/**
 * Abandoned playlists: the user's own playlists whose newest item was added more than N months ago (or empty
 * ones). Spotify exposes no "last modified" date, so the newest `added_at` of the last 50 items stands in for it;
 * results are cached per playlist version in the user's vault so large collections finish over several calls.
 */
import { parseAddedTrack, parsePlaylist, type AddedTrack, type PlaylistInfo } from './catalog.js';
import type { OwnerDeps } from './context.js';
import { collectOffsetPages } from './paging.js';
import { paths } from './paths.js';
import { spotifyCall } from './spotify-api.js';
import { BudgetExhaustedError } from './spotify-errors.js';
import { readPagingObject } from './paging.js';
import { readVault, vaultOf, writeVault } from './vault.js';

/** Vault type of the cache of last-added dates (per playlist `snapshot_id`). */
export const STALE_TYP = 'stale';

/** Most playlists read from the library. */
export const MAX_LIBRARY_PLAYLISTS = 2000;

/** Newest `added_at` per playlist snapshot id (empty text = empty playlist). */
export type LastAddedCache = Record<string, string>;

/** Every playlist in the user's library (within the budget; throws if not even one page fits). */
export async function fetchAllPlaylists(
  deps: OwnerDeps,
): Promise<{ playlists: PlaylistInfo[]; complete: boolean }> {
  const read = await collectOffsetPages(deps, {
    path: '/me/playlists',
    offset: 0,
    pageSize: 50,
    maxItems: MAX_LIBRARY_PLAYLISTS,
  });
  const playlists = read.items.map(parsePlaylist).filter((p): p is PlaylistInfo => p !== null);
  return { playlists, complete: read.nextOffset === null };
}

/** Newest `added_at` among the last 50 items of a playlist (empty text when it has none). */
export async function fetchLastAdded(deps: OwnerDeps, playlist: PlaylistInfo): Promise<string> {
  if (playlist.total === 0) return '';
  const query = { offset: Math.max(0, playlist.total - 50), limit: 50 };
  const page = readPagingObject(
    await spotifyCall(deps, { path: paths.playlistItems(playlist.id), query }),
  );
  const dates = page.items
    .map(parseAddedTrack)
    .filter((t): t is AddedTrack => t !== null)
    .map((t) => t.addedAt);
  return dates.sort().at(-1) ?? '';
}

/** Fills the cache for the given playlists within the budget; returns how many are still unknown. */
export async function fillLastAdded(
  deps: OwnerDeps,
  playlists: readonly PlaylistInfo[],
  cache: LastAddedCache,
): Promise<number> {
  const todo = playlists.filter((p) => !(p.snapshotId in cache));
  let done = 0;
  try {
    for (const playlist of todo) {
      cache[playlist.snapshotId] = await fetchLastAdded(deps, playlist);
      done += 1;
    }
  } catch (error) {
    if (!(error instanceof BudgetExhaustedError)) throw error;
  }
  return todo.length - done;
}

/** Reads the cache, fills it for the user's own playlists and saves it; returns playlists, cache and what is missing. */
export async function scanOwnPlaylists(
  deps: OwnerDeps,
  userId: string,
): Promise<{ own: PlaylistInfo[]; cache: LastAddedCache; missing: number }> {
  const { playlists, complete } = await fetchAllPlaylists(deps);
  if (!complete)
    throw new Error(
      'Could not list all your playlists within one call; raise SPOTIFY_CALL_BUDGET on the Worker.',
    );
  const own = playlists.filter((p) => p.ownerId === userId);
  const vault = vaultOf(deps);
  const ref = { typ: STALE_TYP, owner: deps.owner };
  const cache = ((await readVault(vault, ref)) ?? {}) as LastAddedCache;
  const missing = await fillLastAdded(deps, own, cache);
  await writeVault(vault, ref, cache);
  return { own, cache, missing };
}

/** Own playlists older than the cutoff (ISO), and empty ones when asked. Pure. */
export function stalePlaylists(
  own: readonly PlaylistInfo[],
  scan: { readonly cache: LastAddedCache; readonly cutoff: string; readonly includeEmpty: boolean },
): { playlist: PlaylistInfo; lastAdded: string }[] {
  return own
    .map((playlist) => ({ playlist, lastAdded: scan.cache[playlist.snapshotId] ?? '' }))
    .filter(({ lastAdded }) => (lastAdded === '' ? scan.includeEmpty : lastAdded < scan.cutoff));
}
