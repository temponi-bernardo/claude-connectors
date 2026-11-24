/**
 * Organizing previews: copy filtered Liked Songs into a new playlist (e.g. "this week's likes"), sort, split or
 * merge playlists, find abandoned playlists and change the library in bulk. All answer a plan for `apply_plan`.
 */
import { z } from 'zod';
import { READ_ONLY_HINTS, toolAnnotations } from '../../../src/mcp/annotations.js';
import { defineTool } from '../../../src/mcp/tools.js';
import type { OwnerDeps } from './context.js';
import type { AddedTrack, PlaylistInfo } from './catalog.js';
import type { GenreMap } from './genres.js';
import type { PlanStep } from './plans.js';
import {
  matchesFilter,
  needsGenres,
  sortTracks,
  type TrackFilter,
  type TrackKey,
} from './rules.js';
import {
  checkNoLocalFiles,
  hasCriteria,
  mergeDraft,
  playlistBefore,
  planDraft,
  rewriteStep,
  splitDraft,
  trackSample,
  type PlanDraft,
} from './smart.js';
import {
  isLoading,
  loadCompleteSource,
  type LoadingStatus,
  type SourceSnapshot,
} from './sources.js';
import { scanOwnPlaylists, stalePlaylists } from './stale.js';
import {
  FILTER_SHAPE,
  LIBRARY_URI,
  PLAYLIST_REF,
  SOURCE_SHAPE,
  currentUserId,
  sourceRefOf,
  spotifyIdOf,
  toTrackFilter,
} from './tool-kit.js';
import { previewDraft, readySource, type ReadySource } from './tools-smart.js';

/** Keys to sort or split by. */
export const TRACK_KEYS = ['artist', 'genre', 'decade', 'year', 'added', 'name', 'album'] as const;

/** Most URIs of one bulk library change. */
export const MAX_BULK_URIS = 2000;

/** Options of a copy of Liked Songs into a new playlist. */
export interface CopyOptions {
  readonly filter: TrackFilter;
  readonly name: string;
  readonly description: string;
  readonly public: boolean;
  readonly sort_by?: TrackKey | undefined;
  readonly descending: boolean;
  readonly max_items?: number | undefined;
}

/** The Liked Songs a copy takes: filtered, capped (newest first) and optionally sorted. Pure. */
export function copiedTracks(ready: ReadySource, options: CopyOptions): AddedTrack[] {
  const all = ready.snapshot.tracks;
  const matched = hasCriteria(options.filter)
    ? all.filter((t) => matchesFilter(t, options.filter, ready.genres))
    : [...all];
  const limited = matched.slice(0, options.max_items ?? matched.length);
  if (!options.sort_by) return limited;
  return sortTracks(limited, {
    key: options.sort_by,
    descending: options.descending,
    genres: ready.genres,
  });
}

/** Plan draft of a copy of Liked Songs into a new playlist. */
export function copyLikedDraft(ready: ReadySource, options: CopyOptions): PlanDraft {
  const tracks = copiedTracks(ready, options);
  const step: PlanStep = {
    kind: 'playlist_create',
    name: options.name,
    description: options.description,
    isPublic: options.public,
    uris: tracks.map((t) => t.uri),
  };
  const details = { items: tracks.length, sample: trackSample(tracks) };
  return {
    title: `New playlist "${options.name}" with ${tracks.length} liked songs`,
    steps: [step],
    before: null,
    details,
  };
}

/** `preview_copy_liked_to_playlist`: filtered Liked Songs into a new playlist. */
export const previewCopyLikedTool = defineTool({
  name: 'preview_copy_liked_to_playlist',
  description:
    'Plans a NEW playlist with the Liked Songs that match a filter (same filter as preview_filter_liked), e.g. "this week\'s likes" with added_after, or "my electronic likes" with genres. Optional sort_by and max_items (newest first).',
  shape: {
    name: z.string().min(1).max(100),
    description: z.string().max(300).default(''),
    public: z.boolean().default(false),
    ...FILTER_SHAPE,
    sort_by: z.enum(TRACK_KEYS).optional(),
    descending: z.boolean().default(false),
    max_items: z.number().int().min(1).max(10_000).optional(),
  },
  annotations: toolAnnotations('Preview copy of liked songs', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const filter = toTrackFilter(args);
    const withGenres = needsGenres(filter) || args.sort_by === 'genre';
    const ready = await readySource(deps, { kind: 'liked' }, withGenres);
    if (isLoading(ready)) return ready;
    return previewDraft(deps, copyLikedDraft(ready, { ...args, filter }));
  },
});

