/**
 * Dependency-free PDF text extraction (receipts, invoices): objects, FlateDecode streams, object
 * streams, ToUnicode maps and the page text operators. No OCR and no encrypted PDFs.
 */
import { decompressBytes } from './zip.js';

/** PDF object: dictionary (text) and the decompressed stream, if any. */
export interface PdfObject {
  readonly dict: string;
  readonly data: Uint8Array | null;
}

/** PDF objects by number. */
export type PdfObjects = ReadonlyMap<number, PdfObject>;

/** ToUnicode map of a font: code → text, and how many bytes each code has. */
export interface PdfCMap {
  readonly map: ReadonlyMap<number, string>;
  readonly bytes: 1 | 2;
}

/** Raw piece of an object: dictionary and the still-compressed stream bytes. */
interface RawPdfObject {
  readonly num: number;
  readonly dict: string;
  readonly stream: Uint8Array | null;
}

/** Converts bytes into one-character-per-byte text (latin1), to find keywords without losing offsets. */
export function bytesToLatin1(bytes: Uint8Array): string {
  let out = '';
  for (let pos = 0; pos < bytes.length; pos += 0x8000) {
    out += String.fromCharCode(...bytes.subarray(pos, pos + 0x8000));
  }
  return out;
}

/** Says whether the bytes start like a PDF (`%PDF-`). */
export function isPdf(bytes: Uint8Array): boolean {
  return bytesToLatin1(bytes.subarray(0, 5)) === '%PDF-';
}

/** Start of a stream's data: after `stream` and the line break (CRLF or LF). */
export function streamDataStart(text: string, keywordAt: number): number {
  const after = keywordAt + 'stream'.length;
  if (text.startsWith('\r\n', after)) return after + 2;
  return text[after] === '\n' || text[after] === '\r' ? after + 1 : after;
}

/** End of a stream's data without the line break before `endstream` (it is not part of the data). */
export function trimStreamEol(text: string, dataStart: number, streamEnd: number): number {
  let end = streamEnd;
  if (end > dataStart && text[end - 1] === '\n') end--;
  if (end > dataStart && text[end - 1] === '\r') end--;
  return end;
}

/** Reads the object starting at `start` (right after `N G obj`); `end` is where the search for the next one resumes. */
export function readRawObject(
  text: string,
  bytes: Uint8Array,
  start: number,
): { dict: string; stream: Uint8Array | null; end: number } {
  const objEnd = text.indexOf('endobj', start);
  const limit = objEnd < 0 ? text.length : objEnd;
  const keyword = text.indexOf('stream', start);
  if (keyword < 0 || keyword > limit)
    return { dict: text.slice(start, limit), stream: null, end: limit };
  const dataStart = streamDataStart(text, keyword);
  const dataEnd = text.indexOf('endstream', dataStart);
  const streamEnd = dataEnd < 0 ? text.length : dataEnd;
  const end = text.indexOf('endobj', streamEnd);
  return {
    dict: text.slice(start, keyword),
    stream: bytes.subarray(dataStart, trimStreamEol(text, dataStart, streamEnd)),
    end: end < 0 ? text.length : end,
  };
}

/** Lists the file's `N G obj ... endobj` objects, in the order they appear. */
export function listRawObjects(bytes: Uint8Array): RawPdfObject[] {
  const text = bytesToLatin1(bytes);
  const pattern = /(\d+)\s+\d+\s+obj\b/g;
  const objects: RawPdfObject[] = [];
  for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
    const raw = readRawObject(text, bytes, match.index + match[0].length);
    objects.push({ num: Number(match[1]), dict: raw.dict, stream: raw.stream });
    pattern.lastIndex = raw.end;
  }
  return objects;
}

/** Decompresses the stream per its `/Filter`: no filter passes through, FlateDecode inflates, others give null. */
export async function decodePdfStream(
  dict: string,
  stream: Uint8Array,
): Promise<Uint8Array | null> {
  if (!dict.includes('/Filter')) return stream;
  if (!/\/Filter\s*\[?\s*\/FlateDecode\s*\]?/.test(dict)) return null;
  try {
    return await decompressBytes(stream, 'deflate');
  } catch {
    return null;
  }
}

