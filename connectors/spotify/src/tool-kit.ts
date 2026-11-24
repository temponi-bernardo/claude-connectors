/**
 * Shared pieces of the Spotify tools: input schemas (ids, URIs, pages, filters, sources), id parsing and the
 * current user's Spotify id. Schemas validate everything the model sends before it reaches a URL or a body.
 */
import { z } from 'zod';
import { requireAccount } from './access-token.js';
import type { OwnerDeps } from './context.js';
import { SPOTIFY_URI_PATTERN } from './library-write.js';
import type { TrackFilter } from './rules.js';
import type { SourceRef } from './sources.js';

/** A library URI (track, album, episode, show, audiobook, playlist, artist or user). */
export const LIBRARY_URI = z
  .string()
  .regex(
    SPOTIFY_URI_PATTERN,
    'Expected a Spotify URI such as spotify:track:4uLU6hMCjMI75M1A2tKUQC.',
  );

/** A URI that can be queued or added to a playlist (track or episode). */
export const PLAYABLE_URI = z
  .string()
  .regex(
    /^spotify:(track|episode):[A-Za-z0-9]+$/,
    'Expected spotify:track:<id> or spotify:episode:<id>.',
  );

/** A playlist reference: id, `spotify:playlist:<id>` or an open.spotify.com link. */
export const PLAYLIST_REF = z
  .string()
  .min(1)
  .max(300)
  .describe('Playlist id, spotify:playlist:<id> URI or open.spotify.com/playlist/<id> link.');

/** Page size (1–50). */
export const PAGE_LIMIT = z.number().int().min(1).max(50).default(20);

/** Page start. */
export const PAGE_OFFSET = z.number().int().min(0).max(100_000).default(0);

/** A calendar date or instant (`YYYY-MM-DD` or ISO 8601). */
export const DATE_TEXT = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}(T[\d:.]+Z?)?$/, 'Use YYYY-MM-DD or an ISO 8601 instant.');

/** Filter fields shared by the smart operations. */
export const FILTER_SHAPE = {
  artists: z
    .array(z.string().min(1).max(200))
    .max(100)
    .optional()
    .describe('Artist names (exact, any case/accents).'),
  genres: z
    .array(z.string().min(1).max(60))
    .max(30)
    .optional()
    .describe(
      'Genre terms matched inside the artists\' Spotify genres ("electronic" matches "electronica"). OR with artists.',
    ),
  year_from: z
    .number()
    .int()
    .min(1900)
    .max(2100)
    .optional()
    .describe('Release year from (inclusive).'),
  year_to: z.number().int().min(1900).max(2100).optional().describe('Release year to (inclusive).'),
  added_after: DATE_TEXT.optional().describe('Added on or after this date.'),
  added_before: DATE_TEXT.optional().describe('Added before this date.'),
  unavailable_only: z
    .boolean()
    .optional()
    .describe('Only tracks Spotify says cannot be played in your country.'),
} as const;

/** Parsed filter arguments. */
export interface FilterArgs {
  readonly artists?: string[] | undefined;
  readonly genres?: string[] | undefined;
  readonly year_from?: number | undefined;
  readonly year_to?: number | undefined;
  readonly added_after?: string | undefined;
  readonly added_before?: string | undefined;
  readonly unavailable_only?: boolean | undefined;
}

/** Filter arguments → domain filter. */
export function toTrackFilter(args: FilterArgs): TrackFilter {
  return {
    artists: args.artists,
    genres: args.genres,
    yearFrom: args.year_from,
    yearTo: args.year_to,
    addedAfter: args.added_after,
    addedBefore: args.added_before,
    unavailableOnly: args.unavailable_only,
  };
}

/** Source fields: Liked Songs or one of your playlists. */
export const SOURCE_SHAPE = {
  source: z.enum(['liked', 'playlist']).default('liked'),
  playlist_id: PLAYLIST_REF.optional().describe('Required when source is "playlist".'),
} as const;

/** Extracts a bare id of the given type from an id, URI or open.spotify.com link; throws when it is not one. */
export function spotifyIdOf(ref: string, type: string): string {
  const text = ref.trim();
  const fromUri = new RegExp(`^spotify:${type}:([A-Za-z0-9]+)$`).exec(text);
  const fromLink = new RegExp(
    `^https://open\\.spotify\\.com/(?:intl-[\\w-]+/)?${type}/([A-Za-z0-9]+)`,
  ).exec(text);
  const id = fromUri?.[1] ?? fromLink?.[1] ?? (/^[A-Za-z0-9]{1,64}$/.test(text) ? text : null);
  if (id === null)
    throw new Error(`"${text.slice(0, 80)}" is not a Spotify ${type} id, URI or link.`);
  return id;
}

/** Source args of `sourceRefOf`. */
export interface SourceArgs {
  readonly source: 'liked' | 'playlist';
  readonly playlist_id?: string | undefined;
}

/** Source arguments → source reference. */
export function sourceRefOf(args: SourceArgs): SourceRef {
  if (args.source === 'liked') return { kind: 'liked' };
  if (!args.playlist_id) throw new Error('Pass playlist_id when source is "playlist".');
  return { kind: 'playlist', id: spotifyIdOf(args.playlist_id, 'playlist') };
}

/** The connected user's Spotify user id (to tell their own playlists apart). */
export async function currentUserId(deps: OwnerDeps): Promise<string> {
  return (await requireAccount(deps)).spotifyUserId;
}
