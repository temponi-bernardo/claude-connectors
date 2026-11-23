import { describe, expect, it, vi } from 'vitest';
import {
  canvasApiError,
  canvasErrorStatus,
  collectPages,
  confirmUpload,
  isPermissionDenial,
  postUploadForm,
  uploadForm,
  createCanvasClient,
  fetchDownload,
  fetchFileBytes,
  fetchPlainText,
  graphqlData,
  networkFailure,
  readCanvasJson,
  requestCanvasJson,
  isReadOnlyGraphql,
  queryCanvasGraphql,
  requestCanvas,
  CANVAS_TIMEOUT_MS,
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

  it('limits every call with a timeout signal', async () => {
    const f = fakeFetch(json({}));
    await sendCanvasRequest(deps(f), { method: 'GET', path: '/a' });
    expect(f.mock.calls[0]![1]?.signal).toBeInstanceOf(AbortSignal);
    expect(CANVAS_TIMEOUT_MS).toBeGreaterThanOrEqual(10_000);
  });

  it('sends no body on GET', async () => {
    const f = fakeFetch(json({}));
    await sendCanvasRequest(deps(f), { method: 'GET', path: '/a' });
    expect(f.mock.calls[0]![1]).not.toHaveProperty('body');
  });
});

describe('requestCanvas', () => {
  it('turns a timeout into a clear 504 error and keeps other network errors', async () => {
    const timeout = Object.assign(new Error('aborted'), { name: 'TimeoutError' });
    const slow = vi.fn(() => Promise.reject(timeout)) as unknown as typeof fetch;
    const req = { method: 'GET', path: '/a' } as const;
    const error: unknown = await requestCanvas({ ...deps(fakeFetch()), fetchFn: slow }, req).catch(
      (e: unknown) => e,
    );
    expect(String(error)).toContain('did not answer within');
    expect(canvasErrorStatus(error)).toBe(504);
    const down = vi.fn(() =>
      Promise.reject(new TypeError('fetch failed')),
    ) as unknown as typeof fetch;
    await expect(requestCanvas({ ...deps(fakeFetch()), fetchFn: down }, req)).rejects.toThrow(
      'fetch failed',
    );
  });

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

  it('on a 401 that denies only the resource, keeps the status and does not blame the token', async () => {
    const body = '{"status":"unauthorized","errors":[{"message":"user not authorized"}]}';
    const f = fakeFetch(new Response(body, { status: 401 }));
    const error: unknown = await requestCanvas(deps(f), { method: 'GET', path: '/a' }).catch(
      (e: unknown) => e,
    );
    expect(error).toMatchObject({ status: 401, tokenRejected: false });
    expect(String(error)).toContain('Canvas 401 on GET /a');
  });

  it('marks a bare 401 as a rejected token', async () => {
    const f = fakeFetch(json({ errors: [{ message: 'Invalid access token.' }] }, { status: 401 }));
    const error: unknown = await requestCanvas(deps(f), { method: 'GET', path: '/a' }).catch(
      (e: unknown) => e,
    );
    expect(error).toMatchObject({ status: 401, tokenRejected: true });
  });

  it('includes the status and body in other errors', async () => {
    const f = fakeFetch(new Response('forbidden', { status: 403 }));
    await expect(requestCanvas(deps(f), { method: 'GET', path: '/a' })).rejects.toThrow(
      'Canvas 403 on GET /a: forbidden',
    );
  });
});

describe('canvasApiError and canvasErrorStatus', () => {
  it('reads the status of a Canvas error and null for anything else', () => {
    expect(canvasErrorStatus(canvasApiError('x', 404))).toBe(404);
    expect(canvasApiError('x', 401, true).tokenRejected).toBe(true);
    expect(canvasErrorStatus(new Error('x'))).toBeNull();
    expect(canvasErrorStatus(null)).toBeNull();
  });
});