/** Splits the objects stored in an object stream (`/Type /ObjStm`): numbers and dictionaries. */
export function splitObjectStream(dict: string, data: Uint8Array): [number, PdfObject][] {
  const first = Number(/\/First\s+(\d+)/.exec(dict)?.[1] ?? NaN);
  if (Number.isNaN(first)) return [];
  const text = bytesToLatin1(data);
  const header = text.slice(0, first).trim().split(/\s+/).map(Number);
  const offsets = header.filter((_, i) => i % 2 === 1).map((off) => first + off);
  return header
    .filter((_, i) => i % 2 === 0)
    .map((num, i) => [
      num,
      { dict: text.slice(offsets[i] ?? text.length, offsets[i + 1] ?? text.length), data: null },
    ]);
}

/** Stores a read object and, if it is an object stream, the objects inside it (without overwriting). */
export function storePdfObject(objects: Map<number, PdfObject>, num: number, obj: PdfObject): void {
  objects.set(num, obj);
  if (!obj.data || !/\/Type\s*\/ObjStm/.test(obj.dict)) return;
  for (const [inner, innerObj] of splitObjectStream(obj.dict, obj.data)) {
    if (!objects.has(inner)) objects.set(inner, innerObj);
  }
}

/** Reads every PDF object, decompressing streams and opening object streams. */
export async function readPdfObjects(bytes: Uint8Array): Promise<PdfObjects> {
  const objects = new Map<number, PdfObject>();
  for (const raw of listRawObjects(bytes)) {
    const data = raw.stream ? await decodePdfStream(raw.dict, raw.stream) : null;
    storePdfObject(objects, raw.num, { dict: raw.dict, data });
  }
  return objects;
}

/** Object numbers referenced (`N 0 R`) in a fragment. */
export function pdfRefs(text: string): number[] {
  return [...text.matchAll(/(\d+)\s+\d+\s+R\b/g)].map((m) => Number(m[1]));
}

/** Value of a key that may be a single reference or a list of references (`/Kids [...]`, `/Contents`). */
export function dictRefs(dict: string, key: string): number[] {
  const match = new RegExp(`/${key}\\s*(\\[[^\\]]*\\]|\\d+\\s+\\d+\\s+R)`).exec(dict);
  return match?.[1] ? pdfRefs(match[1]) : [];
}

/** Appends to `pages` the pages under node `num` of the page tree, in order (bounded depth). */
export function collectPdfPages(objects: PdfObjects, num: number, pages: number[]): void {
  const dict = objects.get(num)?.dict ?? '';
  if (/\/Type\s*\/Page\b/.test(dict)) pages.push(num);
  else if (pages.length < 10_000)
    for (const kid of dictRefs(dict, 'Kids')) collectPdfPages(objects, kid, pages);
}

/** Pages in reading order, walking the `/Pages` → `/Kids` tree from the root. */
export function orderedPages(objects: PdfObjects): number[] {
  const pages: number[] = [];
  for (const [num, obj] of objects) {
    if (/\/Type\s*\/Pages\b/.test(obj.dict) && !/\/Parent\b/.test(obj.dict))
      collectPdfPages(objects, num, pages);
  }
  return pages;
}

/** Decodes UTF-16BE hex (a ToUnicode map target) into text. */
export function utf16beHexToString(hex: string): string {
  if (hex.length === 2) return String.fromCharCode(parseInt(hex, 16));
  const units: number[] = [];
  for (let pos = 0; pos + 4 <= hex.length; pos += 4)
    units.push(parseInt(hex.slice(pos, pos + 4), 16));
  return String.fromCharCode(...units);
}

/** Reads the `<src> <target>` lines of the `beginbfchar` blocks of a ToUnicode map. */
export function readBfChars(text: string, map: Map<number, string>): void {
  for (const block of text.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const pair of (block[1] ?? '').matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]*)>/g)) {
      map.set(parseInt(pair[1] ?? '0', 16), utf16beHexToString(pair[2] ?? ''));
    }
  }
}

