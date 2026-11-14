/**
 * Extração de texto de PDF sem dependências (recibos, faturas): objetos, fluxos FlateDecode, fluxos de
 * objetos, mapas ToUnicode e os operadores de texto das páginas. Não faz OCR nem abre PDF cifrado.
 */
import { decompressBytes } from './zip.js';

/** Objeto do PDF: dicionário (texto) e o fluxo já descomprimido, se houver. */
export interface PdfObject {
  readonly dict: string;
  readonly data: Uint8Array | null;
}

/** Objetos do PDF por número. */
export type PdfObjects = ReadonlyMap<number, PdfObject>;

/** Mapa ToUnicode de uma fonte: código → texto, e quantos bytes tem cada código. */
export interface PdfCMap {
  readonly map: ReadonlyMap<number, string>;
  readonly bytes: 1 | 2;
}

/** Pedaço cru de um objeto: dicionário e bytes do fluxo ainda comprimido. */
interface RawPdfObject {
  readonly num: number;
  readonly dict: string;
  readonly stream: Uint8Array | null;
}

/** Converte bytes em texto de um caractere por byte (latin1), para achar palavras-chave sem perder offsets. */
export function bytesToLatin1(bytes: Uint8Array): string {
  let out = '';
  for (let pos = 0; pos < bytes.length; pos += 0x8000) {
    out += String.fromCharCode(...bytes.subarray(pos, pos + 0x8000));
  }
  return out;
}

/** Diz se os bytes começam como um PDF (`%PDF-`). */
export function isPdf(bytes: Uint8Array): boolean {
  return bytesToLatin1(bytes.subarray(0, 5)) === '%PDF-';
}

/** Início dos dados de um fluxo: depois de `stream` e da quebra de linha (CRLF ou LF). */
export function streamDataStart(text: string, keywordAt: number): number {
  const after = keywordAt + 'stream'.length;
  if (text.startsWith('\r\n', after)) return after + 2;
  return text[after] === '\n' || text[after] === '\r' ? after + 1 : after;
}

/** Fim dos dados de um fluxo sem a quebra de linha que precede `endstream` (ela não faz parte dos dados). */
export function trimStreamEol(text: string, dataStart: number, streamEnd: number): number {
  let end = streamEnd;
  if (end > dataStart && text[end - 1] === '\n') end--;
  if (end > dataStart && text[end - 1] === '\r') end--;
  return end;
}

/** Lê o objeto que começa em `start` (logo após `N G obj`); `end` é onde a busca pelo próximo continua. */
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

/** Lista os objetos `N G obj ... endobj` do arquivo, na ordem em que aparecem. */
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

/** Descomprime o fluxo conforme o `/Filter`: sem filtro passa direto, FlateDecode infla, outros dão nulo. */
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

/** Separa os objetos guardados num fluxo de objetos (`/Type /ObjStm`): números e dicionários. */
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

/** Guarda um objeto lido e, se ele for um fluxo de objetos, os objetos de dentro (sem sobrescrever). */
export function storePdfObject(objects: Map<number, PdfObject>, num: number, obj: PdfObject): void {
  objects.set(num, obj);
  if (!obj.data || !/\/Type\s*\/ObjStm/.test(obj.dict)) return;
  for (const [inner, innerObj] of splitObjectStream(obj.dict, obj.data)) {
    if (!objects.has(inner)) objects.set(inner, innerObj);
  }
}

/** Lê todos os objetos do PDF, descomprimindo fluxos e abrindo os fluxos de objetos. */
export async function readPdfObjects(bytes: Uint8Array): Promise<PdfObjects> {
  const objects = new Map<number, PdfObject>();
  for (const raw of listRawObjects(bytes)) {
    const data = raw.stream ? await decodePdfStream(raw.dict, raw.stream) : null;
    storePdfObject(objects, raw.num, { dict: raw.dict, data });
  }
  return objects;
}

/** Números de objeto citados como referência (`N 0 R`) num trecho. */
export function pdfRefs(text: string): number[] {
  return [...text.matchAll(/(\d+)\s+\d+\s+R\b/g)].map((m) => Number(m[1]));
}

/** Valor de uma chave que pode ser referência única ou lista de referências (`/Kids [...]`, `/Contents`). */
export function dictRefs(dict: string, key: string): number[] {
  const match = new RegExp(`/${key}\\s*(\\[[^\\]]*\\]|\\d+\\s+\\d+\\s+R)`).exec(dict);
  return match?.[1] ? pdfRefs(match[1]) : [];
}

/** Acrescenta a `pages` as páginas sob o nó `num` da árvore de páginas, em ordem (profundidade limitada). */
export function collectPdfPages(objects: PdfObjects, num: number, pages: number[]): void {
  const dict = objects.get(num)?.dict ?? '';
  if (/\/Type\s*\/Page\b/.test(dict)) pages.push(num);
  else if (pages.length < 10_000)
    for (const kid of dictRefs(dict, 'Kids')) collectPdfPages(objects, kid, pages);
}

