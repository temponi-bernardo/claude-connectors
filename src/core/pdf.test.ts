import { deflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import {
  addFontRefs,
  applyTextOperator,
  bytesToLatin1,
  classifyWord,
  collectPdfPages,
  contentStreamText,
  decodePdfStream,
  decodePdfText,
  dictRefs,
  feedPdfToken,
  fontCMaps,
  fontResourceRefs,
  isPdf,
  lastOperandText,
  listRawObjects,
  moveText,
  nextPdfToken,
  orderedPages,
  parseToUnicodeCMap,
  pdfRefs,
  pdfToText,
  rangeTarget,
  readBfChars,
  readBfRanges,
  readEscape,
  readHexString,
  readLiteralString,
  readPdfObjects,
  readPdfWord,
  readRawObject,
  showArrayText,
  skipPdfSpace,
  splitObjectStream,
  storePdfObject,
  streamDataStart,
  trimStreamEol,
  tidyPdfText,
  utf16beHexToString,
  wrapString,
  type PdfCMap,
  type PdfObject,
  type PdfTextState,
} from './pdf.js';

/** Latin1 text as bytes (one byte per character). */
function latin1(text: string): Uint8Array {
  return Uint8Array.from(text, (c) => c.charCodeAt(0));
}

/** Builds a PDF from `[number, body]` objects; bodies with `stream` carry the given bytes. */
function buildPdf(objects: readonly [number, string, Uint8Array?][], trailer = ''): Uint8Array {
  const parts: Uint8Array[] = [latin1('%PDF-1.7\n')];
  for (const [num, body, stream] of objects) {
    if (stream) {
      parts.push(
        latin1(`${num} 0 obj\n${body}\nstream\r\n`),
        stream,
        latin1('\nendstream\nendobj\n'),
      );
    } else parts.push(latin1(`${num} 0 obj\n${body}\nendobj\n`));
  }
  parts.push(latin1(`trailer\n<< ${trailer} >>\n%%EOF`));
  return Buffer.concat(parts);
}

const CMAP = `/CIDInit /ProcSet findresource begin
begincmap
1 begincodespacerange <0000> <FFFF> endcodespacerange
2 beginbfchar <0001> <0052> <0002> <00E9> endbfchar
1 beginbfrange <0010> <0012> <0061> endbfrange
1 beginbfrange <0020> <0021> [<0031> <0032>] endbfrange
endcmap`;

/** Two-page receipt: page 2 has a lower object number than page 1 (order comes from the tree). */
function receiptPdf(): Uint8Array {
  const page1 = deflateSync(
    latin1('BT /F1 12 Tf 72 700 Td (Receipt FL Cloud) Tj 0 -14 Td [(Total) -400 (R$ 10,00)] TJ ET'),
  );
  const page2 = latin1('BT /F2 10 Tf <0001000200100011> Tj T* <0020 0021> Tj ET');
  const font7 = '<< /Type /Font /Subtype /Type1 >> ';
  const font8 = '<< /Type /Font /Subtype /Type0 /ToUnicode 9 0 R >>';
  const header = `7 0 8 ${font7.length} `;
  const objStm = latin1(header + font7 + font8);
  return buildPdf([
    [1, '<< /Type /Catalog /Pages 2 0 R >>'],
    [2, '<< /Type /Pages /Kids [5 0 R 3 0 R] /Count 2 >>'],
    [3, '<< /Type /Page /Parent 2 0 R /Contents 4 0 R /Resources 10 0 R >>'],
    [4, '<< /Length 0 >>', page2],
    [5, '<< /Type /Page /Parent 2 0 R /Contents [6 0 R] /Resources << /Font << /F1 7 0 R >> >> >>'],
    [6, '<< /Filter /FlateDecode >>', page1],
    [
      11,
      `<< /Type /ObjStm /N 2 /First ${header.length} /Filter /FlateDecode >>`,
      deflateSync(objStm),
    ],
    [9, '<< >>', latin1(CMAP)],
    [10, '<< /Font << /F2 8 0 R >> >>'],
  ]);
}

describe('pdfToText', () => {
  it('extracts the page text in tree order, with simple and ToUnicode fonts', async () => {
    expect(await pdfToText(receiptPdf())).toBe('Receipt FL Cloud\nTotal R$ 10,00\n\nRéab\n12');
  });

  it('rejects an encrypted PDF', async () => {
    const pdf = buildPdf([[1, '<< /Type /Catalog >>']], '/Encrypt 5 0 R');
    await expect(pdfToText(pdf)).rejects.toThrow(/password/);
  });

  it('returns empty when there are no pages', async () => {
    expect(await pdfToText(buildPdf([[1, '<< /Type /Catalog >>']]))).toBe('');
  });
});

describe('bytesToLatin1 and isPdf', () => {
  it('maps each byte to a character', () => {
    expect(bytesToLatin1(Uint8Array.of(0x50, 0xe9, 0xff))).toBe('Péÿ');
    expect(bytesToLatin1(new Uint8Array(70000)).length).toBe(70000);
  });

  it('recognizes the %PDF- header', () => {
    expect(isPdf(latin1('%PDF-1.4'))).toBe(true);
    expect(isPdf(latin1('PK\u0003\u0004'))).toBe(false);
  });
});

describe('object reading', () => {
  it('streamDataStart skips CRLF, LF, CR or nothing', () => {
    expect(streamDataStart('stream\r\nX', 0)).toBe(8);
    expect(streamDataStart('stream\nX', 0)).toBe(7);
    expect(streamDataStart('stream\rX', 0)).toBe(7);
    expect(streamDataStart('streamX', 0)).toBe(6);
  });

  it('trimStreamEol strips CRLF, LF or CR from the end, without passing the start', () => {
    expect(trimStreamEol('ab\r\n', 0, 4)).toBe(2);
    expect(trimStreamEol('ab\n', 0, 3)).toBe(2);
    expect(trimStreamEol('ab\r', 0, 3)).toBe(2);
    expect(trimStreamEol('\n', 1, 1)).toBe(1);
  });

  it('readRawObject splits dictionary and stream, and tolerates a truncated file', () => {
    const text = '<< /A 1 >> stream\nDATA\nendstream endobj';
    const raw = readRawObject(text, latin1(text), 0);
    expect(raw.dict).toBe('<< /A 1 >> ');
    expect(bytesToLatin1(raw.stream!)).toBe('DATA');
    expect(readRawObject('<< /A 1 >>', latin1('<< /A 1 >>'), 0)).toMatchObject({
      stream: null,
      end: 10,
    });
    const cut = '<< >> stream\nABC';
    expect(bytesToLatin1(readRawObject(cut, latin1(cut), 0).stream!)).toBe('ABC');
  });

  it('listRawObjects finds every object', () => {
    expect(listRawObjects(receiptPdf()).map((o) => o.num)).toEqual([1, 2, 3, 4, 5, 6, 11, 9, 10]);
  });

  it('decodePdfStream: no filter, Flate, unknown filter and corrupt data', async () => {
    expect(await decodePdfStream('<< >>', latin1('abc'))).toEqual(latin1('abc'));
    const inflated = await decodePdfStream('<< /Filter [/FlateDecode] >>', deflateSync('hi'));
    expect(bytesToLatin1(inflated!)).toBe('hi');
    expect(await decodePdfStream('<< /Filter /DCTDecode >>', latin1('x'))).toBeNull();
    expect(await decodePdfStream('<< /Filter /FlateDecode >>', latin1('junk'))).toBeNull();
  });

  it('splitObjectStream reads the inner objects and ignores a stream without /First', () => {
    const data = latin1('3 0 4 5 (hi) (two)');
    expect(splitObjectStream('<< /First 8 >>', data)).toEqual([
      [3, { dict: '(hi) ', data: null }],
      [4, { dict: '(two)', data: null }],
    ]);
    expect(splitObjectStream('<< >>', data)).toEqual([]);
  });

  it('storePdfObject does not overwrite an already-read object with one from an object stream', () => {
    const objects = new Map<number, PdfObject>([[3, { dict: 'original', data: null }]]);
    storePdfObject(objects, 9, { dict: '<< /Type /ObjStm /First 4 >>', data: latin1('3 0 x') });
    expect(objects.get(3)?.dict).toBe('original');
    storePdfObject(objects, 10, { dict: '<< /Type /ObjStm /First 4 >>', data: latin1('5 0 y') });
    expect(objects.get(5)?.dict).toBe('y');
  });

  it('readPdfObjects includes the objects inside the object stream', async () => {
    const objects = await readPdfObjects(receiptPdf());
    expect(objects.get(8)?.dict).toContain('/ToUnicode 9 0 R');
  });
});

describe('references and pages', () => {
  it('pdfRefs and dictRefs read single references and lists', () => {
    expect(pdfRefs('[1 0 R 22 0 R]')).toEqual([1, 22]);
    expect(dictRefs('/Contents 4 0 R', 'Contents')).toEqual([4]);
    expect(dictRefs('/Kids [5 0 R 3 0 R]', 'Kids')).toEqual([5, 3]);
    expect(dictRefs('/Other 1 0 R', 'Kids')).toEqual([]);
  });

  it('orderedPages and collectPdfPages follow /Kids', async () => {
    const objects = await readPdfObjects(receiptPdf());
    expect(orderedPages(objects)).toEqual([5, 3]);
    const pages: number[] = [];
    collectPdfPages(objects, 99, pages);
    expect(pages).toEqual([]);
  });
});

describe('ToUnicode maps', () => {
  it('utf16beHexToString decodes 1 byte, UTF-16 and empty', () => {
    expect(utf16beHexToString('41')).toBe('A');
    expect(utf16beHexToString('00E90041')).toBe('éA');
    expect(utf16beHexToString('')).toBe('');
  });

  it('readBfChars and readBfRanges fill the map', () => {
    const map = new Map<number, string>();
    readBfChars(CMAP, map);
    readBfRanges(CMAP, map);
    expect([...map]).toEqual([
      [1, 'R'],
      [2, 'é'],
      [0x10, 'a'],
      [0x11, 'b'],
      [0x12, 'c'],
      [0x20, '1'],
      [0x21, '2'],
    ]);
  });

  it('rangeTarget uses the list or increments the last character', () => {
    expect(rangeTarget(['0041'], 2)).toBe('C');
    expect(rangeTarget(['0041', '0042'], 1)).toBe('B');
    expect(rangeTarget([''], 1)).toBe('');
  });

  it('parseToUnicodeCMap detects 1- or 2-byte codes', () => {
    expect(parseToUnicodeCMap(CMAP).bytes).toBe(2);
    expect(parseToUnicodeCMap('begincodespacerange <00> <FF>').bytes).toBe(1);
  });

  it('fontResourceRefs merges inline and referenced /Font; fontCMaps only fonts with ToUnicode', async () => {
    const objects = await readPdfObjects(receiptPdf());
    expect([...fontResourceRefs(objects)]).toEqual([
      ['F1', 7],
      ['F2', 8],
    ]);
    expect([...fontCMaps(objects).keys()]).toEqual(['F2']);
    const fonts = new Map([['F1', 1]]);
    addFontRefs(fonts, '/F1 9 0 R /F3 4 0 R');
    expect([...fonts]).toEqual([
      ['F1', 1],
      ['F3', 4],
    ]);
  });
});

describe('content strings and items', () => {
  it('readLiteralString handles escapes, nested parentheses and octal', () => {
    expect(readLiteralString('(a\\(b\\) (c) \\101\\n\\\nz)', 0)).toEqual(['a(b) (c) A\nz', 22]);
    expect(readLiteralString('(no end', 0)[0]).toBe('no end');
  });

  it('readEscape covers octal, letters, CRLF break and literal character', () => {
    expect(readEscape('351', 0)).toEqual(['é', 3]);
    expect(readEscape('t', 0)).toEqual(['\t', 1]);
    expect(readEscape('\r\nx', 0)).toEqual(['', 2]);
    expect(readEscape('\\', 0)).toEqual(['\\', 1]);
  });

  it('readHexString pads an odd digit and tolerates a missing >', () => {
    expect(readHexString('<48 69>', 0)).toEqual(['Hi', 7]);
    expect(readHexString('<4', 0)).toEqual(['@', 3]);
  });

  it('nextPdfToken, readPdfWord, classifyWord and skipPdfSpace', () => {
    expect(nextPdfToken('  /F1 ', 0)).toEqual([{ kind: 'name', value: 'F1' }, 5]);
    expect(nextPdfToken('[', 0)?.[0].kind).toBe('open');
    expect(nextPdfToken(']', 0)?.[0].kind).toBe('close');
    expect(nextPdfToken('<<', 0)?.[0]).toEqual({ kind: 'op', value: '<<' });
    expect(nextPdfToken('   ', 0)).toBeNull();
    expect(readPdfWord('-1.5 Tj', 0)).toEqual([{ kind: 'number', value: -1.5 }, 4]);
    expect(classifyWord('Tj')).toEqual({ kind: 'op', value: 'Tj' });
    expect(classifyWord('.5')).toEqual({ kind: 'number', value: 0.5 });
    expect(skipPdfSpace('  x', 0)).toBe(2);
    expect(wrapString(['a', 3])).toEqual([{ kind: 'string', value: 'a' }, 3]);
  });
});

describe('text interpreter', () => {
  const cmap: PdfCMap = { map: new Map([[0x41, 'Z']]), bytes: 1 };
  function fresh(): PdfTextState {
    return { font: undefined, operands: [], array: null, out: [] };
  }

  it('decodePdfText uses the font map or latin1', () => {
    expect(decodePdfText('AB', cmap)).toBe('Z');
    expect(decodePdfText('AB', undefined)).toBe('AB');
  });

  it('operators \', ", TJ, Td, T*, Tf and unknown', () => {
    const state = fresh();
    state.operands = [{ kind: 'string', value: 'x' }];
    applyTextOperator(state, "'", new Map());
    applyTextOperator(state, '"', new Map());
    state.operands = [{ kind: 'name', value: 'F9' }];
    applyTextOperator(state, 'Tf', new Map([['F9', cmap]]));
    expect(state.font).toBe(cmap);
    applyTextOperator(state, 'TJ', new Map());
    applyTextOperator(state, 'cm', new Map());
    expect(state.out).toEqual(['\nx', '\nx', '']);
  });

  it('lastOperandText and moveText', () => {
    const state = fresh();
    expect(lastOperandText(state)).toBe('');
    state.operands = [
      { kind: 'number', value: 10 },
      { kind: 'number', value: 0 },
    ];
    expect(moveText(state)).toBe(' ');
    state.operands = [
      { kind: 'number', value: 0 },
      { kind: 'number', value: -12 },
    ];
    expect(moveText(state)).toBe('\n');
  });

  it('showArrayText inserts a space only for large adjustments', () => {
    const items = [
      { kind: 'string', value: 'a' },
      { kind: 'number', value: -50 },
      { kind: 'string', value: 'b' },
      { kind: 'number', value: -300 },
      { kind: 'string', value: 'c' },
    ] as const;
    expect(showArrayText(items, undefined)).toBe('ab c');
  });

  it('feedPdfToken accumulates lists and clears operands on the operator', () => {
    const state = fresh();
    feedPdfToken(state, { kind: 'open', value: '[' }, new Map());
    feedPdfToken(state, { kind: 'string', value: 'q' }, new Map());
    feedPdfToken(state, { kind: 'close', value: ']' }, new Map());
    feedPdfToken(state, { kind: 'op', value: 'TJ' }, new Map());
    expect(state).toMatchObject({ out: ['q'], operands: [], array: null });
  });

  it('contentStreamText and tidyPdfText', () => {
    expect(contentStreamText('BT (Olá) Tj ET % end', new Map())).toBe('Olá\n');
    expect(tidyPdfText('  a   b \n\n\n\n c  ')).toBe('a b\n\nc');
  });
});
