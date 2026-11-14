import { describe, expect, it, vi } from 'vitest';
import {
  collectPages,
  createCanvasClient,
  fetchDownload,
  fetchFileBytes,
  fetchPlainText,
  requestCanvas,
  sendCanvasRequest,
  unauthorizedMessage,
  type ClientDeps,
} from './client.js';

function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), { status: 200, ...init });
}

/** Fake fetch that returns the responses in order and records the calls. */
function fakeFetch(...responses: Response[]) {
  return vi.fn<(url: URL | string, init?: RequestInit) => Promise<Response>>(() =>
    Promise.resolve(responses.shift() ?? json(null)),
  );
}

function deps(fetchFn: ReturnType<typeof fakeFetch>): ClientDeps {
  return { baseUrl: 'https://x.test', token: 't', fetchFn: fetchFn as unknown as typeof fetch };
}

describe('unauthorizedMessage', () => {
  it('tells the user to generate another token and reconnect in Claude', () => {
    const message = unauthorizedMessage('https://x.test');
    expect(message).toContain('https://x.test/profile/settings');
    expect(message).toContain('reconnect');
  });
});

describe('sendCanvasRequest', () => {
  it('builds the API URL, headers with the token and a JSON body', async () => {
    const f = fakeFetch(json({}));
    await sendCanvasRequest(deps(f), {
      method: 'POST',
      path: '/a',
      params: { x: 1 },
      body: { b: 2 },
    });
    const [url, init] = f.mock.calls[0]!;
    expect(String(url)).toBe('https://x.test/api/v1/a?x=1');
    expect(init).toMatchObject({
      method: 'POST',
      body: '{"b":2}',
      headers: { Authorization: 'Bearer t', 'Content-Type': 'application/json' },
    });
  });

  it('sends no body on GET', async () => {
    const f = fakeFetch(json({}));
    await sendCanvasRequest(deps(f), { method: 'GET', path: '/a' });
    expect(f.mock.calls[0]![1]).not.toHaveProperty('body');
  });
});

describe('requestCanvas', () => {
  it('returns the response on success', async () => {
    const res = await requestCanvas(deps(fakeFetch(json({ ok: 1 }))), {
      method: 'GET',
      path: '/a',
    });
    expect(await res.json()).toEqual({ ok: 1 });
  });

  it('on 401 fails only once, telling the user to reconnect', async () => {
    const f = fakeFetch(json({}, { status: 401 }));
    await expect(requestCanvas(deps(f), { method: 'GET', path: '/a' })).rejects.toThrow(
      'reconnect',
    );
    expect(f).toHaveBeenCalledOnce();
  });

  it('includes the status and body in other errors', async () => {
    const f = fakeFetch(new Response('forbidden', { status: 403 }));
    await expect(requestCanvas(deps(f), { method: 'GET', path: '/a' })).rejects.toThrow(
      'Canvas 403 on GET /a: forbidden',
    );
  });
});

describe('collectPages', () => {
  it('follows the Link header and respects the maximum', async () => {
    const f = fakeFetch(
      json([1, 2], { headers: { link: '<https://x.test/api/v1/a?page=2>; rel="next"' } }),
      json([3, 4], { headers: { link: '<https://x.test/api/v1/a?page=3>; rel="next"' } }),
    );
    await expect(collectPages(deps(f), { method: 'GET', path: '/a' }, 3)).resolves.toEqual([
      1, 2, 3,
    ]);
    expect(String(f.mock.calls[1]![0])).toBe('https://x.test/api/v1/a?page=2');
  });

  it('accepts a response that is not a list', async () => {
    await expect(
      collectPages(deps(fakeFetch(json({ a: 1 }))), { method: 'GET', path: '/a' }, 10),
    ).resolves.toEqual([{ a: 1 }]);
  });
});

describe('fetchPlainText', () => {
  it('returns the text or fails with the status', async () => {
    const f = fakeFetch(new Response('content'), new Response('', { status: 404 }));
    await expect(fetchPlainText(f as unknown as typeof fetch, 'https://f.test/a')).resolves.toBe(
      'content',
    );
    await expect(fetchPlainText(f as unknown as typeof fetch, 'https://f.test/a')).rejects.toThrow(
      '404',
    );
  });
});

describe('fetchDownload', () => {
  it('returns the response or fails with the status', async () => {
    const f = fakeFetch(new Response('ok'), new Response('', { status: 403 }));
    const res = await fetchDownload(f as unknown as typeof fetch, 'https://f.test/a');
    expect(await res.text()).toBe('ok');
    await expect(fetchDownload(f as unknown as typeof fetch, 'https://f.test/a')).rejects.toThrow(
      '403',
    );
  });
});

describe('fetchFileBytes', () => {
  it('returns the file bytes', async () => {
    const f = fakeFetch(new Response(new Uint8Array([1, 2, 3])));
    const bytes = await fetchFileBytes(f as unknown as typeof fetch, 'https://f.test/a');
    expect(Array.from(bytes)).toEqual([1, 2, 3]);
  });
});

describe('createCanvasClient', () => {
  it('exposes get, getAll with per_page, post, fetchText and fetchBytes', async () => {
    const f = fakeFetch(
      json({ g: 1 }),
      json([1]),
      json({ p: 1 }),
      new Response('txt'),
      new Response(new Uint8Array([7])),
    );
    const client = createCanvasClient(deps(f));
    await expect(client.get('/g')).resolves.toEqual({ g: 1 });
    await expect(client.getAll('/l')).resolves.toEqual([1]);
    expect(String(f.mock.calls[1]![0])).toContain('per_page=100');
    await expect(client.post('/p', { a: 1 })).resolves.toEqual({ p: 1 });
    await expect(client.fetchText('https://f.test/x')).resolves.toBe('txt');
    expect(Array.from(await client.fetchBytes('https://f.test/y'))).toEqual([7]);
    expect(client.baseUrl).toBe('https://x.test');
  });
});
