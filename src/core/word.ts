/**
 * Text of Word documents: .docx (ZIP + XML) and .doc (Word 97-2003, binary inside a CFB).
 * No Node APIs and no dependencies: runs the same locally and in Cloudflare Workers.
 */
import { byteView, utf16leToString } from './bytes.js';
import { openCfb, readCfbStream } from './cfb.js';
import { htmlToText } from './html.js';
import { readZipEntry } from './zip.js';

/** Characters 0x80 to 0x9F in Windows-1252 ("compressed" .doc text); the rest is Latin-1. */
export const CP1252_HIGH = '€\u0081‚ƒ„…†‡ˆ‰Š‹Œ\u008dŽ\u008f\u0090‘’“”•–—˜™š›œ\u009džŸ';

/** WordprocessingML fragments that become text, in document order. */
const DOCX_TOKENS =
  /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>|<w:tab\/>|<w:(?:br|cr)(?:\s[^>]*)?\/>|<\/w:p>/g;

/** Converts the body XML of a .docx into text: paragraphs, tabs and line breaks. */
export function docxXmlToText(xml: string): string {
  let out = '';
  for (const match of xml.matchAll(DOCX_TOKENS)) {
    const [token, text] = match;
    if (text !== undefined) out += text;
    else if (token === '<w:tab/>') out += '\t';
    else out += '\n';
  }
  return htmlToText(out);
}

/** Extracts the text of a .docx. */
export async function docxToText(bytes: Uint8Array): Promise<string> {
  const xml = await readZipEntry(bytes, 'word/document.xml');
  if (!xml) throw new Error('.docx file without word/document.xml.');
  return docxXmlToText(new TextDecoder().decode(xml));
}

/** Decodes Windows-1252 bytes. */
export function cp1252ToString(bytes: Uint8Array): string {
  let out = '';
  for (const b of bytes) {
    out += b >= 0x80 && b < 0xa0 ? CP1252_HIGH.charAt(b - 0x80) : String.fromCharCode(b);
  }
  return out;
}

/** .doc text piece: character range and where its bytes are in the WordDocument stream. */
export interface DocPiece {
  readonly cpStart: number;
  readonly cpEnd: number;
  readonly fc: number;
}

/** Reads the piece table (PlcPcd) inside the Clx, skipping the formatting blocks (Prc). */
export function parsePieceTable(table: Uint8Array, fcClx: number): DocPiece[] {
  const v = byteView(table);
  let pos = fcClx;
  while (table[pos] === 0x01) pos += 3 + v.getUint16(pos + 1, true);
  if (table[pos] !== 0x02) throw new Error('.doc document with an invalid text table.');
  const lcb = v.getUint32(pos + 1, true);
  const plc = pos + 5;
  const count = (lcb - 4) / 12;
  return Array.from({ length: count }, (_, i) => ({
    cpStart: v.getUint32(plc + i * 4, true),
    cpEnd: v.getUint32(plc + (i + 1) * 4, true),
    fc: v.getUint32(plc + (count + 1) * 4 + i * 8 + 2, true),
  }));
}

/** Text of a piece: 8-bit (Windows-1252) if the "compressed" bit is set, otherwise UTF-16LE. */
export function pieceText(wordDoc: Uint8Array, piece: DocPiece): string {
  const length = piece.cpEnd - piece.cpStart;
  if (piece.fc & 0x40000000) {
    const start = (piece.fc & 0x3fffffff) / 2;
    return cp1252ToString(wordDoc.subarray(start, start + length));
  }
  return utf16leToString(wordDoc.subarray(piece.fc, piece.fc + length * 2));
}

/* eslint-disable no-control-regex -- .doc text uses control characters as marks */
/** Replacements of Word marks, in order: fields (the result stays), paragraphs, cells and leftovers. */
export const WORD_TEXT_REPLACEMENTS: readonly (readonly [RegExp, string])[] = [
  [/\u0013[^\u0013\u0014\u0015]*\u0014/g, ''],
  [/\u0013[^\u0013\u0014\u0015]*\u0015/g, ''],
  [/[\r\u000b\u000c]/g, '\n'],
  [/\u0007/g, '\t'],
  [/[\u0000-\u0008\u000e-\u001f]/g, ''],
  [/[ \t]+\n/g, '\n'],
  [/\n{3,}/g, '\n\n'],
];
/* eslint-enable no-control-regex */

/** Replaces Word control characters with text: paragraphs, cells and fields (keeps the result). */
export function cleanWordText(raw: string): string {
  return WORD_TEXT_REPLACEMENTS.reduce((acc, [re, to]) => acc.replace(re, to), raw).trim();
}

/** Extracts the main text of a .doc (Word 97-2003), without footnotes and headers. */
export function docToText(bytes: Uint8Array): string {
  const cfb = openCfb(bytes);
  const wordDoc = readCfbStream(cfb, 'WordDocument');
  if (!wordDoc) throw new Error('.doc file without the WordDocument stream.');
  const v = byteView(wordDoc);
  const flags = v.getUint16(0x0a, true);
  if (flags & 0x0100) throw new Error('The .doc is password-protected.');
  const table = readCfbStream(cfb, flags & 0x0200 ? '1Table' : '0Table');
  if (!table) throw new Error('.doc file without the table stream.');
  const pieces = parsePieceTable(table, v.getUint32(0x01a2, true));
  const raw = pieces.map((p) => pieceText(wordDoc, p)).join('');
  return cleanWordText(raw.slice(0, v.getUint32(0x4c, true)));
}

/** Word document kind by name or MIME: `docx`, `doc` or `null`. */
export function wordKind(contentType: string, name: string): 'docx' | 'doc' | null {
  if (/\.docx$/i.test(name) || contentType.includes('wordprocessingml')) return 'docx';
  if (/\.doc$/i.test(name) || contentType === 'application/msword') return 'doc';
  return null;
}

/** Extracts the text of a Word document of the given kind. */
export function wordToText(kind: 'docx' | 'doc', bytes: Uint8Array): Promise<string> {
  return kind === 'docx' ? docxToText(bytes) : Promise.resolve(docToText(bytes));
}