/** Loads every playlist to merge; the first one still loading is returned instead. */
export async function loadMergeSources(
  deps: OwnerDeps,
  ids: readonly string[],
): Promise<SourceSnapshot[] | LoadingStatus> {
  const snapshots: SourceSnapshot[] = [];
  for (const id of ids) {
    const loaded = await loadCompleteSource(deps, { kind: 'playlist', id });
    if (isLoading(loaded)) return loaded;
    snapshots.push(loaded);
  }
  return snapshots;
}

/** Sort options of `sortDraft`. */
export interface SortOptions {
  readonly playlistId: string;
  readonly key: TrackKey;
  readonly descending: boolean;
  readonly genres: GenreMap;
}

/** Sort plan of one playlist (rewritten in the new order, after a backup). */
export function sortDraft(snapshot: SourceSnapshot, sort: SortOptions): PlanDraft {
  checkNoLocalFiles(snapshot);
  const sorted = sortTracks(snapshot.tracks, {
    key: sort.key,
    descending: sort.descending,
    genres: sort.genres,
  });
  const steps = [
    rewriteStep(
      snapshot,
      sort.playlistId,
      sorted.map((t) => t.uri),
    ),
  ];
  return {
    title: `Sort "${snapshot.name}" by ${sort.key}`,
    steps,
    before: playlistBefore(snapshot, sort.playlistId, `"${snapshot.name}" before sorting`),
    details: { items: sorted.length, first: trackSample(sorted).slice(0, 10) },
  };
}

/** Arguments of `preview_organize_playlists`. */
export interface OrganizeArgs {
  readonly action: 'sort' | 'split' | 'merge';
  readonly source: 'liked' | 'playlist';
  readonly playlist_id?: string | undefined;
  readonly playlist_ids?: string[] | undefined;
  readonly by: TrackKey;
  readonly descending: boolean;
  readonly name: string;
  readonly min_group_size: number;
  readonly dedupe: boolean;
}

/** Merge draft: every listed playlist loaded (or the loading answer). */
export async function mergePreviewDraft(
  deps: OwnerDeps,
  args: OrganizeArgs,
): Promise<PlanDraft | LoadingStatus> {
  const ids = (args.playlist_ids ?? []).map((ref) => spotifyIdOf(ref, 'playlist'));
  if (ids.length < 2) throw new Error('merge needs playlist_ids with 2 to 10 playlists.');
  const loaded = await loadMergeSources(deps, ids);
  return Array.isArray(loaded)
    ? mergeDraft(loaded, { name: args.name, dedupe: args.dedupe })
    : loaded;
}

/** Why Liked Songs cannot be sorted. */
export const LIKED_SORT_REFUSAL =
  'Liked Songs cannot be reordered; sort a playlist, or copy your likes with preview_copy_liked_to_playlist and sort_by.';

/** Sort or split draft of one source (or the loading answer). */
export async function sourcePreviewDraft(
  deps: OwnerDeps,
  args: OrganizeArgs,
): Promise<PlanDraft | LoadingStatus> {
  const ref = sourceRefOf(args);
  if (args.action === 'sort' && ref.kind !== 'playlist') throw new Error(LIKED_SORT_REFUSAL);
  const ready = await readySource(deps, ref, args.by === 'genre');
  if (isLoading(ready)) return ready;
  const { snapshot, genres } = ready;
  if (ref.kind === 'liked' || args.action === 'split') {
    return splitDraft(snapshot, {
      key: args.by,
      genres,
      prefix: args.name,
      minSize: args.min_group_size,
    });
  }
  return sortDraft(snapshot, {
    playlistId: ref.id,
    key: args.by,
    descending: args.descending,
    genres,
  });
}