/** Reads the `beginbfrange` blocks of a ToUnicode map (incremented start target or list). */
export function readBfRanges(text: string, map: Map<number, string>): void {
  const line = /<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*(<[0-9a-fA-F]*>|\[[^\]]*\])/g;
  for (const block of text.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
    for (const m of (block[1] ?? '').matchAll(line)) {
      const lo = parseInt(m[1] ?? '0', 16);
      const hi = Math.min(parseInt(m[2] ?? '0', 16), lo + 0xffff);
      const targets = [...(m[3] ?? '').matchAll(/<([0-9a-fA-F]*)>/g)].map((t) => t[1] ?? '');
      for (let code = lo; code <= hi; code++) map.set(code, rangeTarget(targets, code - lo));
    }
  }
}

/** Target of a code in a `bfrange`: the list item, or the start target plus the offset. */
export function rangeTarget(targets: readonly string[], offset: number): string {
  if (targets.length > 1) return utf16beHexToString(targets[offset] ?? '');
  const base = utf16beHexToString(targets[0] ?? '');
  if (!base) return '';
  return base.slice(0, -1) + String.fromCharCode(base.charCodeAt(base.length - 1) + offset);
}

/** Parses a ToUnicode map: 1- or 2-byte codes (by `codespacerange`) and their texts. */
export function parseToUnicodeCMap(text: string): PdfCMap {
  const map = new Map<number, string>();
  readBfChars(text, map);
  readBfRanges(text, map);
  const space = /begincodespacerange\s*<([0-9a-fA-F]+)>/.exec(text)?.[1] ?? '';
  return { map, bytes: space.length >= 4 ? 2 : 1 };
}

/** Adds to `fonts` the name → object pairs (`/F1 5 0 R`) of a font dictionary. */
export function addFontRefs(fonts: Map<string, number>, text: string): void {
  for (const m of text.matchAll(/\/([^\s/<>[\]()]+)\s+(\d+)\s+\d+\s+R/g)) {
    const name = m[1] ?? '';
    if (!fonts.has(name)) fonts.set(name, Number(m[2]));
  }
}

/** Font names (`/F1`) → font object, merging the `/Font` dictionaries of every resource. */
export function fontResourceRefs(objects: PdfObjects): Map<string, number> {
  const fonts = new Map<string, number>();
  for (const obj of objects.values()) {
    addFontRefs(fonts, /\/Font\s*<<([^>]*)>>/.exec(obj.dict)?.[1] ?? '');
    const ref = /\/Font\s+(\d+)\s+\d+\s+R/.exec(obj.dict)?.[1];
    if (ref) addFontRefs(fonts, objects.get(Number(ref))?.dict ?? '');
  }
  return fonts;
}

/** ToUnicode maps by font name, for fonts that have `/ToUnicode`. */
export function fontCMaps(objects: PdfObjects): Map<string, PdfCMap> {
  const cmaps = new Map<string, PdfCMap>();
  for (const [name, num] of fontResourceRefs(objects)) {
    const ref = dictRefs(objects.get(num)?.dict ?? '', 'ToUnicode')[0];
    const data = ref === undefined ? null : objects.get(ref)?.data;
    if (data) cmaps.set(name, parseToUnicodeCMap(bytesToLatin1(data)));
  }
  return cmaps;
}

/** Decodes the bytes of a text string with the current font (ToUnicode), or as latin1 without a map. */
export function decodePdfText(raw: string, cmap: PdfCMap | undefined): string {
  if (!cmap) return raw;
  let out = '';
  for (let pos = 0; pos + cmap.bytes <= raw.length; pos += cmap.bytes) {
    const code =
      cmap.bytes === 2 ? raw.charCodeAt(pos) * 256 + raw.charCodeAt(pos + 1) : raw.charCodeAt(pos);
    out += cmap.map.get(code) ?? '';
  }
  return out;
}

/** Escape sequences of a PDF literal string (`\n`, `\(`...). */
export const PDF_ESCAPES: Readonly<Record<string, string>> = {
  n: '\n',
  r: '\r',
  t: '\t',
  b: '\b',
  f: '\f',
};

/** How much each parenthesis changes the depth of a literal string. */
const PAREN_DEPTH: Readonly<Record<string, number>> = { '(': 1, ')': -1 };

