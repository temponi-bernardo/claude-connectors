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
  type SpotifyRoute,
} from './fixtures/fake-spotify.js';
import {
  addPlaylistItemsTool,
  checkCoverImage,
  createPlaylistFromQueriesTool,
  createPlaylistTool,
  firstTrackPerQuery,
  getPlaylistTool,
  listMyPlaylistsTool,
  playlistDetailsBody,
  playlistItemsPage,
  removePlaylistItemsTool,
  reorderPlaylistItemsTool,
  setPlaylistCoverTool,
  updatePlaylistDetailsTool,
} from './tools-playlists.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

function ok(): Response {
  return Response.json({ snapshot_id: 's' });
}
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4]).toString('base64');

describe('playlist tools', () => {
  it('lists playlists, marking and filtering your own', async () => {
    const all = [
      playlistJson('mine'),
      playlistJson('theirs', { owner: { id: 'x', display_name: 'X' } }),
    ];
    const deps = await testOwnerDeps(fakeSpotify([pagedRoute(/\/v1\/me\/playlists$/, all)]));
    expect(await listMyPlaylistsTool.run(deps, {})).toMatchObject({
      total: 2,
      items: [
        { id: 'mine', mine: true },
        { id: 'theirs', mine: false },
      ],
    });
    expect(await listMyPlaylistsTool.run(deps, { only_mine: true })).toMatchObject({
      items: [{ id: 'mine' }],
    });
  });

  it('get_playlist returns items only for own or collaborative playlists', async () => {
    const routes: SpotifyRoute[] = [
      ['GET', /\/v1\/playlists\/mine$/, () => Response.json(playlistJson('mine'))],
      [
        'GET',
        /\/v1\/playlists\/theirs$/,
        () => Response.json(playlistJson('theirs', { owner: { id: 'x' } })),
      ],
      pagedRoute(/\/v1\/playlists\/mine\/items$/, [entryJson(trackJson('a'))]),
    ];
    const deps = await testOwnerDeps(fakeSpotify(routes));
    expect(await getPlaylistTool.run(deps, { playlist_id: 'spotify:playlist:mine' })).toMatchObject(
      { tracks: [{ uri: 'spotify:track:a' }], next_offset: null },
    );
    expect(await getPlaylistTool.run(deps, { playlist_id: 'theirs' })).toHaveProperty('note');
    expect(await playlistItemsPage(deps, 'mine', { offset: 0, limit: 1 })).toMatchObject({
      offset: 0,
    });
  });

  it('creates playlists (private by default; collaborative forces private) and adds items', async () => {
    const calls: SpotifyCallRecord[] = [];
    const routes: SpotifyRoute[] = [
      ['POST', /\/v1\/me\/playlists$/, () => Response.json({ id: 'new' }, { status: 201 })],
      ['POST', /\/items$/, ok],
      ['PUT', /\/v1\/playlists\/new$/, () => new Response(null)],
    ];
    const deps = await testOwnerDeps(fakeSpotify(routes, calls));
    expect(await createPlaylistTool.run(deps, { name: 'N', uris: ['spotify:track:a'] })).toEqual({
      playlist_id: 'new',
      uri: 'spotify:playlist:new',
      added: 1,
    });
    expect(
      JSON.parse(calls.find((c) => c.url.pathname === '/v1/me/playlists')?.body ?? '{}'),
    ).toEqual({ name: 'N', description: '', public: false });
    await createPlaylistTool.run(deps, { name: 'C', collaborative: true });
    expect(JSON.parse(calls.find((c) => c.method === 'PUT')?.body ?? '{}')).toEqual({
      name: 'C',
      public: false,
      collaborative: true,
    });
  });

  it('builds a playlist from search queries and reports what was not found', async () => {
    const routes: SpotifyRoute[] = [
      [
        'GET',
        /\/v1\/search$/,
        (c) =>
          Response.json({
            tracks: { items: c.url.searchParams.get('q') === 'none' ? [] : [trackJson('found')] },
          }),
      ],
      ['POST', /\/v1\/me\/playlists$/, () => Response.json({ id: 'new' })],
      ['POST', /\/items$/, ok],
    ];
    const deps = await testOwnerDeps(fakeSpotify(routes));
    const out = await createPlaylistFromQueriesTool.run(deps, {
      name: 'Grunge',
      queries: ['track:Seasons artist:Chris Cornell', 'none'],
    });
    expect(out).toMatchObject({
      playlist_id: 'new',
      added: [{ uri: 'spotify:track:found' }],
      not_found: ['none'],
    });
    expect(await firstTrackPerQuery(deps, ['none'])).toEqual([null]);
    const empty = await testOwnerDeps(
      fakeSpotify([['GET', /\/v1\/search$/, () => Response.json({})], routes[1]!]),
    );
    expect(
      await createPlaylistFromQueriesTool.run(empty, { name: 'E', queries: ['x'] }),
    ).toMatchObject({ added: [] });
  });

  it('updates details, validating the collaborative rule', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([['PUT', /\/v1\/playlists\/p$/, () => new Response(null)]]),
    );
    expect(
      await updatePlaylistDetailsTool.run(deps, { playlist_id: 'p', name: 'New', public: true }),
    ).toEqual({ playlist_id: 'p', updated: ['name', 'public'] });
    await expect(updatePlaylistDetailsTool.run(deps, { playlist_id: 'p' })).rejects.toThrow(
      'at least one',
    );
    expect(() => playlistDetailsBody({ collaborative: true, public: true })).toThrow(
      'must be private',
    );
    expect(playlistDetailsBody({ description: 'd', collaborative: false })).toEqual({
      description: 'd',
      collaborative: false,
    });
  });

  it('adds at a position, removes and reorders items', async () => {
    const calls: SpotifyCallRecord[] = [];
    const deps = await testOwnerDeps(
      fakeSpotify(
        [
          ['POST', /\/items$/, ok],
          ['DELETE', /\/items$/, ok],
          ['PUT', /\/items$/, ok],
        ],
        calls,
      ),
    );
    await addPlaylistItemsTool.run(deps, {
      playlist_id: 'p',
      uris: ['spotify:track:a'],
      position: 0,
    });
    await removePlaylistItemsTool.run(deps, { playlist_id: 'p', uris: ['spotify:track:a'] });
    await reorderPlaylistItemsTool.run(deps, {
      playlist_id: 'p',
      range_start: 5,
      insert_before: 0,
    });
    const bodies = calls
      .filter((c) => c.url.pathname === '/v1/playlists/p/items')
      .map((c) => JSON.parse(c.body) as unknown);
    expect(bodies).toEqual([
      { uris: ['spotify:track:a'], position: 0 },
      { items: [{ uri: 'spotify:track:a' }] },
      { range_start: 5, insert_before: 0, range_length: 1 },
    ]);
    await addPlaylistItemsTool.run(deps, { playlist_id: 'p', uris: ['spotify:track:b'] });
    expect(JSON.parse(calls.at(-1)?.body ?? '{}')).toEqual({ uris: ['spotify:track:b'] });
  });

  it('uploads a JPEG cover and refuses other images or oversized ones', async () => {
    const calls: SpotifyCallRecord[] = [];
    const deps = await testOwnerDeps(
      fakeSpotify([['PUT', /\/images$/, () => new Response(null, { status: 202 })]], calls),
    );
    await setPlaylistCoverTool.run(deps, {
      playlist_id: 'p',
      image_base64: `data:image/jpeg;base64,${JPEG}`,
    });
    expect(calls.at(-1)?.headers.get('content-type')).toBe('image/jpeg');
    expect(calls.at(-1)?.body).toBe(JPEG);
    expect(() => checkCoverImage(Buffer.from('PNGxxxxx').toString('base64'))).toThrow('JPEG');
    expect(() => checkCoverImage('A'.repeat(300_000))).toThrow('256 KB');
  });
});
