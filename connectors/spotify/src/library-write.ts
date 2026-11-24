/**
 * Writes to the user's library with the 2026 endpoints: `PUT/DELETE /me/library?uris=` (40 URIs per request)
 * saves or removes tracks, albums, episodes, shows, audiobooks and follows/unfollows playlists and users. For
 * artists Spotify's pages are ambiguous, so an artist chunk falls back to `/me/following?type=artist` when the
 * library endpoint rejects it with 400.
 */
import type { OwnerDeps } from './context.js';
import { spotifyCall } from './spotify-api.js';
import { SpotifyApiError } from './spotify-errors.js';

/** Most URIs per `/me/library` request. */
export const LIBRARY_BATCH = 40;

/** Most items per playlist add/remove/replace request. */
export const PLAYLIST_BATCH = 100;

/** A Spotify URI of a type the library accepts (local files are not library items). */
export const SPOTIFY_URI_PATTERN =
  /^spotify:(track|album|episode|show|audiobook|playlist|artist|user):[\w.-]+$/;

/** Save or remove. */
export type LibraryAction = 'save' | 'remove';

/** Tells whether a URI is an artist URI. */
export function isArtistUri(uri: string): boolean {
  return uri.startsWith('spotify:artist:');
}

/** Bare id of a URI (`spotify:artist:abc` → `abc`). */
export function uriId(uri: string): string {
  return uri.slice(uri.lastIndexOf(':') + 1);
}

/** Saves or removes URIs through `/me/library` (one request, at most `LIBRARY_BATCH`). */
export async function writeLibraryUris(
  deps: OwnerDeps,
  action: LibraryAction,
  uris: readonly string[],
): Promise<void> {
  const method = action === 'save' ? 'PUT' : 'DELETE';
  await spotifyCall(deps, { method, path: '/me/library', query: { uris: uris.join(',') } });
}

/** Follows or unfollows artists: `/me/library` first, `/me/following?type=artist` if that answers 400. */
export async function writeArtistFollows(
  deps: OwnerDeps,
  action: LibraryAction,
  uris: readonly string[],
): Promise<void> {
  try {
    await writeLibraryUris(deps, action, uris);
  } catch (error) {
    if (!(error instanceof SpotifyApiError) || error.status !== 400) throw error;
    const method = action === 'save' ? 'PUT' : 'DELETE';
    const query = { type: 'artist', ids: uris.map(uriId).join(',') };
    await spotifyCall(deps, { method, path: '/me/following', query });
  }
}

/** Writes one chunk (≤ `LIBRARY_BATCH`) of mixed URIs: artists apart from the rest. */
export async function writeLibraryChunk(
  deps: OwnerDeps,
  action: LibraryAction,
  uris: readonly string[],
): Promise<void> {
  const artists = uris.filter(isArtistUri);
  const others = uris.filter((uri) => !isArtistUri(uri));
  if (others.length > 0) await writeLibraryUris(deps, action, others);
  if (artists.length > 0) await writeArtistFollows(deps, action, artists);
}

/** Checks which URIs are in the library (`/me/library/contains`, ≤ `LIBRARY_BATCH`). */
export async function libraryContains(
  deps: OwnerDeps,
  uris: readonly string[],
): Promise<boolean[]> {
  const body = await spotifyCall(deps, {
    path: '/me/library/contains',
    query: { uris: uris.join(',') },
  });
  return Array.isArray(body) ? body.map((value) => value === true) : uris.map(() => false);
}

/** Splits a list into chunks of `size`. */
export function chunkList<T>(items: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}
