/**
 * Playback tools (Spotify Premium): state, devices, play/pause, skip, seek, volume, shuffle, repeat, queue and
 * transfer. Without Premium or an active device Spotify answers 403/404, turned into a clear message.
 */
import { z } from 'zod';
import { CREATE_HINTS, READ_ONLY_HINTS, toolAnnotations } from '../../../src/mcp/annotations.js';
import { defineTool, type ToolSpec } from '../../../src/mcp/tools.js';
import { asJsonObject } from '../../../src/remote/streamed-tool.js';
import { parseTrack, trackOutput, textField } from './catalog.js';
import type { OwnerDeps } from './context.js';
import { nowPlayingOutput } from './tools-catalog.js';
import { spotifyCall } from './spotify-api.js';
import { LIBRARY_URI, PLAYABLE_URI } from './tool-kit.js';

/** A device id (from `list_devices`). */
const DEVICE_ID = z
  .string()
  .regex(/^[A-Za-z0-9]{1,100}$/)
  .optional()
  .describe('Device id from list_devices; default: the active device.');

/** Hints of playback commands: they change state but delete nothing, and repeating them is not neutral. */
const PLAYER_HINTS = CREATE_HINTS;

/** Query with the optional device id. */
export function deviceQuery(deviceId: string | undefined): Record<string, string> {
  return deviceId === undefined ? {} : { device_id: deviceId };
}

/** Compact JSON of a device. */
export function deviceOutput(value: unknown): Record<string, unknown> {
  const device = asJsonObject(value) ?? {};
  return {
    id: device.id ?? null,
    name: textField(device, 'name'),
    type: textField(device, 'type'),
    active: device.is_active === true,
    restricted: device.is_restricted === true,
    volume_percent: device.volume_percent ?? null,
  };
}

/** `playback_state`: device, item, shuffle and repeat. */
export const playbackStateTool = defineTool({
  name: 'playback_state',
  description:
    'Shows the playback state: active device, what is playing, progress, shuffle and repeat.',
  shape: {},
  annotations: toolAnnotations('Playback state', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps) => {
    const body = await spotifyCall(deps, {
      path: '/me/player',
      query: { additional_types: 'track,episode', market: 'from_token' },
    });
    const state = asJsonObject(body);
    if (!state) return { active: false, note: 'No active playback. Open Spotify on a device.' };
    return {
      ...nowPlayingOutput(state),
      device: deviceOutput(state.device),
      shuffle: state.shuffle_state === true,
      repeat: state.repeat_state ?? 'off',
    };
  },
});

/** `list_devices`: available devices. */
export const listDevicesTool = defineTool({
  name: 'list_devices',
  description:
    'Lists the devices Spotify can play on (phones, computers, speakers) with their ids.',
  shape: {},
  annotations: toolAnnotations('List devices', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps) => {
    const body = asJsonObject(await spotifyCall(deps, { path: '/me/player/devices' })) ?? {};
    return { devices: Array.isArray(body.devices) ? body.devices.map(deviceOutput) : [] };
  },
});

/** Play args of `playBody`. */
export interface PlayArgs {
  readonly context_uri?: string | undefined;
  readonly uris?: string[] | undefined;
  readonly offset_position?: number | undefined;
}

/** Body of `play`: a context (album/playlist/artist) with an optional start, or a list of tracks. */
export function playBody(args: PlayArgs): Record<string, unknown> | undefined {
  if (args.context_uri !== undefined && args.uris !== undefined)
    throw new Error('Pass context_uri or uris, not both.');
  const offset =
    args.offset_position === undefined ? {} : { offset: { position: args.offset_position } };
  if (args.context_uri !== undefined) return { context_uri: args.context_uri, ...offset };
  if (args.uris !== undefined) return { uris: args.uris, ...offset };
  return undefined;
}

/** `play`: starts or resumes playback. */
export const playTool = defineTool({
  name: 'play',
  description:
    'Starts or resumes playback (Premium). Without arguments resumes; with context_uri plays an album, playlist or artist (offset_position picks the start); with uris plays those tracks.',
  shape: {
    device_id: DEVICE_ID,
    context_uri: LIBRARY_URI.optional(),
    uris: z.array(PLAYABLE_URI).min(1).max(100).optional(),
    offset_position: z.number().int().min(0).optional(),
  },
  annotations: toolAnnotations('Play', PLAYER_HINTS),
  run: async (deps: OwnerDeps, args) => {
    const body = playBody(args);
    await spotifyCall(deps, {
      method: 'PUT',
      path: '/me/player/play',
      query: deviceQuery(args.device_id),
      ...(body ? { body } : {}),
    });
    return { ok: true };
  },
});

/** A player request without body. */
export interface PlayerCommand {
  method: 'PUT' | 'POST';
  path: string;
  query: Record<string, string | number>;
}

/** Definition of a simple player command tool. */
export interface PlayerCommandSpec<S extends z.ZodRawShape> {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly shape: S;
  readonly command: (args: z.infer<z.ZodObject<S>>) => PlayerCommand;
}

