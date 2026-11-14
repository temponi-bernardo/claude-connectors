import { describe, expect, it, vi } from 'vitest';
import { memoryBucket, streamOf } from './fixtures/fakes.js';
import {
  acceptSnapshotPush,
  archiveSnapshot,
  readUploadHeaders,
  sameSecret,
  SNAPSHOT_KEY_NAME,
  storedGeneration,
  storeSnapshot,
  storeSnapshotResponse,
} from './snapshots.js';

function identity(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  return body;
}

function snapshotResponse(text: string, generation: number): Response {
  return new Response(text, {
    headers: { 'content-length': String(text.length), 'x-snapshot-generation': String(generation) },
  });
}

describe('storedGeneration e readUploadHeaders', () => {
  it('lê a geração dos metadados, 0 se ausente ou inválida', () => {
    expect(storedGeneration({ customMetadata: { generation: '7' } })).toBe(7);
    expect(storedGeneration({ customMetadata: { generation: 'x' } })).toBe(0);
    expect(storedGeneration(null)).toBe(0);
  });

  it('exige tamanho e geração positivos', () => {
    expect(readUploadHeaders(snapshotResponse('abc', 2).headers)).toEqual({
      length: 3,
      generation: 2,
    });
    expect(readUploadHeaders(new Headers({ 'content-length': '3' }))).toBeNull();
  });
});

describe('storeSnapshot', () => {
  it('grava geração mais nova e recusa a velha ou igual', async () => {
    const bucket = memoryBucket();
    function save(text: string, generation: number): Promise<string> {
      return storeSnapshot(
        bucket,
        { body: streamOf(text), length: text.length, generation },
        identity,
      );
    }
    expect(await save('v2', 2)).toBe('saved');
    expect(await save('v1', 1)).toBe('stale');
    expect(await save('v2b', 2)).toBe('stale');
    expect(bucket.items.get(SNAPSHOT_KEY_NAME)).toEqual({
      text: 'v2',
      customMetadata: { generation: '2' },
    });
  });

  it('passa o fluxo pelo conversor de tamanho fixo', async () => {
    const fixed = vi.fn(identity);
    await storeSnapshot(memoryBucket(), { body: streamOf('abc'), length: 3, generation: 1 }, fixed);
    expect(fixed).toHaveBeenCalledWith(expect.any(ReadableStream), 3);
  });
});

describe('storeSnapshotResponse', () => {
  it('204 é unchanged; 200 grava', async () => {
    const bucket = memoryBucket();
    expect(await storeSnapshotResponse(bucket, new Response(null, { status: 204 }), identity)).toBe(
      'unchanged',
    );
    expect(await storeSnapshotResponse(bucket, snapshotResponse('abc', 1), identity)).toBe('saved');
  });

  it('recusa resposta sem headers ou com erro', async () => {
    const bucket = memoryBucket();
    await expect(storeSnapshotResponse(bucket, new Response('x'), identity)).rejects.toThrow(
      'Snapshot inválido',
    );
    const failed = new Response('x', { status: 500 });
    await expect(storeSnapshotResponse(bucket, failed, identity)).rejects.toThrow('500');
  });
});

describe('archiveSnapshot', () => {
  it('copia para o arquivo com data e apaga o atual; sem snapshot, não faz nada', async () => {
    const bucket = memoryBucket();
    expect(await archiveSnapshot(bucket, new Date(0), identity)).toBe(false);
    await storeSnapshot(bucket, { body: streamOf('abc'), length: 3, generation: 4 }, identity);
    expect(await archiveSnapshot(bucket, new Date('2026-11-14T10:00:00Z'), identity)).toBe(true);
    expect(bucket.items.has(SNAPSHOT_KEY_NAME)).toBe(false);
    expect(bucket.items.get('whatsapp/archive/snapshot-2026-11-14T10-00-00-000Z.was1')).toEqual({
      text: 'abc',
      customMetadata: { generation: '4' },
    });
  });
});

describe('sameSecret e acceptSnapshotPush', () => {
  it('compara segredos sem atalhos e recusa vazio', () => {
    expect(sameSecret('abc', 'abc')).toBe(true);
    expect(sameSecret('abd', 'abc')).toBe(false);
    expect(sameSecret('ab', 'abc')).toBe(false);
    expect(sameSecret('', '')).toBe(false);
  });

  function push(auth: string, init: RequestInit = {}): Request {
    return new Request('http://snapshot.internal/push', {
      method: 'PUT',
      body: 'abc',
      headers: { authorization: auth, 'content-length': '3', 'x-snapshot-generation': '3' },
      ...init,
    });
  }

  it('grava o push com o token certo e recusa o resto', async () => {
    const bucket = memoryBucket();
    const options = { token: 'tok', fixedLength: identity };
    const ok = await acceptSnapshotPush(bucket, push('Bearer tok'), options);
    expect(await ok.json()).toEqual({ outcome: 'saved' });
    expect((await acceptSnapshotPush(bucket, push('Bearer x'), options)).status).toBe(403);
    const get = new Request('http://snapshot.internal/push', {
      headers: { authorization: 'Bearer tok' },
    });
    expect((await acceptSnapshotPush(bucket, get, options)).status).toBe(403);
    const noMeta = new Request('http://snapshot.internal/push', {
      method: 'PUT',
      body: 'abc',
      headers: { authorization: 'Bearer tok' },
    });
    expect((await acceptSnapshotPush(bucket, noMeta, options)).status).toBe(400);
  });
});