/** `preview_organize_playlists`: sort, split or merge. */
export const previewOrganizeTool = defineTool({
  name: 'preview_organize_playlists',
  description:
    'Plans organizing playlists. action "sort": rewrite one of your playlists ordered by a key. "split": create one new playlist per artist/genre/decade/... of a source (Liked Songs or a playlist). "merge": create a new playlist with every track of 2–10 of your playlists (dedupe drops repeated songs). Sources are never deleted.',
  shape: {
    action: z.enum(['sort', 'split', 'merge']),
    ...SOURCE_SHAPE,
    playlist_ids: z
      .array(PLAYLIST_REF)
      .min(2)
      .max(10)
      .optional()
      .describe('merge: the playlists to merge.'),
    by: z.enum(TRACK_KEYS).default('artist'),
    descending: z.boolean().default(false),
    name: z
      .string()
      .min(1)
      .max(80)
      .default('Organized')
      .describe('merge: new playlist name; split: name prefix.'),
    min_group_size: z.number().int().min(1).max(500).default(5),
    dedupe: z.boolean().default(true),
  },
  annotations: toolAnnotations('Preview organizing playlists', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const draft =
      args.action === 'merge'
        ? await mergePreviewDraft(deps, args)
        : await sourcePreviewDraft(deps, args);
    return isLoading(draft) ? draft : previewDraft(deps, draft);
  },
});

/** Average month in milliseconds. */
export const MONTH_MS = 30.44 * 24 * 3600 * 1000;

/** Plan draft that removes stale playlists from the library (backed up as library items). Pure. */
export function staleDraft(
  stale: readonly { readonly playlist: PlaylistInfo; readonly lastAdded: string }[],
  info: { readonly ownCount: number; readonly cutoff: string },
): PlanDraft {
  const library = stale.map(({ playlist, lastAdded }) => ({
    uri: playlist.uri,
    name: playlist.name,
    artists: '',
    addedAt: lastAdded,
  }));
  const steps: PlanStep[] = [{ kind: 'library_remove', uris: library.map((p) => p.uri) }];
  const sample = library
    .slice(0, 30)
    .map((p) => ({ name: p.name, last_added: p.addedAt || 'empty' }));
  const details = {
    own_playlists: info.ownCount,
    stale: library.length,
    cutoff: info.cutoff,
    sample,
  };
  const before = { label: 'Abandoned playlists removed', library };
  return planDraft(`Remove ${library.length} abandoned playlists`, steps, { before, details });
}

/** `preview_stale_playlists`: own playlists with nothing added for N months. */
export const previewStalePlaylistsTool = defineTool({
  name: 'preview_stale_playlists',
  description:
    'Finds YOUR playlists with nothing added for at least `months` (and, with include_empty, empty ones) and plans removing them from your library (Spotify\'s "delete" is an unfollow: a backup lets you follow them back). Spotify has no "last modified" date, so the newest date an item was added is used.',
  shape: {
    months: z.number().int().min(1).max(120).default(12),
    include_empty: z.boolean().default(true),
  },
  annotations: toolAnnotations('Preview abandoned playlists', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const scan = await scanOwnPlaylists(deps, await currentUserId(deps));
    if (scan.missing > 0) {
      const loaded = scan.own.length - scan.missing;
      return {
        status: 'loading',
        loaded,
        total: scan.own.length,
        message: 'Still checking your playlists; call again with the same arguments.',
      };
    }
    const cutoff = new Date(deps.now() - args.months * MONTH_MS).toISOString();
    const stale = stalePlaylists(scan.own, {
      cache: scan.cache,
      cutoff,
      includeEmpty: args.include_empty,
    });
    return previewDraft(deps, staleDraft(stale, { ownCount: scan.own.length, cutoff }));
  },
});

/** `preview_library_change`: like/unlike, save/remove or follow/unfollow many items at once. */
export const previewLibraryChangeTool = defineTool({
  name: 'preview_library_change',
  description:
    'Plans saving or removing up to 2000 library URIs at once (like/unlike tracks, save/remove albums, follow/unfollow artists and playlists). Removals are backed up before apply_plan runs them.',
  shape: {
    action: z.enum(['save', 'remove']),
    uris: z.array(LIBRARY_URI).min(1).max(MAX_BULK_URIS),
  },
  annotations: toolAnnotations('Preview bulk library change', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const uris = [...new Set(args.uris)];
    const step: PlanStep = {
      kind: args.action === 'save' ? 'library_save' : 'library_remove',
      uris,
    };
    const library = uris.map((uri) => ({ uri, name: '', artists: '', addedAt: '' }));
    const before =
      args.action === 'remove' ? { label: 'Library items removed in bulk', library } : null;
    return previewDraft(deps, {
      title: `${args.action === 'save' ? 'Save' : 'Remove'} ${uris.length} library items`,
      steps: [step],
      before,
      details: { items: uris.length },
    });
  },
});
