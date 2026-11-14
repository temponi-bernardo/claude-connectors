import { randomBytes } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { Readable } from 'node:stream';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { DEFAULT_REDIRECT_HOSTS } from './oauth.js';
import {
  MAX_BODY_BYTES,
  readNodeBody,
  readPublicUrl,
  readRemoteServerConfig,
  serveNodeRequest,
  startRemoteHttpServer,
  toWebRequest,
  writeWebResponse,
} from './node-server.js';

const KEY = randomBytes(32).toString('base64');

describe('readRemoteServerConfig', () => {
  it('reads the public URL without a trailing slash, the key, the port and the default hosts', () => {
    const config = readRemoteServerConfig({
      PUBLIC_URL: 'https://x.dev/',
      SEAL_KEY: KEY,
      PORT: '9000',
    });
    expect(config.port).toBe(9000);
    expect(config.settings.issuer).toBe('https://x.dev');
    expect(config.settings.redirectHosts).toEqual(DEFAULT_REDIRECT_HOSTS);
  });

  it('uses port 8080 and accepts comma-separated redirect hosts', () => {
    const config = readRemoteServerConfig({
      PUBLIC_URL: 'http://localhost:8080',
      SEAL_KEY: KEY,
      OAUTH_REDIRECT_HOSTS: 'claude.ai, example.dev',
    });
    expect(config.port).toBe(8080);
    expect(config.settings.redirectHosts).toEqual(['claude.ai', 'example.dev']);
  });

  it('requires PUBLIC_URL over https (except localhost) and SEAL_KEY', () => {
    expect(() => readRemoteServerConfig({ SEAL_KEY: KEY })).toThrow(/PUBLIC_URL/);
    expect(() => readRemoteServerConfig({ PUBLIC_URL: 'http://x.dev', SEAL_KEY: KEY })).toThrow(
      /https/,
    );
    expect(() => readRemoteServerConfig({ PUBLIC_URL: 'https://x.dev' })).toThrow(/SEAL_KEY/);
  });
});

describe('startRemoteHttpServer', () => {
  const server = startRemoteHttpServer({
    origin: 'https://public.dev',
    port: 0,
    handler: async (request) =>
      new Response(`${request.method} ${request.url} ${await request.text()}`, {
        status: 201,
        headers: { 'x-test': 'yes' },
      }),
  });
  afterAll(() => {
    server.close();
  });

  function baseUrl(): string {
    return `http://127.0.0.1:${String((server.address() as AddressInfo).port)}`;
  }

  it('passes through method, public URL, body, status and headers', async () => {
    if (!server.listening) await new Promise((resolve) => server.once('listening', resolve));
    const res = await fetch(`${baseUrl()}/token?a=1`, { method: 'POST', body: 'x=1' });
    expect(res.status).toBe(201);
    expect(res.headers.get('x-test')).toBe('yes');
    expect(await res.text()).toBe('POST https://public.dev/token?a=1 x=1');
  });

  it('sends no body on GET', async () => {
    const res = await fetch(`${baseUrl()}/`);
    expect(await res.text()).toBe('GET https://public.dev/ ');
  });

  it('rejects a body over the limit with 413', async () => {
    const res = await fetch(`${baseUrl()}/x`, { method: 'POST', body: 'a'.repeat(1_100_000) });
    expect(res.status).toBe(413);
  });
});

/** Fake Node request: a stream with method, URL and headers. */
function fakeNodeRequest(chunks: string[], extra: Record<string, unknown> = {}): IncomingMessage {
  return Object.assign(Readable.from(chunks.map((c) => Buffer.from(c))), {
    method: 'POST',
    url: '/token?a=1',
    headers: { 'content-type': 'text/plain', 'x-list': ['a', 'b'] },
    ...extra,
  }) as unknown as IncomingMessage;
}

/** Fake Node response that records status, headers and body. */
function fakeNodeResponse() {
  const sent = { status: 0, headers: {} as Record<string, string>, body: '' };
  const res = {
    writeHead: (status: number, headers: Record<string, string>) => {
      Object.assign(sent, { status, headers });
    },
    end: (body: Buffer) => {
      sent.body = body.toString();
    },
  } as unknown as ServerResponse;
  return { res, sent };
}

describe('readPublicUrl', () => {
  it('accepts localhost over http and rejects text that is not a URL', () => {
    expect(readPublicUrl({ PUBLIC_URL: 'http://localhost:8080/' })).toBe('http://localhost:8080');
    expect(() => readPublicUrl({ PUBLIC_URL: 'nothing' })).toThrow(/PUBLIC_URL/);
  });
});

describe('readNodeBody', () => {
  it('joins the chunks and returns null over the limit', async () => {
    expect((await readNodeBody(fakeNodeRequest(['a', 'b'])))?.toString()).toBe('ab');
    expect(await readNodeBody(fakeNodeRequest(['x'.repeat(MAX_BODY_BYTES + 1)]))).toBeNull();
  });
});

describe('toWebRequest', () => {
  it('uses the public origin, joins repeated headers and only adds a body outside GET', async () => {
    const req = toWebRequest(fakeNodeRequest([]), Buffer.from('x=1'), 'https://p.dev');
    expect(req.url).toBe('https://p.dev/token?a=1');
    expect(req.headers.get('x-list')).toBe('a, b');
    expect(await req.text()).toBe('x=1');
    const get = toWebRequest(
      fakeNodeRequest([], { method: 'GET' }),
      Buffer.from(''),
      'https://p.dev',
    );
    expect(get.body).toBeNull();
  });
});

describe('writeWebResponse and serveNodeRequest', () => {
  it('writes status, headers and body', async () => {
    const { res, sent } = fakeNodeResponse();
    await writeWebResponse(res, new Response('hi', { status: 202, headers: { 'x-a': '1' } }));
    expect(sent).toMatchObject({ status: 202, body: 'hi', headers: { 'x-a': '1' } });
  });

  it('answers 500 when the handler throws', async () => {
    const { res, sent } = fakeNodeResponse();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const options = {
      origin: 'https://p.dev',
      port: 0,
      handler: () => Promise.reject(new Error('x')),
    };
    await serveNodeRequest(options, fakeNodeRequest([]), res);
    expect(sent.status).toBe(500);
    spy.mockRestore();
  });
});
