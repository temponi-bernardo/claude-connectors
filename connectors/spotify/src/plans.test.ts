import { describe, expect, it } from 'vitest';
import { fakeSpotify, testOwnerDeps } from './fixtures/fake-spotify.js';
import {
  createPlan,
  isDestructiveStep,
  loadPlans,
  MAX_PENDING_PLANS,
  planItemCount,
  previewOutput,
  requirePlan,
  savePlans,
  START_PROGRESS,
  storePlan,
} from './plans.js';

const STEPS = [{ kind: 'library_remove' as const, uris: ['spotify:track:a', 'spotify:track:b'] }];

describe('plans', () => {
  it('creates a plan that expires in minutes and finds it by id only for its owner', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    const plan = await createPlan(deps, { title: 't', steps: STEPS, before: null });
    expect(plan.id).toMatch(/^[\w-]{16}$/);
    expect(plan.progress).toEqual(START_PROGRESS);
    expect((await requirePlan(deps, plan.id)).title).toBe('t');
    const other = await testOwnerDeps(fakeSpotify([]), { owner: 'spotify:other', kv: deps.kv });
    await expect(requirePlan(other, plan.id)).rejects.toThrow('expired');
    const later = { ...deps, now: () => deps.now() + 11 * 60_000 };
    await expect(requirePlan(later, plan.id)).rejects.toThrow('Run the preview again');
  });

  it('keeps at most a few pending plans', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    for (let i = 0; i < MAX_PENDING_PLANS + 2; i += 1)
      await createPlan(deps, { title: `p${i}`, steps: STEPS, before: null });
    expect(await loadPlans(deps)).toHaveLength(MAX_PENDING_PLANS);
  });

  it('storePlan renews or removes a plan', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    const plan = await createPlan(deps, { title: 't', steps: STEPS, before: null });
    await storePlan(deps, { ...plan, progress: { ...plan.progress, offset: 1 } }, false);
    expect((await requirePlan(deps, plan.id)).progress.offset).toBe(1);
    await storePlan(deps, plan, true);
    expect(await loadPlans(deps)).toEqual([]);
    await savePlans(deps, []);
    expect(await loadPlans(deps)).toEqual([]);
  });

  it('classifies steps, counts items and words the preview', async () => {
    expect(isDestructiveStep(STEPS[0] as never)).toBe(true);
    expect(isDestructiveStep({ kind: 'library_save', uris: [] })).toBe(false);
    expect(isDestructiveStep({ kind: 'playlist_replace', playlistId: 'p', uris: [] })).toBe(true);
    expect(planItemCount(STEPS)).toBe(2);
    const deps = await testOwnerDeps(fakeSpotify([]));
    const plan = await createPlan(deps, { title: 't', steps: STEPS, before: { label: 'b' } });
    const out = previewOutput(plan, { sample: [] });
    expect(out).toMatchObject({
      plan_id: plan.id,
      backup_before_apply: true,
      changes: [{ kind: 'library_remove', items: 2 }],
    });
    expect(String(out.next)).toContain('explicit OK');
  });
});
