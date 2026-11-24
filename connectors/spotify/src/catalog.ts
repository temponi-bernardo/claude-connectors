/**
 * Parsing of Spotify catalog objects (tracks, episodes, artists, albums, playlists) into compact domain types and
 * into the small JSON the tools return. Pure. Text from Spotify (names, descriptions) is third-party data.
 */
import { asJsonObject } from '../../../src/remote/streamed-tool.js';

/** An artist reference inside a track or album. */
export interface ArtistRef {
  readonly id: string;
  readonly name: string;
}

/** A playable item (track or podcast episode) as the tools use it. */
export interface TrackInfo {
  readonly uri: string;
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly artists: readonly ArtistRef[];
  readonly album: string;
  readonly releaseDate: string;
  readonly durationMs: number;
  /** `false` when Spotify says it cannot be played in the user's market (needs `market=from_token`). */
  readonly isPlayable: boolean | null;
  readonly isrc: string | null;
  readonly isLocal: boolean;
}

/** A track with the instant it was added (to Liked Songs or to a playlist). */
export interface AddedTrack extends TrackInfo {
  readonly addedAt: string;
}

/** A playlist summary. */
export interface PlaylistInfo {
  readonly id: string;
  readonly uri: string;
  readonly name: string;
  readonly description: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly isPublic: boolean | null;
  readonly collaborative: boolean;
  readonly total: number;
  readonly snapshotId: string;
}

/** Text field of an object, or the fallback. */
export function textField(
  item: Readonly<Record<string, unknown>>,
  name: string,
  fallback = '',
): string {
  const value = item[name];
  return typeof value === 'string' ? value : fallback;
}

/** The artists of a track or album (id and name). */
export function parseArtistRefs(value: unknown): ArtistRef[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(asJsonObject)
    .filter((a): a is Record<string, unknown> => a !== null)
    .map((a) => ({ id: textField(a, 'id'), name: textField(a, 'name') }));
}

/** Result of `trackAlbum`. */
export interface AlbumAndDate {
  album: string;
  date: string;
}

/** Album name and release date of a track (episodes use the show name and their own date). */
export function trackAlbum(item: Readonly<Record<string, unknown>>): AlbumAndDate {
  const album = asJsonObject(item.album);
  if (album) return { album: textField(album, 'name'), date: textField(album, 'release_date') };
  const show = asJsonObject(item.show);
  return { album: show ? textField(show, 'name') : '', date: textField(item, 'release_date') };
}

/** Parses a track or episode; null for anything without a URI (removed items, null entries). */
export function parseTrack(value: unknown): TrackInfo | null {
  const item = asJsonObject(value);
  if (!item || typeof item.uri !== 'string') return null;
  const { album, date } = trackAlbum(item);
  const ids = asJsonObject(item.external_ids);
  return {
    uri: item.uri,
    id: textField(item, 'id'),
    name: textField(item, 'name'),
    type: textField(item, 'type', 'track'),
    artists: parseArtistRefs(item.artists),
    album,
    releaseDate: date,
    durationMs: typeof item.duration_ms === 'number' ? item.duration_ms : 0,
    isPlayable: typeof item.is_playable === 'boolean' ? item.is_playable : null,
    isrc: ids && typeof ids.isrc === 'string' ? ids.isrc : null,
    isLocal: item.is_local === true || item.uri.startsWith('spotify:local:'),
  };
}

/** Parses a saved or playlist entry (`{added_at, item|track}`); null when its item is gone. */
export function parseAddedTrack(value: unknown): AddedTrack | null {
  const entry = asJsonObject(value);
  if (!entry) return null;
  const track = parseTrack(entry.item ?? entry.track);
  if (!track) return null;
  return {
    ...track,
    addedAt: textField(entry, 'added_at'),
    isLocal: track.isLocal || entry.is_local === true,
  };
}

/** Total of a playlist's items (`items.total`, or the deprecated `tracks.total`). */
export function playlistTotal(item: Readonly<Record<string, unknown>>): number {
  const items = asJsonObject(item.items) ?? asJsonObject(item.tracks);
  return items && typeof items.total === 'number' ? items.total : 0;
}

/** Parses a playlist object; null without an id. */
export function parsePlaylist(value: unknown): PlaylistInfo | null {
  const item = asJsonObject(value);
  if (!item || typeof item.id !== 'string') return null;
  const owner = asJsonObject(item.owner) ?? {};
  return {
    id: item.id,
    uri: textField(item, 'uri', `spotify:playlist:${item.id}`),
    name: textField(item, 'name'),
    description: textField(item, 'description'),
    ownerId: textField(owner, 'id'),
    ownerName: textField(owner, 'display_name'),
    isPublic: typeof item.public === 'boolean' ? item.public : null,
    collaborative: item.collaborative === true,
    total: playlistTotal(item),
    snapshotId: textField(item, 'snapshot_id'),
  };
}

/** Release year of a Spotify date (`YYYY`, `YYYY-MM` or `YYYY-MM-DD`), or null. */
export function releaseYear(date: string): number | null {
  const year = Number(date.slice(0, 4));
  return /^\d{4}/.test(date) && year > 0 ? year : null;
}

/** Compact JSON of a track for tool results. */
export function trackOutput(track: TrackInfo): Record<string, unknown> {
  return {
    uri: track.uri,
    name: track.name,
    artists: track.artists.map((a) => a.name).join(', '),
    album: track.album,
    year: releaseYear(track.releaseDate),
    ...(track.isPlayable === false ? { playable: false } : {}),
    ...(track.isLocal ? { local: true } : {}),
  };
}

/** Compact JSON of an added track (with the date it was added). */
export function addedTrackOutput(track: AddedTrack): Record<string, unknown> {
  return { ...trackOutput(track), added_at: track.addedAt };
}

/** Compact JSON of a playlist for tool results, saying whether the user owns it. */
export function playlistOutput(playlist: PlaylistInfo, userId: string): Record<string, unknown> {
  return {
    id: playlist.id,
    name: playlist.name,
    owner: playlist.ownerName || playlist.ownerId,
    mine: playlist.ownerId === userId,
    public: playlist.isPublic,
    collaborative: playlist.collaborative,
    items: playlist.total,
    ...(playlist.description ? { description: playlist.description } : {}),
  };
}

/** Optional descriptive fields of a non-track catalog object (owner, publisher, release date, genres). */
export function catalogExtras(item: Readonly<Record<string, unknown>>): Record<string, unknown> {
  const owner = asJsonObject(item.owner);
  const extras: Record<string, unknown> = {};
  if (owner) extras.owner = textField(owner, 'display_name', textField(owner, 'id'));
  if (typeof item.publisher === 'string') extras.publisher = item.publisher;
  if (typeof item.release_date === 'string') extras.released = item.release_date;
  if (Array.isArray(item.genres) && item.genres.length > 0) extras.genres = item.genres;
  return extras;
}

/** Compact JSON of any catalog object found by search (artist, album, show, audiobook...). */
export function catalogItemOutput(value: unknown): Record<string, unknown> | null {
  const item = asJsonObject(value);
  if (!item || typeof item.uri !== 'string') return null;
  const track = item.type === 'track' || item.type === 'episode' ? parseTrack(item) : null;
  if (track) return trackOutput(track);
  const by = parseArtistRefs(item.artists ?? item.authors).map((a) => a.name);
  return {
    uri: item.uri,
    name: textField(item, 'name'),
    ...(by.length > 0 ? { by: by.join(', ') } : {}),
    ...catalogExtras(item),
  };
}
