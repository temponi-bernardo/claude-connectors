/**
 * Bridge lifecycle inside the `WhatsAppBridge` Durable Object: restores the R2 snapshot when the container wakes up
 * empty, forwards calls with the `BRIDGE_TOKEN`, saves snapshots after syncs (at most one per minute) and enforces
 * the hard hourly send limit in the Durable Object storage.
 */
import { logWarning } from '../../../src/core/redact.js';
import { ACCESS_LIST_KEY, ACCESS_ROUTE, parseAccessList } from './access.js';
import { bridgeErrorFrom } from './bridge-client.js';
import {
  archiveSnapshot,
  storeSnapshotResponse,
  type FixedLength,
  type SnapshotBucket,
  type SnapshotOutcome,
  SNAPSHOT_KEY_NAME,
} from './snapshots.js';

/** What the lifecycle needs from the Durable Object (a port, testable with fakes). */
export interface BridgeHost {
  /** The `Container`'s `containerFetch`: wakes the container if needed and forwards the request. */
  readonly containerFetch: (url: string, init?: RequestInit) => Promise<Response>;
  readonly bucket: SnapshotBucket;
  readonly fixedLength: FixedLength;
  readonly storage: {
    get<T>(key: string): Promise<T | undefined>;
    put(key: string, value: unknown): Promise<void>;
  };
  readonly waitUntil: (promise: Promise<unknown>) => void;
  readonly stop: () => Promise<void>;
  readonly bridgeToken: string;
  readonly sendMaxPerHour: number;
  readonly now: () => number;
}

/** Minimum interval between usage-triggered snapshots (ms). */
export const SNAPSHOT_INTERVAL_MS = 60_000;

/** Bridge routes after which the database may have changed and a snapshot is worth trying. */
export const SNAPSHOT_AFTER_PATHS: ReadonlySet<string> = new Set([
  '/sync/wait',
  '/status',
  '/send',
  '/logout',
  '/pair/code',
  '/pair/qr',
]);

/** Durable Object storage key holding the timestamps of recent sends. */
export const SEND_HISTORY_KEY = 'send-history';

/** Adds the bridge `Authorization` to a request's options. */
export function withBridgeToken(token: string, init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers);
  headers.set('authorization', `Bearer ${token}`);
  return { ...init, headers };
}

/** Makes an authenticated request to the bridge inside the container. */
export function fetchBridge(host: BridgeHost, path: string, init?: RequestInit): Promise<Response> {
  return host.containerFetch(`http://bridge${path}`, withBridgeToken(host.bridgeToken, init));
}

/** Reads the bridge phase (`GET /health`). */
export async function readBridgePhase(host: BridgeHost): Promise<string> {
  const res = await fetchBridge(host, '/health');
  const body = (await res.json()) as { phase?: unknown };
  return typeof body.phase === 'string' ? body.phase : 'unknown';
}

/** Options for `POST /restore`: the bucket snapshot as a stream, or `X-Snapshot: none` if there is none. */
export async function restoreRequestInit(host: BridgeHost): Promise<RequestInit> {
  const snapshot = await host.bucket.get(SNAPSHOT_KEY_NAME);
  if (!snapshot) return { method: 'POST', headers: { 'x-snapshot': 'none' } };
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/octet-stream',
      'content-length': String(snapshot.size),
    },
    body: snapshot.body,
  };
}

/** Restores the bridge if it just woke up; a rejected snapshot throws (never starts over on its own). */
export async function ensureRestored(host: BridgeHost): Promise<void> {
  if ((await readBridgePhase(host)) !== 'awaiting_restore') return;
  const res = await fetchBridge(host, '/restore', await restoreRequestInit(host));
  // 409: another request restored first.
  if (res.ok || res.status === 409) return;
  throw bridgeErrorFrom(res.status, await res.json().catch(() => null));
}

/** Asks the bridge for the snapshot and writes it to the bucket. */
export async function snapshotBridge(host: BridgeHost, force = false): Promise<SnapshotOutcome> {
  // force=1: after a failed write, the bridge would otherwise return 204 (already delivered).
  const res = await fetchBridge(host, force ? '/snapshot?force=1' : '/snapshot');
  return storeSnapshotResponse(host.bucket, res, host.fixedLength);
}

/** Decides a send: allowed (with the new history) or refused with how many seconds to wait. Pure. */
export function planSend(
  history: readonly number[],
  now: number,
  maxPerHour: number,
): { readonly allowed: boolean; readonly history: number[]; readonly retryAfterSeconds: number } {
  const recent = history.filter((at) => at > now - 3_600_000).sort((a, b) => a - b);
  if (recent.length < maxPerHour)
    return { allowed: true, history: [...recent, now], retryAfterSeconds: 0 };
  const oldest = recent[recent.length - maxPerHour] ?? now;
  return {
    allowed: false,
    history: recent,
    retryAfterSeconds: Math.ceil((oldest + 3_600_000 - now) / 1000),
  };
}

