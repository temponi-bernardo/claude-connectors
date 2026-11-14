import { describe, expect, it, vi } from 'vitest';
import { memoryBucket, streamOf, textOf } from './fixtures/fakes.js';
import {
  acceptSnapshotPush,
  archiveSnapshot,
  pumpInto,
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

  it('ponte ainda iniciando (503) não é falha: nada a salvar', async () => {
    const starting = Response.json({ error: 'not_ready' }, { status: 503 });
    expect(await storeSnapshotResponse(memoryBucket(), starting, identity)).toBe('unchanged');
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

describe('pumpInto', () => {
  it('copia bloco a bloco e fecha o destino (sem pipeTo, que o Workers recusa entre fluxos internos)', async () => {
    const source = streamOf('abc');
    const pipeTo = vi.spyOn(source, 'pipeTo');
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const done = pumpInto(source, writable);
    await expect(textOf(readable)).resolves.toBe('abc');
    await done;
    expect(pipeTo).not.toHaveBeenCalled();
  });

  it('erro na origem aborta o destino (quem grava no R2 falha em vez de travar)', async () => {
    const source = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('a'));
        controller.error(new Error('caiu'));
      },
    });
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const done = pumpInto(source, writable);
    await expect(textOf(readable)).rejects.toThrow('caiu');
    await expect(done).resolves.toBeUndefined();
  });

  it('destino que falha cancela a origem', async () => {
    const cancel = vi.fn();
    const source = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(new Uint8Array([1]));
      },
      cancel,
    });
    const writable = new WritableStream<Uint8Array>({
      write() {
        throw new Error('R2 recusou');
      },
    });
    await pumpInto(source, writable);
    expect(cancel).toHaveBeenCalled();
  });
});