describe('isPermissionDenial', () => {
  it.each([
    ['{"status":"unauthorized","errors":[]}', true],
    ['{"status": "unauthorized"}', true],
    ['{"errors":[{"message":"Invalid access token."}]}', false],
    ['', false],
  ])('%s → %s', (body, expected) => {
    expect(isPermissionDenial(body)).toBe(expected);
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
  it('sends the given headers, such as a byte range', async () => {
    const f = fakeFetch(new Response('ok'));
    await fetchDownload(f as unknown as typeof fetch, 'https://f.test/a', { range: 'bytes=0-1' });
    expect(f.mock.calls[0]![1]).toEqual({ headers: { range: 'bytes=0-1' } });
  });

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

  it('stops reading as soon as the file passes the limit', async () => {
    const f = fakeFetch(new Response(new Uint8Array(5)));
    await expect(
      fetchFileBytes(f as unknown as typeof fetch, 'https://f.test/a', 4),
    ).rejects.toThrow('above the 70 MB limit');
  });

  it('never puts the verifier of the URL in the error', async () => {
    const f = fakeFetch(new Response(new Uint8Array(5)));
    const error: unknown = await fetchFileBytes(
      f as unknown as typeof fetch,
      'https://f.test/a?verifier=secret&x=1',
      4,
    ).catch((e: unknown) => e);
    expect(String(error)).toContain('verifier=[hidden]&x=1');
    expect(String(error)).not.toContain('secret');
  });
});

const SLOT = { upload_url: 'https://up.test/u', upload_params: { key: 'k1', policy: 'p' } };
const FILE = { name: 'r.txt', contentType: 'text/plain', bytes: new Uint8Array([104, 105]) };

describe('uploadForm', () => {
  it("puts Canvas's params first and the file last", async () => {
    const form = uploadForm(SLOT, FILE);
    expect([...form.keys()]).toEqual(['key', 'policy', 'file']);
    const blob = form.get('file') as File;
    expect(blob.name).toBe('r.txt');
    expect(blob.type).toBe('text/plain');
    await expect(blob.text()).resolves.toBe('hi');
  });

  it('accepts a slot without params', () => {
    expect([...uploadForm({ upload_url: 'u' }, FILE).keys()]).toEqual(['file']);
  });
});

describe('postUploadForm', () => {
  it('posts the form without the Canvas token and without following redirects', async () => {
    const f = fakeFetch(json({}));
    await postUploadForm(f as unknown as typeof fetch, SLOT, FILE);
    const [url, init] = f.mock.calls[0]!;
    expect(String(url)).toBe('https://up.test/u');
    expect(init).toMatchObject({ method: 'POST', redirect: 'manual' });
    expect(init).not.toHaveProperty('headers');
    expect(init?.body).toBeInstanceOf(FormData);
  });
});

describe('confirmUpload', () => {
  it('reads the file from a 2xx answer', async () => {
    const f = fakeFetch();
    await expect(confirmUpload(deps(f), json({ id: 9 }, { status: 201 }))).resolves.toEqual({
      id: 9,
    });
    expect(f).not.toHaveBeenCalled();
  });

  it('confirms a 3xx answer at its Location with the token', async () => {
    const f = fakeFetch(json({ id: 9 }));
    const redirect = new Response(null, {
      status: 302,
      headers: { location: 'https://x.test/api/v1/files/9/create_success?uuid=u' },
    });
    await expect(confirmUpload(deps(f), redirect)).resolves.toEqual({ id: 9 });
    const [url, init] = f.mock.calls[0]!;
    expect(String(url)).toBe('https://x.test/api/v1/files/9/create_success?uuid=u');
    expect(init).toMatchObject({ method: 'POST', headers: { Authorization: 'Bearer t' } });
  });

  it('fails on a refused upload or a redirect without Location', async () => {
    const f = fakeFetch();
    await expect(confirmUpload(deps(f), new Response('denied', { status: 403 }))).rejects.toThrow(
      /upload \(403\): denied/,
    );
    await expect(confirmUpload(deps(f), new Response(null, { status: 302 }))).rejects.toThrow(
      /upload \(302\)/,
    );
  });
});

describe('createCanvasClient', () => {
  it('uploads a file and confirms it', async () => {
    const f = fakeFetch(json({ id: 9 }, { status: 201 }));
    await expect(createCanvasClient(deps(f)).upload(SLOT, FILE)).resolves.toEqual({ id: 9 });
    expect(String(f.mock.calls[0]![0])).toBe('https://up.test/u');
  });

  it('exposes get, getAll with per_page, post, fetchText, fetchBytes and query', async () => {
    const f = fakeFetch(
      json({ g: 1 }),
      json([1]),
      json({ p: 1 }),
      new Response('txt'),
      new Response(new Uint8Array([7])),
      new Response('s'),
      json({ data: { q: 1 } }),
    );
    const client = createCanvasClient(deps(f));
    await expect(client.get('/g')).resolves.toEqual({ g: 1 });
    await expect(client.getAll('/l')).resolves.toEqual([1]);
    expect(String(f.mock.calls[1]![0])).toContain('per_page=100');
    await expect(client.post('/p', { a: 1 })).resolves.toEqual({ p: 1 });
    await expect(client.fetchText('https://f.test/x')).resolves.toBe('txt');
    expect(Array.from(await client.fetchBytes('https://f.test/y'))).toEqual([7]);
    await expect((await client.fetchStream('https://f.test/z')).text()).resolves.toBe('s');
    await expect(client.query('{ q }')).resolves.toEqual({ q: 1 });
    expect(client.baseUrl).toBe('https://x.test');
  });
});

describe('networkFailure', () => {
  it('rewrites only a timeout, as a 504 that names the request', () => {
    const req = { method: 'GET', path: '/planner/items' } as const;
    const timeout = networkFailure(Object.assign(new Error('x'), { name: 'TimeoutError' }), req);
    expect(canvasErrorStatus(timeout)).toBe(504);
    expect(String(timeout)).toContain('GET /planner/items');
    const other = new TypeError('fetch failed');
    expect(networkFailure(other, req)).toBe(other);
    expect(networkFailure(null, req)).toBeNull();
  });
});

describe('readCanvasJson and requestCanvasJson', () => {
  const req = { method: 'GET', path: '/slow' } as const;

  it('reads the JSON body of an answer', async () => {
    await expect(readCanvasJson(json({ a: 1 }), req)).resolves.toEqual({ a: 1 });
    await expect(requestCanvasJson(deps(fakeFetch(json([2]))), req)).resolves.toEqual([2]);
  });

  it('turns a timeout while reading the body into the clear 504', async () => {
    const timeout = Object.assign(new Error('aborted'), { name: 'TimeoutError' });
    const stuck = { json: () => Promise.reject(timeout) } as unknown as Response;
    const error: unknown = await readCanvasJson(stuck, req).catch((e: unknown) => e);
    expect(canvasErrorStatus(error)).toBe(504);
    await expect(readCanvasJson(new Response('not json'), req)).rejects.toThrow(SyntaxError);
  });
});

describe('isReadOnlyGraphql', () => {
  it('accepts queries and refuses mutations and subscriptions anywhere in the document', () => {
    expect(isReadOnlyGraphql('{ a }')).toBe(true);
    expect(isReadOnlyGraphql('# note\n query Q($id: ID!) { a(id: $id) { b } }')).toBe(true);
    expect(isReadOnlyGraphql('mutation { x }')).toBe(false);
    expect(isReadOnlyGraphql('query A { a } mutation B { x }')).toBe(false);
    expect(isReadOnlyGraphql('subscription { s }')).toBe(false);
    expect(isReadOnlyGraphql('fragment F on A { a }')).toBe(false);
  });
});

describe('graphqlData', () => {
  it('returns the data, or fails with the first GraphQL error', () => {
    expect(graphqlData({ data: { a: 1 } })).toEqual({ a: 1 });
    expect(() => graphqlData({ errors: [{ message: 'bad field' }] })).toThrow('bad field');
    expect(() => graphqlData({ data: null })).toThrow('empty answer');
  });
});

describe('queryCanvasGraphql', () => {
  it('posts the query and variables to /api/graphql, outside /api/v1', async () => {
    const f = fakeFetch(json({ data: { ok: true } }));
    const data = await queryCanvasGraphql(deps(f), { document: '{ ok }', variables: { id: '1' } });
    expect(data).toEqual({ ok: true });
    const [url, init] = f.mock.calls[0]!;
    expect(String(url)).toBe('https://x.test/api/graphql');
    expect(init).toMatchObject({
      method: 'POST',
      body: '{"query":"{ ok }","variables":{"id":"1"}}',
    });
  });

  it('refuses a mutation without calling Canvas', async () => {
    const f = fakeFetch();
    await expect(queryCanvasGraphql(deps(f), { document: 'mutation { x }' })).rejects.toThrow(
      'read-only',
    );
    expect(f).not.toHaveBeenCalled();
  });
});