/** Reads a literal string `( ... )` from the `(`; returns the raw text and the next position. */
export function readLiteralString(src: string, start: number): [string, number] {
  let depth = 1;
  let out = '';
  let pos = start + 1;
  while (pos < src.length && depth > 0) {
    const ch = src[pos] ?? '';
    if (ch === '\\') {
      const [text, next] = readEscape(src, pos + 1);
      out += text;
      pos = next;
      continue;
    }
    depth += PAREN_DEPTH[ch] ?? 0;
    if (depth > 0) out += ch;
    pos++;
  }
  return [out, pos];
}

/** Reads the escape after `\`: octal of up to 3 digits, known letter, line break or the character itself. */
export function readEscape(src: string, pos: number): [string, number] {
  const octal = /^[0-7]{1,3}/.exec(src.slice(pos, pos + 3))?.[0];
  if (octal) return [String.fromCharCode(parseInt(octal, 8) & 0xff), pos + octal.length];
  const ch = src[pos] ?? '';
  if (ch === '\r' || ch === '\n') return ['', src.startsWith('\r\n', pos) ? pos + 2 : pos + 1];
  return [PDF_ESCAPES[ch] ?? ch, pos + 1];
}

/** Reads a hex string `<...>` from the `<`; an odd trailing digit counts as followed by 0. */
export function readHexString(src: string, start: number): [string, number] {
  const end = src.indexOf('>', start);
  const stop = end < 0 ? src.length : end;
  const hex = src.slice(start + 1, stop).replace(/[^0-9a-fA-F]/g, '');
  const padded = hex.length % 2 ? `${hex}0` : hex;
  let out = '';
  for (let pos = 0; pos < padded.length; pos += 2)
    out += String.fromCharCode(parseInt(padded.slice(pos, pos + 2), 16));
  return [out, stop + 1];
}

/** Item read from a content stream: text string, number, name, list mark or operator. */
export type PdfToken =
  | { readonly kind: 'string'; readonly value: string }
  | { readonly kind: 'number'; readonly value: number }
  | { readonly kind: 'name' | 'op' | 'open' | 'close'; readonly value: string };

/** Whitespace (sticky search at the position, without copying the rest of the text). */
const PDF_SPACE = /\s*/y;

/** A stream word: name, `<<`/`>>`, number/operator, comment or a lone character. */
const PDF_WORD = /\/[^\s/<>[\]()]*|<<|>>|[^\s/<>[\]()%]+|%[^\r\n]*|[\s\S]/y;

/** Position of the next non-space character, from `pos`. */
export function skipPdfSpace(src: string, pos: number): number {
  PDF_SPACE.lastIndex = pos;
  PDF_SPACE.exec(src);
  return PDF_SPACE.lastIndex;
}

/** Reads the next content stream item from `pos`; null at the end. */
export function nextPdfToken(src: string, pos: number): [PdfToken, number] | null {
  const at = skipPdfSpace(src, pos);
  if (at >= src.length) return null;
  const ch = src[at] ?? '';
  if (ch === '(') return wrapString(readLiteralString(src, at));
  if (ch === '<' && src[at + 1] !== '<') return wrapString(readHexString(src, at));
  if (ch === '[') return [{ kind: 'open', value: ch }, at + 1];
  if (ch === ']') return [{ kind: 'close', value: ch }, at + 1];
  return readPdfWord(src, at);
}

/** Reads a word (name, number, operator, `<<`/`>>` or comment) from `at`. */
export function readPdfWord(src: string, at: number): [PdfToken, number] {
  PDF_WORD.lastIndex = at;
  const word = PDF_WORD.exec(src)?.[0] ?? ' ';
  return [classifyWord(word), at + word.length];
}

/** Wraps the result of a string read in a `string` item. */
export function wrapString([value, next]: [string, number]): [PdfToken, number] {
  return [{ kind: 'string', value }, next];
}

/** Classifies a stream word: name (`/F1`), number or operator. */
export function classifyWord(word: string): PdfToken {
  if (word.startsWith('/')) return { kind: 'name', value: word.slice(1) };
  if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(word)) return { kind: 'number', value: Number(word) };
  return { kind: 'op', value: word };
}