/** A simple player command tool (no body): name, title, description, method, path and query builder. */
export function playerCommandTool<S extends z.ZodRawShape>(
  spec: PlayerCommandSpec<S>,
): ToolSpec<OwnerDeps> {
  return defineTool({
    name: spec.name,
    description: `${spec.description} Needs Spotify Premium.`,
    shape: spec.shape,
    annotations: toolAnnotations(spec.title, PLAYER_HINTS),
    run: async (deps: OwnerDeps, args) => {
      await spotifyCall(deps, spec.command(args));
      return { ok: true };
    },
  });
}

/** `pause`. */
export const pauseTool = playerCommandTool({
  name: 'pause',
  title: 'Pause',
  description: 'Pauses playback.',
  shape: { device_id: DEVICE_ID },
  command: (args) => ({
    method: 'PUT',
    path: '/me/player/pause',
    query: deviceQuery(args.device_id),
  }),
});

/** `skip`: next or previous. */
export const skipTool = playerCommandTool({
  name: 'skip',
  title: 'Skip track',
  description: 'Skips to the next or the previous track.',
  shape: { direction: z.enum(['next', 'previous']).default('next'), device_id: DEVICE_ID },
  command: (args) => ({
    method: 'POST',
    path: `/me/player/${args.direction}`,
    query: deviceQuery(args.device_id),
  }),
});

/** `seek`. */
export const seekTool = playerCommandTool({
  name: 'seek',
  title: 'Seek',
  description: 'Jumps to a position (milliseconds) in the current track.',
  shape: { position_ms: z.number().int().min(0), device_id: DEVICE_ID },
  command: (args) => ({
    method: 'PUT',
    path: '/me/player/seek',
    query: { position_ms: args.position_ms, ...deviceQuery(args.device_id) },
  }),
});

/** `set_volume`. */
export const setVolumeTool = playerCommandTool({
  name: 'set_volume',
  title: 'Set volume',
  description: 'Sets the volume (0–100) of the device.',
  shape: { volume_percent: z.number().int().min(0).max(100), device_id: DEVICE_ID },
  command: (args) => ({
    method: 'PUT',
    path: '/me/player/volume',
    query: { volume_percent: args.volume_percent, ...deviceQuery(args.device_id) },
  }),
});

/** `set_shuffle`. */
export const setShuffleTool = playerCommandTool({
  name: 'set_shuffle',
  title: 'Set shuffle',
  description: 'Turns shuffle on or off.',
  shape: { state: z.boolean(), device_id: DEVICE_ID },
  command: (args) => ({
    method: 'PUT',
    path: '/me/player/shuffle',
    query: { state: String(args.state), ...deviceQuery(args.device_id) },
  }),
});

/** `set_repeat`. */
export const setRepeatTool = playerCommandTool({
  name: 'set_repeat',
  title: 'Set repeat',
  description: 'Sets repeat: track, context (album/playlist) or off.',
  shape: { state: z.enum(['track', 'context', 'off']), device_id: DEVICE_ID },
  command: (args) => ({
    method: 'PUT',
    path: '/me/player/repeat',
    query: { state: args.state, ...deviceQuery(args.device_id) },
  }),
});

/** `add_to_queue`. */
export const addToQueueTool = playerCommandTool({
  name: 'add_to_queue',
  title: 'Add to queue',
  description: 'Adds a track or episode to the end of the queue.',
  shape: { uri: PLAYABLE_URI, device_id: DEVICE_ID },
  command: (args) => ({
    method: 'POST',
    path: '/me/player/queue',
    query: { uri: args.uri, ...deviceQuery(args.device_id) },
  }),
});

/** `get_queue`: what plays now and next. */
export const getQueueTool = defineTool({
  name: 'get_queue',
  description: 'Shows the current track and the upcoming queue.',
  shape: {},
  annotations: toolAnnotations('Get queue', READ_ONLY_HINTS),
  run: async (deps: OwnerDeps) => {
    const body = asJsonObject(await spotifyCall(deps, { path: '/me/player/queue' })) ?? {};
    const current = parseTrack(body.currently_playing);
    const queue = (Array.isArray(body.queue) ? body.queue : [])
      .map(parseTrack)
      .filter((t) => t !== null);
    return {
      current: current ? trackOutput(current) : null,
      queue: queue.map((t) => trackOutput(t)),
    };
  },
});

/** `transfer_playback`: moves playback to another device. */
export const transferPlaybackTool = defineTool({
  name: 'transfer_playback',
  description:
    'Moves playback to another device (id from list_devices); play: true starts playing there. Needs Spotify Premium.',
  shape: { device_id: z.string().regex(/^[A-Za-z0-9]{1,100}$/), play: z.boolean().default(false) },
  annotations: toolAnnotations('Transfer playback', PLAYER_HINTS),
  run: async (deps: OwnerDeps, args) => {
    await spotifyCall(deps, {
      method: 'PUT',
      path: '/me/player',
      body: { device_ids: [args.device_id], play: args.play },
    });
    return { ok: true, device_id: args.device_id };
  },
});
