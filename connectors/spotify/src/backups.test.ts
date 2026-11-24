import { describe, expect, it } from 'vitest';
import {
  backupEntry,
  backupPage,
  deleteAllBackups,
  deleteBackup,
  listBackups,
  MAX_BACKUPS,
  requireBackup,
  saveBackup,
  toBackupPlaylist,
  toBackupTrack,
} from './backups.js';
import { parseAddedTrack, parsePlaylist } from './catalog.js';
import {
  entryJson,
  fakeSpotify,
  playlistJson,
  testOwnerDeps,
  trackJson,
} from './fixtures/fake-spotify.js';

const TRACK = parseAddedTrack(entryJson(trackJson('a'), '2024-02-02'))!;

describe('backups', () => {
  it('converts tracks and playlists for a backup', () => {
    expect(toBackupTrack(TRACK)).toEqual({
      uri: 'spotify:track:a',
      name: 'Song a',
      artists: 'Artist a',
      addedAt: '2024-02-02',
    });
    const info = parsePlaylist(playlistJson('p'));
    if (!info) throw new Error('fixture');
    expect(toBackupPlaylist(info, [TRACK])).toMatchObject({
      id: 'p',
      name: 'List p',
      tracks: [{ uri: 'spotify:track:a' }],
    });
    expect(backupEntry('i', { label: 'l', liked: [toBackupTrack(TRACK)] }, 'd')).toEqual({
      id: 'i',
      label: 'l',
      createdAt: 'd',
      liked: 1,
      playlists: 0,
      library: 0,
    });
  });

  it('saves, lists, reads, pages and deletes backups', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    const entry = await saveBackup(deps, {
      label: 'liked',
      liked: Array.from({ length: 5 }, () => toBackupTrack(TRACK)),
    });
    expect(await listBackups(deps)).toEqual([entry]);
    const stored = await requireBackup(deps, entry.id);
    expect(backupPage(stored, { section: 'liked', offset: 0, limit: 2 })).toMatchObject({
      total: 5,
      next_offset: 2,
    });
    expect(backupPage(stored, { section: 'playlists', offset: 0, limit: 2 })).toMatchObject({
      total: 0,
      next_offset: null,
    });
    expect(await deleteBackup(deps, entry.id)).toBe(true);
    expect(await deleteBackup(deps, entry.id)).toBe(false);
    await expect(requireBackup(deps, entry.id)).rejects.toThrow('list_backups');
  });

  it('prunes the oldest beyond the limit and erases all on request', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    const first = await saveBackup(deps, { label: 'first' });
    for (let i = 0; i < MAX_BACKUPS; i += 1) await saveBackup(deps, { label: `b${i}` });
    const all = await listBackups(deps);
    expect(all).toHaveLength(MAX_BACKUPS);
    expect(all.some((b) => b.id === first.id)).toBe(false);
    expect(await deleteAllBackups(deps)).toBe(MAX_BACKUPS);
    expect(await listBackups(deps)).toEqual([]);
  });

  it('a user cannot read another user’s backup', async () => {
    const alice = await testOwnerDeps(fakeSpotify([]));
    const entry = await saveBackup(alice, { label: 'secret' });
    const bob = await testOwnerDeps(fakeSpotify([]), { owner: 'spotify:bob', kv: alice.kv });
    await expect(requireBackup(bob, entry.id)).rejects.toThrow('does not exist');
  });
});
