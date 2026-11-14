import { describe, expect, it, vi } from 'vitest';
import { fakeHost, textOf, type FakeRoute } from './fixtures/fakes.js';
import {
  createBridgeLifecycle,
  ensureRestored,
  fetchBridge,
  forwardInit,
  guardSend,
  logSnapshotFailure,
  planSend,
  readBridgePhase,
  resetBridge,
  restoreRequestInit,
  routeBridgeRequest,
  SEND_HISTORY_KEY,
  SNAPSHOT_AFTER_PATHS,
  SNAPSHOT_INTERVAL_MS,
  SnapshotScheduler,
  snapshotBridge,
  withBridgeToken,
} from './lifecycle.js';
import { SNAPSHOT_KEY_NAME, storeSnapshot } from './snapshots.js';
import { streamOf } from './fixtures/fakes.js';

function readyRoute(extra: FakeRoute = () => Response.json({ ok: true })): FakeRoute {
  return (path, init) =>
    path === '/health' ? Response.json({ phase: 'ready' }) : extra(path, init);
}

function snapshotReply(): Response {
  return new Response('snap', { headers: { 'content-length': '4', 'x-snapshot-generation': '1' } });
}

describe('withBridgeToken and fetchBridge', () => {
  it('adds the Authorization without losing the other headers', () => {
    const init = withBridgeToken('t', { method: 'POST', headers: { 'x-a': '1' } });
    const headers = new Headers(init.headers);
    expect([init.method, headers.get('authorization'), headers.get('x-a')]).toEqual([
      'POST',
      'Bearer t',
      '1',
    ]);
  });

  it('talks to the bridge at the internal address, authenticated', async () => {
    const host = fakeHost(() => Response.json({}));
    await fetchBridge(host, '/status');
    expect(host.calls[0]?.path).toBe('/status');
    expect(new Headers(host.calls[0]?.init.headers).get('authorization')).toBe(
      'Bearer bridge-token',
    );
  });
});

describe('readBridgePhase and ensureRestored', () => {
  it('reads the phase and does not restore a ready bridge', async () => {
    const host = fakeHost(readyRoute());
    expect(await readBridgePhase(host)).toBe('ready');
    await ensureRestored(host);
    expect(host.calls.map((call) => call.path)).toEqual(['/health', '/health']);
    const odd = fakeHost(() => Response.json({}));
    expect(await readBridgePhase(odd)).toBe('unknown');
  });

  it('without a snapshot in the bucket, restores with X-Snapshot: none', async () => {
    const host = fakeHost((path) =>
      path === '/health' ? Response.json({ phase: 'awaiting_restore' }) : Response.json({}),
    );
    await ensureRestored(host);
    const restore = host.calls[1];
    expect(restore?.path).toBe('/restore');
    expect(new Headers(restore?.init.headers).get('x-snapshot')).toBe('none');
  });

  it('with a snapshot, streams the file with its size', async () => {
    const host = fakeHost(() => Response.json({}));
    await storeSnapshot(
      host.bucket,
      { body: streamOf('encrypted'), length: 9, generation: 3 },
      (b) => b,
    );
    const init = await restoreRequestInit(host);
    expect(new Headers(init.headers).get('content-length')).toBe('9');
    expect(await textOf(init.body as ReadableStream<Uint8Array>)).toBe('encrypted');
  });

  it('accepts 409 (another request restored) and throws if the snapshot is rejected', async () => {
    const conflict = fakeHost((path) =>
      path === '/health'
        ? Response.json({ phase: 'awaiting_restore' })
        : new Response('', { status: 409 }),
    );
    await expect(ensureRestored(conflict)).resolves.toBeUndefined();
    const bad = fakeHost((path) =>
      path === '/health'
        ? Response.json({ phase: 'awaiting_restore' })
        : Response.json({ error: 'bad_snapshot' }, { status: 422 }),
    );
    await expect(ensureRestored(bad)).rejects.toMatchObject({ code: 'bad_snapshot' });
  });
});

describe('snapshotBridge and SnapshotScheduler', () => {
  it('saves the snapshot the bridge returns', async () => {
    const host = fakeHost(() => snapshotReply());
    expect(await snapshotBridge(host)).toBe('saved');
    await expect(host.bucket.head(SNAPSHOT_KEY_NAME)).resolves.not.toBeNull();
  });

  it('schedules a snapshot only after the right routes and at most once per interval', async () => {
    let clock = 0;
    const host = fakeHost(() => new Response(null, { status: 204 }), { now: () => clock });
    const scheduler = new SnapshotScheduler(host);
    clock = SNAPSHOT_INTERVAL_MS;
    scheduler.maybeSnapshot('/chats');
    expect(host.waited).toHaveLength(0);
    scheduler.maybeSnapshot('/sync/wait');
    scheduler.maybeSnapshot('/status');
    expect(host.waited).toHaveLength(1);
    clock += SNAPSHOT_INTERVAL_MS;
    scheduler.maybeSnapshot('/status');
    expect(host.waited).toHaveLength(2);
    await Promise.all(host.waited);
    expect(SNAPSHOT_AFTER_PATHS.has('/pair/code')).toBe(true);
  });

  it('queues snapshots and keeps the queue going even after a failure', async () => {
    let fail = true;
    const host = fakeHost(() => {
      if (fail) {
        fail = false;
        return new Response('x');
      }
      return new Response(null, { status: 204 });
    });
    const scheduler = new SnapshotScheduler(host);
    const first = scheduler.snapshotNow();
    const second = scheduler.snapshotNow();
    await expect(first).rejects.toThrow('Invalid snapshot');
    await expect(second).resolves.toBe('unchanged');
  });

  it('after a failure, the next snapshot is forced (the bridge cannot return 204)', async () => {
    let fail = true;
    const host = fakeHost(() => {
      if (fail) {
        fail = false;
        return snapshotReply();
      }
      return new Response(null, { status: 204 });
    });
    host.bucket.put = () => Promise.reject(new Error('R2 down'));
    const scheduler = new SnapshotScheduler(host);
    await expect(scheduler.snapshotNow()).rejects.toThrow('R2 down');
    await expect(scheduler.snapshotNow()).resolves.toBe('unchanged');
    await expect(scheduler.snapshotNow()).resolves.toBe('unchanged');
    expect(host.calls.map((call) => call.path)).toEqual([
      '/snapshot',
      '/snapshot?force=1',
      '/snapshot',
    ]);
  });

  it('snapshotQuietly and logSnapshotFailure only log the failure', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await logSnapshotFailure(Promise.reject(new Error('down')));
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- tests a reason that is not an Error
    await logSnapshotFailure(Promise.reject('text'));
    await new SnapshotScheduler(fakeHost(() => new Response('x'))).snapshotQuietly();
    expect(warn).toHaveBeenCalledTimes(3);
    warn.mockRestore();
  });
});

