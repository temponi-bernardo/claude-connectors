import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import { fakeSpotify, testOwnerDeps, type SpotifyCallRecord } from './fixtures/fake-spotify.js';
import {
  ensureGenres,
  fetchArtistGenres,
  loadGenreCache,
  MAX_CACHED_ARTISTS,
  missingArtistIds,
  saveGenreCache,
} from './genres.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

function artistRoute(calls: SpotifyCallRecord[]): ReturnType<typeof fakeSpotify> {
  return fakeSpotify(
    [
      [
        'GET',
        /^\/v1\/artists\/[^/]+$/,
        (c) =>
          Response.json({
            id: c.url.pathname.split('/').pop(),
            genres: c.url.pathname.endsWith('none') ? undefined : ['electronica', 'house'],
          }),
      ],
    ],
    calls,
  );
}

describe('artist genres with a per-user cache', () => {
  it('fetches each missing artist once and caches it (also artists without genres)', async () => {
    const calls: SpotifyCallRecord[] = [];
    const deps = await testOwnerDeps(artistRoute(calls));
    const first = await ensureGenres(deps, ['a1', 'none', 'a1', '']);
    expect(first.missing).toBe(0);
    expect(first.genres).toEqual({ a1: ['electronica', 'house'], none: [] });
    const apiCalls = calls.filter((c) => c.url.pathname.startsWith('/v1/artists')).length;
    await ensureGenres(deps, ['a1', 'none']);
    expect(calls.filter((c) => c.url.pathname.startsWith('/v1/artists')).length).toBe(apiCalls);
  });

  it('stops within the budget and reports the missing count', async () => {
    const deps = await testOwnerDeps(artistRoute([]), { budget: 3 });
    const result = await ensureGenres(deps, ['a', 'b', 'c', 'd']);
    expect(result.missing).toBe(2);
    expect(Object.keys(await loadGenreCache(deps))).toHaveLength(2);
  });

  it('keeps the cache per user', async () => {
    const shared = await testOwnerDeps(artistRoute([]));
    await ensureGenres(shared, ['a']);
    const other = await testOwnerDeps(artistRoute([]), { owner: 'spotify:other', kv: shared.kv });
    expect(await loadGenreCache(other)).toEqual({});
  });

  it('rethrows other errors', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([['GET', /^\/v1\/artists\//, () => new Response('', { status: 400 })]]),
    );
    await expect(ensureGenres(deps, ['a'])).rejects.toThrow('400');
  });

  it('helpers: missing ids, fetch and trimming', async () => {
    expect(missingArtistIds(['a', 'b', 'a'], { a: [] })).toEqual(['b']);
    const deps = await testOwnerDeps(artistRoute([]));
    expect(await fetchArtistGenres(deps, 'x')).toEqual(['electronica', 'house']);
    const big = Object.fromEntries(
      Array.from({ length: MAX_CACHED_ARTISTS + 2 }, (_, i) => [`k${i}`, []]),
    );
    await saveGenreCache(deps, big);
    expect(Object.keys(await loadGenreCache(deps))).toHaveLength(MAX_CACHED_ARTISTS);
  });
});
