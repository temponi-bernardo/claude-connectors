import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { toToolResult } from '../../../src/mcp/tools.js';
import { fakeContext } from './fixtures/fake-context.js';
import { MAX_CHUNK_BYTES } from './chunks.js';
import {
  chunkToolResult,
  downloadCanvasFile,
  downloadRefusal,
  MAX_DOWNLOAD_MB,
  openCanvasChunk,
  planCanvasDownload,
  streamCanvasFile,
  tooLargeMessage,
  MAX_DOWNLOAD_BYTES,
  MAX_TEXT_CHARS,
  readCanvasFileText,
} from './files.js';

function fixture(name: string): Uint8Array {
  return new Uint8Array(
    readFileSync(new URL(`../../../src/core/fixtures/${name}`, import.meta.url)),
  );
}

const MB = 1024 * 1024;
const pdf = { display_name: 'a.pdf', url: 'u', 'content-type': 'application/pdf', size: 4 };

/** Bytes 0, 1, 2... (mod 256). */
function counting(size: number): Uint8Array {
  return new Uint8Array(size).map((_, i) => i % 256);
}

async function readAll(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

describe('downloadRefusal', () => {
  it('refuses without a link or above the limit, and allows the rest', () => {
    expect(downloadRefusal({ display_name: 'a' })).toContain('has no download link');
    const big = { display_name: 'v.mp4', url: 'u', size: MAX_DOWNLOAD_BYTES + 1 };
    expect(downloadRefusal(big)).toBe(
      '"v.mp4" is 70.0 MB, above the 70 MB limit for the conversation; download it from the link: u',
    );
    expect(downloadRefusal({ url: 'u', size: 10 })).toBeNull();
    expect(downloadRefusal({ url: 'u' })).toBeNull();
  });
});

describe('tooLargeMessage', () => {
  it('names the file, its size and the limit, and points to the link', () => {
    expect(tooLargeMessage('a.pdf', 75 * 1024 * 1024, 'u')).toBe(
      '"a.pdf" is 75.0 MB, above the 70 MB limit for the conversation; download it from the link: u',
    );
    expect(MAX_DOWNLOAD_MB).toBe(70);
    expect(MAX_DOWNLOAD_BYTES).toBe(70 * 1024 * 1024);
  });
});

describe('planCanvasDownload', () => {
  it('plans the whole file or the asked part', () => {
    expect(planCanvasDownload(pdf, {})).toMatchObject({ start: 0, end: 4, whole: true });
    const big = { ...pdf, size: 20 * MB };
    expect(planCanvasDownload(big, { offset: 8 * MB })).toMatchObject({
      start: 8 * MB,
      end: 16 * MB,
    });
  });

  it('explains a refusal, an unknown size or an offset past the end', () => {
    expect(planCanvasDownload({ display_name: 'n' }, {})).toContain('has no download link');
    expect(planCanvasDownload({ display_name: 'n', url: 'u' }, {})).toBe(
      'Canvas did not report the size of "n"; download it from the link: u',
    );
    expect(planCanvasDownload(pdf, { offset: 9 })).toBe(
      '"a.pdf": offset 9 is past the end of the file (4 bytes).',
    );
  });
});

describe('openCanvasChunk', () => {
  const part = { start: 2, end: 5, total: 10, step: 3, whole: false };

  it('asks for the range and uses a 206 answer as it is', async () => {
    const ranged = new Response(new Uint8Array([2, 3, 4]), {
      status: 206,
      headers: { 'content-range': 'bytes 2-4/10' },
    });
    const { ctx, fetchStream } = fakeContext({ u: ranged });
    expect([...(await readAll(await openCanvasChunk(ctx.client, 'u', part)))]).toEqual([2, 3, 4]);
    expect(fetchStream).toHaveBeenCalledWith('u', { range: 'bytes=2-4' });
  });

  it('cuts the part out of a full answer when the range is ignored', async () => {
    const { ctx } = fakeContext({ u: new Response(counting(10)) });
    expect([...(await readAll(await openCanvasChunk(ctx.client, 'u', part)))]).toEqual([2, 3, 4]);
  });

  it('fails on a download without a body', async () => {
    const { ctx } = fakeContext({ u: new Response(null) });
    await expect(openCanvasChunk(ctx.client, 'u', part)).rejects.toThrow('empty download');
  });
});

describe('streamCanvasFile', () => {
  it('streams a small file whole, with its own type', async () => {
    const { ctx, fetchStream } = fakeContext({ u: new Response('abcd') });
    const content = await streamCanvasFile(ctx.client, pdf, {});
    expect(fetchStream).toHaveBeenCalledWith('u', {});
    expect(content).toMatchObject({ mimeType: 'application/pdf', uri: 'u' });
    expect(content?.text).toBe('"a.pdf" (application/pdf, 0 KB). Link: u');
    await expect(new Response(content!.body).text()).resolves.toBe('abcd');
  });

  it('streams at most one part of a large file, as raw bytes', async () => {
    const big = { ...pdf, size: 20 * MB };
    const { ctx } = fakeContext({ u: new Response(counting(20 * MB)) });
    const content = await streamCanvasFile(ctx.client, big, { offset: 16 * MB });
    expect(content).toMatchObject({
      mimeType: 'application/octet-stream',
      uri: `u#bytes=${16 * MB}-${20 * MB - 1}`,
    });
    expect(content?.text).toContain('this is the last part');
    const bytes = await readAll(content!.body);
    expect(bytes).toHaveLength(4 * MB);
    expect(bytes[0]).toBe((16 * MB) % 256);
  });

  it('never returns more than the planned part even if Canvas sends more', async () => {
    const { ctx } = fakeContext({ u: new Response(counting(MAX_CHUNK_BYTES + 10)) });
    const content = await streamCanvasFile(ctx.client, { ...pdf, size: 1 }, {});
    expect(await readAll(content!.body)).toHaveLength(1);
  });

  it('leaves to the regular tool what it cannot return', async () => {
    const { ctx, fetchStream } = fakeContext({});
    await expect(streamCanvasFile(ctx.client, { display_name: 'n' }, {})).resolves.toBeNull();
    await expect(streamCanvasFile(ctx.client, pdf, { offset: 99 })).resolves.toBeNull();
    expect(fetchStream).not.toHaveBeenCalled();
  });
});

describe('chunkToolResult', () => {
  it('describes the part and attaches its content', () => {
    const chunk = { start: 0, end: 1, total: 1, step: MAX_CHUNK_BYTES, whole: true };
    const result = toToolResult(
      chunkToolResult({ ...pdf, 'content-type': 'image/png' }, chunk, new Uint8Array([1])),
    );
    expect(result.content[1]).toEqual({ type: 'image', data: 'AQ==', mimeType: 'image/png' });
  });
});

describe('downloadCanvasFile', () => {
  it('downloads the part when it can and returns the reason when it cannot', async () => {
    const big = { ...pdf, size: 20 * MB };
    const { ctx } = fakeContext({ u: new Response(counting(20 * MB)) });
    const result = toToolResult(await downloadCanvasFile(ctx.client, big, {}));
    expect(JSON.stringify(result.content[0])).toContain('offset=8388608');
    expect(result.content[1]).toMatchObject({
      type: 'resource',
      resource: { mimeType: 'application/octet-stream' },
    });
    await expect(downloadCanvasFile(ctx.client, {}, {})).resolves.toContain('has no download link');
  });
});

describe('readCanvasFileText', () => {
  it('reads .docx and .doc from the binary content', async () => {
    const { ctx } = fakeContext({ x: fixture('exemplo.docx'), d: fixture('exemplo.doc') });
    const docx = await readCanvasFileText(ctx.client, { display_name: 'a.docx', url: 'x' });
    expect(docx).toBe('# a.docx\n\nOlá, mundo!\nSegunda linha com ação & <tag>.');
    const doc = await readCanvasFileText(ctx.client, {
      display_name: 'b',
      url: 'd',
      'content-type': 'application/msword',
    });
    expect(doc).toBe('# b\n\nOlá, mundo!\nSegunda linha com ação & <tag>.');
  });

  it('converts HTML, cuts huge texts and returns the link without a url or for binaries', async () => {
    const { ctx } = fakeContext({ h: '<p>x</p>', g: 'a'.repeat(MAX_TEXT_CHARS * 2) });
    const html = { display_name: 'a.html', url: 'h', 'content-type': 'text/html' };
    await expect(readCanvasFileText(ctx.client, html)).resolves.toBe('# a.html\n\nx');
    const big = await readCanvasFileText(ctx.client, { display_name: 'g.txt', url: 'g' });
    expect(big).toHaveLength(MAX_TEXT_CHARS);
    await expect(readCanvasFileText(ctx.client, {})).resolves.toContain(
      'download it from the link',
    );
  });
});
