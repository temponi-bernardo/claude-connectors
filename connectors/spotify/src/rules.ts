/**
 * Pure rules of the smart operations: filters (artist, genre, release year, date added, availability),
 * duplicate detection (same recording or another version of the same song) and grouping/sorting keys.
 */
import { releaseYear, type AddedTrack } from './catalog.js';
import type { GenreMap } from './genres.js';

/** Which tracks match. Lists combine with OR (artist OR genre); the other fields narrow with AND. */
export interface TrackFilter {
  readonly artists?: readonly string[] | undefined;
  readonly genres?: readonly string[] | undefined;
  readonly yearFrom?: number | undefined;
  readonly yearTo?: number | undefined;
  readonly addedAfter?: string | undefined;
  readonly addedBefore?: string | undefined;
  readonly unavailableOnly?: boolean | undefined;
}

/** Lowercase text without accents or extra spaces, for comparisons. */
export function foldText(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Tells whether any of the track's artists is one of the names (exact, ignoring case and accents). */
export function matchesArtist(track: AddedTrack, names: readonly string[]): boolean {
  const wanted = new Set(names.map(foldText));
  return track.artists.some((artist) => wanted.has(foldText(artist.name)));
}

/** Genres of the track's artists, from the cache. */
export function trackGenres(track: AddedTrack, genres: GenreMap): string[] {
  return track.artists.flatMap((artist) => genres[artist.id] ?? []);
}

/** Tells whether a genre of the track contains one of the terms (`electronic` matches `electronica`). */
export function matchesGenre(
  track: AddedTrack,
  terms: readonly string[],
  genres: GenreMap,
): boolean {
  const own = trackGenres(track, genres).map(foldText);
  return terms.map(foldText).some((term) => own.some((genre) => genre.includes(term)));
}

/** Tells whether the artist/genre part of the filter matches (true when it names neither). */
export function matchesWho(track: AddedTrack, filter: TrackFilter, genres: GenreMap): boolean {
  const artists = filter.artists ?? [];
  const terms = filter.genres ?? [];
  if (artists.length === 0 && terms.length === 0) return true;
  return matchesArtist(track, artists) || matchesGenre(track, terms, genres);
}

/** Tells whether the release year is inside the filter's range (unknown years never match a range). */
export function matchesYear(track: AddedTrack, filter: TrackFilter): boolean {
  if (filter.yearFrom === undefined && filter.yearTo === undefined) return true;
  const year = releaseYear(track.releaseDate);
  if (year === null) return false;
  return year >= (filter.yearFrom ?? 0) && year <= (filter.yearTo ?? 9999);
}

/** Tells whether the date added is inside the filter's range (ISO dates compare as text). */
export function matchesAdded(track: AddedTrack, filter: TrackFilter): boolean {
  if (filter.addedAfter !== undefined && track.addedAt < filter.addedAfter) return false;
  return filter.addedBefore === undefined || track.addedAt < filter.addedBefore;
}

/** Tells whether the track matches every part of the filter. */
export function matchesFilter(track: AddedTrack, filter: TrackFilter, genres: GenreMap): boolean {
  if (filter.unavailableOnly === true && track.isPlayable !== false) return false;
  return (
    matchesWho(track, filter, genres) && matchesYear(track, filter) && matchesAdded(track, filter)
  );
}

/** Tells whether the filter needs artist genres. */
export function needsGenres(filter: TrackFilter): boolean {
  return (filter.genres ?? []).length > 0;
}

/** Version tags that do not make a different song (remasters, mono/stereo, editions, edits). */
const VERSION_TAG =
  /\b(remaster(ed)?|\d{4} (mix|version)|mono|stereo|deluxe|edition|anniversary|single version|album version|radio edit|explicit|clean|bonus track|feat\.?|ft\.?|with)\b/;

/** Title without version tags in brackets or after " - ", folded. */
export function songTitleKey(title: string): string {
  const folded = foldText(title);
  const noBrackets = folded.replace(/[([][^)\]]*[)\]]/g, (part) =>
    VERSION_TAG.test(part) ? '' : part,
  );
  const dash = noBrackets.indexOf(' - ');
  const base =
    dash >= 0 && VERSION_TAG.test(noBrackets.slice(dash)) ? noBrackets.slice(0, dash) : noBrackets;
  return base.replace(/\s+/g, ' ').trim();
}

