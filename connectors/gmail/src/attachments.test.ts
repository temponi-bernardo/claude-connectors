import { readFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  attachmentBytesToText,
  detectAttachmentKind,
  downloadAttachment,
  looksLikeText,
  MAX_ATTACHMENT_BYTES,
  readAttachmentText,
} from './attachments.js';
import { gmailRoute, linkedTestDeps, TEST_REFS } from './fixtures/fake-google.js';
import { b64 } from './fixtures/messages.js';

const OWNER = TEST_REFS[0]!;
const docx = new Uint8Array(
  readFileSync(new URL('../../../src/core/fixtures/exemplo.docx', import.meta.url)),
);
const doc = new Uint8Array(
  readFileSync(new URL('../../../src/core/fixtures/exemplo.doc', import.meta.url)),
);

/** PDF mínimo de uma página com o texto dado. */
function tinyPdf(text: string): Uint8Array {
  const content = deflateSync(`BT /F1 12 Tf (${text}) Tj ET`);
  return Buffer.concat([
    Buffer.from(
      '%PDF-1.4\n1 0 obj << /Type /Pages /Kids [2 0 R] >> endobj\n2 0 obj << /Type /Page /Parent 1 0 R /Contents 3 0 R >> endobj\n3 0 obj << /Filter /FlateDecode >>\nstream\n',
    ),
    content,
    Buffer.from('\nendstream\nendobj\n%%EOF'),
  ]);
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('detecção do tipo', () => {
  it('looksLikeText aceita texto e recusa binário ou vazio', () => {
    expect(looksLikeText('linha 1\r\n\tlinha 2')).toBe(true);
    expect(looksLikeText('\u0000\u0001\u0002abc')).toBe(false);
    expect(looksLikeText('')).toBe(false);
  });

  it('detectAttachmentKind reconhece PDF, Word, HTML, texto e binário', () => {
    expect(detectAttachmentKind(tinyPdf('x'))).toBe('pdf');
    expect(detectAttachmentKind(docx)).toBe('docx');
    expect(detectAttachmentKind(doc)).toBe('doc');
    expect(detectAttachmentKind(Buffer.from('<html><body>oi</body></html>'))).toBe('html');
    expect(detectAttachmentKind(Buffer.from('a,b\n1,2'))).toBe('text');
    expect(detectAttachmentKind(Uint8Array.of(0xff, 0xd8, 0xff, 0xe0, 0, 1, 2))).toBeNull();
  });
});

describe('attachmentBytesToText', () => {
  it('converte cada tipo suportado', async () => {
    expect(await attachmentBytesToText(tinyPdf('Recibo 42'))).toBe('Recibo 42');
    expect(await attachmentBytesToText(docx)).toContain('Olá, mundo!');
    expect(await attachmentBytesToText(doc)).toContain('Olá, mundo!');
    expect(await attachmentBytesToText(Buffer.from('<html><p>Olá</p></html>'))).toBe('Olá');
    expect(await attachmentBytesToText(Buffer.from('só texto'))).toBe('só texto');
  });

  it('recusa tipos não suportados', async () => {
    await expect(attachmentBytesToText(Uint8Array.of(0xff, 0xd8, 0, 1))).rejects.toThrow(
      /Unsupported/,
    );
  });
});

describe('readAttachmentText', () => {
  const ids = { messageId: 'm1', attachmentId: 'a1' };

  it('baixa, converte e limita o texto', async () => {
    const pdf = tinyPdf('Total US$ 9,99');
    const route = gmailRoute({
      'messages/m1/attachments/a1': { size: pdf.length, data: b64(pdf) },
    });
    const deps = await linkedTestDeps([route]);
    expect(await readAttachmentText(deps, OWNER, ids)).toEqual({
      account: 'dono',
      message_id: 'm1',
      size: pdf.length,
      text: 'Total US$ 9,99',
    });
  });

  it('avisa quando não há texto extraível', async () => {
    const pdf = tinyPdf('');
    const route = gmailRoute({ 'messages/m1/attachments/a1': { data: b64(pdf) } });
    const deps = await linkedTestDeps([route]);
    expect((await readAttachmentText(deps, OWNER, ids)).text).toMatch(/scanned/);
  });

  it('recusa anexos acima de 5 MB', async () => {
    const route = gmailRoute({
      'messages/m1/attachments/a1': { size: MAX_ATTACHMENT_BYTES + 1, data: '' },
    });
    const deps = await linkedTestDeps([route]);
    await expect(readAttachmentText(deps, OWNER, ids)).rejects.toThrow(/above the 5 MB/);
  });
});

describe('downloadAttachment', () => {
  it('devolve tamanho e bytes; sem size usa o tamanho dos bytes', async () => {
    const route = gmailRoute({
      'messages/m1/attachments/a1': { size: 2, data: b64('oi') },
      'messages/m1/attachments/a2': { data: b64('abc') },
    });
    const deps = await linkedTestDeps([route]);
    const first = await downloadAttachment(deps, OWNER, { messageId: 'm1', attachmentId: 'a1' });
    expect(first.size).toBe(2);
    expect(Buffer.from(first.bytes).toString()).toBe('oi');
    const second = await downloadAttachment(deps, OWNER, { messageId: 'm1', attachmentId: 'a2' });
    expect(second.size).toBe(3);
  });
});
