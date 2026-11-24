/**
 * Two-step operations: every batch change is first a plan (preview with counts and a sample) stored in the
 * user's vault for a few minutes; `apply_plan` runs it by id. Plans carry the "before" data so a backup is saved
 * before anything is removed, and their progress so an interrupted run resumes where it stopped.
 */
import { randomToken } from '../../../src/remote/worker-kit.js';
import type { OwnerDeps } from './context.js';
import { readVault, vaultOf, writeVault } from './vault.js';

/** Vault type of the user's pending plans (one record with all of them). */
export const PLANS_TYP = 'plans';

/** Minutes a plan stays valid after the preview (and after each partial run). */
export const PLAN_TTL_MINUTES = 10;

/** Most pending plans per user (the oldest is dropped). */
export const MAX_PENDING_PLANS = 5;

/** One change of a plan. Library changes take any library URI (track, album, playlist, artist...). */
export type PlanStep =
  | { readonly kind: 'library_save' | 'library_remove'; readonly uris: readonly string[] }
  | {
      readonly kind: 'playlist_add' | 'playlist_remove' | 'playlist_replace';
      readonly playlistId: string;
      readonly uris: readonly string[];
      /** For a rewrite: the playlist version the preview read; a different one aborts the run. */
      readonly expectedSnapshotId?: string;
    }
  | {
      readonly kind: 'playlist_create';
      readonly name: string;
      readonly description: string;
      readonly isPublic: boolean;
      readonly uris: readonly string[];
    };

/** A track as kept in a backup. */
export interface BackupTrack {
  readonly uri: string;
  readonly name: string;
  readonly artists: string;
  readonly addedAt: string;
}

/** A playlist as kept in a backup: details and items in order. */
export interface BackupPlaylist {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly isPublic: boolean | null;
  readonly tracks: readonly BackupTrack[];
}

/** What a backup holds. */
export interface BackupContent {
  readonly label: string;
  readonly liked?: readonly BackupTrack[];
  readonly playlists?: readonly BackupPlaylist[];
  /** Library items (e.g. followed playlists) by URI. */
  readonly library?: readonly BackupTrack[];
}

/** Where an interrupted run continues: step, items done in it, created playlist, base count of an addition. */
export interface PlanProgress {
  readonly step: number;
  readonly offset: number;
  readonly createdPlaylistId: string | null;
  readonly baseTotal: number | null;
  readonly replaced: boolean;
}

/** A stored plan. */
export interface Plan {
  readonly id: string;
  readonly title: string;
  readonly expiresAt: number;
  readonly steps: readonly PlanStep[];
  /** Saved as a backup before the first change when the plan removes or replaces something. */
  readonly before: BackupContent | null;
  readonly backupId: string | null;
  readonly progress: PlanProgress;
  readonly createdPlaylists: readonly string[];
  /** Instant (Unix ms) until which an `apply_plan` call holds the plan; another call must wait. */
  readonly runningUntil?: number;
}

/** Progress of a plan that has not started. */
export const START_PROGRESS: Readonly<PlanProgress> = {
  step: 0,
  offset: 0,
  createdPlaylistId: null,
  baseTotal: null,
  replaced: false,
};

/** Tells whether a step removes or overwrites something (and so needs a backup first). */
export function isDestructiveStep(step: PlanStep): boolean {
  return (
    step.kind === 'library_remove' ||
    step.kind === 'playlist_remove' ||
    step.kind === 'playlist_replace'
  );
}

/** Number of items a plan touches. */
export function planItemCount(steps: readonly PlanStep[]): number {
  return steps.reduce((sum, step) => sum + step.uris.length, 0);
}

/** Reads the user's pending plans, dropping expired ones. */
export async function loadPlans(deps: OwnerDeps): Promise<Plan[]> {
  const data = await readVault(vaultOf(deps), { typ: PLANS_TYP, owner: deps.owner });
  const plans = Array.isArray(data) ? (data as Plan[]) : [];
  return plans.filter((plan) => plan.expiresAt > deps.now());
}

/** Stores the pending plans (the record expires with the last plan). */
export async function savePlans(deps: OwnerDeps, plans: readonly Plan[]): Promise<void> {
  const ttlSeconds = PLAN_TTL_MINUTES * 60 * 2;
  await writeVault(vaultOf(deps), { typ: PLANS_TYP, owner: deps.owner, ttlSeconds }, plans);
}

/** Plan input of `createPlan`. */
export interface PlanInput {
  readonly title: string;
  readonly steps: readonly PlanStep[];
  readonly before: BackupContent | null;
}

/** Creates and stores a plan; returns it. */
export async function createPlan(deps: OwnerDeps, draft: PlanInput): Promise<Plan> {
  const plan: Plan = {
    ...draft,
    id: randomToken(12),
    expiresAt: deps.now() + PLAN_TTL_MINUTES * 60_000,
    backupId: null,
    progress: START_PROGRESS,
    createdPlaylists: [],
  };
  const others = (await loadPlans(deps)).slice(-(MAX_PENDING_PLANS - 1));
  await savePlans(deps, [...others, plan]);
  return plan;
}

/** Finds a pending plan by id or explains that it expired. */
export async function requirePlan(deps: OwnerDeps, planId: string): Promise<Plan> {
  const plan = (await loadPlans(deps)).find((p) => p.id === planId);
  if (!plan) {
    throw new Error(
      `Plan ${planId} does not exist or expired (plans last ${PLAN_TTL_MINUTES} minutes). Run the preview again.`,
    );
  }
  return plan;
}

/** Replaces (or, when finished, removes) a plan in the store, renewing its validity. */
export async function storePlan(deps: OwnerDeps, plan: Plan, finished: boolean): Promise<void> {
  const others = (await loadPlans(deps)).filter((p) => p.id !== plan.id);
  const renewed = { ...plan, expiresAt: deps.now() + PLAN_TTL_MINUTES * 60_000 };
  await savePlans(deps, finished ? others : [...others, renewed]);
}

/** The preview answer: plan id, validity, counts and a sample, plus notes. */
export function previewOutput(
  plan: Plan,
  details: Readonly<Record<string, unknown>>,
): Record<string, unknown> {
  return {
    plan_id: plan.id,
    title: plan.title,
    expires_at: new Date(plan.expiresAt).toISOString(),
    changes: plan.steps.map((step) => ({ kind: step.kind, items: step.uris.length })),
    backup_before_apply: plan.before !== null,
    ...details,
    next: `Show this to the user. Only after their explicit OK call apply_plan with plan_id "${plan.id}".`,
  };
}

/** Seconds an `apply_plan` call holds a plan (long enough for one call, short enough to recover from a crash). */
export const PLAN_LEASE_SECONDS = 90;

/** Takes the plan for this call, or refuses when another `apply_plan` call is still running it. */
export async function claimPlan(deps: OwnerDeps, plan: Plan): Promise<Plan> {
  if ((plan.runningUntil ?? 0) > deps.now()) {
    throw new Error(
      `Plan ${plan.id} is being applied by another call; wait a minute and call apply_plan again.`,
    );
  }
  const claimed = { ...plan, runningUntil: deps.now() + PLAN_LEASE_SECONDS * 1000 };
  await storePlan(deps, claimed, false);
  return claimed;
}
