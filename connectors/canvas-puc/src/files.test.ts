import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { toToolResult } from '../../../src/mcp/tools.js';
import { fakeContext } from './fixtures/fake-context.js';
import {
  downloadCanvasFile,
  downloadedFileResult,
  describeDownloadedFile,
  downloadRefusal,
  fileContentBlock,
  fileMimeType,
  MAX_DOWNLOAD_MB,
  openCanvasFileStream,
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

describe('fileContentBlock', () => {
  it('uses an image block for image/* and an embedded resource for the rest', () => {
    const bytes = new Uint8Array([1]);
    expect(fileContentBlock({ 'content-type': 'image/png' }, bytes)).toEqual({
      type: 'image',
      data: 'AQ==',
      mimeType: 'image/png',
    });
    expect(fileContentBlock({ id: 9 }, bytes)).toEqual({
      type: 'resource',
      resource: { uri: 'canvas-file:9', mimeType: 'application/octet-stream', blob: 'AQ==' },
    });
    expect(fileContentBlock({ url: 'u', 'content-type': 'application/pdf' }, bytes)).toMatchObject({
      resource: { uri: 'u', mimeType: 'application/pdf' },
    });
  });
});

describe('downloadedFileResult', () => {
  it('describes the file and attaches the content', () => {
    const file = { display_name: 'a.pdf', url: 'u', 'content-type': 'application/pdf' };
    const result = toToolResult(downloadedFileResult(file, new Uint8Array(2048)));
    expect(result.content[0]).toEqual({
      type: 'text',
      text: '"a.pdf" (application/pdf, 2 KB). Link: u',
    });
    expect(result.content).toHaveLength(2);
  });
});

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

describe('describeDownloadedFile', () => {
  it('describes name, type, size in KB and link', () => {
    const file = { display_name: 'a.pdf', url: 'u', 'content-type': 'application/pdf' };
    expect(describeDownloadedFile(file, 3072)).toBe('"a.pdf" (application/pdf, 3 KB). Link: u');
  });
});

describe('fileMimeType', () => {
  it('uses the Canvas content type or a generic binary type', () => {
    expect(fileMimeType({ 'content-type': 'image/png' })).toBe('image/png');
    expect(fileMimeType({})).toBe('application/octet-stream');
  });
});

describe('openCanvasFileStream', () => {
  it('returns the body with the declared size, or null without a body', async () => {
    const sized = new Response('abc', { headers: { 'content-length': '3' } });
    const { ctx } = fakeContext({ a: sized, b: new Response(null) });
    const opened = await openCanvasFileStream(ctx.client, 'a');
    expect(opened?.size).toBe(3);
    await expect(openCanvasFileStream(ctx.client, 'b')).resolves.toBeNull();
  });
});

describe('streamCanvasFile', () => {
  const pdf = { display_name: 'a.pdf', url: 'u', 'content-type': 'application/pdf', size: 4 };

  it('streams the file body with its description', async () => {
    const { ctx, fetchStream } = fakeContext({ u: new Response('abcd') });
    const content = await streamCanvasFile(ctx.client, pdf);
    expect(fetchStream).toHaveBeenCalledWith('u');
    expect(content).toMatchObject({
      text: describeDownloadedFile(pdf, 4),
      mimeType: 'application/pdf',
      uri: 'u',
    });
    await expect(new Response(content!.body).text()).resolves.toBe('abcd');
  });

  it('caps the body even when the size reported by Canvas is wrong', async () => {
    const { ctx } = fakeContext({ u: new Response('x'.repeat(MAX_DOWNLOAD_BYTES + 1)) });
    const content = await streamCanvasFile(ctx.client, { ...pdf, size: 1 });
    await expect(new Response(content!.body).arrayBuffer()).rejects.toThrow(
      'above the 70 MB limit',
    );
  });

  it('uses the downloaded size when Canvas does not report one', async () => {
    const res = new Response('abcd', { headers: { 'content-length': '2048' } });
    const { ctx } = fakeContext({ u: res });
    const unsized = { display_name: 'a.pdf', url: 'u', 'content-type': 'application/pdf' };
    const content = await streamCanvasFile(ctx.client, unsized);
    expect(content?.text).toContain('2 KB');
  });

  it('leaves to the regular tool what it refuses or what is declared too large', async () => {
    const big = new Response('x', {
      headers: { 'content-length': String(MAX_DOWNLOAD_BYTES + 1) },
    });
    const { ctx, fetchStream } = fakeContext({ u: big });
    await expect(streamCanvasFile(ctx.client, { display_name: 'n' })).resolves.toBeNull();
    expect(fetchStream).not.toHaveBeenCalled();
    await expect(streamCanvasFile(ctx.client, pdf)).resolves.toBeNull();
    expect(big.bodyUsed || big.body?.locked).toBeTruthy();
  });
});

describe('downloadCanvasFile', () => {
  it('downloads the bytes when it can and returns the reason when it cannot', async () => {
    const { ctx, fetchBytes } = fakeContext({ u: new Uint8Array([1]) });
    const ok = await downloadCanvasFile(ctx.client, { url: 'u', 'content-type': 'image/png' });
    expect(fetchBytes).toHaveBeenCalledWith('u');
    expect(toToolResult(ok).content[1]).toMatchObject({ type: 'image', data: 'AQ==' });
    await expect(downloadCanvasFile(ctx.client, {})).resolves.toContain('has no download link');
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