/** Enforces the send limit; returns the 429 response if exceeded, or null (and records the send) if allowed. */
export async function guardSend(host: BridgeHost): Promise<Response | null> {
  const history = (await host.storage.get<number[]>(SEND_HISTORY_KEY)) ?? [];
  const plan = planSend(history, host.now(), host.sendMaxPerHour);
  await host.storage.put(SEND_HISTORY_KEY, plan.history);
  if (plan.allowed) return null;
  return Response.json(
    { error: 'rate_limited', retry_after_seconds: plan.retryAfterSeconds },
    { status: 429 },
  );
}

/** Options to forward an incoming request to the bridge (method, type and body). */
export function forwardInit(request: Request): RequestInit {
  const type = request.headers.get('content-type');
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  return {
    method: request.method,
    ...(type ? { headers: { 'content-type': type } } : {}),
    ...(hasBody && request.body ? { body: request.body } : {}),
  };
}

/** Assembled lifecycle: handles requests and saves snapshots serially. */
export interface BridgeLifecycle {
  readonly handle: (request: Request) => Promise<Response>;
  readonly snapshotNow: () => Promise<SnapshotOutcome>;
  readonly snapshotQuietly: () => Promise<void>;
}

/** Saves snapshots serially (never two at once) and decides when usage deserves a snapshot. */
export class SnapshotScheduler {
  private chain: Promise<unknown> = Promise.resolve();
  private lastAt = 0;
  private forceNext = false;

  constructor(private readonly host: BridgeHost) {}

  /** Takes a snapshot after the ones already queued. */
  snapshotNow(): Promise<SnapshotOutcome> {
    const run = this.chain.then(() => this.runSnapshot());
    this.chain = run.catch(() => undefined);
    this.lastAt = this.host.now();
    return run;
  }

  /** Requests the snapshot; if it fails, the next one is forced so nothing that missed R2 is lost. */
  private async runSnapshot(): Promise<SnapshotOutcome> {
    const force = this.forceNext;
    try {
      const outcome = await snapshotBridge(this.host, force);
      this.forceNext = false;
      return outcome;
    } catch (error) {
      this.forceNext = true;
      throw error;
    }
  }

  /** Takes a snapshot and only logs a failure. */
  snapshotQuietly(): Promise<void> {
    return logSnapshotFailure(this.snapshotNow());
  }

  /** After a route that may change the database, schedules a snapshot if the last one is over a minute old. */
  maybeSnapshot(path: string): void {
    if (SNAPSHOT_AFTER_PATHS.has(path) && this.host.now() - this.lastAt >= SNAPSHOT_INTERVAL_MS) {
      this.host.waitUntil(this.snapshotQuietly());
    }
  }
}

/** Builds the bridge lifecycle for a Durable Object. */
export function createBridgeLifecycle(host: BridgeHost): BridgeLifecycle {
  const scheduler = new SnapshotScheduler(host);
  return {
    handle: (request) => routeBridgeRequest({ host, scheduler }, request),
    snapshotNow: () => scheduler.snapshotNow(),
    snapshotQuietly: () => scheduler.snapshotQuietly(),
  };
}

/** Awaits a snapshot and only logs a failure (without message data). */
export async function logSnapshotFailure(run: Promise<SnapshotOutcome>): Promise<void> {
  try {
    await run;
  } catch (error) {
    logWarning('Snapshot failed:', error);
  }
}

/** Dependencies of the Durable Object router. */
export interface BridgeRouter {
  readonly host: BridgeHost;
  readonly scheduler: Pick<SnapshotScheduler, 'snapshotNow' | 'maybeSnapshot'>;
}

/** Starts over: archives the current snapshot and stops the container (the next use starts empty). */
export async function resetBridge(host: BridgeHost): Promise<Response> {
  const archived = await archiveSnapshot(host.bucket, new Date(host.now()), host.fixedLength);
  await host.stop();
  return Response.json({ reset: true, archived });
}

/** Access list route (`/__access`): GET reads it, PUT validates and saves it; never wakes the container. */
export async function handleAccessRoute(host: BridgeHost, request: Request): Promise<Response> {
  if (request.method !== 'PUT') {
    return Response.json(parseAccessList(await host.storage.get(ACCESS_LIST_KEY)));
  }
  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== 'object' || body === null) {
    return Response.json(
      { error: 'bad_request', message: 'The access list must be a JSON object.' },
      { status: 400 },
    );
  }
  const list = parseAccessList(body);
  await host.storage.put(ACCESS_LIST_KEY, list);
  return Response.json(list);
}

/** Handles a Worker request: internal routes (`/__snapshot`, `/__reset`, `/__access`) or forwarding to the bridge. */
export async function routeBridgeRequest(
  router: BridgeRouter,
  request: Request,
): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === '/__snapshot')
    return Response.json({ outcome: await router.scheduler.snapshotNow() });
  if (url.pathname === '/__reset') return resetBridge(router.host);
  if (url.pathname === ACCESS_ROUTE) return handleAccessRoute(router.host, request);
  await ensureRestored(router.host);
  if (url.pathname === '/send') {
    const refused = await guardSend(router.host);
    if (refused) return refused;
  }
  const res = await fetchBridge(router.host, url.pathname + url.search, forwardInit(request));
  router.scheduler.maybeSnapshot(url.pathname);
  return res;
}
