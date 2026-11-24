import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import {
  addPlaylistUris,
  advancePlan,
  checkPlaylistUnchanged,
  backupBeforeApply,
  createUserPlaylist,
  currentChunk,
  currentStep,
  playlistItemCount,
  reconcilePlan,
  resumedPlaylistId,
  forgetTouchedSources,
  runAddChunk,
  runCreateChunk,
  runReplaceChunk,
  touchedSources,
  runPlan,
  runPlanChunk,
} from './apply.js';
import { listBackups } from './backups.js';
import {
  fakeSpotify,
  testOwnerDeps,
  type SpotifyCallRecord,
  type SpotifyRoute,
} from './fixtures/fake-spotify.js';
import { START_PROGRESS, type Plan, type PlanStep } from './plans.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

function uris(n: number, p = 't'): string[] {
  return Array.from({ length: n }, (_, i) => `spotify:track:${p}${i}`);
}

function plan(steps: PlanStep[], extra: Partial<Plan> = {}): Plan {
  return {
    id: 'p'.repeat(16),
    title: 't',
    expiresAt: 0,
    steps,
    before: null,
    backupId: null,
    progress: START_PROGRESS,
    createdPlaylists: [],
    ...extra,
  };
}

/** A fake playlist store: items per playlist, honouring add/replace/remove and the count. */
function playlistStore(start: Record<string, string[]> = {}): {
  routes: SpotifyRoute[];
  lists: Record<string, string[]>;
} {
  const lists: Record<string, string[]> = { ...start };
  function id(c: SpotifyCallRecord): string {
    return c.url.pathname.split('/')[3] ?? '';
  }
  function body(c: SpotifyCallRecord): { uris?: string[]; items?: { uri: string }[] } {
    return JSON.parse(c.body || '{}') as { uris?: string[]; items?: { uri: string }[] };
  }
  const routes: SpotifyRoute[] = [
    ['GET', /\/items$/, (c) => Response.json({ items: [], total: (lists[id(c)] ?? []).length })],
    [
      'POST',
      /\/items$/,
      (c) => {
        lists[id(c)] = [...(lists[id(c)] ?? []), ...(body(c).uris ?? [])];
        return Response.json({ snapshot_id: 's' }, { status: 201 });
      },
    ],
    [
      'PUT',
      /\/items$/,
      (c) => {
        lists[id(c)] = [...(body(c).uris ?? [])];
        return Response.json({ snapshot_id: 's' });
      },
    ],
    [
      'DELETE',
      /\/items$/,
      (c) => {
        const gone = new Set((body(c).items ?? []).map((i) => i.uri));
        lists[id(c)] = (lists[id(c)] ?? []).filter((u) => !gone.has(u));
        return Response.json({ snapshot_id: 's' });
      },
    ],
    [
      'POST',
      /\/v1\/me\/playlists$/,
      () => {
        lists.new1 = [];
        return Response.json({ id: 'new1' }, { status: 201 });
      },
    ],
    ['PUT', /\/v1\/me\/library$/, () => new Response(null)],
    ['DELETE', /\/v1\/me\/library$/, () => new Response(null)],
  ];
  return { routes, lists };
}

describe('plan progress', () => {
  it('advances within a step and to the next one', () => {
    const p = plan([
      { kind: 'library_save', uris: uris(50) },
      { kind: 'library_save', uris: uris(1) },
    ]);
    expect(advancePlan(p, 40).progress).toMatchObject({ step: 0, offset: 40 });
    expect(advancePlan(advancePlan(p, 40), 10).progress).toEqual({ ...START_PROGRESS, step: 1 });
    expect(currentChunk(p, p.steps[0]!)).toHaveLength(40);
    expect(
      currentChunk(plan([{ kind: 'playlist_add', playlistId: 'x', uris: uris(150) }]), {
        kind: 'playlist_add',
        playlistId: 'x',
        uris: uris(150),
      }),
    ).toHaveLength(100);
    expect(() => currentStep(advancePlan(plan([{ kind: 'library_save', uris: [] }]), 0))).toThrow(
      'no step',
    );
  });
});

