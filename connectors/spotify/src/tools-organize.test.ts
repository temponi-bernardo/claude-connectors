import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import { parsePlaylist } from './catalog.js';
import { fakeSpotify, playlistJson, testOwnerDeps } from './fixtures/fake-spotify.js';
import { libraryRoutes, type LibraryState } from './fixtures/library-store.js';
import {
  copiedTracks,
  copyLikedDraft,
  LIKED_SORT_REFUSAL,
  loadMergeSources,
  mergePreviewDraft,
  previewCopyLikedTool,
  previewLibraryChangeTool,
  previewOrganizeTool,
  previewStalePlaylistsTool,
  sortDraft,
  sourcePreviewDraft,
  staleDraft,
} from './tools-organize.js';
import { applyPlanTool } from './tools-smart.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

function state(): LibraryState {
  return {
    liked: [
      {
        id: 'n1',
        extra: { artists: [{ id: 'ar-b', name: 'Bicep' }] },
        addedAt: '2026-11-20T00:00:00Z',
      },
      {
        id: 'n2',
        extra: {
          artists: [{ id: 'ar-c', name: 'Cornell' }],
          album: { name: 'A', release_date: '1994' },
        },
        addedAt: '2026-11-19T00:00:00Z',
      },
      {
        id: 'o1',
        extra: { artists: [{ id: 'ar-b', name: 'Bicep' }] },
        addedAt: '2026-01-01T00:00:00Z',
      },
    ],
    playlists: {
      p1: ['spotify:track:z', 'spotify:track:a', 'spotify:track:m'],
      p2: ['spotify:track:a', 'spotify:track:q'],
      old: [],
    },
    genres: { 'ar-b': ['electronica'], 'ar-c': ['grunge'] },
    created: 0,
  };
}

