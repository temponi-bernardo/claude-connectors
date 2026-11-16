import { describe, expect, it } from 'vitest';
import {
  base64EncodeStream,
  byteLimitStream,
  framedStream,
  readLimitedBytes,
  splitBase64Ready,
} from './stream.js';
import { bytesToBase64 } from './bytes.js';

/** Stream that emits the given chunks. */
function streamOf(chunks: readonly Uint8Array[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
}

async function collectText(stream: ReadableStream<Uint8Array>): Promise<string> {
  return new Response(stream).text();
}

describe('splitBase64Ready', () => {
  it('keeps a multiple of 3 bytes ready and carries the rest', () => {
    const { ready, rest } = splitBase64Ready(new Uint8Array([1]), new Uint8Array([2, 3, 4, 5]));
    expect([...ready]).toEqual([1, 2, 3]);
    expect([...rest]).toEqual([4, 5]);
    expect(splitBase64Ready(new Uint8Array(0), new Uint8Array([7])).ready).toHaveLength(0);
  });
});

describe('base64EncodeStream', () => {
  it('encodes chunks of any size exactly like the whole buffer', async () => {
    const all = new Uint8Array(1000).map((_, i) => (i * 37) % 256);
    const chunks = [all.subarray(0, 1), all.subarray(1, 5), all.subarray(5, 6), all.subarray(6)];
    const text = await collectText(streamOf(chunks).pipeThrough(base64EncodeStream()));
    expect(text).toBe(bytesToBase64(all));
  });

  it('encodes an empty stream as an empty string', async () => {
    await expect(collectText(streamOf([]).pipeThrough(base64EncodeStream()))).resolves.toBe('');
  });
});

describe('byteLimitStream', () => {
  it('passes chunks up to the limit and fails above it', async () => {
    const ok = streamOf([new Uint8Array(2), new Uint8Array(2)]).pipeThrough(
      byteLimitStream(4, 'too big'),
    );
    await expect(new Response(ok).arrayBuffer()).resolves.toHaveProperty('byteLength', 4);
    const big = streamOf([new Uint8Array(3), new Uint8Array(2)]).pipeThrough(
      byteLimitStream(4, 'too big'),
    );
    await expect(new Response(big).arrayBuffer()).rejects.toThrow('too big');
  });
});

describe('framedStream', () => {
  it('writes the prefix before and the suffix after the content', async () => {
    const enc = new TextEncoder();
    const framed = streamOf([enc.encode('b'), enc.encode('c')]).pipeThrough(framedStream('a', 'd'));
    await expect(collectText(framed)).resolves.toBe('abcd');
  });
});

describe('readLimitedBytes', () => {
  it('reads the whole body within the limit', async () => {
    const bytes = await readLimitedBytes(streamOf([new Uint8Array([1, 2])]), 2, 'x');
    expect([...bytes]).toEqual([1, 2]);
    await expect(readLimitedBytes(null, 2, 'x')).resolves.toHaveLength(0);
  });

  it('fails as soon as the body passes the limit', async () => {
    await expect(readLimitedBytes(streamOf([new Uint8Array(3)]), 2, 'over')).rejects.toThrow(
      'over',
    );
  });
});