/** Páginas na ordem de leitura, percorrendo a árvore `/Pages` → `/Kids` a partir da raiz. */
export function orderedPages(objects: PdfObjects): number[] {
  const pages: number[] = [];
  for (const [num, obj] of objects) {
    if (/\/Type\s*\/Pages\b/.test(obj.dict) && !/\/Parent\b/.test(obj.dict))
      collectPdfPages(objects, num, pages);
  }
  return pages;
}

/** Decodifica hexadecimal UTF-16BE (destino de um mapa ToUnicode) em texto. */
export function utf16beHexToString(hex: string): string {
  if (hex.length === 2) return String.fromCharCode(parseInt(hex, 16));
  const units: number[] = [];
  for (let pos = 0; pos + 4 <= hex.length; pos += 4)
    units.push(parseInt(hex.slice(pos, pos + 4), 16));
  return String.fromCharCode(...units);
}

/** Lê as linhas `<orig> <destino>` dos blocos `beginbfchar` de um mapa ToUnicode. */
export function readBfChars(text: string, map: Map<number, string>): void {
  for (const block of text.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const pair of (block[1] ?? '').matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]*)>/g)) {
      map.set(parseInt(pair[1] ?? '0', 16), utf16beHexToString(pair[2] ?? ''));
    }
  }
}

/** Lê os blocos `beginbfrange` de um mapa ToUnicode (destino inicial incrementado ou lista). */
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

/** Destino de um código num `bfrange`: o item da lista, ou o destino inicial somado ao deslocamento. */
export function rangeTarget(targets: readonly string[], offset: number): string {
  if (targets.length > 1) return utf16beHexToString(targets[offset] ?? '');
  const base = utf16beHexToString(targets[0] ?? '');
  if (!base) return '';
  return base.slice(0, -1) + String.fromCharCode(base.charCodeAt(base.length - 1) + offset);
}

/** Interpreta um mapa ToUnicode: códigos de 1 ou 2 bytes (pelo `codespacerange`) e seus textos. */
export function parseToUnicodeCMap(text: string): PdfCMap {
  const map = new Map<number, string>();
  readBfChars(text, map);
  readBfRanges(text, map);
  const space = /begincodespacerange\s*<([0-9a-fA-F]+)>/.exec(text)?.[1] ?? '';
  return { map, bytes: space.length >= 4 ? 2 : 1 };
}

/** Acrescenta a `fonts` os pares nome → objeto (`/F1 5 0 R`) de um dicionário de fontes. */
export function addFontRefs(fonts: Map<string, number>, text: string): void {
  for (const m of text.matchAll(/\/([^\s/<>[\]()]+)\s+(\d+)\s+\d+\s+R/g)) {
    const name = m[1] ?? '';
    if (!fonts.has(name)) fonts.set(name, Number(m[2]));
  }
}

/** Nomes de fonte (`/F1`) → objeto da fonte, juntando os dicionários `/Font` de todos os recursos. */
export function fontResourceRefs(objects: PdfObjects): Map<string, number> {
  const fonts = new Map<string, number>();
  for (const obj of objects.values()) {
    addFontRefs(fonts, /\/Font\s*<<([^>]*)>>/.exec(obj.dict)?.[1] ?? '');
    const ref = /\/Font\s+(\d+)\s+\d+\s+R/.exec(obj.dict)?.[1];
    if (ref) addFontRefs(fonts, objects.get(Number(ref))?.dict ?? '');
  }
  return fonts;
}

/** Mapas ToUnicode por nome de fonte, para as fontes que têm `/ToUnicode`. */
export function fontCMaps(objects: PdfObjects): Map<string, PdfCMap> {
  const cmaps = new Map<string, PdfCMap>();
  for (const [name, num] of fontResourceRefs(objects)) {
    const ref = dictRefs(objects.get(num)?.dict ?? '', 'ToUnicode')[0];
    const data = ref === undefined ? null : objects.get(ref)?.data;
    if (data) cmaps.set(name, parseToUnicodeCMap(bytesToLatin1(data)));
  }
  return cmaps;
}

/** Decodifica os bytes de uma string de texto pela fonte atual (ToUnicode), ou como latin1 sem mapa. */
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

/** Sequências de escape de uma string literal do PDF (`\n`, `\(`...). */
export const PDF_ESCAPES: Readonly<Record<string, string>> = {
  n: '\n',
  r: '\r',
  t: '\t',
  b: '\b',
  f: '\f',
};

/** Quanto cada parêntese muda a profundidade de uma string literal. */
const PAREN_DEPTH: Readonly<Record<string, number>> = { '(': 1, ')': -1 };

/** Lê uma string literal `( ... )` a partir do `(`; devolve o texto cru e a posição seguinte. */
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

/** Lê o escape depois de `\`: octal de até 3 dígitos, letra conhecida, quebra de linha ou o próprio caractere. */
export function readEscape(src: string, pos: number): [string, number] {
  const octal = /^[0-7]{1,3}/.exec(src.slice(pos, pos + 3))?.[0];
  if (octal) return [String.fromCharCode(parseInt(octal, 8) & 0xff), pos + octal.length];
  const ch = src[pos] ?? '';
  if (ch === '\r' || ch === '\n') return ['', src.startsWith('\r\n', pos) ? pos + 2 : pos + 1];
  return [PDF_ESCAPES[ch] ?? ch, pos + 1];
}

