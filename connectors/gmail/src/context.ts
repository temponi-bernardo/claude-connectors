/**
 * Dependencies injected into the Gmail connector (settings, KV, network and clock), so tests can swap the
 * network and the clock without global mocks.
 */
import type { Fetcher, KvStore } from '../../../src/remote/worker-kit.js';
import type { GmailSettings } from './config.js';

export type { Fetcher, KvStore };

/** Everything the tools and the linking flows need. */
export interface GmailDeps {
  readonly settings: GmailSettings;
  readonly kv: KvStore;
  readonly fetch: Fetcher;
  /** Clock in Unix milliseconds. */
  readonly now: () => number;
  /** Public origin of the Worker (`https://gmail-remote.<account>.workers.dev`), for linking links. */
  readonly origin: string;
}

/** Dependencies of an authenticated request: the usual ones plus the connector user. */
export interface OwnerDeps extends GmailDeps {
  /** Stable Google user id (`sub` from sign-in), owner of the linked accounts. */
  readonly owner: string;
  /** Email the owner signed in with (shown on the link confirmation page); absent outside `/mcp`. */
  readonly ownerEmail?: string;
}

/** User-Agent sent to Google (lesson from Canvas: calls without a User-Agent may be blocked). */
export const UPSTREAM_USER_AGENT = 'claude-connectors-gmail/0.1';
