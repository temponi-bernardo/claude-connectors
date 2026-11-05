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
  it('lê URL pública sem barra final, chave, porta e hosts padrão', () => {
    const config = readRemoteServerConfig({
      PUBLIC_URL: 'https://x.dev/',
      SEAL_KEY: KEY,
      PORT: '9000',
    });
    expect(config.port).toBe(9000);
    expect(config.settings.issuer).toBe('https://x.dev');
    expect(config.settings.redirectHosts).toEqual(DEFAULT_REDIRECT_HOSTS);
  });

  it('usa a porta 8080 e aceita hosts de retorno separados por vírgula', () => {
    const config = readRemoteServerConfig({
      PUBLIC_URL: 'http://localhost:8080',
      SEAL_KEY: KEY,
      OAUTH_REDIRECT_HOSTS: 'claude.ai, exemplo.dev',
    });
    expect(config.port).toBe(8080);
    expect(config.settings.redirectHosts).toEqual(['claude.ai', 'exemplo.dev']);
  });

  it('exige PUBLIC_URL em https (exceto localhost) e SEAL_KEY', () => {
    expect(() => readRemoteServerConfig({ SEAL_KEY: KEY })).toThrow(/PUBLIC_URL/);
    expect(() => readRemoteServerConfig({ PUBLIC_URL: 'http://x.dev', SEAL_KEY: KEY })).toThrow(
      /https/,
    );
    expect(() => readRemoteServerConfig({ PUBLIC_URL: 'https://x.dev' })).toThrow(/SEAL_KEY/);
  });
});

describe('startRemoteHttpServer', () => {
  const server = startRemoteHttpServer({
    origin: 'https://publico.dev',
    port: 0,
    handler: async (request) =>
      new Response(`${request.method} ${request.url} ${await request.text()}`, {
        status: 201,
        headers: { 'x-teste': 'sim' },
      }),
  });
  afterAll(() => {
    server.close();
  });

  function baseUrl(): string {
    return `http://127.0.0.1:${String((server.address() as AddressInfo).port)}`;
  }

  it('repassa método, URL pública, corpo, status e headers', async () => {
    if (!server.listening) await new Promise((resolve) => server.once('listening', resolve));
    const res = await fetch(`${baseUrl()}/token?a=1`, { method: 'POST', body: 'x=1' });
    expect(res.status).toBe(201);
    expect(res.headers.get('x-teste')).toBe('sim');
    expect(await res.text()).toBe('POST https://publico.dev/token?a=1 x=1');
  });

  it('não envia corpo em GET', async () => {
    const res = await fetch(`${baseUrl()}/`);
    expect(await res.text()).toBe('GET https://publico.dev/ ');
  });

  it('recusa corpo acima do limite com 413', async () => {
    const res = await fetch(`${baseUrl()}/x`, { method: 'POST', body: 'a'.repeat(1_100_000) });
    expect(res.status).toBe(413);
  });
});

/** Requisição do Node falsa: um stream com método, URL e headers. */
function fakeNodeRequest(chunks: string[], extra: Record<string, unknown> = {}): IncomingMessage {
  return Object.assign(Readable.from(chunks.map((c) => Buffer.from(c))), {
    method: 'POST',
    url: '/token?a=1',
    headers: { 'content-type': 'text/plain', 'x-lista': ['a', 'b'] },
    ...extra,
  }) as unknown as IncomingMessage;
}

/** Resposta do Node falsa que guarda status, headers e corpo. */
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
  it('aceita localhost em http e recusa texto que não é URL', () => {
    expect(readPublicUrl({ PUBLIC_URL: 'http://localhost:8080/' })).toBe('http://localhost:8080');
    expect(() => readPublicUrl({ PUBLIC_URL: 'nada' })).toThrow(/PUBLIC_URL/);
  });
});

describe('readNodeBody', () => {
  it('junta os pedaços e devolve nulo acima do limite', async () => {
    expect((await readNodeBody(fakeNodeRequest(['a', 'b'])))?.toString()).toBe('ab');
    expect(await readNodeBody(fakeNodeRequest(['x'.repeat(MAX_BODY_BYTES + 1)]))).toBeNull();
  });
});

describe('toWebRequest', () => {
  it('usa a origem pública, junta headers repetidos e só põe corpo fora de GET', async () => {
    const req = toWebRequest(fakeNodeRequest([]), Buffer.from('x=1'), 'https://p.dev');
    expect(req.url).toBe('https://p.dev/token?a=1');
    expect(req.headers.get('x-lista')).toBe('a, b');
    expect(await req.text()).toBe('x=1');
    const get = toWebRequest(
      fakeNodeRequest([], { method: 'GET' }),
      Buffer.from(''),
      'https://p.dev',
    );
    expect(get.body).toBeNull();
  });
});

describe('writeWebResponse e serveNodeRequest', () => {
  it('escreve status, headers e corpo', async () => {
    const { res, sent } = fakeNodeResponse();
    await writeWebResponse(res, new Response('oi', { status: 202, headers: { 'x-a': '1' } }));
    expect(sent).toMatchObject({ status: 202, body: 'oi', headers: { 'x-a': '1' } });
  });

  it('responde 500 quando o handler lança', async () => {
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
