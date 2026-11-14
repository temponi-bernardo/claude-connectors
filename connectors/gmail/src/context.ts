/**
 * Dependencies injected into the Gmail connector (settings, KV, network and clock), so tests can swap the
 * network and the clock without global mocks.
 */
import type { GmailSettings } from './config.js';

/** The subset of Workers KV the connector uses. */
export interface KvStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

/** Injectable `fetch`. */
export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

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
}

/** User-Agent sent to Google (lesson from Canvas: calls without a User-Agent may be blocked). */
export const UPSTREAM_USER_AGENT = 'claude-connectors-gmail/0.1';
