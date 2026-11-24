/**
 * Playlist tools: list yours, read one, create (also from search queries, since the Web API has no AI playlist
 * generation), change details, add/remove/reorder items and set the cover image. Spotify lets apps read and edit
 * items only of playlists the user owns or collaborates on.
 */
import { z } from 'zod';
import {
  CREATE_HINTS,
  DESTRUCTIVE_HINTS,
  ORGANIZE_HINTS,
  READ_ONLY_HINTS,
  toolAnnotations,
} from '../../../src/mcp/annotations.js';
import { defineTool } from '../../../src/mcp/tools.js';
import { addPlaylistUris, createUserPlaylist } from './apply.js';
import {
  addedTrackOutput,
  parseAddedTrack,
  parsePlaylist,
  parseTrack,
  playlistOutput,
  trackOutput,
  type AddedTrack,
  type PlaylistInfo,
  type TrackInfo,
} from './catalog.js';
import { saveBackup, uriBackupTracks } from './backups.js';
import type { OwnerDeps } from './context.js';
import { PLAYLIST_BATCH } from './library-write.js';
import { nextPageOffset, readPagingObject } from './paging.js';
import { paths } from './paths.js';
import { spotifyCall } from './spotify-api.js';
import { fetchPlaylistInfo } from './sources.js';
import {
  currentUserId,
  PAGE_LIMIT,
  PAGE_OFFSET,
  PLAYABLE_URI,
  PLAYLIST_REF,
  spotifyIdOf,
} from './tool-kit.js';

/** Largest cover image Spotify accepts (base64 JPEG payload, bytes). */
export const MAX_COVER_BASE64_BYTES = 256 * 1024;

/** Most search queries `create_playlist_from_queries` runs. */
export const MAX_PLAYLIST_QUERIES = 25;

/** Playlist fields shared by create and update. */
const DETAILS_SHAPE = {
  description: z.string().max(300).optional(),
  public: z.boolean().optional(),
  collaborative: z.boolean().optional().describe('Collaborative playlists must be private.'),
} as const;

/** `list_my_playlists`: the user's playlists (own and followed). */
export const listMyPlaylistsTool = defineTool({
  name: 'list_my_playlists',
  description:
    "Lists the playlists in the user's library (own and followed), 50 per page at most, with mine: true for their own. Only own or collaborative playlists can have their items read or edited.",
  shape: { offset: PAGE_OFFSET, limit: PAGE_LIMIT, only_mine: z.boolean().default(false) },
  annotations: toolAnnotations('List my playlists', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const userId = await currentUserId(deps);
    const body = await spotifyCall(deps, {
      path: '/me/playlists',
      query: { offset: args.offset, limit: args.limit },
    });
    const page = readPagingObject(body);
    const all = page.items.map(parsePlaylist).filter((p): p is PlaylistInfo => p !== null);
    const shown = args.only_mine ? all.filter((p) => p.ownerId === userId) : all;
    const next = nextPageOffset(args.offset, page.items.length, page.total);
    return {
      total: page.total,
      next_offset: next,
      items: shown.map((p) => playlistOutput(p, userId)),
    };
  },
});

/** One page of a playlist's items as tool output. */
export async function playlistItemsPage(
  deps: OwnerDeps,
  id: string,
  page: { readonly offset: number; readonly limit: number },
): Promise<Record<string, unknown>> {
  const query = { ...page, market: 'from_token', additional_types: 'track,episode' };
  const body = readPagingObject(await spotifyCall(deps, { path: paths.playlistItems(id), query }));
  const tracks = body.items.map(parseAddedTrack).filter((t): t is AddedTrack => t !== null);
  const next = nextPageOffset(page.offset, body.items.length, body.total);
  return { offset: page.offset, next_offset: next, tracks: tracks.map(addedTrackOutput) };
}

/** `get_playlist`: details and one page of items. */
export const getPlaylistTool = defineTool({
  name: 'get_playlist',
  description:
    "Gets a playlist's details and one page of its items (up to 50; use next_offset). Items are only available for playlists you own or collaborate on; for others Spotify returns details only.",
  shape: { playlist_id: PLAYLIST_REF, offset: PAGE_OFFSET, limit: PAGE_LIMIT },
  annotations: toolAnnotations('Get playlist', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const id = spotifyIdOf(args.playlist_id, 'playlist');
    const info = await fetchPlaylistInfo(deps, id);
    const details = playlistOutput(info, await currentUserId(deps));
    if (details.mine !== true && !info.collaborative) {
      return {
        ...details,
        note: 'Spotify only shares the items of playlists you own or collaborate on.',
      };
    }
    return { ...details, ...(await playlistItemsPage(deps, id, args)) };
  },
});

