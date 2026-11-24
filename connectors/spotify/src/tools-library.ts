/**
 * Library tools: Liked Songs (with artist genres from the per-user cache), saved albums, followed artists, and
 * saving/removing/checking any library item — tracks, albums, episodes, shows, audiobooks, and following or
 * unfollowing artists, playlists and users.
 */
import { z } from 'zod';
import {
  DESTRUCTIVE_HINTS,
  ORGANIZE_HINTS,
  READ_ONLY_HINTS,
  toolAnnotations,
} from '../../../src/mcp/annotations.js';
import { defineTool } from '../../../src/mcp/tools.js';
import { asJsonObject } from '../../../src/remote/streamed-tool.js';
import {
  addedTrackOutput,
  catalogItemOutput,
  parseAddedTrack,
  type AddedTrack,
} from './catalog.js';
import { saveBackup, uriBackupTracks } from './backups.js';
import type { OwnerDeps } from './context.js';
import { ensureGenres } from './genres.js';
import { LIBRARY_BATCH, libraryContains, writeLibraryChunk } from './library-write.js';
import { cursorAfter, nextPageOffset, readPagingObject } from './paging.js';
import { artistIdsOf, trackGenres } from './rules.js';
import { spotifyCall } from './spotify-api.js';
import { LIBRARY_URI, PAGE_LIMIT, PAGE_OFFSET } from './tool-kit.js';

/** URIs of one direct library call (larger sets go through `preview_library_change`). */
const DIRECT_URIS = z.array(LIBRARY_URI).min(1).max(LIBRARY_BATCH);

/** Liked tracks of a page with their artists' genres (genres fetched within the budget). */
export async function withGenres(
  deps: OwnerDeps,
  tracks: readonly AddedTrack[],
): Promise<{ items: Record<string, unknown>[]; genresMissing: number }> {
  const { genres, missing } = await ensureGenres(deps, artistIdsOf(tracks));
  const items = tracks.map((t) => ({
    ...addedTrackOutput(t),
    genres: [...new Set(trackGenres(t, genres))],
  }));
  return { items, genresMissing: missing };
}

/** `list_liked_tracks`: one page of Liked Songs. */
export const listLikedTracksTool = defineTool({
  name: 'list_liked_tracks',
  description:
    "Lists Liked Songs, newest first: name, artists, album, release year, date liked and (with with_genres) the artists' genres from a per-user cache. Up to 50 per page; use next_offset. For whole-library work prefer the preview_* tools.",
  shape: { offset: PAGE_OFFSET, limit: PAGE_LIMIT, with_genres: z.boolean().default(false) },
  annotations: toolAnnotations('List liked songs', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const query = { offset: args.offset, limit: args.limit, market: 'from_token' };
    const page = readPagingObject(await spotifyCall(deps, { path: '/me/tracks', query }));
    const tracks = page.items.map(parseAddedTrack).filter((t): t is AddedTrack => t !== null);
    const next = nextPageOffset(args.offset, page.items.length, page.total);
    const base = { total: page.total, offset: args.offset, next_offset: next };
    if (!args.with_genres) return { ...base, items: tracks.map(addedTrackOutput) };
    const { items, genresMissing } = await withGenres(deps, tracks);
    return {
      ...base,
      items,
      ...(genresMissing > 0 ? { genres_pending_artists: genresMissing } : {}),
    };
  },
});

/** `list_saved_albums`: saved albums. */
export const listSavedAlbumsTool = defineTool({
  name: 'list_saved_albums',
  description: 'Lists the albums saved in the library, newest first (up to 50 per page).',
  shape: { offset: PAGE_OFFSET, limit: PAGE_LIMIT },
  annotations: toolAnnotations('List saved albums', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const query = { offset: args.offset, limit: args.limit };
    const page = readPagingObject(await spotifyCall(deps, { path: '/me/albums', query }));
    const items = page.items.map((entry) => {
      const item = asJsonObject(entry) ?? {};
      return { ...catalogItemOutput(item.album), added_at: item.added_at };
    });
    return { total: page.total, offset: args.offset, items };
  },
});

/** `list_followed_artists`: followed artists (cursor pages). */
export const listFollowedArtistsTool = defineTool({
  name: 'list_followed_artists',
  description:
    'Lists followed artists (up to 50 per page). Pass after from the previous page to continue.',
  shape: {
    limit: PAGE_LIMIT,
    after: z
      .string()
      .regex(/^[A-Za-z0-9]+$/)
      .optional(),
  },
  annotations: toolAnnotations('List followed artists', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const query = {
      type: 'artist',
      limit: args.limit,
      ...(args.after ? { after: args.after } : {}),
    };
    const body = await spotifyCall(deps, { path: '/me/following', query });
    const page = readPagingObject(body, 'artists');
    const items = page.items.map(catalogItemOutput).filter((item) => item !== null);
    return { total: page.total, items, after: cursorAfter(body, 'artists') };
  },
});

/** `save_to_library`: like/save or follow up to 40 items. */
export const saveToLibraryTool = defineTool({
  name: 'save_to_library',
  description:
    'Saves up to 40 items to the library by URI: tracks (Like), albums, episodes, shows and audiobooks; with spotify:artist:, spotify:playlist: or spotify:user: URIs it FOLLOWS them. For more items use preview_library_change.',
  shape: { uris: DIRECT_URIS },
  annotations: toolAnnotations('Save or follow', ORGANIZE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    await writeLibraryChunk(deps, 'save', args.uris);
    return { saved: args.uris.length };
  },
});

/** `remove_from_library`: unlike/remove or unfollow up to 40 items. */
export const removeFromLibraryTool = defineTool({
  name: 'remove_from_library',
  description:
    'Removes up to 40 items from the library by URI (unlike tracks, remove albums/shows/episodes/audiobooks); with artist, playlist or user URIs it UNFOLLOWS them (unfollowing your own playlist deletes it from your library; following it again restores it). Confirm with the user first. The removed URIs are backed up (backup_id; preview_restore re-saves them). For more items use preview_library_change.',
  shape: { uris: DIRECT_URIS },
  annotations: toolAnnotations('Remove or unfollow', DESTRUCTIVE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const backup = await saveBackup(deps, {
      label: 'Removed with remove_from_library',
      library: uriBackupTracks(args.uris),
    });
    await writeLibraryChunk(deps, 'remove', args.uris);
    return { removed: args.uris.length, backup_id: backup.id };
  },
});

/** `check_library`: which items are saved or followed. */
export const checkLibraryTool = defineTool({
  name: 'check_library',
  description: 'Checks which of up to 40 URIs are in the library (saved, liked or followed).',
  shape: { uris: DIRECT_URIS },
  annotations: toolAnnotations('Check library', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const flags = await libraryContains(deps, args.uris);
    return { items: args.uris.map((uri, i) => ({ uri, in_library: flags[i] === true })) };
  },
});