describe('running plans', () => {
  it('removes 95 liked songs in chunks of 40, after saving a backup', async () => {
    const store = playlistStore();
    const calls: SpotifyCallRecord[] = [];
    const deps = await testOwnerDeps(fakeSpotify(store.routes, calls));
    const p = plan([{ kind: 'library_remove', uris: uris(95) }], {
      before: { label: 'b', liked: [] },
    });
    const outcome = await runPlan(deps, p);
    expect(outcome.finished).toBe(true);
    expect(outcome.plan.backupId).not.toBeNull();
    expect(await listBackups(deps)).toHaveLength(1);
    expect(
      calls
        .filter((c) => c.method === 'DELETE')
        .map((c) => c.url.searchParams.get('uris')?.split(',').length),
    ).toEqual([40, 40, 15]);
  });

  it('creates a playlist and fills it in chunks of 100', async () => {
    const store = playlistStore();
    const deps = await testOwnerDeps(fakeSpotify(store.routes));
    const outcome = await runPlan(
      deps,
      plan([
        { kind: 'playlist_create', name: 'n', description: 'd', isPublic: false, uris: uris(250) },
      ]),
    );
    expect(outcome.finished).toBe(true);
    expect(outcome.plan.createdPlaylists).toEqual(['new1']);
    expect(store.lists.new1).toHaveLength(250);
  });

  it('creates an empty playlist without adding', async () => {
    const store = playlistStore();
    const deps = await testOwnerDeps(fakeSpotify(store.routes));
    const outcome = await runPlan(
      deps,
      plan([{ kind: 'playlist_create', name: 'n', description: '', isPublic: true, uris: [] }]),
    );
    expect(outcome.finished).toBe(true);
    expect(store.lists.new1).toEqual([]);
  });

  it('replaces a playlist: PUT the first 100, then POST the rest', async () => {
    const store = playlistStore({ pl: uris(300, 'old') });
    const deps = await testOwnerDeps(fakeSpotify(store.routes));
    await runPlan(deps, plan([{ kind: 'playlist_replace', playlistId: 'pl', uris: uris(230) }]));
    expect(store.lists.pl).toEqual(uris(230));
  });

  it('adds to and removes from existing playlists', async () => {
    const store = playlistStore({ pl: uris(3, 'x') });
    const deps = await testOwnerDeps(fakeSpotify(store.routes));
    await runPlan(
      deps,
      plan([
        { kind: 'playlist_add', playlistId: 'pl', uris: uris(2) },
        { kind: 'playlist_remove', playlistId: 'pl', uris: ['spotify:track:x0'] },
      ]),
    );
    expect(store.lists.pl).toEqual(['spotify:track:x1', 'spotify:track:x2', ...uris(2)]);
  });

  it('stops when the budget runs out and resumes without adding twice (idempotent resume)', async () => {
    const store = playlistStore({ pl: [] });
    const deps = await testOwnerDeps(fakeSpotify(store.routes), { budget: 4 });
    const step: PlanStep = { kind: 'playlist_add', playlistId: 'pl', uris: uris(450) };
    const first = await runPlan(deps, plan([step]));
    expect(first.finished).toBe(false);
    expect(first.error).toBeNull();
    const stale = { ...first.plan, progress: { ...first.plan.progress, offset: 0 } };
    deps.budget.remaining = 40;
    const second = await runPlan(deps, stale);
    expect(second.finished).toBe(true);
    expect(store.lists.pl).toEqual(uris(450));
  });

  it('keeps progress and returns the error when Spotify fails', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([['DELETE', /\/v1\/me\/library$/, () => new Response('', { status: 403 })]]),
    );
    const outcome = await runPlan(deps, plan([{ kind: 'library_remove', uris: uris(3) }]));
    expect(outcome.finished).toBe(false);
    expect(String(outcome.error)).toContain('403');
  });

  it('helpers: counts, appends, creation errors, resumed playlist and backups only when destructive', async () => {
    const store = playlistStore({ pl: uris(7) });
    const deps = await testOwnerDeps(fakeSpotify(store.routes));
    expect(await playlistItemCount(deps, 'pl')).toBe(7);
    await addPlaylistUris(deps, 'pl', ['spotify:track:z']);
    expect(store.lists.pl).toHaveLength(8);
    const bad = await testOwnerDeps(
      fakeSpotify([['POST', /\/v1\/me\/playlists$/, () => Response.json({})]]),
    );
    await expect(
      createUserPlaylist(bad, { name: 'n', description: '', isPublic: false }),
    ).rejects.toThrow('new playlist id');
    expect(resumedPlaylistId(plan([{ kind: 'library_save', uris: [] }]))).toBeNull();
    const created = plan(
      [{ kind: 'playlist_create', name: 'n', description: '', isPublic: false, uris: uris(1) }],
      { progress: { ...START_PROGRESS, createdPlaylistId: 'c', baseTotal: 0 } },
    );
    expect(resumedPlaylistId(created)).toBe('c');
    const save = plan([{ kind: 'library_save', uris: uris(1) }], { before: { label: 'x' } });
    expect((await backupBeforeApply(deps, save)).backupId).toBeNull();
    expect(await reconcilePlan(deps, save)).toBe(save);
    expect((await runPlanChunk(deps, save)).progress.step).toBe(1);
  });
});