describe('organizing previews', () => {
  it('copies this week’s likes into a new playlist (weekly routine)', async () => {
    const lib = state();
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(lib)));
    const preview = (await previewCopyLikedTool.run(deps, {
      name: 'Week 47',
      added_after: '2026-11-17',
    })) as { plan_id: string; items: number };
    expect(preview.items).toBe(2);
    await applyPlanTool.run(deps, { plan_id: preview.plan_id });
    expect(lib.playlists.created1).toEqual(['spotify:track:n1', 'spotify:track:n2']);
  });

  it('copies all likes sorted by genre, capped', async () => {
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(state())));
    const preview = await previewCopyLikedTool.run(deps, {
      name: 'All',
      sort_by: 'genre',
      max_items: 2,
    });
    expect(preview).toMatchObject({
      items: 2,
      sample: [{ uri: 'spotify:track:n1' }, { uri: 'spotify:track:n2' }],
    });
  });

  it('sorts a playlist by name (rewrite after backup) and refuses sorting Liked Songs', async () => {
    const lib = state();
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(lib)));
    const preview = (await previewOrganizeTool.run(deps, {
      action: 'sort',
      source: 'playlist',
      playlist_id: 'p1',
      by: 'name',
    })) as { plan_id: string; backup_before_apply: boolean };
    expect(preview.backup_before_apply).toBe(true);
    await applyPlanTool.run(deps, { plan_id: preview.plan_id });
    expect(lib.playlists.p1).toEqual(['spotify:track:a', 'spotify:track:m', 'spotify:track:z']);
    await expect(previewOrganizeTool.run(deps, { action: 'sort' })).rejects.toThrow(
      LIKED_SORT_REFUSAL,
    );
  });

  it('splits Liked Songs by genre and merges playlists without repeats', async () => {
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(state())));
    const split = await previewOrganizeTool.run(deps, {
      action: 'split',
      by: 'genre',
      min_group_size: 1,
      name: 'Likes',
    });
    expect(split).toMatchObject({
      playlists: [
        { name: 'electronica', items: 2 },
        { name: 'grunge', items: 1 },
      ],
    });
    const merge = await previewOrganizeTool.run(deps, {
      action: 'merge',
      playlist_ids: ['p1', 'spotify:playlist:p2'],
      name: 'Both',
    });
    expect(merge).toMatchObject({ items: 4, dropped_duplicates: 1 });
    await expect(previewOrganizeTool.run(deps, { action: 'merge', name: 'x' })).rejects.toThrow();
  });

  it('merge and sort drafts answer "loading" while a playlist is read', async () => {
    const lib = state();
    lib.playlists.big = Array.from({ length: 300 }, (_, i) => `spotify:track:t${i}`);
    lib.playlists.big2 = Array.from({ length: 300 }, (_, i) => `spotify:track:u${i}`);
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(lib)), { budget: 4 });
    expect(await loadMergeSources(deps, ['big', 'p1'])).toMatchObject({ status: 'loading' });
    deps.budget.remaining = 3;
    const args = {
      action: 'merge' as const,
      source: 'liked' as const,
      playlist_ids: ['big', 'p1'],
      by: 'artist' as const,
      descending: false,
      name: 'x',
      min_group_size: 1,
      dedupe: true,
    };
    expect(await mergePreviewDraft(deps, args)).toMatchObject({ status: 'loading' });
    await expect(mergePreviewDraft(deps, { ...args, playlist_ids: ['one'] })).rejects.toThrow(
      '2 to 10',
    );
    deps.budget.remaining = 3;
    expect(
      await sourcePreviewDraft(deps, {
        ...args,
        action: 'sort',
        source: 'playlist',
        playlist_id: 'big2',
      }),
    ).toMatchObject({ status: 'loading' });
  });

  it('finds abandoned playlists and plans removing them from the library', async () => {
    const lib = state();
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(lib)));
    const preview = (await previewStalePlaylistsTool.run(deps, { months: 6 })) as {
      stale: number;
      sample: { name: string; last_added: string }[];
    };
    expect(preview.stale).toBe(3);
    expect(preview.sample).toContainEqual({ name: 'List old', last_added: 'empty' });
    expect(
      await previewStalePlaylistsTool.run(deps, { months: 120, include_empty: false }),
    ).toMatchObject({ nothing_to_do: true });
    const slow = await testOwnerDeps(fakeSpotify(libraryRoutes(state())), { budget: 3 });
    clearSpotifyTokenCache();
    expect(await previewStalePlaylistsTool.run(slow, {})).toMatchObject({ status: 'loading' });
  });

  it('plans bulk library changes, backing up only removals', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    const uris = ['spotify:track:a', 'spotify:track:a', 'spotify:artist:b'];
    expect(await previewLibraryChangeTool.run(deps, { action: 'remove', uris })).toMatchObject({
      items: 2,
      backup_before_apply: true,
    });
    expect(await previewLibraryChangeTool.run(deps, { action: 'save', uris })).toMatchObject({
      backup_before_apply: false,
    });
  });

  it('pure drafts', async () => {
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(state())));
    const ready = {
      snapshot: {
        key: 'liked',
        name: 'L',
        snapshotId: '',
        startedAt: 0,
        total: 0,
        nextOffset: null,
        tracks: [],
      },
      genres: {},
    };
    expect(
      copiedTracks(ready, {
        filter: {},
        name: 'n',
        description: '',
        public: false,
        descending: false,
      }),
    ).toEqual([]);
    expect(
      copyLikedDraft(ready, {
        filter: {},
        name: 'n',
        description: '',
        public: false,
        descending: false,
      }).steps,
    ).toHaveLength(1);
    expect(
      sortDraft(ready.snapshot, { playlistId: 'p', key: 'name', descending: true, genres: {} })
        .steps,
    ).toHaveLength(1);
    const info = parsePlaylist(playlistJson('x'))!;
    expect(
      staleDraft([{ playlist: info, lastAdded: '2020' }], { ownCount: 1, cutoff: 'c' }).details,
    ).toMatchObject({ stale: 1 });
    expect(deps.owner).toBeTruthy();
  });
});
