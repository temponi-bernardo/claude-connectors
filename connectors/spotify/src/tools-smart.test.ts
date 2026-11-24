import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import { libraryRoutes, type LibraryState } from './fixtures/library-store.js';
import { fakeSpotify, testOwnerDeps } from './fixtures/fake-spotify.js';
import { listBackups } from './backups.js';
import {
  applyOutput,
  applyPlanTool,
  cancelPlanTool,
  genresLoading,
  previewDedupeTool,
  previewDraft,
  previewFilterLikedTool,
  previewSourceDraft,
  previewUnavailableTool,
  readySource,
  syncLibraryTool,
} from './tools-smart.js';
import { loadPlans } from './plans.js';
import type { PlanDraft } from './smart.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

function state(): LibraryState {
  return {
    liked: [
      {
        id: 'cornell1',
        extra: { artists: [{ id: 'ar-cornell', name: 'Chris Cornell' }] },
        addedAt: '2026-11-01T00:00:00Z',
      },
      {
        id: 'bicep1',
        extra: { artists: [{ id: 'ar-bicep', name: 'Bicep' }] },
        addedAt: '2026-10-01T00:00:00Z',
      },
      {
        id: 'pop1',
        extra: { artists: [{ id: 'ar-pop', name: 'Pop Star' }] },
        addedAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'pop2',
        extra: {
          artists: [{ id: 'ar-pop', name: 'Pop Star' }],
          name: 'Song pop1 - Remastered 2011',
        },
        addedAt: '2025-02-01T00:00:00Z',
      },
      {
        id: 'gone1',
        extra: { artists: [{ id: 'ar-old', name: 'Old' }], is_playable: false },
        addedAt: '2019-01-01T00:00:00Z',
      },
    ],
    playlists: { mix: ['spotify:track:a', 'spotify:track:a', 'spotify:track:b'] },
    genres: {
      'ar-cornell': ['grunge'],
      'ar-bicep': ['electronica'],
      'ar-pop': ['dance pop'],
      'ar-old': [],
    },
    created: 0,
  };
}

/** Normalizes a pop2 duplicate: its name equals pop1's song name. */
function withDuplicateNames(s: LibraryState): LibraryState {
  const pop2 = s.liked.find((t) => t.id === 'pop2');
  if (pop2) pop2.extra = { ...pop2.extra, name: 'Song pop1 - Remastered 2011' };
  const pop1 = s.liked.find((t) => t.id === 'pop1');
  if (pop1) pop1.extra = { ...pop1.extra, name: 'Song pop1' };
  return s;
}

describe('the motivating case: keep only Chris Cornell + electronic', () => {
  it('previews, then applies only after the plan id, backing up what it removes', async () => {
    const lib = state();
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(lib)));
    const preview = (await previewFilterLikedTool.run(deps, {
      mode: 'keep',
      artists: ['Chris Cornell'],
      genres: ['electronic'],
    })) as Record<string, unknown>;
    expect(preview).toMatchObject({
      total: 5,
      to_remove: 3,
      to_keep: 2,
      backup_before_apply: true,
    });
    expect(lib.liked).toHaveLength(5);
    const applied = (await applyPlanTool.run(deps, {
      plan_id: preview.plan_id as string,
    })) as Record<string, unknown>;
    expect(applied).toMatchObject({ status: 'done', items_done: 3, items_total: 3 });
    expect(lib.liked.map((t) => t.id)).toEqual(['cornell1', 'bicep1']);
    expect((await listBackups(deps))[0]).toMatchObject({ liked: 3 });
    await expect(applyPlanTool.run(deps, { plan_id: preview.plan_id as string })).rejects.toThrow(
      'does not exist or expired',
    );
  });

  it('answers "loading" while the library or genres are still being read', async () => {
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(state())), { budget: 3 });
    const first = await previewFilterLikedTool.run(deps, { mode: 'keep', genres: ['electronic'] });
    expect(first).toMatchObject({ status: 'loading' });
    expect(genresLoading(3).message).toContain('3 artists left');
  });
});

