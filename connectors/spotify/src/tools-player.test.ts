import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import {
  fakeSpotify,
  testOwnerDeps,
  trackJson,
  type SpotifyCallRecord,
} from './fixtures/fake-spotify.js';
import {
  addToQueueTool,
  deviceOutput,
  deviceQuery,
  getQueueTool,
  listDevicesTool,
  pauseTool,
  playbackStateTool,
  playBody,
  playerCommandTool,
  playTool,
  seekTool,
  setRepeatTool,
  setShuffleTool,
  setVolumeTool,
  skipTool,
  transferPlaybackTool,
} from './tools-player.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

function ok(): Response {
  return new Response(null, { status: 204 });
}

describe('player tools', () => {
  it('sends each command to the right endpoint with the device', async () => {
    const calls: SpotifyCallRecord[] = [];
    const deps = await testOwnerDeps(
      fakeSpotify(
        [
          ['PUT', /\/me\/player/, ok],
          ['POST', /\/me\/player/, ok],
        ],
        calls,
      ),
    );
    await pauseTool.run(deps, { device_id: 'd1' });
    await skipTool.run(deps, { direction: 'previous' });
    await seekTool.run(deps, { position_ms: 1000 });
    await setVolumeTool.run(deps, { volume_percent: 30 });
    await setShuffleTool.run(deps, { state: true });
    await setRepeatTool.run(deps, { state: 'context' });
    await addToQueueTool.run(deps, { uri: 'spotify:track:a' });
    await transferPlaybackTool.run(deps, { device_id: 'd2', play: true });
    await playTool.run(deps, { context_uri: 'spotify:album:x', offset_position: 2 });
    await playTool.run(deps, {});
    const api = calls.filter((c) => c.url.pathname.startsWith('/v1/'));
    expect(api.map((c) => `${c.method} ${c.url.pathname}`)).toEqual([
      'PUT /v1/me/player/pause',
      'POST /v1/me/player/previous',
      'PUT /v1/me/player/seek',
      'PUT /v1/me/player/volume',
      'PUT /v1/me/player/shuffle',
      'PUT /v1/me/player/repeat',
      'POST /v1/me/player/queue',
      'PUT /v1/me/player',
      'PUT /v1/me/player/play',
      'PUT /v1/me/player/play',
    ]);
    expect(api[0]?.url.searchParams.get('device_id')).toBe('d1');
    expect(api[4]?.url.searchParams.get('state')).toBe('true');
    expect(JSON.parse(api[8]?.body ?? '{}')).toEqual({
      context_uri: 'spotify:album:x',
      offset: { position: 2 },
    });
    expect(api[9]?.body).toBe('');
  });

  it('explains Premium and no-device errors', async () => {
    const premium = await testOwnerDeps(
      fakeSpotify([
        [
          'PUT',
          /pause$/,
          () =>
            Response.json({ error: { status: 403, reason: 'PREMIUM_REQUIRED' } }, { status: 403 }),
        ],
      ]),
    );
    await expect(pauseTool.run(premium, {})).rejects.toThrow('Premium');
    clearSpotifyTokenCache();
    const nodevice = await testOwnerDeps(
      fakeSpotify([
        [
          'PUT',
          /play$/,
          () =>
            Response.json({ error: { status: 404, reason: 'NO_ACTIVE_DEVICE' } }, { status: 404 }),
        ],
      ]),
    );
    await expect(playTool.run(nodevice, { uris: ['spotify:track:a'] })).rejects.toThrow(
      'No active Spotify device',
    );
  });

  it('reads state, devices and queue', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([
        [
          'GET',
          /\/v1\/me\/player$/,
          () =>
            Response.json({
              is_playing: true,
              item: trackJson('a'),
              device: { id: 'd', name: 'Phone', type: 'Smartphone', is_active: true },
              shuffle_state: true,
              repeat_state: 'off',
            }),
        ],
        [
          'GET',
          /devices$/,
          () => Response.json({ devices: [{ id: 'd', name: 'Phone', volume_percent: 50 }] }),
        ],
        [
          'GET',
          /queue$/,
          () => Response.json({ currently_playing: trackJson('a'), queue: [trackJson('b'), null] }),
        ],
      ]),
    );
    expect(await playbackStateTool.run(deps, {})).toMatchObject({
      playing: true,
      shuffle: true,
      device: { name: 'Phone', active: true },
    });
    expect(await listDevicesTool.run(deps, {})).toMatchObject({
      devices: [{ id: 'd', volume_percent: 50 }],
    });
    expect(await getQueueTool.run(deps, {})).toMatchObject({
      current: { uri: 'spotify:track:a' },
      queue: [{ uri: 'spotify:track:b' }],
    });
    const idle = await testOwnerDeps(
      fakeSpotify([
        ['GET', /\/v1\/me\/player$/, () => new Response(null, { status: 204 })],
        ['GET', /devices$/, () => Response.json({})],
        ['GET', /queue$/, () => Response.json({})],
      ]),
    );
    expect(await playbackStateTool.run(idle, {})).toMatchObject({ active: false });
    expect(await listDevicesTool.run(idle, {})).toEqual({ devices: [] });
    expect(await getQueueTool.run(idle, {})).toEqual({ current: null, queue: [] });
  });

  it('helpers', () => {
    expect(deviceQuery(undefined)).toEqual({});
    expect(deviceOutput(null)).toMatchObject({ id: null, active: false });
    expect(() => playBody({ context_uri: 'spotify:album:a', uris: ['spotify:track:b'] })).toThrow(
      'not both',
    );
    expect(playBody({ uris: ['spotify:track:b'] })).toEqual({ uris: ['spotify:track:b'] });
    expect(playBody({})).toBeUndefined();
    expect(
      playerCommandTool({
        name: 'x',
        title: 'X',
        description: 'd',
        shape: {},
        command: () => ({ method: 'PUT', path: '/me/player/x', query: {} }),
      }).description,
    ).toContain('Premium');
  });
});
