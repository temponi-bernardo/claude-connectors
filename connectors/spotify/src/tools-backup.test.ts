import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import { fakeSpotify, testOwnerDeps } from './fixtures/fake-spotify.js';
import { libraryRoutes, type LibraryState } from './fixtures/library-store.js';
import {
  createBackupTool,
  deleteBackupTool,
  exportBackupTool,
  listBackupsTool,
  previewRestoreTool,
  restoreDraft,
  restoreSteps,
} from './tools-backup.js';
import { applyPlanTool, previewFilterLikedTool } from './tools-smart.js';
import type { StoredBackup } from './backups.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

function state(): LibraryState {
  return {
    liked: [
      {
        id: 'keep',
        extra: { artists: [{ id: 'a', name: 'Keep' }] },
        addedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'drop',
        extra: { artists: [{ id: 'b', name: 'Drop' }] },
        addedAt: '2025-01-01T00:00:00Z',
      },
    ],
    playlists: { mix: ['spotify:track:x', 'spotify:local:a:b:c:1'] },
    genres: {},
    created: 0,
  };
}

describe('backup tools', () => {
  it('backs up Liked Songs and a playlist, lists, exports and deletes', async () => {
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(state())));
    const liked = (await createBackupTool.run(deps, {})) as {
      backup: { id: string; liked: number };
    };
    expect(liked.backup.liked).toBe(2);
    const playlist = (await createBackupTool.run(deps, {
      source: 'playlist',
      playlist_id: 'mix',
    })) as { backup: { id: string; playlists: number } };
    expect(playlist.backup.playlists).toBe(1);
    expect(((await listBackupsTool.run(deps, {})) as { backups: unknown[] }).backups).toHaveLength(
      2,
    );
    expect(
      await exportBackupTool.run(deps, { backup_id: liked.backup.id, limit: 1 }),
    ).toMatchObject({ total: 2, next_offset: 1, items: [{ uri: 'spotify:track:keep' }] });
    expect(await deleteBackupTool.run(deps, { backup_id: playlist.backup.id })).toEqual({
      deleted: true,
    });
  });

  it('answers "loading" for big sources', async () => {
    const lib = state();
    lib.liked = Array.from({ length: 200 }, (_, i) => ({ id: `t${i}`, extra: {}, addedAt: 'x' }));
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(lib)), { budget: 3 });
    expect(await createBackupTool.run(deps, {})).toMatchObject({ status: 'loading' });
  });

  it('restores what an automatic backup saved before a cleanup', async () => {
    const lib = state();
    const deps = await testOwnerDeps(fakeSpotify(libraryRoutes(lib)));
    const cleanup = (await previewFilterLikedTool.run(deps, {
      mode: 'keep',
      artists: ['Keep'],
    })) as { plan_id: string };
    const done = (await applyPlanTool.run(deps, { plan_id: cleanup.plan_id })) as {
      backup_id: string;
    };
    expect(lib.liked.map((t) => t.id)).toEqual(['keep']);
    const restore = (await previewRestoreTool.run(deps, { backup_id: done.backup_id })) as {
      plan_id: string;
      liked: number;
    };
    expect(restore.liked).toBe(1);
    await applyPlanTool.run(deps, { plan_id: restore.plan_id });
    expect(lib.liked.map((t) => t.id).sort()).toEqual(['drop', 'keep']);
  });

  it('recreates playlists as new ones, without local files', () => {
    const backup: StoredBackup = {
      id: 'b'.repeat(12),
      label: 'l',
      createdAt: '2026-11-24T00:00:00Z',
      liked: 0,
      playlists: 1,
      library: 1,
      content: {
        label: 'l',
        library: [{ uri: 'spotify:playlist:old', name: 'Old', artists: '', addedAt: '' }],
        playlists: [
          {
            id: 'p',
            name: 'Mix',
            description: '',
            isPublic: null,
            tracks: [
              { uri: 'spotify:track:x', name: '', artists: '', addedAt: '' },
              { uri: 'spotify:local:a', name: '', artists: '', addedAt: '' },
            ],
          },
        ],
      },
    };
    expect(restoreSteps(backup)).toEqual([
      { kind: 'library_save', uris: ['spotify:playlist:old'] },
      {
        kind: 'playlist_create',
        name: 'Mix (restored)',
        description: 'Restored from backup 2026-11-24.',
        isPublic: false,
        uris: ['spotify:track:x'],
      },
    ]);
    expect(restoreDraft({ ...backup, content: { label: 'empty' } }).steps).toEqual([]);
  });

  it('refuses malformed backup ids', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    await expect(exportBackupTool.run(deps, { backup_id: '../x' })).rejects.toThrow();
  });
});
