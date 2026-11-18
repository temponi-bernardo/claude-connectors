import { describe, expect, it, vi } from 'vitest';
import { createCanvasClient } from './client.js';
import {
  fileAccessError,
  fileAccessReason,
  fileLookupPlan,
  fileRefFromArgs,
  fileRefFromUrl,
  resolveCanvasFile,
} from './file-ref.js';

const BASE = 'https://pucminas.instructure.com';
const PDF = { id: 18832665, display_name: 'Revisão.pdf', url: `${BASE}/files/18832665/download` };
const LINK = `${BASE}/courses/294409/files/18832665?verifier=secret-v&wrap=1`;
const DENIED = '{"status":"unauthorized","errors":[{"message":"user not authorized"}]}';

function reply(status: number, body: unknown = PDF): Response {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return new Response(text, { status });
}

/** Real client over a fake fetch that answers in order and records the URLs. */
function clientWith(...responses: Response[]) {
  const fetchFn = vi.fn<(url: URL | string) => Promise<Response>>(() =>
    Promise.resolve(responses.shift() ?? reply(500, 'none')),
  );
  const client = createCanvasClient({
    baseUrl: BASE,
    token: 't',
    fetchFn: fetchFn as unknown as typeof fetch,
  });
  function urls(): string[] {
    return fetchFn.mock.calls.map(([u]) => String(u).replace(`${BASE}/api/v1`, ''));
  }
  return { client, urls };
}

describe('fileRefFromUrl', () => {
  it('reads file, course and verifier of an RCE file link', () => {
    expect(fileRefFromUrl(LINK, BASE)).toEqual({
      fileId: '18832665',
      courseId: '294409',
      verifier: 'secret-v',
    });
  });

  it('accepts relative links, previews, downloads and media iframes', () => {
    expect(fileRefFromUrl('/files/7/preview', BASE)).toMatchObject({ fileId: '7' });
    expect(
      fileRefFromUrl(`${BASE}/media_attachments_iframe/19034621?type=video`, BASE),
    ).toMatchObject({ fileId: '19034621', courseId: undefined });
  });

  it('refuses other hosts, non-file links and invalid urls', () => {
    expect(() => fileRefFromUrl('https://evil.test/files/1', BASE)).toThrow('Only links of');
    expect(() => fileRefFromUrl(`${BASE}/courses/1/pages/x`, BASE)).toThrow(
      'does not point to a Canvas file',
    );
    expect(() => fileRefFromUrl('http://[x', BASE)).toThrow('not a valid link');
  });
});

describe('fileRefFromArgs', () => {
  it('uses the url, lets course_id fill the course and checks file_id agrees', () => {
    expect(fileRefFromArgs({ url: '/files/7', course_id: 3 }, BASE)).toEqual({
      fileId: '7',
      courseId: '3',
      verifier: undefined,
    });
    expect(fileRefFromArgs({ url: LINK, file_id: 18832665 }, BASE).courseId).toBe('294409');
    expect(() => fileRefFromArgs({ url: LINK, file_id: 1 }, BASE)).toThrow('does not match');
  });

  it('takes a bare file_id and needs at least one of file_id and url', () => {
    expect(fileRefFromArgs({ file_id: 5 }, BASE)).toEqual({ fileId: '5', courseId: undefined });
    expect(() => fileRefFromArgs({}, BASE)).toThrow('Pass file_id or url');
  });
});

describe('fileLookupPlan', () => {
  it('tries course, global and verifier endpoints in this order, hiding the verifier', () => {
    const plan = fileLookupPlan({ fileId: '9', courseId: '2', verifier: 'v' });
    expect(plan.map((p) => [p.path, p.params])).toEqual([
      ['/courses/2/files/9', {}],
      ['/files/9', {}],
      ['/files/9', { verifier: 'v' }],
    ]);
    expect(plan.map((p) => p.label).join()).not.toContain('=v');
  });

  it('only tries the global endpoint without course and verifier', () => {
    expect(fileLookupPlan({ fileId: '9' }).map((p) => p.path)).toEqual(['/files/9']);
  });
});

describe('fileAccessReason and fileAccessError', () => {
  it.each([
    [401, 'hidden, locked'],
    [403, 'locked'],
    [404, 'not found'],
    [500, 'Canvas answered 500'],
    [null, 'before Canvas answered'],
  ])('%s → %s', (status, text) => {
    expect(fileAccessReason(status)).toContain(text);
  });

  it('suggests passing the url when there was no verifier', () => {
    const msg = fileAccessError({ fileId: '9' }, [{ label: 'GET /api/v1/files/9', status: null }]);
    expect(msg).toContain('- GET /api/v1/files/9 → error');
    expect(msg).toContain('pass that full url');
  });
});

describe('resolveCanvasFile (endpoint fallback)', () => {
  it('200: returns the file from the course endpoint', async () => {
    const { client, urls } = clientWith(reply(200));
    await expect(resolveCanvasFile(client, { url: LINK })).resolves.toEqual(PDF);
    expect(urls()).toEqual(['/courses/294409/files/18832665']);
  });

  it('401 (denied) then 200: falls back to the global endpoint', async () => {
    const { client, urls } = clientWith(reply(401, DENIED), reply(200));
    await expect(resolveCanvasFile(client, { url: LINK })).resolves.toEqual(PDF);
    expect(urls()).toEqual(['/courses/294409/files/18832665', '/files/18832665']);
  });

  it('403 then 404 then 200: the verifier opens the file', async () => {
    const { client, urls } = clientWith(reply(403, 'locked'), reply(404, 'nope'), reply(200));
    await expect(resolveCanvasFile(client, { url: LINK })).resolves.toEqual(PDF);
    expect(urls()[2]).toBe('/files/18832665?verifier=secret-v');
  });

  it('401, 403 and 404: a clear error per endpoint, never the verifier', async () => {
    const { client } = clientWith(reply(401, DENIED), reply(403, 'x'), reply(404, 'x'));
    const error = String(await resolveCanvasFile(client, { url: LINK }).catch((e: unknown) => e));
    expect(error).toContain('Could not open Canvas file 18832665');
    expect(error).toContain('GET /api/v1/courses/294409/files/18832665 → 401 (not authorized');
    expect(error).toContain('GET /api/v1/files/18832665 → 403 (forbidden');
    expect(error).toContain('GET /api/v1/files/18832665?verifier=[hidden] → 404 (not found');
    expect(error).not.toContain('secret-v');
  });

  it('stops at once when Canvas rejects the token itself', async () => {
    const { client, urls } = clientWith(
      reply(401, { errors: [{ message: 'Invalid access token.' }] }),
    );
    await expect(resolveCanvasFile(client, { url: LINK })).rejects.toThrow('reconnect');
    expect(urls()).toHaveLength(1);
  });
});
