/**
 * Artist genres with a per-user cache: `GET /artists/{id}` one artist at a time (the batch endpoint is gone in
 * development mode), cached in the user's vault so each artist is fetched once. Spotify marks `genres` as
 * deprecated: an artist may come back with none, which is cached too.
 */
import type { OwnerDeps } from './context.js';
import { spotifyCall } from './spotify-api.js';
import { BudgetExhaustedError } from './spotify-errors.js';
import { readVault, vaultOf, writeVault } from './vault.js';

/** Vault type of the genre cache. */
export const GENRES_TYP = 'genres';

/** Seconds the genre cache stays in KV after its last update. */
export const GENRES_TTL_SECONDS = 30 * 24 * 3600;

/** Most artists kept in the cache (oldest dropped first). */
export const MAX_CACHED_ARTISTS = 20_000;

/** Genres per artist id. */
export type GenreMap = Record<string, string[]>;

/** Reads the user's genre cache (empty when none). */
export async function loadGenreCache(deps: OwnerDeps): Promise<GenreMap> {
  const data = await readVault(vaultOf(deps), { typ: GENRES_TYP, owner: deps.owner });
  return (data ?? {}) as GenreMap;
}

/** Stores the cache, trimmed to `MAX_CACHED_ARTISTS`. */
export async function saveGenreCache(deps: OwnerDeps, cache: GenreMap): Promise<void> {
  const entries = Object.entries(cache);
  const kept = Object.fromEntries(entries.slice(Math.max(0, entries.length - MAX_CACHED_ARTISTS)));
  const ref = { typ: GENRES_TYP, owner: deps.owner, ttlSeconds: GENRES_TTL_SECONDS };
  await writeVault(vaultOf(deps), ref, kept);
}

/** Genres of one artist from `GET /artists/{id}` (empty when Spotify returns none). */
export async function fetchArtistGenres(deps: OwnerDeps, artistId: string): Promise<string[]> {
  const body = (await spotifyCall(deps, { path: `/artists/${encodeURIComponent(artistId)}` })) as {
    genres?: unknown;
  } | null;
  return Array.isArray(body?.genres)
    ? body.genres.filter((g): g is string => typeof g === 'string')
    : [];
}

/** Artist ids not in the cache yet (unique, ignoring empty ids). */
export function missingArtistIds(ids: readonly string[], cache: GenreMap): string[] {
  return [...new Set(ids)].filter((id) => id !== '' && !(id in cache));
}

/**
 * Fills the cache for the given artists within the budget and saves it; returns the cache and how many artists
 * are still missing (0 = complete).
 */
export async function ensureGenres(
  deps: OwnerDeps,
  artistIds: readonly string[],
): Promise<{ genres: GenreMap; missing: number }> {
  const cache = await loadGenreCache(deps);
  const todo = missingArtistIds(artistIds, cache);
  let fetched = 0;
  try {
    for (const id of todo) {
      cache[id] = await fetchArtistGenres(deps, id);
      fetched += 1;
    }
  } catch (error) {
    if (!(error instanceof BudgetExhaustedError)) throw error;
  }
  if (fetched > 0) await saveGenreCache(deps, cache);
  return { genres: cache, missing: todo.length - fetched };
}
