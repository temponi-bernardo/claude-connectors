/**
 * Pure builders of the smart operations' plans: which tracks a filter removes, duplicates to drop, groups to
 * split into, the merged list, unavailable tracks and stale playlists. Each returns plan steps plus the "before"
 * data a backup needs. No network here.
 */
import { addedTrackOutput, type AddedTrack } from './catalog.js';
import { toBackupTrack } from './backups.js';
import type { GenreMap } from './genres.js';
import type { BackupContent, PlanStep } from './plans.js';
import {
  findDuplicates,
  groupTracks,
  matchesFilter,
  type TrackFilter,
  type TrackKey,
} from './rules.js';
import type { SourceSnapshot } from './sources.js';

/** Tracks shown in a preview sample. */
export const PREVIEW_SAMPLE = 20;

/** Most playlists a split creates. */
export const MAX_SPLIT_GROUPS = 20;

/** A plan draft: title, steps, before-data and the preview details. */
export interface PlanDraft {
  readonly title: string;
  readonly steps: readonly PlanStep[];
  readonly before: BackupContent | null;
  readonly details: Readonly<Record<string, unknown>>;
}

/** The rule of a Liked Songs filter. */
export interface FilterRule {
  readonly filter: TrackFilter;
  readonly mode: 'keep' | 'remove';
  readonly genres: GenreMap;
}

/** Plan draft extra of `planDraft`. */
export interface PlanDraftExtra {
  readonly before: BackupContent | null;
  readonly details: Readonly<Record<string, unknown>>;
}

/** Builds a plan draft. */
export function planDraft(
  title: string,
  steps: readonly PlanStep[],
  extra: PlanDraftExtra,
): PlanDraft {
  return { title, steps, ...extra };
}

/** A sample of tracks for a preview. */
export function trackSample(tracks: readonly AddedTrack[]): Record<string, unknown>[] {
  return tracks.slice(0, PREVIEW_SAMPLE).map(addedTrackOutput);
}

/** Tells whether a filter names at least one criterion. */
export function hasCriteria(filter: TrackFilter): boolean {
  return Object.values(filter).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== undefined,
  );
}

/** Tracks to remove for a filter: `keep` removes what does not match, `remove` removes what matches. */
export function tracksToRemove(tracks: readonly AddedTrack[], rule: FilterRule): AddedTrack[] {
  return tracks.filter(
    (t) => matchesFilter(t, rule.filter, rule.genres) === (rule.mode === 'remove'),
  );
}

/** Liked Songs to unlike for a filter, with counts and samples of what goes and what stays. */
export function filterLikedDraft(snapshot: SourceSnapshot, rule: FilterRule): PlanDraft {
  if (!hasCriteria(rule.filter)) {
    throw new Error(
      'Give at least one criterion (artists, genres, years, dates or unavailable_only).',
    );
  }
  const remove = tracksToRemove(snapshot.tracks, rule);
  const removed = new Set(remove);
  const keep = snapshot.tracks.filter((t) => !removed.has(t));
  const total = snapshot.tracks.length;
  const details = {
    total,
    to_remove: remove.length,
    to_keep: keep.length,
    sample_remove: trackSample(remove),
    sample_keep: trackSample(keep),
  };
  const title = `Unlike ${remove.length} of ${total} Liked Songs (${rule.mode} filter)`;
  const before = likedBefore('Liked Songs removed by a filter', remove);
  return planDraft(title, [likedRemoval(remove)], { before, details });
}

/** Step that unlikes the given tracks. */
export function likedRemoval(tracks: readonly AddedTrack[]): PlanStep {
  return { kind: 'library_remove', uris: tracks.map((t) => t.uri) };
}

/** Backup content of removed Liked Songs. */
export function likedBefore(label: string, tracks: readonly AddedTrack[]): BackupContent {
  return { label, liked: tracks.map(toBackupTrack) };
}

/** Backup content of a whole playlist snapshot. */
export function playlistBefore(
  snapshot: SourceSnapshot,
  playlistId: string,
  label: string,
): BackupContent {
  const tracks = snapshot.tracks.map(toBackupTrack);
  return {
    label,
    playlists: [{ id: playlistId, name: snapshot.name, description: '', isPublic: null, tracks }],
  };
}

/** Refuses rewriting a playlist that has local files (the Web API cannot add them back). */
export function checkNoLocalFiles(snapshot: SourceSnapshot): void {
  const local = snapshot.tracks.filter((t) => t.isLocal).length;
  if (local > 0) {
    throw new Error(
      `"${snapshot.name}" has ${local} local file(s); Spotify's API cannot add them back, so it cannot be rewritten safely.`,
    );
  }
}

