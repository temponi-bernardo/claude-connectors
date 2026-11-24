/**
 * Smart operations in two steps: each `preview_*` tool reads what it needs (resuming across calls for large
 * libraries), builds a plan and answers counts, a sample and a `plan_id`; `apply_plan` runs it after the user's
 * OK, backing up first whatever it removes or rewrites.
 */
import { z } from 'zod';
import {
  DESTRUCTIVE_HINTS,
  ORGANIZE_HINTS,
  READ_ONLY_HINTS,
  toolAnnotations,
} from '../../../src/mcp/annotations.js';
import { defineTool } from '../../../src/mcp/tools.js';
import { runPlan } from './apply.js';
import type { OwnerDeps } from './context.js';
import { ensureGenres, type GenreMap } from './genres.js';
import {
  claimPlan,
  createPlan,
  loadPlans,
  planItemCount,
  previewOutput,
  requirePlan,
  savePlans,
  storePlan,
} from './plans.js';
import { artistIdsOf, needsGenres } from './rules.js';
import { dedupeDraft, filterLikedDraft, unavailableDraft, type PlanDraft } from './smart.js';
import {
  isLoading,
  loadCompleteSource,
  loadSource,
  type LoadingStatus,
  type SourceRef,
  type SourceSnapshot,
} from './sources.js';
import { FILTER_SHAPE, SOURCE_SHAPE, sourceRefOf, toTrackFilter } from './tool-kit.js';

/** A complete source with the genres it needs. */
export interface ReadySource {
  readonly snapshot: SourceSnapshot;
  readonly genres: GenreMap;
}

/** Plan ids look like this (12 random bytes in base64url). */
export const PLAN_ID = z
  .string()
  .regex(/^[\w-]{16}$/, 'Expected the plan_id returned by a preview.');

/** Loading answer while artist genres are still being fetched. */
export function genresLoading(missing: number): LoadingStatus {
  return {
    status: 'loading',
    loaded: 0,
    total: missing,
    message: `Fetching artist genres: ${missing} artists left. Call the same tool again with the same arguments to continue.`,
  };
}

/** Loads a complete source and, when asked, the genres of all its artists; otherwise the loading answer. */
export async function readySource(
  deps: OwnerDeps,
  ref: SourceRef,
  withGenres: boolean,
): Promise<ReadySource | LoadingStatus> {
  const loaded = await loadCompleteSource(deps, ref);
  if (isLoading(loaded)) return loaded;
  if (!withGenres) return { snapshot: loaded, genres: {} };
  const { genres, missing } = await ensureGenres(deps, artistIdsOf(loaded.tracks));
  return missing > 0 ? genresLoading(missing) : { snapshot: loaded, genres };
}

/** Stores a draft as a plan and answers the preview (or says there is nothing to do). */
export async function previewDraft(
  deps: OwnerDeps,
  draft: PlanDraft,
): Promise<Record<string, unknown>> {
  const creates = draft.steps.some((step) => step.kind === 'playlist_create');
  if (!creates && planItemCount(draft.steps) === 0)
    return { nothing_to_do: true, ...draft.details };
  const plan = await createPlan(deps, draft);
  return previewOutput(plan, draft.details);
}

/** Loads a source (no genres) and previews the draft a builder makes of it (`playlistId` null for Liked Songs). */
export async function previewSourceDraft(
  deps: OwnerDeps,
  ref: SourceRef,
  build: (snapshot: SourceSnapshot, playlistId: string | null) => PlanDraft,
): Promise<unknown> {
  const ready = await readySource(deps, ref, false);
  if (isLoading(ready)) return ready;
  return previewDraft(deps, build(ready.snapshot, ref.kind === 'playlist' ? ref.id : null));
}

/** `sync_library`: loads (or refreshes) the Liked Songs snapshot used by the previews. */
export const syncLibraryTool = defineTool({
  name: 'sync_library',
  description:
    'Loads Liked Songs into the connector\'s private snapshot (and, with with_genres, the artists\' genres) so previews work on the whole library. Big libraries take several calls: repeat until status is "ready". refresh: true starts over.',
  shape: { refresh: z.boolean().default(false), with_genres: z.boolean().default(false) },
  annotations: toolAnnotations('Sync liked songs', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const snapshot = await loadSource(deps, { kind: 'liked' }, args.refresh);
    if (snapshot.nextOffset !== null)
      return {
        status: 'loading',
        loaded: snapshot.tracks.length,
        total: snapshot.total,
        next: 'Call sync_library again (refresh: false) to continue.',
      };
    const genres = args.with_genres ? await ensureGenres(deps, artistIdsOf(snapshot.tracks)) : null;
    const pending = genres?.missing ?? 0;
    return {
      status: pending > 0 ? 'loading' : 'ready',
      liked: snapshot.tracks.length,
      ...(genres ? { genre_artists_pending: pending } : {}),
    };
  },
});