/** Lê uma string hexadecimal `<...>` a partir do `<`; dígito ímpar no fim vale como seguido de 0. */
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

/** Item lido de um fluxo de conteúdo: string de texto, número, nome, marca de lista ou operador. */
export type PdfToken =
  | { readonly kind: 'string'; readonly value: string }
  | { readonly kind: 'number'; readonly value: number }
  | { readonly kind: 'name' | 'op' | 'open' | 'close'; readonly value: string };

/** Espaços em branco (busca fixa na posição, sem copiar o resto do texto). */
const PDF_SPACE = /\s*/y;

/** Uma palavra do fluxo: nome, `<<`/`>>`, número/operador, comentário ou um caractere solto. */
const PDF_WORD = /\/[^\s/<>[\]()]*|<<|>>|[^\s/<>[\]()%]+|%[^\r\n]*|[\s\S]/y;

/** Posição do próximo caractere que não é espaço, a partir de `pos`. */
export function skipPdfSpace(src: string, pos: number): number {
  PDF_SPACE.lastIndex = pos;
  PDF_SPACE.exec(src);
  return PDF_SPACE.lastIndex;
}

/** Lê o próximo item do fluxo de conteúdo a partir de `pos`; nulo no fim. */
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

/** Lê uma palavra (nome, número, operador, `<<`/`>>` ou comentário) a partir de `at`. */
export function readPdfWord(src: string, at: number): [PdfToken, number] {
  PDF_WORD.lastIndex = at;
  const word = PDF_WORD.exec(src)?.[0] ?? ' ';
  return [classifyWord(word), at + word.length];
}

/** Embrulha o resultado de uma leitura de string num item `string`. */
export function wrapString([value, next]: [string, number]): [PdfToken, number] {
  return [{ kind: 'string', value }, next];
}

/** Classifica uma palavra do fluxo: nome (`/F1`), número ou operador. */
export function classifyWord(word: string): PdfToken {
  if (word.startsWith('/')) return { kind: 'name', value: word.slice(1) };
  if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(word)) return { kind: 'number', value: Number(word) };
  return { kind: 'op', value: word };
}

/** Estado do intérprete de texto: fonte atual, operandos, lista aberta e texto já produzido. */
export interface PdfTextState {
  font: PdfCMap | undefined;
  operands: PdfToken[];
  array: PdfToken[] | null;
  out: string[];
}

/** Espaço entre letras de um `TJ` a partir do qual o ajuste conta como espaço entre palavras. */
export const TJ_SPACE_THRESHOLD = -200;

/** Texto de um operando de `TJ`: strings decodificadas e espaços onde o ajuste é grande. */
export function showArrayText(items: readonly PdfToken[], font: PdfCMap | undefined): string {
  return items
    .map((item) => {
      if (item.kind === 'string') return decodePdfText(item.value, font);
      return item.kind === 'number' && item.value < TJ_SPACE_THRESHOLD ? ' ' : '';
    })
    .join('');
}

/** Texto da última string dos operandos, decodificado pela fonte atual. */
export function lastOperandText(state: PdfTextState): string {
  const last = state.operands[state.operands.length - 1];
  return last?.kind === 'string' ? decodePdfText(last.value, state.font) : '';
}

/** O que um `Td`/`TD` produz: quebra de linha se mudou a linha (ty ≠ 0), senão um espaço. */
export function moveText(state: PdfTextState): string {
  const ty = state.operands[state.operands.length - 1];
  return ty?.kind === 'number' && ty.value !== 0 ? '\n' : ' ';
}

/** Texto que cada operador de texto produz (sem `Tf`, que só troca a fonte). */
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

/** Aplica um operador de texto ao estado: troca de fonte ou acrescenta o texto que ele produz. */
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

/** Consome um item no intérprete: listas, operandos e operadores. */
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

/** Texto de um fluxo de conteúdo de página. */
export function contentStreamText(content: string, cmaps: ReadonlyMap<string, PdfCMap>): string {
  const state: PdfTextState = { font: undefined, operands: [], array: null, out: [] };
  for (let next = nextPdfToken(content, 0); next; next = nextPdfToken(content, next[1])) {
    feedPdfToken(state, next[0], cmaps);
  }
  return state.out.join('');
}

/** Limpa o texto extraído: espaços repetidos, linhas em branco em excesso e pontas. */
export function tidyPdfText(text: string): string {
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Extrai o texto de um PDF, página por página; lança erro se ele for cifrado. */
export async function pdfToText(bytes: Uint8Array): Promise<string> {
  if (/\/Encrypt\b/.test(bytesToLatin1(bytes.subarray(Math.max(0, bytes.length - 4096))))) {
    throw new Error('O PDF é protegido por senha (cifrado); não consigo ler o texto.');
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
