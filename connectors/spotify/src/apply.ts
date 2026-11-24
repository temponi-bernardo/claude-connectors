/**
 * Runs a stored plan chunk by chunk within the call budget. Before the first change of a plan that removes or
 * replaces something, the "before" data is saved as a backup. When the budget runs out the progress is kept and
 * the next `apply_plan` call continues; playlist additions are reconciled with the playlist's item count so a
 * resumed run does not add twice.
 */
import { saveBackup } from './backups.js';
import type { OwnerDeps } from './context.js';
import { LIBRARY_BATCH, PLAYLIST_BATCH, writeLibraryChunk } from './library-write.js';
import { paths } from './paths.js';
import { isDestructiveStep, START_PROGRESS, type Plan, type PlanStep } from './plans.js';
import { spotifyCall } from './spotify-api.js';
import { BudgetExhaustedError } from './spotify-errors.js';
import { forgetSource, type SourceRef } from './sources.js';

/** Outcome of one apply call: the updated plan, whether it finished and the error that stopped it. */
export interface ApplyOutcome {
  readonly plan: Plan;
  readonly finished: boolean;
  readonly error: unknown;
}

/** Moves the plan's progress by `count` items, going to the next step when the current one is done. */
export function advancePlan(plan: Plan, count: number): Plan {
  const step = plan.steps[plan.progress.step];
  const offset = plan.progress.offset + count;
  if (step && offset < step.uris.length) return { ...plan, progress: { ...plan.progress, offset } };
  return { ...plan, progress: { ...START_PROGRESS, step: plan.progress.step + 1 } };
}

/** Number of items now in a playlist (one request). */
export async function playlistItemCount(deps: OwnerDeps, playlistId: string): Promise<number> {
  const body = (await spotifyCall(deps, {
    path: paths.playlistItems(playlistId),
    query: { limit: 1 },
  })) as { total?: unknown } | null;
  return typeof body?.total === 'number' ? body.total : 0;
}

/** Appends items to a playlist (one request, ≤ `PLAYLIST_BATCH`). */
export async function addPlaylistUris(
  deps: OwnerDeps,
  playlistId: string,
  uris: readonly string[],
): Promise<void> {
  await spotifyCall(deps, {
    method: 'POST',
    path: paths.playlistItems(playlistId),
    body: { uris },
  });
}

/** Creates a playlist for the current user and returns its id. */
export async function createUserPlaylist(
  deps: OwnerDeps,
  details: { readonly name: string; readonly description: string; readonly isPublic: boolean },
): Promise<string> {
  const body = { name: details.name, description: details.description, public: details.isPublic };
  const created = (await spotifyCall(deps, { method: 'POST', path: '/me/playlists', body })) as {
    id?: unknown;
  } | null;
  if (typeof created?.id !== 'string')
    throw new Error('Spotify did not return the new playlist id.');
  return created.id;
}

/** The step the plan is at (throws when the plan already finished). */
export function currentStep(plan: Plan): PlanStep {
  const step = plan.steps[plan.progress.step];
  if (!step) throw new Error('The plan has no step left to run.');
  return step;
}

/** The next chunk of the current step. */
export function currentChunk(plan: Plan, step: PlanStep): string[] {
  const size = step.kind.startsWith('library') ? LIBRARY_BATCH : PLAYLIST_BATCH;
  return step.uris.slice(plan.progress.offset, plan.progress.offset + size);
}

/** Runs one chunk of a playlist addition (recording the base count first). */
export async function runAddChunk(deps: OwnerDeps, plan: Plan, playlistId: string): Promise<Plan> {
  if (plan.progress.baseTotal === null) {
    const baseTotal = await playlistItemCount(deps, playlistId);
    return { ...plan, progress: { ...plan.progress, baseTotal } };
  }
  const step = currentStep(plan);
  const chunk = currentChunk(plan, step);
  await addPlaylistUris(deps, playlistId, chunk);
  return advancePlan(plan, chunk.length);
}

/** Runs one chunk of a replacement: the first chunk replaces everything, the rest are appended. */
export async function runReplaceChunk(
  deps: OwnerDeps,
  plan: Plan,
  playlistId: string,
): Promise<Plan> {
  if (plan.progress.replaced) return runAddChunk(deps, plan, playlistId);
  const step = currentStep(plan);
  const chunk = currentChunk(plan, step);
  await spotifyCall(deps, {
    method: 'PUT',
    path: paths.playlistItems(playlistId),
    body: { uris: chunk },
  });
  const moved = advancePlan(plan, chunk.length);
  if (moved.progress.step !== plan.progress.step) return moved;
  return { ...moved, progress: { ...moved.progress, replaced: true, baseTotal: 0 } };
}