describe('other smart previews', () => {
  it('dedupes Liked Songs and a playlist', async () => {
    const lib = withDuplicateNames(state());
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(lib)));
    expect(await previewDedupeTool.run(deps, {})).toMatchObject({
      duplicates: 1,
      sample_remove: [{ uri: 'spotify:track:pop2' }],
    });
    const plan = (await previewDedupeTool.run(deps, {
      source: 'playlist',
      playlist_id: 'mix',
    })) as { plan_id: string };
    await applyPlanTool.run(deps, { plan_id: plan.plan_id });
    expect(lib.playlists.mix).toEqual(['spotify:track:a', 'spotify:track:b']);
  });

  it('finds unavailable tracks', async () => {
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(state())));
    expect(await previewUnavailableTool.run(deps, {})).toMatchObject({
      unavailable: 1,
      sample_remove: [{ uri: 'spotify:track:gone1' }],
    });
  });

  it('says when there is nothing to do', async () => {
    const lib = state();
    lib.liked = lib.liked.slice(0, 1);
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(lib)));
    expect(await previewUnavailableTool.run(deps, {})).toMatchObject({ nothing_to_do: true });
    expect(await previewDraft(deps, { title: 't', steps: [], before: null, details: {} })).toEqual({
      nothing_to_do: true,
    });
  });

  it('sync_library loads the snapshot and genres, resuming over calls', async () => {
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(state())), { budget: 2 });
    expect(await syncLibraryTool.run(deps, { with_genres: true })).toMatchObject({
      status: 'loading',
    });
    deps.budget.remaining = 40;
    expect(await syncLibraryTool.run(deps, { with_genres: true })).toMatchObject({
      status: 'ready',
      liked: 5,
      genre_artists_pending: 0,
    });
    expect(await syncLibraryTool.run(deps, { refresh: true })).toMatchObject({ status: 'ready' });
    const loading = await testOwnerDeps(
      fakeSpotify(
        libraryRoutes({
          ...state(),
          liked: Array.from({ length: 200 }, (_, i) => ({ id: `t${i}`, extra: {}, addedAt: 'x' })),
        }),
      ),
      { budget: 3 },
    );
    clearSpotifyTokenCache();
    expect(await syncLibraryTool.run(loading, {})).toMatchObject({
      status: 'loading',
      loaded: 100,
    });
  });

  it('apply_plan runs large plans over several calls and cancel_plan forgets a plan', async () => {
    const lib = state();
    lib.liked = Array.from({ length: 90 }, (_, i) => ({
      id: `t${i}`,
      extra: { artists: [{ id: 'a', name: 'X' }] },
      addedAt: '2020',
    }));
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(lib)));
    const preview = (await previewFilterLikedTool.run(deps, {
      mode: 'remove',
      artists: ['X'],
    })) as { plan_id: string };
    deps.budget.remaining = 2;
    expect(await applyPlanTool.run(deps, { plan_id: preview.plan_id })).toMatchObject({
      status: 'partial',
      items_done: 80,
    });
    deps.budget.remaining = 40;
    expect(await applyPlanTool.run(deps, { plan_id: preview.plan_id })).toMatchObject({
      status: 'done',
      items_done: 90,
    });
    const other = (await previewFilterLikedTool.run(deps, {
      mode: 'keep',
      artists: ['Nobody'],
    })) as Record<string, unknown>;
    expect(other).toMatchObject({ nothing_to_do: true, total: 0 });
    const second = (await previewDedupeTool.run(deps, {
      source: 'playlist',
      playlist_id: 'mix',
    })) as { plan_id: string };
    expect(await cancelPlanTool.run(deps, { plan_id: second.plan_id })).toEqual({
      cancelled: true,
    });
    expect(await loadPlans(deps)).toEqual([]);
  });

  it('apply_plan reports Spotify errors after saving progress', async () => {
    const lib = state();
    const routes = libraryRoutes(lib);
    const deps = await testOwnerDeps(
      fakeSpotify([
        ['DELETE', /^\/v1\/me\/library$/, () => new Response('', { status: 403 })],
        ...routes,
      ]),
    );
    const preview = (await previewUnavailableTool.run(deps, {})) as { plan_id: string };
    await expect(applyPlanTool.run(deps, { plan_id: preview.plan_id })).rejects.toThrow('403');
    expect((await loadPlans(deps))[0]?.backupId).not.toBeNull();
  });

  it('readySource and applyOutput', async () => {
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(state())));
    expect(await readySource(deps, { kind: 'liked' }, false)).toMatchObject({ genres: {} });
    const plan = {
      id: 'x',
      title: '',
      expiresAt: 0,
      steps: [{ kind: 'library_save' as const, uris: ['a', 'b'] }],
      before: null,
      backupId: 'b1',
      progress: { step: 0, offset: 1, createdPlaylistId: null, baseTotal: null, replaced: false },
      createdPlaylists: ['c'],
    };
    expect(applyOutput({ plan, finished: false, error: null })).toMatchObject({
      status: 'partial',
      items_done: 1,
      backup_id: 'b1',
      created_playlists: ['c'],
    });
  });
});

describe('previewSourceDraft', () => {
  it('passes the playlist id (or null for Liked Songs) to the builder', async () => {
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(state())));
    const seen: (string | null)[] = [];
    function build(_: unknown, id: string | null): PlanDraft {
      seen.push(id);
      return { title: 't', steps: [], before: null, details: {} };
    }
    await previewSourceDraft(deps, { kind: 'liked' }, build);
    await previewSourceDraft(deps, { kind: 'playlist', id: 'mix' }, build);
    expect(seen).toEqual([null, 'mix']);
  });
});