/** `preview_filter_liked`: unlike by artist, genre, year, date added or availability. */
export const previewFilterLikedTool = defineTool({
  name: 'preview_filter_liked',
  description:
    'Plans which Liked Songs to UNLIKE. mode "keep": keep only matching tracks (e.g. artists ["Chris Cornell"] + genres ["electronic"]) and unlike the rest; mode "remove": unlike the matching ones. Artists and genres combine with OR; years and dates narrow. Genres come from Spotify artist data and may be missing for some artists. Returns counts, samples and a plan_id; nothing changes until apply_plan.',
  shape: { mode: z.enum(['keep', 'remove']), ...FILTER_SHAPE },
  annotations: toolAnnotations('Preview liked songs filter', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const filter = toTrackFilter(args);
    const ready = await readySource(deps, { kind: 'liked' }, needsGenres(filter));
    if (isLoading(ready)) return ready;
    return previewDraft(
      deps,
      filterLikedDraft(ready.snapshot, { filter, mode: args.mode, genres: ready.genres }),
    );
  },
});

/** `preview_dedupe`: duplicates in Liked Songs or a playlist. */
export const previewDedupeTool = defineTool({
  name: 'preview_dedupe',
  description:
    'Plans removing duplicates from Liked Songs or one of your playlists: the same track twice, or the same song in another version/album (remaster, deluxe, single, explicit/clean). Live versions and remixes count as different songs. Keeps the playable, earliest-added copy.',
  shape: { ...SOURCE_SHAPE },
  annotations: toolAnnotations('Preview duplicates', READ_ONLY_HINTS),
  run: (deps: OwnerDeps, args) => previewSourceDraft(deps, sourceRefOf(args), dedupeDraft),
});

/** `preview_unavailable`: tracks no longer playable. */
export const previewUnavailableTool = defineTool({
  name: 'preview_unavailable',
  description:
    'Finds tracks in Liked Songs or one of your playlists that Spotify says cannot be played in your country (removed or region-locked) and plans removing them.',
  shape: { ...SOURCE_SHAPE },
  annotations: toolAnnotations('Preview unavailable tracks', READ_ONLY_HINTS),
  run: (deps: OwnerDeps, args) => previewSourceDraft(deps, sourceRefOf(args), unavailableDraft),
});

/** Answer of an apply call. */
export function applyOutput(outcome: Awaited<ReturnType<typeof runPlan>>): Record<string, unknown> {
  const { plan } = outcome;
  const done =
    plan.steps.slice(0, plan.progress.step).reduce((sum, s) => sum + s.uris.length, 0) +
    plan.progress.offset;
  return {
    status: outcome.finished ? 'done' : 'partial',
    plan_id: plan.id,
    items_done: done,
    items_total: planItemCount(plan.steps),
    ...(plan.backupId ? { backup_id: plan.backupId } : {}),
    ...(plan.createdPlaylists.length ? { created_playlists: plan.createdPlaylists } : {}),
    ...(outcome.finished
      ? {}
      : { next: `Call apply_plan again with plan_id "${plan.id}" to continue.` }),
  };
}

/** `apply_plan`: runs a previewed plan. */
export const applyPlanTool = defineTool({
  name: 'apply_plan',
  description:
    'Runs a plan returned by a preview_* tool, ONLY after the user explicitly approved that preview. Backs up first whatever it removes or rewrites (see list_backups). Large plans run over several calls: repeat while status is "partial". Plans expire 10 minutes after the preview or the last partial run.',
  shape: { plan_id: PLAN_ID },
  annotations: toolAnnotations('Apply plan', DESTRUCTIVE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const plan = await claimPlan(deps, await requirePlan(deps, args.plan_id));
    const outcome = await runPlan(deps, plan);
    await storePlan(deps, { ...outcome.plan, runningUntil: 0 }, outcome.finished);
    if (outcome.error !== null)
      throw outcome.error instanceof Error
        ? outcome.error
        : new Error('The plan stopped with an unknown error.');
    return applyOutput(outcome);
  },
});

/** `cancel_plan`: forgets a pending plan. */
export const cancelPlanTool = defineTool({
  name: 'cancel_plan',
  description:
    'Discards a pending plan (nothing on Spotify changes). Changes already applied by a partial run stay.',
  shape: { plan_id: PLAN_ID },
  annotations: toolAnnotations('Cancel plan', ORGANIZE_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const plans = await loadPlans(deps);
    await savePlans(
      deps,
      plans.filter((p) => p.id !== args.plan_id),
    );
    return { cancelled: plans.some((p) => p.id === args.plan_id) };
  },
});