/** Runs one chunk of a creation: first creates the playlist, then adds items to it. */
export async function runCreateChunk(
  deps: OwnerDeps,
  plan: Plan,
  step: Extract<PlanStep, { kind: 'playlist_create' }>,
): Promise<Plan> {
  const created = plan.progress.createdPlaylistId;
  if (created !== null) return runAddChunk(deps, plan, created);
  const id = await createUserPlaylist(deps, step);
  const progress = { ...plan.progress, createdPlaylistId: id, baseTotal: 0 };
  const next = { ...plan, progress, createdPlaylists: [...plan.createdPlaylists, id] };
  return step.uris.length === 0 ? advancePlan(next, 0) : next;
}

/** Runs one chunk of the current step. */
export async function runPlanChunk(deps: OwnerDeps, plan: Plan): Promise<Plan> {
  const step = currentStep(plan);
  if (step.kind === 'playlist_create') return runCreateChunk(deps, plan, step);
  if (!('playlistId' in step)) {
    const chunk = currentChunk(plan, step);
    await writeLibraryChunk(deps, step.kind === 'library_save' ? 'save' : 'remove', chunk);
    return advancePlan(plan, chunk.length);
  }
  if (step.kind === 'playlist_add') return runAddChunk(deps, plan, step.playlistId);
  if (step.kind === 'playlist_replace') return runReplaceChunk(deps, plan, step.playlistId);
  const chunk = currentChunk(plan, step);
  const body = { items: chunk.map((uri) => ({ uri })) };
  await spotifyCall(deps, { method: 'DELETE', path: paths.playlistItems(step.playlistId), body });
  return advancePlan(plan, chunk.length);
}

/** Playlist a resumed step writes to (null for library steps or before creation/replacement started). */
export function resumedPlaylistId(plan: Plan): string | null {
  const step = plan.steps[plan.progress.step];
  if (!step || plan.progress.baseTotal === null) return null;
  if (step.kind === 'playlist_create') return plan.progress.createdPlaylistId;
  return step.kind === 'playlist_add' || step.kind === 'playlist_replace' ? step.playlistId : null;
}

/** Re-reads the item count of a resumed playlist step, so additions that already happened are not repeated. */
export async function reconcilePlan(deps: OwnerDeps, plan: Plan): Promise<Plan> {
  const playlistId = resumedPlaylistId(plan);
  const step = plan.steps[plan.progress.step];
  if (playlistId === null || !step) return plan;
  const added = (await playlistItemCount(deps, playlistId)) - (plan.progress.baseTotal ?? 0);
  const offset = Math.min(step.uris.length, Math.max(plan.progress.offset, added));
  return offset >= step.uris.length
    ? advancePlan(plan, offset - plan.progress.offset)
    : { ...plan, progress: { ...plan.progress, offset } };
}

/** Saves the plan's "before" data as a backup when it removes or replaces something and has none yet. */
export async function backupBeforeApply(deps: OwnerDeps, plan: Plan): Promise<Plan> {
  if (plan.backupId !== null || plan.before === null || !plan.steps.some(isDestructiveStep))
    return plan;
  const entry = await saveBackup(deps, plan.before);
  return { ...plan, backupId: entry.id };
}

/** Sources a plan changes: Liked Songs for library steps, each playlist it writes to. */
export function touchedSources(plan: Plan): SourceRef[] {
  const refs = new Map<string, SourceRef>();
  for (const step of plan.steps) {
    if ('playlistId' in step) refs.set(step.playlistId, { kind: 'playlist', id: step.playlistId });
    else if (step.kind !== 'playlist_create') refs.set('liked', { kind: 'liked' });
  }
  return [...refs.values()];
}

/** Forgets the snapshots of every source the plan changed. */
export async function forgetTouchedSources(deps: OwnerDeps, plan: Plan): Promise<void> {
  for (const ref of touchedSources(plan)) await forgetSource(deps, ref);
}

/** Runs a plan until it finishes, the budget runs out or an error stops it (progress is kept either way). */
export async function runPlan(deps: OwnerDeps, plan: Plan): Promise<ApplyOutcome> {
  let current = plan;
  let error: unknown = null;
  try {
    current = await backupBeforeApply(deps, current);
    current = await reconcilePlan(deps, current);
    while (current.progress.step < current.steps.length) {
      current = await runPlanChunk(deps, current);
    }
  } catch (caught) {
    error = caught instanceof BudgetExhaustedError ? null : caught;
  }
  await forgetTouchedSources(deps, current);
  const finished = current.progress.step >= current.steps.length;
  return { plan: current, finished, error };
}