describe('planSend and guardSend', () => {
  it('allows up to the limit in the last hour and says how long to wait', () => {
    const now = 10_000_000;
    expect(planSend([now - 3_700_000], now, 1)).toEqual({
      allowed: true,
      history: [now],
      retryAfterSeconds: 0,
    });
    const full = planSend([now - 1_000, now - 600_000], now, 2);
    expect(full.allowed).toBe(false);
    expect(full.retryAfterSeconds).toBe(3000);
  });

  it('records sends in storage and answers 429 when exceeded', async () => {
    const host = fakeHost(() => Response.json({}));
    expect(await guardSend(host)).toBeNull();
    expect(await guardSend(host)).toBeNull();
    const refused = await guardSend(host);
    expect(refused?.status).toBe(429);
    expect(await refused?.json()).toMatchObject({ error: 'rate_limited' });
    expect(await host.storage.get<number[]>(SEND_HISTORY_KEY)).toHaveLength(2);
  });
});

describe('forwardInit', () => {
  it('forwards method, type and body; GET goes without a body', async () => {
    const post = new Request('http://bridge/send', {
      method: 'POST',
      body: '{"a":1}',
      headers: { 'content-type': 'application/json' },
    });
    const init = forwardInit(post);
    expect(init.method).toBe('POST');
    expect(await textOf(init.body as ReadableStream<Uint8Array>)).toBe('{"a":1}');
    expect(forwardInit(new Request('http://bridge/status'))).toEqual({ method: 'GET' });
  });
});

describe('routeBridgeRequest and createBridgeLifecycle', () => {
  it('restores, forwards and schedules a snapshot after the sync', async () => {
    const host = fakeHost(
      readyRoute((path) => (path === '/snapshot' ? snapshotReply() : Response.json({ ok: 1 }))),
    );
    const lifecycle = createBridgeLifecycle(host);
    const res = await lifecycle.handle(
      new Request('http://bridge/sync/wait?timeout_ms=10', { method: 'POST' }),
    );
    expect(await res.json()).toEqual({ ok: 1 });
    await Promise.all(host.waited);
    expect(host.calls.map((call) => call.path)).toEqual([
      '/health',
      '/sync/wait?timeout_ms=10',
      '/snapshot',
    ]);
  });

  it('handles the internal snapshot and reset routes without waking the bridge', async () => {
    const stop = vi.fn(() => Promise.resolve());
    const host = fakeHost(() => new Response(null, { status: 204 }), { stop });
    const lifecycle = createBridgeLifecycle(host);
    const snap = await lifecycle.handle(
      new Request('http://bridge/__snapshot', { method: 'POST' }),
    );
    expect(await snap.json()).toEqual({ outcome: 'unchanged' });
    const reset = await lifecycle.handle(new Request('http://bridge/__reset', { method: 'POST' }));
    expect(await reset.json()).toEqual({ reset: true, archived: false });
    expect(stop).toHaveBeenCalledOnce();
    await expect(lifecycle.snapshotNow()).resolves.toBe('unchanged');
    await expect(lifecycle.snapshotQuietly()).resolves.toBeUndefined();
  });

  it('enforces the send limit before forwarding /send', async () => {
    const host = fakeHost(readyRoute(), { sendMaxPerHour: 1 });
    const scheduler = new SnapshotScheduler(host);
    function send(): Request {
      return new Request('http://bridge/send', { method: 'POST', body: '{}' });
    }
    expect((await routeBridgeRequest({ host, scheduler }, send())).status).toBe(200);
    expect((await routeBridgeRequest({ host, scheduler }, send())).status).toBe(429);
    expect(host.calls.filter((call) => call.path === '/send')).toHaveLength(1);
  });

  it('resetBridge archives the snapshot and stops the container', async () => {
    const stop = vi.fn(() => Promise.resolve());
    const host = fakeHost(() => Response.json({}), { stop });
    await storeSnapshot(host.bucket, { body: streamOf('x'), length: 1, generation: 1 }, (b) => b);
    expect(await (await resetBridge(host)).json()).toEqual({ reset: true, archived: true });
    expect(stop).toHaveBeenCalledOnce();
  });
});
