import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import {
  entryJson,
  fakeSpotify,
  pagedRoute,
  playlistJson,
  testOwnerDeps,
  trackJson,
  type SpotifyCallRecord,
} from './fixtures/fake-spotify.js';
import {
  advanceSnapshot,
  emptySnapshot,
  fetchPlaylistInfo,
  forgetSource,
  isLoading,
  isSnapshotReusable,
  LIKED_FRESH_MS,
  loadCompleteSource,
  loadingStatus,
  loadSource,
  sourceKey,
  sourceRequest,
  sourceVersion,
} from './sources.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

const LIKED = Array.from({ length: 130 }, (_, i) =>
  entryJson(trackJson(`t${i}`), `2024-01-${String((i % 28) + 1).padStart(2, '0')}`),
);

describe('source snapshots', () => {
  it('names sources and their requests (market=from_token for availability)', () => {
    expect(sourceKey({ kind: 'liked' })).toBe('liked');
    expect(sourceKey({ kind: 'playlist', id: 'p1' })).toBe('playlist-p1');
    expect(sourceRequest({ kind: 'liked' })).toEqual({
      path: '/me/tracks',
      query: { market: 'from_token' },
    });
    expect(sourceRequest({ kind: 'playlist', id: 'a/b' }).path).toBe('/playlists/a%2Fb/items');
  });

  it('loads Liked Songs over several calls when the budget is small, then reuses it while fresh', async () => {
    const calls: SpotifyCallRecord[] = [];
    const deps = await testOwnerDeps(fakeSpotify([pagedRoute(/\/v1\/me\/tracks$/, LIKED)], calls), {
      budget: 3,
    });
    const first = await loadCompleteSource(deps, { kind: 'liked' });
    expect(isLoading(first)).toBe(true);
    deps.budget.remaining = 3;
    const second = await loadCompleteSource(deps, { kind: 'liked' });
    expect(isLoading(second)).toBe(false);
    if (isLoading(second)) throw new Error('unreachable');
    expect(second.tracks).toHaveLength(130);
    const before = calls.length;
    await loadSource(deps, { kind: 'liked' });
    expect(calls.length).toBe(before);
  });

  it('starts over when refreshed', async () => {
    const deps = await testOwnerDeps(fakeSpotify([pagedRoute(/\/v1\/me\/tracks$/, LIKED)]));
    await loadSource(deps, { kind: 'liked' });
    const again = await loadSource(deps, { kind: 'liked' }, true);
    expect(again.tracks).toHaveLength(130);
  });

  it('reloads a playlist when its snapshot_id changes', async () => {
    let snap = 's1';
    const routes = [
      [
        'GET',
        /^\/v1\/playlists\/p1$/,
        () => Response.json(playlistJson('p1', { snapshot_id: snap })),
      ] as const,
      pagedRoute(/^\/v1\/playlists\/p1\/items$/, LIKED.slice(0, 3)),
    ];
    const deps = await testOwnerDeps(fakeSpotify(routes));
    const first = await loadSource(deps, { kind: 'playlist', id: 'p1' });
    expect(first).toMatchObject({ name: 'List p1', snapshotId: 's1', nextOffset: null });
    snap = 's2';
    expect((await loadSource(deps, { kind: 'playlist', id: 'p1' })).snapshotId).toBe('s2');
  });

  it('decides reuse by freshness or version', () => {
    const liked = emptySnapshot({ kind: 'liked' }, { name: 'L', snapshotId: '', now: 0 });
    expect(isSnapshotReusable(liked, { snapshotId: '', now: LIKED_FRESH_MS - 1 })).toBe(true);
    expect(isSnapshotReusable(liked, { snapshotId: '', now: LIKED_FRESH_MS })).toBe(false);
    const list = emptySnapshot(
      { kind: 'playlist', id: 'p' },
      { name: 'P', snapshotId: 'a', now: 0 },
    );
    expect(isSnapshotReusable(list, { snapshotId: 'a', now: 1e12 })).toBe(true);
    expect(isSnapshotReusable(list, { snapshotId: 'b', now: 0 })).toBe(false);
    expect(isSnapshotReusable(null, { snapshotId: '', now: 0 })).toBe(false);
  });

  it('advanceSnapshot leaves a complete snapshot alone; loadingStatus explains how to continue', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    const done = {
      ...emptySnapshot({ kind: 'liked' }, { name: 'L', snapshotId: '', now: 0 }),
      nextOffset: null,
    };
    expect(await advanceSnapshot(deps, { kind: 'liked' }, done)).toBe(done);
    expect(loadingStatus({ ...done, total: 9 }).message).toContain(
      'call the same tool again'.replace('call', 'Call'),
    );
    expect(await sourceVersion(deps, { kind: 'liked' })).toEqual({
      name: 'Liked Songs',
      snapshotId: '',
    });
  });

  it('reports a playlist Spotify does not return', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([['GET', /^\/v1\/playlists\/x$/, () => Response.json({})]]),
    );
    await expect(sourceVersion(deps, { kind: 'playlist', id: 'x' })).rejects.toThrow('no playlist');
  });
});

describe('source helpers', () => {
  it('fetchPlaylistInfo reads one playlist and forgetSource drops its snapshot', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([
        ['GET', /^\/v1\/playlists\/p1$/, () => Response.json(playlistJson('p1'))],
        pagedRoute(/items$/, []),
      ]),
    );
    expect((await fetchPlaylistInfo(deps, 'p1')).name).toBe('List p1');
    await loadSource(deps, { kind: 'playlist', id: 'p1' });
    const before = deps.kv.entries.size;
    await forgetSource(deps, { kind: 'playlist', id: 'p1' });
    expect(deps.kv.entries.size).toBe(before - 1);
  });
});