describe('snapshots after a run', () => {
  it('lists the sources a plan changes', () => {
    const p = plan([
      { kind: 'library_remove', uris: [] },
      { kind: 'playlist_add', playlistId: 'a', uris: [] },
      { kind: 'playlist_create', name: 'n', description: '', isPublic: false, uris: [] },
    ]);
    expect(touchedSources(p)).toEqual([{ kind: 'liked' }, { kind: 'playlist', id: 'a' }]);
  });
});

describe('chunk runners', () => {
  it('runAddChunk records the base count first, then appends', async () => {
    const store = playlistStore({ pl: uris(2, 'x') });
    const deps = await testOwnerDeps(fakeSpotify(store.routes));
    const p = plan([{ kind: 'playlist_add', playlistId: 'pl', uris: uris(3) }]);
    const based = await runAddChunk(deps, p, 'pl');
    expect(based.progress.baseTotal).toBe(2);
    expect((await runAddChunk(deps, based, 'pl')).progress.step).toBe(1);
  });

  it('runReplaceChunk replaces first and runCreateChunk creates first', async () => {
    const store = playlistStore({ pl: uris(5, 'x') });
    const deps = await testOwnerDeps(fakeSpotify(store.routes));
    const replace = await runReplaceChunk(
      deps,
      plan([{ kind: 'playlist_replace', playlistId: 'pl', uris: uris(150) }]),
      'pl',
    );
    expect(replace.progress).toMatchObject({ replaced: true, offset: 100 });
    const step = {
      kind: 'playlist_create' as const,
      name: 'n',
      description: '',
      isPublic: false,
      uris: uris(1),
    };
    const created = await runCreateChunk(deps, plan([step]), step);
    expect(created.progress.createdPlaylistId).toBe('new1');
  });

  it('forgetTouchedSources clears the snapshots a plan changed', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    await forgetTouchedSources(deps, plan([{ kind: 'library_save', uris: [] }]));
    expect(deps.kv.entries.size).toBe(1);
  });
});

describe('playlist rewrites check the version first', () => {
  it('refuses to rewrite a playlist that changed since the preview', async () => {
    const store = playlistStore({ pl: uris(3) });
    const routes: SpotifyRoute[] = [
      [
        'GET',
        /\/v1\/playlists\/pl$/,
        () => Response.json({ id: 'pl', name: 'Mix', snapshot_id: 'v2' }),
      ],
      ...store.routes,
    ];
    const deps = await testOwnerDeps(fakeSpotify(routes));
    const step: PlanStep = {
      kind: 'playlist_replace',
      playlistId: 'pl',
      uris: uris(1),
      expectedSnapshotId: 'v1',
    };
    await expect(checkPlaylistUnchanged(deps, step)).rejects.toThrow('changed since the preview');
    const outcome = await runPlan(deps, plan([step]));
    expect(String(outcome.error)).toContain('changed since the preview');
    expect(store.lists.pl).toEqual(uris(3));
    await checkPlaylistUnchanged(deps, { ...step, expectedSnapshotId: 'v2' });
    await checkPlaylistUnchanged(deps, { kind: 'library_save', uris: [] });
  });
});