/** Playlist details args of `playlistDetailsBody`. */
export interface PlaylistDetailsArgs {
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly public?: boolean | undefined;
  readonly collaborative?: boolean | undefined;
}

/** Applies the collaborative rule: collaborative playlists are private. */
export function playlistDetailsBody(args: PlaylistDetailsArgs): Record<string, unknown> {
  if (args.collaborative === true && args.public === true) {
    throw new Error(
      'A collaborative playlist must be private: pass public: false (or omit public).',
    );
  }
  const body: Record<string, unknown> = {};
  if (args.name !== undefined) body.name = args.name;
  if (args.description !== undefined) body.description = args.description;
  if (args.collaborative === true) body.public = false;
  else if (args.public !== undefined) body.public = args.public;
  if (args.collaborative !== undefined) body.collaborative = args.collaborative;
  return body;
}

/** `create_playlist`: a new playlist, optionally with items. */
export const createPlaylistTool = defineTool({
  name: 'create_playlist',
  description:
    'Creates a new playlist for the user, optionally with up to 100 track/episode URIs. To build a playlist from a description, search first (or use create_playlist_from_queries).',
  shape: {
    name: z.string().min(1).max(100),
    ...DETAILS_SHAPE,
    uris: z.array(PLAYABLE_URI).max(PLAYLIST_BATCH).default([]),
  },
  annotations: toolAnnotations('Create playlist', CREATE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const details = {
      name: args.name,
      description: args.description ?? '',
      isPublic: args.public ?? false,
    };
    const id = await createUserPlaylist(deps, details);
    if (args.collaborative === true) {
      await spotifyCall(deps, {
        method: 'PUT',
        path: paths.playlist(id),
        body: playlistDetailsBody(args),
      });
    }
    if (args.uris.length > 0) await addPlaylistUris(deps, id, args.uris);
    return { playlist_id: id, uri: `spotify:playlist:${id}`, added: args.uris.length };
  },
});

/** Runs each query with `limit=1` and returns the first track found (null when none), within the budget. */
export async function firstTrackPerQuery(
  deps: OwnerDeps,
  queries: readonly string[],
): Promise<ReturnType<typeof parseTrack>[]> {
  const found: (TrackInfo | null)[] = [];
  for (const q of queries) {
    const body = await spotifyCall(deps, {
      path: '/search',
      query: { q, type: 'track', limit: 1, market: 'from_token' },
    });
    found.push(parseTrack(readPagingObject(body, 'tracks').items[0]));
  }
  return found;
}

/** `create_playlist_from_queries`: builds a playlist from search queries (one track per query). */
export const createPlaylistFromQueriesTool = defineTool({
  name: 'create_playlist_from_queries',
  description:
    'Builds a playlist from a description: YOU turn the description into up to 25 precise search queries (e.g. "track:Black Hole Sun artist:Soundgarden"), this tool takes the top track of each, creates the playlist and reports what was not found.',
  shape: {
    name: z.string().min(1).max(100),
    ...DETAILS_SHAPE,
    queries: z.array(z.string().min(1).max(250)).min(1).max(MAX_PLAYLIST_QUERIES),
  },
  annotations: toolAnnotations('Create playlist from searches', CREATE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const found = await firstTrackPerQuery(deps, args.queries);
    const tracks = found.filter((t): t is TrackInfo => t !== null);
    const details = {
      name: args.name,
      description: args.description ?? '',
      isPublic: args.public ?? false,
    };
    const id = await createUserPlaylist(deps, details);
    const uris = [...new Set(tracks.map((t) => t.uri))];
    if (uris.length > 0) await addPlaylistUris(deps, id, uris);
    const notFound = args.queries.filter((_, i) => found[i] === null);
    return { playlist_id: id, added: tracks.map(trackOutput), not_found: notFound };
  },
});

/** `update_playlist_details`: rename, describe, make public/private or collaborative. */
export const updatePlaylistDetailsTool = defineTool({
  name: 'update_playlist_details',
  description: 'Changes a playlist you own: name, description, public/private and collaborative.',
  shape: {
    playlist_id: PLAYLIST_REF,
    name: z.string().min(1).max(100).optional(),
    ...DETAILS_SHAPE,
  },
  annotations: toolAnnotations('Update playlist details', ORGANIZE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const body = playlistDetailsBody(args);
    if (Object.keys(body).length === 0)
      throw new Error('Pass at least one of name, description, public or collaborative.');
    const id = spotifyIdOf(args.playlist_id, 'playlist');
    await spotifyCall(deps, { method: 'PUT', path: paths.playlist(id), body });
    return { playlist_id: id, updated: Object.keys(body) };
  },
});

