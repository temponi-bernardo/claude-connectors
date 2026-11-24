/**
 * Spotify Web API client: authenticated requests with the per-call budget, one silent token renewal after a 401,
 * `Retry-After` honoured on 429 (short waits only) and one retry on 5xx. Errors become actionable messages.
 */
import { buildUrl, type QueryParams } from '../../../src/core/http.js';
import { forgetSpotifyAccessToken, getSpotifyAccessToken } from './access-token.js';
import { MAX_RETRY_WAIT_SECONDS } from './config.js';
import { SPOTIFY_USER_AGENT, type OwnerDeps } from './context.js';
import { spendCall, spotifyHttpError } from './spotify-errors.js';

/** Base address of the Web API. */
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

/** Attempts per request (first try plus retries). */
export const SPOTIFY_MAX_ATTEMPTS = 3;

/** Pause before retrying a 5xx (ms). */
export const SPOTIFY_SERVER_RETRY_MS = 500;

/** One Web API request. `jpeg` sends a base64 JPEG body (playlist cover) instead of JSON. */
export interface SpotifyCall {
  readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  readonly path: string;
  readonly query?: QueryParams;
  readonly body?: unknown;
  readonly jpeg?: string;
}

/** What to do after a response: use it, renew the token and retry, wait and retry, or fail. */
export type RetryDecision =
  | { readonly kind: 'done' }
  | { readonly kind: 'renew' }
  | { readonly kind: 'wait'; readonly ms: number }
  | { readonly kind: 'fail' };

/** Seconds of `Retry-After` (1 when absent or invalid). */
export function retryAfterSeconds(response: Response): number {
  const value = Number(response.headers.get('retry-after'));
  return Number.isFinite(value) && value > 0 ? Math.ceil(value) : 1;
}

/** Decides the next step for a response on the given attempt (1-based). Pure. */
export function decideRetry(response: Response, attempt: number): RetryDecision {
  if (response.ok) return { kind: 'done' };
  if (response.status === 401) return attempt === 1 ? { kind: 'renew' } : { kind: 'fail' };
  return attempt < SPOTIFY_MAX_ATTEMPTS ? retryableDecision(response) : { kind: 'fail' };
}

/** Retry decision for a status that may be retried: 429 waits for `Retry-After`, 5xx waits briefly. */
export function retryableDecision(response: Response): RetryDecision {
  if (response.status === 429) return rateLimitDecision(retryAfterSeconds(response));
  if (response.status >= 500) return { kind: 'wait', ms: SPOTIFY_SERVER_RETRY_MS };
  return { kind: 'fail' };
}

/** Waits for a short `Retry-After`; fails on a long one (the message then says how long). */
export function rateLimitDecision(seconds: number): RetryDecision {
  return seconds <= MAX_RETRY_WAIT_SECONDS
    ? { kind: 'wait', ms: seconds * 1000 }
    : { kind: 'fail' };
}

/** Request init for a call with the access token. */
export function spotifyRequestInit(call: SpotifyCall, token: string): RequestInit {
  const headers: Record<string, string> = {
    authorization: `Bearer ${token}`,
    'user-agent': SPOTIFY_USER_AGENT,
  };
  let body: string | undefined;
  if (call.jpeg !== undefined) {
    headers['content-type'] = 'image/jpeg';
    body = call.jpeg;
  } else if (call.body !== undefined) {
    headers['content-type'] = 'application/json';
    body = JSON.stringify(call.body);
  }
  return { method: call.method ?? 'GET', headers, ...(body === undefined ? {} : { body }) };
}

/** Sends one attempt (spending one unit of the budget). */
export async function sendSpotifyAttempt(deps: OwnerDeps, call: SpotifyCall): Promise<Response> {
  const token = await getSpotifyAccessToken(deps);
  spendCall(deps.budget);
  const url = buildUrl(SPOTIFY_API_BASE, call.path, call.query ?? {});
  return deps.fetch(url.toString(), spotifyRequestInit(call, token));
}

/** Reads a response body: JSON, or null when empty or not JSON (204, 202...). */
export async function readSpotifyBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/** Makes a Web API request with renewal and retries; returns the parsed body (null when empty). */
export async function spotifyCall(deps: OwnerDeps, call: SpotifyCall): Promise<unknown> {
  for (let attempt = 1; ; attempt += 1) {
    const response = await sendSpotifyAttempt(deps, call);
    const decision = decideRetry(response, attempt);
    if (decision.kind === 'done') return readSpotifyBody(response);
    if (decision.kind === 'fail') {
      const body = await readSpotifyBody(response);
      const retryAfter = retryAfterSeconds(response);
      throw spotifyHttpError(response.status, call.path, { body, retryAfter });
    }
    if (decision.kind === 'renew') forgetSpotifyAccessToken(deps.owner);
    else await deps.sleep(decision.ms);
  }
}