/** Text interpreter state: current font, operands, open list and text produced so far. */
export interface PdfTextState {
  font: PdfCMap | undefined;
  operands: PdfToken[];
  array: PdfToken[] | null;
  out: string[];
}

/** `TJ` letter spacing beyond which the adjustment counts as a word space. */
export const TJ_SPACE_THRESHOLD = -200;

/** Text of a `TJ` operand: decoded strings and spaces where the adjustment is large. */
export function showArrayText(items: readonly PdfToken[], font: PdfCMap | undefined): string {
  return items
    .map((item) => {
      if (item.kind === 'string') return decodePdfText(item.value, font);
      return item.kind === 'number' && item.value < TJ_SPACE_THRESHOLD ? ' ' : '';
    })
    .join('');
}

/** Text of the last operand string, decoded with the current font. */
export function lastOperandText(state: PdfTextState): string {
  const last = state.operands[state.operands.length - 1];
  return last?.kind === 'string' ? decodePdfText(last.value, state.font) : '';
}

/** What a `Td`/`TD` produces: a line break if the line changed (ty ≠ 0), otherwise a space. */
export function moveText(state: PdfTextState): string {
  const ty = state.operands[state.operands.length - 1];
  return ty?.kind === 'number' && ty.value !== 0 ? '\n' : ' ';
}

/** Text produced by each text operator (except `Tf`, which only switches the font). */
export const PDF_TEXT_OPERATORS: Readonly<Record<string, (state: PdfTextState) => string>> = {
  Tj: lastOperandText,
  "'": (state) => `\n${lastOperandText(state)}`,
  '"': (state) => `\n${lastOperandText(state)}`,
  TJ: (state) => (state.array ? showArrayText(state.array, state.font) : ''),
  Td: moveText,
  TD: moveText,
  'T*': () => '\n',
  ET: () => '\n',
};

/** Applies a text operator to the state: switches the font or appends the text it produces. */
export function applyTextOperator(
  state: PdfTextState,
  op: string,
  cmaps: ReadonlyMap<string, PdfCMap>,
): void {
  if (op === 'Tf') {
    state.font = cmaps.get(String(state.operands[0]?.value ?? ''));
    return;
  }
  const produce = PDF_TEXT_OPERATORS[op];
  if (produce) state.out.push(produce(state));
}

/** Feeds an item to the interpreter: lists, operands and operators. */
export function feedPdfToken(
  state: PdfTextState,
  token: PdfToken,
  cmaps: ReadonlyMap<string, PdfCMap>,
): void {
  if (token.kind === 'open') state.array = [];
  else if (token.kind === 'close') return;
  else if (state.array && token.kind !== 'op') state.array.push(token);
  else if (token.kind === 'op') {
    applyTextOperator(state, token.value, cmaps);
    state.operands = [];
    state.array = null;
  } else state.operands.push(token);
}

/** Text of a page content stream. */
export function contentStreamText(content: string, cmaps: ReadonlyMap<string, PdfCMap>): string {
  const state: PdfTextState = { font: undefined, operands: [], array: null, out: [] };
  for (let next = nextPdfToken(content, 0); next; next = nextPdfToken(content, next[1])) {
    feedPdfToken(state, next[0], cmaps);
  }
  return state.out.join('');
}

/** Tidies the extracted text: repeated spaces, extra blank lines and ends. */
export function tidyPdfText(text: string): string {
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Extracts the text of a PDF, page by page; throws if it is encrypted. */
export async function pdfToText(bytes: Uint8Array): Promise<string> {
  if (/\/Encrypt\b/.test(bytesToLatin1(bytes.subarray(Math.max(0, bytes.length - 4096))))) {
    throw new Error('The PDF is password-protected (encrypted); its text cannot be read.');
  }
  const objects = await readPdfObjects(bytes);
  const cmaps = fontCMaps(objects);
  const pages = orderedPages(objects).map((page) =>
    dictRefs(objects.get(page)?.dict ?? '', 'Contents')
      .map((ref) => objects.get(ref)?.data)
      .map((data) => (data ? contentStreamText(bytesToLatin1(data), cmaps) : ''))
      .join(''),
  );
  return tidyPdfText(pages.join('\n\n'));
}