/** `add_playlist_items`: adds up to 100 items. */
export const addPlaylistItemsTool = defineTool({
  name: 'add_playlist_items',
  description:
    'Adds up to 100 track/episode URIs to a playlist you own or collaborate on, at the end or at position (0 = top).',
  shape: {
    playlist_id: PLAYLIST_REF,
    uris: z.array(PLAYABLE_URI).min(1).max(PLAYLIST_BATCH),
    position: z.number().int().min(0).optional(),
  },
  annotations: toolAnnotations('Add to playlist', CREATE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const id = spotifyIdOf(args.playlist_id, 'playlist');
    const body = {
      uris: args.uris,
      ...(args.position === undefined ? {} : { position: args.position }),
    };
    await spotifyCall(deps, { method: 'POST', path: paths.playlistItems(id), body });
    return { playlist_id: id, added: args.uris.length };
  },
});

/** `remove_playlist_items`: removes up to 100 items (every occurrence of each URI). */
export const removePlaylistItemsTool = defineTool({
  name: 'remove_playlist_items',
  description:
    'Removes up to 100 URIs from a playlist you own (every occurrence of each). Confirm with the user first. The removed URIs are backed up (backup_id; preview_restore recreates them as a new playlist). To remove only duplicate copies or many items, use preview_dedupe or preview_filter_liked-style previews, which back up first.',
  shape: { playlist_id: PLAYLIST_REF, uris: z.array(PLAYABLE_URI).min(1).max(PLAYLIST_BATCH) },
  annotations: toolAnnotations('Remove from playlist', DESTRUCTIVE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const id = spotifyIdOf(args.playlist_id, 'playlist');
    const tracks = uriBackupTracks(args.uris);
    const playlist = {
      id,
      name: `Removed from playlist ${id}`,
      description: '',
      isPublic: null,
      tracks,
    };
    const backup = await saveBackup(deps, {
      label: `Removed from playlist ${id}`,
      playlists: [playlist],
    });
    const body = { items: args.uris.map((uri) => ({ uri })) };
    await spotifyCall(deps, { method: 'DELETE', path: paths.playlistItems(id), body });
    return { playlist_id: id, removed: args.uris.length, backup_id: backup.id };
  },
});

/** `reorder_playlist_items`: moves a block of items. */
export const reorderPlaylistItemsTool = defineTool({
  name: 'reorder_playlist_items',
  description:
    'Moves range_length items starting at range_start (0-based) to before position insert_before, in a playlist you own. For full sorting use preview_organize_playlists.',
  shape: {
    playlist_id: PLAYLIST_REF,
    range_start: z.number().int().min(0),
    insert_before: z.number().int().min(0),
    range_length: z.number().int().min(1).max(10_000).default(1),
  },
  annotations: toolAnnotations('Reorder playlist', ORGANIZE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const id = spotifyIdOf(args.playlist_id, 'playlist');
    const body = {
      range_start: args.range_start,
      insert_before: args.insert_before,
      range_length: args.range_length,
    };
    await spotifyCall(deps, { method: 'PUT', path: paths.playlistItems(id), body });
    return { playlist_id: id, moved: args.range_length };
  },
});

/** Validates a base64 JPEG cover (size and JPEG signature); returns the cleaned base64. */
export function checkCoverImage(base64: string): string {
  const clean = base64.replace(/^data:image\/jpeg;base64,/, '').replace(/\s+/g, '');
  if (clean.length > MAX_COVER_BASE64_BYTES)
    throw new Error('The cover must be at most 256 KB of base64 JPEG.');
  const head = Buffer.from(clean.slice(0, 8), 'base64');
  if (head[0] !== 0xff || head[1] !== 0xd8)
    throw new Error('The cover must be a JPEG image (base64).');
  return clean;
}

/** `set_playlist_cover`: uploads a JPEG cover. */
export const setPlaylistCoverTool = defineTool({
  name: 'set_playlist_cover',
  description:
    'Replaces the cover image of a playlist you own with a JPEG (base64, at most 256 KB).',
  shape: {
    playlist_id: PLAYLIST_REF,
    image_base64: z
      .string()
      .min(8)
      .max(MAX_COVER_BASE64_BYTES + 64),
  },
  annotations: toolAnnotations('Set playlist cover', DESTRUCTIVE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const id = spotifyIdOf(args.playlist_id, 'playlist');
    await spotifyCall(deps, {
      method: 'PUT',
      path: paths.playlistImages(id),
      jpeg: checkCoverImage(args.image_base64),
    });
    return { playlist_id: id, cover: 'updated (Spotify may take a moment to show it)' };
  },
});
