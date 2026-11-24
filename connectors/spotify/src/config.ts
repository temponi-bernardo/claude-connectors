/**
 * Spotify connector settings, read from the Worker secrets and variables. Pure: it only validates text. The
 * host owns no Spotify app: each user brings their own Client ID and Secret (ADR 0033).
 */
import { envValue, type EnvVars } from '../../../src/core/env.js';
import { parseSealKey } from '../../../src/remote/seal.js';

/**
 * Minimal scopes for everything the tools do: library, playlists (incl. cover upload), follows, top items,
 * history and playback. Nothing about email, birthdate or account settings.
 */
export const SPOTIFY_SCOPES: readonly string[] = [
  'user-library-read',
  'user-library-modify',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'ugc-image-upload',
  'user-follow-read',
  'user-follow-modify',
  'user-top-read',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
];

/** Spotify Web API calls one tool call may make by default (the Workers Free plan allows 50 subrequests). */
export const DEFAULT_CALL_BUDGET = 40;

/** Highest budget a host may configure (Workers Paid allows far more subrequests). */
export const MAX_CALL_BUDGET = 900;

/** Longest `Retry-After` (seconds) a tool waits for inside the call; longer ones become an error. */
export const MAX_RETRY_WAIT_SECONDS = 5;

/** Validated connector settings. */
export interface SpotifySettings {
  readonly tokenKey: Buffer;
  /** Spotify calls allowed per tool call; long operations resume on the next call. */
  readonly callBudget: number;
}

/** Reads `SPOTIFY_CALL_BUDGET` (optional): the default when absent; throws outside 5..`MAX_CALL_BUDGET`. */
export function parseCallBudget(raw: string | null): number {
  if (raw === null) return DEFAULT_CALL_BUDGET;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 5 || value > MAX_CALL_BUDGET) {
    throw new Error(`SPOTIFY_CALL_BUDGET must be an integer from 5 to ${MAX_CALL_BUDGET}.`);
  }
  return value;
}

/** Builds the settings from the Worker environment. */
export function readSpotifySettings(env: EnvVars): SpotifySettings {
  return {
    tokenKey: parseSealKey(envValue(env, 'TOKEN_ENC_KEY'), 'TOKEN_ENC_KEY'),
    callBudget: parseCallBudget(envValue(env, 'SPOTIFY_CALL_BUDGET')),
  };
}

/** Tells whether the text looks like a Spotify app Client ID or Client Secret (32 hexadecimal characters). */
export function isSpotifyAppCredential(text: string): boolean {
  return /^[0-9a-f]{32}$/i.test(text);
}
