/**
 * Catalog and listening tools: search, artist details (with genres and latest releases), what is playing, the
 * listening history and the user's top artists and tracks.
 */
import { z } from 'zod';
import { READ_ONLY_HINTS, toolAnnotations } from '../../../src/mcp/annotations.js';
import { defineTool } from '../../../src/mcp/tools.js';
import { asJsonObject } from '../../../src/remote/streamed-tool.js';
import { addedTrackOutput, catalogItemOutput, parseTrack, trackOutput } from './catalog.js';
import type { OwnerDeps } from './context.js';
import { readPagingObject } from './paging.js';
import { paths } from './paths.js';
import { spotifyCall } from './spotify-api.js';
import { PAGE_LIMIT, PAGE_OFFSET, spotifyIdOf } from './tool-kit.js';

/** Types `/search` accepts. */
export const SEARCH_TYPES = [
  'track',
  'artist',
  'album',
  'playlist',
  'show',
  'episode',
  'audiobook',
] as const;

/** Most results per type `/search` returns since 2026. */
export const SEARCH_MAX_LIMIT = 10;

/** Compact results of a search body, grouped by type. */
export function searchOutput(body: unknown, types: readonly string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const type of types) {
    const page = readPagingObject(body, `${type}s`);
    out[`${type}s`] = {
      total: page.total,
      items: page.items.map(catalogItemOutput).filter((item) => item !== null),
    };
  }
  return out;
}

/** `search`: the Spotify catalog. */
export const spotifySearchTool = defineTool({
  name: 'search',
  description:
    'Searches the Spotify catalog for tracks, artists, albums, playlists, podcasts (show/episode) and audiobooks. Supports Spotify filters in the query, e.g. artist:"Chris Cornell" year:1990-1999 genre:techno. Spotify returns at most 10 results per type per page; use offset for more.',
  shape: {
    query: z.string().min(1).max(250),
    types: z.array(z.enum(SEARCH_TYPES)).min(1).max(7).default(['track']),
    limit: z.number().int().min(1).max(SEARCH_MAX_LIMIT).default(SEARCH_MAX_LIMIT),
    offset: z.number().int().min(0).max(1000).default(0),
  },
  annotations: toolAnnotations('Search Spotify', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const query = {
      q: args.query,
      type: args.types.join(','),
      limit: args.limit,
      offset: args.offset,
      market: 'from_token',
    };
    return searchOutput(await spotifyCall(deps, { path: '/search', query }), args.types);
  },
});

/** Latest releases of an artist (albums and singles); empty when Spotify refuses the listing. */
export async function artistReleases(deps: OwnerDeps, artistId: string): Promise<unknown[]> {
  try {
    const query = { include_groups: 'album,single', limit: 10 };
    const body = await spotifyCall(deps, { path: `${paths.artist(artistId)}/albums`, query });
    return readPagingObject(body)
      .items.map(catalogItemOutput)
      .filter((item) => item !== null);
  } catch {
    return [];
  }
}

/** `get_artist`: an artist with genres and, optionally, the latest releases. */
export const getArtistTool = defineTool({
  name: 'get_artist',
  description:
    'Gets an artist by id, URI or link: name, Spotify genres (may be empty: Spotify deprecated genres) and, with include_releases, the latest albums and singles.',
  shape: {
    artist: z.string().min(1).max(300),
    include_releases: z.boolean().default(false),
  },
  annotations: toolAnnotations('Get artist', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const id = spotifyIdOf(args.artist, 'artist');
    const artist = catalogItemOutput(await spotifyCall(deps, { path: paths.artist(id) }));
    if (!args.include_releases) return artist;
    return { ...artist, latest_releases: await artistReleases(deps, id) };
  },
});

/** Compact JSON of `/me/player/currently-playing` (null body = nothing playing). */
export function nowPlayingOutput(body: unknown): Record<string, unknown> {
  const state = asJsonObject(body);
  if (!state) return { playing: false, note: 'Nothing is playing right now.' };
  const track = parseTrack(state.item);
  return {
    playing: state.is_playing === true,
    progress_ms: typeof state.progress_ms === 'number' ? state.progress_ms : null,
    item: track ? trackOutput(track) : null,
    context: asJsonObject(state.context)?.uri ?? null,
  };
}

/** `currently_playing`: the track or episode playing now. */
export const currentlyPlayingTool = defineTool({
  name: 'currently_playing',
  description:
    "Shows the track or episode playing now on the user's Spotify, with progress and context (album/playlist).",
  shape: {},
  annotations: toolAnnotations('Currently playing', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps) => {
    const query = { market: 'from_token', additional_types: 'track,episode' };
    return nowPlayingOutput(
      await spotifyCall(deps, { path: '/me/player/currently-playing', query }),
    );
  },
});

/** `recently_played`: the listening history. */
export const recentlyPlayedTool = defineTool({
  name: 'recently_played',
  description:
    'Lists recently played tracks (newest first, up to 50 per call). Pass before (an ISO instant) to go further back. Spotify keeps only a limited recent history.',
  shape: { limit: PAGE_LIMIT, before: z.string().datetime().optional() },
  annotations: toolAnnotations('Recently played', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const before = args.before === undefined ? {} : { before: Date.parse(args.before) };
    const body = await spotifyCall(deps, {
      path: '/me/player/recently-played',
      query: { limit: args.limit, ...before },
    });
    const items = readPagingObject(body).items.map((entry) => {
      const item = asJsonObject(entry) ?? {};
      const track = parseTrack(item.track);
      return track
        ? addedTrackOutput({
            ...track,
            addedAt: typeof item.played_at === 'string' ? item.played_at : '',
          })
        : null;
    });
    return { items: items.filter((item) => item !== null) };
  },
});

/** `top_items`: the user's top artists or tracks. */
export const topItemsTool = defineTool({
  name: 'top_items',
  description:
    "The user's top artists or tracks: short_term ≈ last 4 weeks, medium_term ≈ 6 months, long_term ≈ 1 year.",
  shape: {
    type: z.enum(['artists', 'tracks']),
    time_range: z.enum(['short_term', 'medium_term', 'long_term']).default('medium_term'),
    limit: PAGE_LIMIT,
    offset: PAGE_OFFSET,
  },
  annotations: toolAnnotations('Top artists and tracks', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const query = { time_range: args.time_range, limit: args.limit, offset: args.offset };
    const page = readPagingObject(await spotifyCall(deps, { path: `/me/top/${args.type}`, query }));
    return {
      total: page.total,
      items: page.items.map(catalogItemOutput).filter((item) => item !== null),
    };
  },
});