/** Key that two versions of the same song share: first artist and the title without version tags. */
export function songKey(track: AddedTrack): string {
  return `${foldText(track.artists[0]?.name ?? '')}|${songTitleKey(track.name)}`;
}

/** Orders copies by preference: playable first, then the one added earliest (or first in the playlist). */
export function preferredCopy(a: AddedTrack, b: AddedTrack): number {
  const playable = Number(b.isPlayable !== false) - Number(a.isPlayable !== false);
  return playable !== 0 ? playable : a.addedAt.localeCompare(b.addedAt);
}

/** Result of `findDuplicates`. */
export interface DuplicateSplit {
  keep: AddedTrack[];
  extra: AddedTrack[];
}

/** Splits tracks into the copy to keep and the duplicates (same URI, or another version of the same song). */
export function findDuplicates(tracks: readonly AddedTrack[]): DuplicateSplit {
  const groups = new Map<string, AddedTrack[]>();
  for (const track of tracks) {
    const key = track.isLocal ? `local|${track.uri}` : songKey(track);
    groups.set(key, [...(groups.get(key) ?? []), track]);
  }
  const keep = new Set([...groups.values()].map((group) => [...group].sort(preferredCopy)[0]));
  return {
    keep: tracks.filter((t) => keep.has(t)),
    extra: tracks.filter((t) => !keep.has(t)),
  };
}

/** Ways to group or sort tracks. */
export type TrackKey = 'artist' | 'genre' | 'decade' | 'year' | 'added' | 'name' | 'album';

/** Value of a track for grouping or sorting (`genre` = first genre of its artists, or "unknown"). */
export function trackKeyValue(track: AddedTrack, key: TrackKey, genres: GenreMap): string {
  const year = releaseYear(track.releaseDate);
  const values: Record<TrackKey, () => string> = {
    artist: () => track.artists[0]?.name ?? 'Unknown artist',
    genre: () => trackGenres(track, genres)[0] ?? 'unknown genre',
    decade: () => (year === null ? 'unknown decade' : `${Math.floor(year / 10) * 10}s`),
    year: () => (year === null ? '0000' : String(year)),
    added: () => track.addedAt,
    name: () => track.name,
    album: () => track.album,
  };
  return values[key]();
}

/** Sorts tracks by a key (stable; ties keep their order). */
export function sortTracks(
  tracks: readonly AddedTrack[],
  by: { readonly key: TrackKey; readonly descending: boolean; readonly genres: GenreMap },
): AddedTrack[] {
  const sign = by.descending ? -1 : 1;
  const keyed = tracks.map((track) => ({
    track,
    value: foldText(trackKeyValue(track, by.key, by.genres)),
  }));
  return keyed.sort((a, b) => sign * a.value.localeCompare(b.value)).map((entry) => entry.track);
}

/** Groups tracks by a key, largest groups first. */
export function groupTracks(
  tracks: readonly AddedTrack[],
  key: TrackKey,
  genres: GenreMap,
): { name: string; tracks: AddedTrack[] }[] {
  const groups = new Map<string, AddedTrack[]>();
  for (const track of tracks) {
    const name = trackKeyValue(track, key, genres);
    groups.set(name, [...(groups.get(name) ?? []), track]);
  }
  return [...groups]
    .map(([name, list]) => ({ name, tracks: list }))
    .sort((a, b) => b.tracks.length - a.tracks.length);
}

/** Every artist id of the tracks (for the genre cache). */
export function artistIdsOf(tracks: readonly AddedTrack[]): string[] {
  return [...new Set(tracks.flatMap((t) => t.artists.map((a) => a.id)))];
}
