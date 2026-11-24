/**
 * Dependencies injected into the Spotify connector (settings, KV, network, clock and sleep), so tests swap the
 * network and the clock without global mocks.
 */
import type { OAuthHelpers } from '@cloudflare/workers-oauth-provider';
import type { Fetcher } from '../../../src/remote/worker-kit.js';
import type { SpotifySettings } from './config.js';
import type { ListableKv } from './vault.js';

/** Everything the sign-in flow and the tools need. */
export interface SpotifyDeps {
  readonly settings: SpotifySettings;
  readonly kv: ListableKv;
  readonly fetch: Fetcher;
  /** Clock in Unix milliseconds. */
  readonly now: () => number;
  /** Waits (used for `Retry-After`). */
  readonly sleep: (ms: number) => Promise<void>;
  /** Public origin of the Worker, for the Spotify Redirect URI. */
  readonly origin: string;
}

/** Spotify calls still allowed in this tool call (shared by every helper of the call). */
export interface CallBudget {
  remaining: number;
}

/** Dependencies of an authenticated `/mcp` request: the usual ones plus the user and the call budget. */
export interface OwnerDeps extends SpotifyDeps {
  /** Stable Spotify account id of the connector user. */
  readonly owner: string;
  readonly budget: CallBudget;
  /** OAuth helpers, to revoke Claude's grants on `disconnect` (absent in unit tests). */
  readonly oauth?: OAuthHelpers;
}

/** User-Agent sent to Spotify. */
export const SPOTIFY_USER_AGENT = 'claude-connectors-spotify/0.1';