/** Duplicates of a source: Liked Songs lose the extra copies; a playlist is rewritten without them. */
export function dedupeDraft(snapshot: SourceSnapshot, playlistId: string | null): PlanDraft {
  const { keep, extra } = findDuplicates(snapshot.tracks);
  const details = {
    total: snapshot.tracks.length,
    duplicates: extra.length,
    sample_remove: trackSample(extra),
  };
  if (playlistId === null) {
    const before = likedBefore('Liked Songs duplicates removed', extra);
    return planDraft(`Remove ${extra.length} duplicate Liked Songs`, [likedRemoval(extra)], {
      before,
      details,
    });
  }
  checkNoLocalFiles(snapshot);
  const before = playlistBefore(snapshot, playlistId, `"${snapshot.name}" before dedupe`);
  const uris = keep.map((t) => t.uri);
  const steps: PlanStep[] =
    extra.length > 0 ? [{ kind: 'playlist_replace', playlistId, uris }] : [];
  return planDraft(`Remove ${extra.length} duplicates from "${snapshot.name}"`, steps, {
    before,
    details,
  });
}

/** Unavailable (not playable in the user's market) tracks of a source to remove. */
export function unavailableDraft(snapshot: SourceSnapshot, playlistId: string | null): PlanDraft {
  const gone = snapshot.tracks.filter((t) => t.isPlayable === false && !t.isLocal);
  const uris = [...new Set(gone.map((t) => t.uri))];
  const details = {
    total: snapshot.tracks.length,
    unavailable: uris.length,
    sample_remove: trackSample(gone),
  };
  const title = `Remove ${uris.length} unavailable tracks from "${snapshot.name}"`;
  if (playlistId === null) {
    return {
      title,
      steps: [likedRemoval(gone)],
      before: likedBefore('Unavailable Liked Songs removed', gone),
      details,
    };
  }
  const before = playlistBefore(
    snapshot,
    playlistId,
    `"${snapshot.name}" before removing unavailable tracks`,
  );
  return { title, steps: [{ kind: 'playlist_remove', playlistId, uris }], before, details };
}

/** Groups for a split: the largest ones, with small groups merged into "Other". */
export function splitGroups(
  tracks: readonly AddedTrack[],
  split: { readonly key: TrackKey; readonly genres: GenreMap; readonly minSize: number },
): { name: string; tracks: AddedTrack[] }[] {
  const groups = groupTracks(tracks, split.key, split.genres);
  const big = groups.filter((g) => g.tracks.length >= split.minSize).slice(0, MAX_SPLIT_GROUPS - 1);
  const rest = groups.filter((g) => !big.includes(g)).flatMap((g) => g.tracks);
  return rest.length > 0 ? [...big, { name: 'Other', tracks: rest }] : big;
}

/** URIs of the tracks without repeats, in order. */
export function uniqueTrackUris(tracks: readonly AddedTrack[]): string[] {
  return [...new Set(tracks.map((t) => t.uri))];
}

/** Step that creates a private playlist. */
export function createStep(name: string, description: string, uris: readonly string[]): PlanStep {
  return {
    kind: 'playlist_create',
    name: name.slice(0, 100),
    description: description.slice(0, 300),
    isPublic: false,
    uris,
  };
}

/** Split options of `splitDraft`. */
export interface SplitOptions {
  readonly key: TrackKey;
  readonly genres: GenreMap;
  readonly prefix: string;
  readonly minSize: number;
}

/** New playlists, one per group of a key. */
export function splitDraft(snapshot: SourceSnapshot, split: SplitOptions): PlanDraft {
  const groups = splitGroups(snapshot.tracks, split);
  const description = `Split of ${snapshot.name} by ${split.key}.`;
  const steps = groups.map((g) =>
    createStep(`${split.prefix} – ${g.name}`, description, uniqueTrackUris(g.tracks)),
  );
  const details = { playlists: groups.map((g) => ({ name: g.name, items: g.tracks.length })) };
  const title = `Split "${snapshot.name}" into ${steps.length} playlists by ${split.key}`;
  return planDraft(title, steps, { before: null, details });
}

/** A new playlist with every track of the sources, optionally without duplicates (same song). */
export function mergeDraft(
  snapshots: readonly SourceSnapshot[],
  merge: { readonly name: string; readonly dedupe: boolean },
): PlanDraft {
  const all = snapshots.flatMap((s) => s.tracks.filter((t) => !t.isLocal));
  const tracks = merge.dedupe ? findDuplicates(all).keep : all;
  const uris = merge.dedupe ? [...new Set(tracks.map((t) => t.uri))] : tracks.map((t) => t.uri);
  const names = snapshots.map((s) => s.name);
  const step = createStep(merge.name, `Merge of ${names.join(', ')}.`, uris);
  const details = {
    items: uris.length,
    dropped_duplicates: all.length - uris.length,
    sources: names,
  };
  return planDraft(`Merge ${snapshots.length} sources into "${merge.name}"`, [step], {
    before: null,
    details,
  });
}
