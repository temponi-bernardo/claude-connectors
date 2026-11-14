import { describe, expect, it, vi } from 'vitest';
import {
  BRIDGE_INSTANCE_NAME,
  bridgeFetchFor,
  bridgeStub,
  type WhatsAppEnv,
} from './worker-env.js';
import { memoryBucket } from './fixtures/fakes.js';

describe('bridgeStub and bridgeFetchFor', () => {
  it('always uses the same named instance', () => {
    const stub = { fetch: vi.fn(() => Promise.resolve(new Response('ok'))) };
    const idFromName = vi.fn((name: string) => `id:${name}`);
    const get = vi.fn(() => stub);
    const env: WhatsAppEnv = { WHATSAPP_BRIDGE: { idFromName, get }, SNAPSHOTS: memoryBucket() };
    expect(bridgeStub(env)).toBe(stub);
    expect(idFromName).toHaveBeenCalledWith(BRIDGE_INSTANCE_NAME);
    expect(get).toHaveBeenCalledWith(`id:${BRIDGE_INSTANCE_NAME}`);
  });

  it('turns relative paths into requests to the stub', async () => {
    const fetch = vi.fn((request: Request) => Promise.resolve(new Response(request.url)));
    const res = await bridgeFetchFor({ fetch })('/status?x=1', { method: 'POST' });
    expect(await res.text()).toBe('http://bridge/status?x=1');
    expect(fetch.mock.calls[0]?.[0].method).toBe('POST');
  });
});
