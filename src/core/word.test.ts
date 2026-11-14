import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  cleanWordText,
  cp1252ToString,
  docToText,
  docxToText,
  docxXmlToText,
  parsePieceTable,
  pieceText,
  wordKind,
  wordToText,
} from './word.js';

function fixture(name: string): Uint8Array {
  return new Uint8Array(readFileSync(new URL(`./fixtures/${name}`, import.meta.url)));
}
const EXPECTED = 'Olá, mundo!\nSegunda linha com ação & <tag>.';

describe('docxXmlToText', () => {
  it('joins the texts, with paragraphs, tabs and breaks', () => {
    const xml =
      '<w:p><w:pPr><w:tabs><w:tab w:val="left"/></w:tabs></w:pPr><w:r><w:t>a</w:t><w:tab/>' +
      '<w:t xml:space="preserve">b &amp; c</w:t><w:br/><w:t>d</w:t></w:r></w:p><w:p><w:t>e</w:t></w:p>';
    expect(docxXmlToText(xml)).toBe('a\tb & c\nd\ne');
  });
});

describe('docxToText', () => {
  it('reads the .docx and fails without the document body', async () => {
    await expect(docxToText(fixture('exemplo.docx'))).resolves.toBe(EXPECTED);
    const empty = new Uint8Array(22);
    new DataView(empty.buffer).setUint32(0, 0x06054b50, true);
    await expect(docxToText(empty)).rejects.toThrow('without word/document.xml');
  });
});

describe('cp1252ToString', () => {
  it('decodes Latin-1 and the Windows-1252 0x80–0x9F range', () => {
    expect(cp1252ToString(new Uint8Array([0x61, 0xe7, 0x80, 0x93, 0x94]))).toBe('aç€“”');
  });
});

describe('parsePieceTable', () => {
  it('skips Prc blocks and reads the pieces', () => {
    const t = new Uint8Array(4 + 5 + 16 + 8);
    const v = new DataView(t.buffer);
    t[0] = 0x01; // Prc with 1 byte of grpprl
    t[3] = 0x02;
    v.setUint32(4, 16, true); // 2 CPs + 1 PCD
    v.setUint32(8, 0, true);
    v.setUint32(12, 5, true);
    v.setUint32(16 + 2, 0x40000800, true);
    expect(parsePieceTable(t, 0)).toEqual([{ cpStart: 0, cpEnd: 5, fc: 0x40000800 }]);
    expect(() => parsePieceTable(new Uint8Array(8), 0)).toThrow('invalid text table');
  });
});

describe('pieceText', () => {
  it('reads 8-bit and UTF-16 pieces', () => {
    const bytes = new Uint8Array([0x61, 0x62, 0x63, 0x00]);
    expect(pieceText(bytes, { cpStart: 0, cpEnd: 2, fc: 0x40000002 })).toBe('bc');
    expect(pieceText(bytes, { cpStart: 0, cpEnd: 1, fc: 2 })).toBe('c');
  });
});

describe('cleanWordText', () => {
  it('replaces Word marks with text and keeps the field results', () => {
    const raw =
      'a\rb\u0007c\u000bd\u0013HYPERLINK "x"\u0014link\u0015 e\u0013PAGE\u0015\u0001  \r\r\r\rf';
    expect(cleanWordText(raw)).toBe('a\nb\tc\ndlink e\n\nf');
  });
});

describe('docToText', () => {
  it('reads .doc with 8-bit and Unicode text', () => {
    expect(docToText(fixture('exemplo.doc'))).toBe(EXPECTED);
    expect(docToText(fixture('unicode.doc'))).toBe('Título ✓ 日本語 — “aspas” €');
  });

  it('rejects a password-protected .doc and files without the Word streams', () => {
    const locked = fixture('exemplo.doc');
    const flagsAt = findWordDocumentFlags(locked);
    locked[flagsAt + 1] = (locked[flagsAt + 1] ?? 0) | 0x01;
    expect(() => docToText(locked)).toThrow('password-protected');
    expect(() => docToText(renameStream(fixture('exemplo.doc'), 'WordDocument'))).toThrow(
      'without the WordDocument stream',
    );
    expect(() => docToText(renameStream(fixture('exemplo.doc'), '1Table'))).toThrow(
      'without the table stream',
    );
  });
});

describe('wordKind', () => {
  it('recognizes .docx and .doc by name or MIME', () => {
    expect(wordKind('', 'A.DOCX')).toBe('docx');
    expect(
      wordKind('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'x'),
    ).toBe('docx');
    expect(wordKind('', 'a.doc')).toBe('doc');
    expect(wordKind('application/msword', 'x')).toBe('doc');
    expect(wordKind('application/pdf', 'a.pdf')).toBeNull();
  });
});

describe('wordToText', () => {
  it('dispatches by kind', async () => {
    await expect(wordToText('docx', fixture('exemplo.docx'))).resolves.toBe(EXPECTED);
    await expect(wordToText('doc', fixture('exemplo.doc'))).resolves.toBe(EXPECTED);
  });
});

/** Position of the FIB flags (offset 0x0A of WordDocument), finding the FIB by its 0xA5EC signature. */
function findWordDocumentFlags(bytes: Uint8Array): number {
  for (let pos = 512; pos < bytes.length; pos += 512) {
    if (bytes[pos] === 0xec && bytes[pos + 1] === 0xa5) return pos + 0x0a;
  }
  throw new Error('FIB not found');
}

/** Changes the first letter of a stream name in the directory, to simulate its absence. */
function renameStream(bytes: Uint8Array, name: string): Uint8Array {
  const needle = Array.from(name).flatMap((c) => [c.charCodeAt(0), 0]);
  for (let pos = 512; pos < bytes.length - needle.length; pos += 128) {
    if (needle.every((b, i) => bytes[pos + i] === b)) {
      bytes[pos] = 0x5a;
      return bytes;
    }
  }
  throw new Error(`stream ${name} not found`);
}
