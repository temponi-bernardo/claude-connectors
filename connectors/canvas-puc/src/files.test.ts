import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { toToolResult } from '../../../src/mcp/tools.js';
import { fakeContext } from './fixtures/fake-context.js';
import {
  bytesToBase64,
  downloadCanvasFile,
  downloadedFileResult,
  downloadRefusal,
  fileContentBlock,
  MAX_DOWNLOAD_BYTES,
  MAX_TEXT_CHARS,
  readCanvasFileText,
} from './files.js';

function fixture(name: string): Uint8Array {
  return new Uint8Array(
    readFileSync(new URL(`../../../src/core/fixtures/${name}`, import.meta.url)),
  );
}

describe('bytesToBase64', () => {
  it('codifica bytes, inclusive acima do tamanho de um bloco', () => {
    expect(bytesToBase64(new Uint8Array([104, 105]))).toBe('aGk=');
    const big = new Uint8Array(0x8000 * 2 + 5).fill(65);
    expect(atob(bytesToBase64(big))).toBe('A'.repeat(big.length));
  });
});

describe('fileContentBlock', () => {
  it('usa bloco de imagem para image/* e recurso embutido para o resto', () => {
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
  it('descreve o arquivo e anexa o conteúdo', () => {
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
  it('recusa sem link ou acima do limite, e libera o resto', () => {
    expect(downloadRefusal({ display_name: 'a' })).toContain('não tem link');
    const big = { display_name: 'v.mp4', url: 'u', size: MAX_DOWNLOAD_BYTES + 1 };
    expect(downloadRefusal(big)).toBe(
      '"v.mp4" tem 10.0 MB, acima do limite de 10 MB para trazer à conversa; baixe pelo link: u',
    );
    expect(downloadRefusal({ url: 'u', size: 10 })).toBeNull();
    expect(downloadRefusal({ url: 'u' })).toBeNull();
  });
});

describe('downloadCanvasFile', () => {
  it('baixa os bytes quando pode e devolve o motivo quando não', async () => {
    const { ctx, fetchBytes } = fakeContext({ u: new Uint8Array([1]) });
    const ok = await downloadCanvasFile(ctx.client, { url: 'u', 'content-type': 'image/png' });
    expect(fetchBytes).toHaveBeenCalledWith('u');
    expect(toToolResult(ok).content[1]).toMatchObject({ type: 'image', data: 'AQ==' });
    await expect(downloadCanvasFile(ctx.client, {})).resolves.toContain('não tem link');
  });
});

describe('readCanvasFileText', () => {
  it('lê .docx e .doc pelo conteúdo binário', async () => {
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

  it('converte HTML, corta textos enormes e devolve o link sem url ou para binários', async () => {
    const { ctx } = fakeContext({ h: '<p>x</p>', g: 'a'.repeat(MAX_TEXT_CHARS * 2) });
    const html = { display_name: 'a.html', url: 'h', 'content-type': 'text/html' };
    await expect(readCanvasFileText(ctx.client, html)).resolves.toBe('# a.html\n\nx');
    const big = await readCanvasFileText(ctx.client, { display_name: 'g.txt', url: 'g' });
    expect(big).toHaveLength(MAX_TEXT_CHARS);
    await expect(readCanvasFileText(ctx.client, {})).resolves.toContain('baixe pelo link');
  });
});
