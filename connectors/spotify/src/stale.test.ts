import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import { parsePlaylist } from './catalog.js';
import {
  entryJson,
  fakeSpotify,
  pagedRoute,
  playlistJson,
  testOwnerDeps,
  trackJson,
  type SpotifyRoute,
} from './fixtures/fake-spotify.js';
import {
  currentVersions,
  fetchAllPlaylists,
  fetchLastAdded,
  fillLastAdded,
  scanOwnPlaylists,
  stalePlaylists,
} from './stale.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

const PLAYLISTS = [
  playlistJson('old', { items: { total: 2 } }),
  playlistJson('new', { items: { total: 1 } }),
  playlistJson('empty', { items: { total: 0 } }),
  playlistJson('theirs', { owner: { id: 'someone' }, items: { total: 1 } }),
];

const ROUTES: SpotifyRoute[] = [
  pagedRoute(/\/v1\/me\/playlists$/, PLAYLISTS),
  pagedRoute(/\/v1\/playlists\/old\/items$/, [
    entryJson(trackJson('a'), '2020-01-01'),
    entryJson(trackJson('b'), '2021-06-01'),
  ]),
  pagedRoute(/\/v1\/playlists\/new\/items$/, [entryJson(trackJson('c'), '2026-10-01')]),
];

describe('abandoned playlists', () => {
  it('scans own playlists only and finds the newest addition of each', async () => {
    const deps = await testOwnerDeps(fakeSpotify(ROUTES));
    const scan = await scanOwnPlaylists(deps, 'owner-user');
    expect(scan.own.map((p) => p.id)).toEqual(['old', 'new', 'empty']);
    expect(scan.missing).toBe(0);
    expect(scan.cache).toMatchObject({
      'snap-old': '2021-06-01',
      'snap-new': '2026-10-01',
      'snap-empty': '',
    });
    const stale = stalePlaylists(scan.own, {
      cache: scan.cache,
      cutoff: '2025-01-01',
      includeEmpty: true,
    });
    expect(stale.map((s) => s.playlist.id)).toEqual(['old', 'empty']);
    expect(
      stalePlaylists(scan.own, { cache: scan.cache, cutoff: '2025-01-01', includeEmpty: false }),
    ).toHaveLength(1);
  });

  it('resumes across calls when the budget runs out', async () => {
    const deps = await testOwnerDeps(fakeSpotify(ROUTES), { budget: 3 });
    const first = await scanOwnPlaylists(deps, 'owner-user');
    expect(first.missing).toBe(2);
    deps.budget.remaining = 5;
    expect((await scanOwnPlaylists(deps, 'owner-user')).missing).toBe(0);
  });

  it('refuses when the playlist list itself does not fit, and rethrows other errors', async () => {
    const many = Array.from({ length: 120 }, (_, i) => playlistJson(`p${i}`));
    const deps = await testOwnerDeps(fakeSpotify([pagedRoute(/\/v1\/me\/playlists$/, many)]), {
      budget: 2,
    });
    await expect(scanOwnPlaylists(deps, 'owner-user')).rejects.toThrow('SPOTIFY_CALL_BUDGET');
    const broken = await testOwnerDeps(
      fakeSpotify([['GET', /items$/, () => new Response('', { status: 400 })]]),
    );
    const info = parsePlaylist(playlistJson('x', { items: { total: 1 } }))!;
    await expect(fillLastAdded(broken, [info], {})).rejects.toThrow('400');
  });

  it('helpers: listing and last added of an empty playlist', async () => {
    const deps = await testOwnerDeps(fakeSpotify(ROUTES));
    expect((await fetchAllPlaylists(deps)).complete).toBe(true);
    expect(await fetchLastAdded(deps, parsePlaylist(playlistJson('e'))!)).toBe('');
  });
});

describe('currentVersions', () => {
  it('keeps only entries of the current playlist versions', () => {
    const own = [parsePlaylist(playlistJson('a', { snapshot_id: 'a2' }))!];
    expect(currentVersions({ a1: 'old', a2: 'new' }, own)).toEqual({ a2: 'new' });
    expect(currentVersions(null, own)).toEqual({});
  });
});
