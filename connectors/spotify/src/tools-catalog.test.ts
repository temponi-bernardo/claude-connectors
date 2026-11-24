import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import {
  fakeSpotify,
  testOwnerDeps,
  trackJson,
  type SpotifyCallRecord,
} from './fixtures/fake-spotify.js';
import {
  artistReleases,
  currentlyPlayingTool,
  getArtistTool,
  nowPlayingOutput,
  recentlyPlayedTool,
  searchOutput,
  spotifySearchTool,
  topItemsTool,
} from './tools-catalog.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

describe('catalog tools', () => {
  it('search sends types, the 10-item limit and the market, and groups results', async () => {
    const calls: SpotifyCallRecord[] = [];
    const body = {
      tracks: { items: [trackJson('a')], total: 1 },
      artists: { items: [{ uri: 'spotify:artist:x', type: 'artist', name: 'X' }], total: 1 },
    };
    const deps = await testOwnerDeps(
      fakeSpotify([['GET', /\/v1\/search$/, () => Response.json(body)]], calls),
    );
    const out = await spotifySearchTool.run(deps, {
      query: 'artist:"Chris Cornell"',
      types: ['track', 'artist'],
    });
    expect(out).toMatchObject({ tracks: { total: 1 }, artists: { items: [{ name: 'X' }] } });
    const query = calls.find((c) => c.url.pathname === '/v1/search')?.url.searchParams;
    expect(query?.get('type')).toBe('track,artist');
    expect(query?.get('limit')).toBe('10');
    await expect(spotifySearchTool.run(deps, { query: 'x', limit: 11 })).rejects.toThrow();
  });

  it('get_artist accepts a link and adds the latest releases on request', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([
        [
          'GET',
          /\/v1\/artists\/abc$/,
          () =>
            Response.json({
              uri: 'spotify:artist:abc',
              type: 'artist',
              name: 'Bicep',
              genres: ['electronica'],
            }),
        ],
        [
          'GET',
          /\/v1\/artists\/abc\/albums$/,
          () =>
            Response.json({
              items: [{ uri: 'spotify:album:1', type: 'album', name: 'Isles' }],
              total: 1,
            }),
        ],
      ]),
    );
    expect(
      await getArtistTool.run(deps, { artist: 'https://open.spotify.com/artist/abc' }),
    ).toMatchObject({ name: 'Bicep', genres: ['electronica'] });
    expect(await getArtistTool.run(deps, { artist: 'abc', include_releases: true })).toMatchObject({
      latest_releases: [{ name: 'Isles' }],
    });
    const failing = await testOwnerDeps(fakeSpotify([]));
    expect(await artistReleases(failing, 'zzz')).toEqual([]);
  });

  it('currently_playing handles nothing playing and an item', async () => {
    expect(nowPlayingOutput(null)).toMatchObject({ playing: false });
    expect(
      nowPlayingOutput({
        is_playing: true,
        progress_ms: 5,
        item: trackJson('a'),
        context: { uri: 'spotify:playlist:p' },
      }),
    ).toMatchObject({
      playing: true,
      context: 'spotify:playlist:p',
      item: { uri: 'spotify:track:a' },
    });
    expect(nowPlayingOutput({ is_playing: false, item: null })).toMatchObject({
      item: null,
      progress_ms: null,
      context: null,
    });
    const deps = await testOwnerDeps(
      fakeSpotify([['GET', /currently-playing$/, () => new Response(null, { status: 204 })]]),
    );
    expect(await currentlyPlayingTool.run(deps, {})).toMatchObject({ playing: false });
  });

  it('recently_played lists tracks with when they were played', async () => {
    const calls: SpotifyCallRecord[] = [];
    const items = [{ track: trackJson('a'), played_at: '2026-11-20T10:00:00Z' }, { track: null }];
    const deps = await testOwnerDeps(
      fakeSpotify([['GET', /recently-played$/, () => Response.json({ items })]], calls),
    );
    const out = (await recentlyPlayedTool.run(deps, { before: '2026-11-21T00:00:00Z' })) as {
      items: { added_at: string }[];
    };
    expect(out.items).toEqual([expect.objectContaining({ added_at: '2026-11-20T10:00:00Z' })]);
    expect(calls.at(-1)?.url.searchParams.get('before')).toBe(
      String(Date.parse('2026-11-21T00:00:00Z')),
    );
    await recentlyPlayedTool.run(deps, {});
    expect(calls.at(-1)?.url.searchParams.get('before')).toBeNull();
  });

  it('top_items passes the time range', async () => {
    const calls: SpotifyCallRecord[] = [];
    const deps = await testOwnerDeps(
      fakeSpotify(
        [
          [
            'GET',
            /\/v1\/me\/top\/artists$/,
            () =>
              Response.json({
                items: [{ uri: 'spotify:artist:a', type: 'artist', name: 'A' }],
                total: 1,
              }),
          ],
        ],
        calls,
      ),
    );
    expect(
      await topItemsTool.run(deps, { type: 'artists', time_range: 'short_term' }),
    ).toMatchObject({ total: 1, items: [{ name: 'A' }] });
    expect(calls.at(-1)?.url.searchParams.get('time_range')).toBe('short_term');
    expect(searchOutput({}, ['show'])).toEqual({ shows: { total: 0, items: [] } });
  });
});
