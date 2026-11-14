import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  attemptBridge,
  BRIDGE_ERROR_MESSAGES,
  BRIDGE_RETRY_MS,
  BridgeError,
  bridgeErrorFrom,
  bridgeJson,
  bridgePath,
  bridgeTimeoutMessage,
  callBridge,
  jsonPost,
  shouldRetryBridge,
  withDeadline,
  type BridgeFetch,
} from './bridge-client.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('bridgeErrorFrom', () => {
  it('translates known codes and keeps status and code', () => {
    const error = bridgeErrorFrom(404, { error: 'chat_not_found' });
    expect(error).toBeInstanceOf(BridgeError);
    expect(error.message).toBe(BRIDGE_ERROR_MESSAGES.chat_not_found);
    expect([error.status, error.code]).toEqual([404, 'chat_not_found']);
  });

  it('uses the bridge message or the status when the code is unknown', () => {
    expect(bridgeErrorFrom(400, { error: 'x', message: 'Explanation' }).message).toBe(
      'Explanation',
    );
    const fallback = bridgeErrorFrom(502, null);
    expect([fallback.message, fallback.code]).toEqual(['The bridge answered 502.', 'http_502']);
  });
});

describe('withDeadline', () => {
  it('returns the value within the deadline', async () => {
    await expect(withDeadline(Promise.resolve(1), Date.now() + 1000, 'late')).resolves.toBe(1);
  });

  it('rejects when the deadline passes and when it has already passed', async () => {
    vi.useFakeTimers();
    const slow = withDeadline(new Promise(() => undefined), Date.now() + 50, 'late');
    vi.advanceTimersByTime(60);
    await expect(slow).rejects.toThrow('late');
    await expect(withDeadline(Promise.resolve(1), Date.now() - 1, 'already gone')).rejects.toThrow(
      'already gone',
    );
  });
});

function later(): number {
  return Date.now() + 5000;
}

describe('callBridge and bridgeJson', () => {
  it('reads the JSON of a 2xx response', async () => {
    const bridge: BridgeFetch = vi.fn(() => Promise.resolve(Response.json({ ok: 1 })));
    await expect(bridgeJson(bridge, '/status', { deadline: later() })).resolves.toEqual({ ok: 1 });
    expect(bridge).toHaveBeenCalledWith('/status', undefined);
  });

  it('throws BridgeError with the bridge code, even without a JSON body', async () => {
    const coded: BridgeFetch = vi.fn(() =>
      Promise.resolve(Response.json({ error: 'not_ready' }, { status: 503 })),
    );
    await expect(callBridge(coded, '/chats', { deadline: later() })).rejects.toMatchObject({
      code: 'not_ready',
    });
    const empty: BridgeFetch = vi.fn(() => Promise.resolve(new Response('x', { status: 500 })));
    await expect(callBridge(empty, '/x', { deadline: later() })).rejects.toThrow('500');
  });

  it('times out with a message that mentions only the route', async () => {
    const hang: BridgeFetch = vi.fn(() => new Promise<Response>(() => undefined));
    await expect(
      callBridge(hang, '/chats?query=secret', { deadline: Date.now() + 10 }),
    ).rejects.toThrow(bridgeTimeoutMessage('/chats?query=secret'));
    expect(bridgeTimeoutMessage('/chats?query=secret')).not.toContain('secret');
  });
});

describe('waiting for the bridge to wake up', () => {
  it('shouldRetryBridge only retries not_ready with time left', () => {
    const notReady = bridgeErrorFrom(503, { error: 'not_ready' });
    expect(shouldRetryBridge(notReady, 10_000, 0)).toBe(true);
    expect(shouldRetryBridge(notReady, BRIDGE_RETRY_MS, 0)).toBe(false);
    expect(shouldRetryBridge(bridgeErrorFrom(404, { error: 'not_found' }), 10_000, 0)).toBe(false);
  });

  it('callBridge retries while the bridge starts and returns once it is ready', async () => {
    let calls = 0;
    const bridge: BridgeFetch = vi.fn(() => {
      calls += 1;
      return Promise.resolve(
        calls < 2
          ? Response.json({ error: 'not_ready' }, { status: 503 })
          : Response.json({ ok: true }),
      );
    });
    const res = await callBridge(bridge, '/status', { deadline: Date.now() + 5000 });
    expect(await res.json()).toEqual({ ok: true });
    expect(calls).toBe(2);
  });

  it('attemptBridge does not retry', async () => {
    const bridge: BridgeFetch = vi.fn(() =>
      Promise.resolve(Response.json({ error: 'not_ready' }, { status: 503 })),
    );
    await expect(attemptBridge(bridge, '/x', { deadline: Date.now() + 5000 })).rejects.toThrow(
      BRIDGE_ERROR_MESSAGES.not_ready,
    );
    expect(bridge).toHaveBeenCalledOnce();
  });
});

describe('bridgePath and jsonPost', () => {
  it('builds the query with only defined values', () => {
    expect(bridgePath('/chats', { query: 'ana & bia', limit: 5, cursor: undefined, x: '' })).toBe(
      '/chats?query=ana+%26+bia&limit=5',
    );
    expect(bridgePath('/status', {})).toBe('/status');
  });

  it('builds a JSON POST', () => {
    expect(jsonPost({ a: 1 })).toEqual({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"a":1}',
    });
  });
});
