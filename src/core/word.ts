/**
 * Texto de documentos do Word: .docx (ZIP + XML) e .doc (Word 97-2003, binário dentro de um CFB).
 * Sem Node e sem dependências: roda igual no conector local e no Cloudflare Workers.
 */
import { byteView, utf16leToString } from './bytes.js';
import { openCfb, readCfbStream } from './cfb.js';
import { htmlToText } from './html.js';
import { readZipEntry } from './zip.js';

/** Caracteres de 0x80 a 0x9F no Windows-1252 (texto "comprimido" do .doc); o resto é Latin-1. */
export const CP1252_HIGH = '€\u0081‚ƒ„…†‡ˆ‰Š‹Œ\u008dŽ\u008f\u0090‘’“”•–—˜™š›œ\u009džŸ';

/** Trechos de WordprocessingML que viram texto, na ordem do documento. */
const DOCX_TOKENS =
  /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>|<w:tab\/>|<w:(?:br|cr)(?:\s[^>]*)?\/>|<\/w:p>/g;

/** Converte o XML do corpo de um .docx em texto: parágrafos, tabulações e quebras de linha. */
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

/** Extrai o texto de um .docx. */
export async function docxToText(bytes: Uint8Array): Promise<string> {
  const xml = await readZipEntry(bytes, 'word/document.xml');
  if (!xml) throw new Error('Arquivo .docx sem word/document.xml.');
  return docxXmlToText(new TextDecoder().decode(xml));
}

/** Decodifica bytes em Windows-1252. */
export function cp1252ToString(bytes: Uint8Array): string {
  let out = '';
  for (const b of bytes) {
    out += b >= 0x80 && b < 0xa0 ? CP1252_HIGH.charAt(b - 0x80) : String.fromCharCode(b);
  }
  return out;
}

/** Peça do texto do .doc: intervalo de caracteres e onde os bytes estão no stream WordDocument. */
export interface DocPiece {
  readonly cpStart: number;
  readonly cpEnd: number;
  readonly fc: number;
}

/** Lê a tabela de peças (PlcPcd) dentro do Clx, pulando os blocos de formatação (Prc). */
export function parsePieceTable(table: Uint8Array, fcClx: number): DocPiece[] {
  const v = byteView(table);
  let pos = fcClx;
  while (table[pos] === 0x01) pos += 3 + v.getUint16(pos + 1, true);
  if (table[pos] !== 0x02) throw new Error('Documento .doc com tabela de texto inválida.');
  const lcb = v.getUint32(pos + 1, true);
  const plc = pos + 5;
  const count = (lcb - 4) / 12;
  return Array.from({ length: count }, (_, i) => ({
    cpStart: v.getUint32(plc + i * 4, true),
    cpEnd: v.getUint32(plc + (i + 1) * 4, true),
    fc: v.getUint32(plc + (count + 1) * 4 + i * 8 + 2, true),
  }));
}

/** Texto de uma peça: 8 bits (Windows-1252) se o bit "compressed" estiver ligado, senão UTF-16LE. */
export function pieceText(wordDoc: Uint8Array, piece: DocPiece): string {
  const length = piece.cpEnd - piece.cpStart;
  if (piece.fc & 0x40000000) {
    const start = (piece.fc & 0x3fffffff) / 2;
    return cp1252ToString(wordDoc.subarray(start, start + length));
  }
  return utf16leToString(wordDoc.subarray(piece.fc, piece.fc + length * 2));
}

/* eslint-disable no-control-regex -- o texto do .doc usa caracteres de controle como marcas */
/** Substituições das marcas do Word, em ordem: campos (fica o resultado), parágrafos, células e sobras. */
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

/** Troca os caracteres de controle do Word por texto: parágrafos, células e campos (mantém o resultado). */
export function cleanWordText(raw: string): string {
  return WORD_TEXT_REPLACEMENTS.reduce((acc, [re, to]) => acc.replace(re, to), raw).trim();
}

/** Extrai o texto principal de um .doc (Word 97-2003), sem notas de rodapé e cabeçalhos. */
export function docToText(bytes: Uint8Array): string {
  const cfb = openCfb(bytes);
  const wordDoc = readCfbStream(cfb, 'WordDocument');
  if (!wordDoc) throw new Error('Arquivo .doc sem o stream WordDocument.');
  const v = byteView(wordDoc);
  const flags = v.getUint16(0x0a, true);
  if (flags & 0x0100) throw new Error('O .doc está protegido por senha.');
  const table = readCfbStream(cfb, flags & 0x0200 ? '1Table' : '0Table');
  if (!table) throw new Error('Arquivo .doc sem o stream de tabela.');
  const pieces = parsePieceTable(table, v.getUint32(0x01a2, true));
  const raw = pieces.map((p) => pieceText(wordDoc, p)).join('');
  return cleanWordText(raw.slice(0, v.getUint32(0x4c, true)));
}

/** Tipo de documento do Word pelo nome ou MIME: `docx`, `doc` ou `null`. */
export function wordKind(contentType: string, name: string): 'docx' | 'doc' | null {
  if (/\.docx$/i.test(name) || contentType.includes('wordprocessingml')) return 'docx';
  if (/\.doc$/i.test(name) || contentType === 'application/msword') return 'doc';
  return null;
}

/** Extrai o texto de um documento do Word do tipo dado. */
export function wordToText(kind: 'docx' | 'doc', bytes: Uint8Array): Promise<string> {
  return kind === 'docx' ? docxToText(bytes) : Promise.resolve(docToText(bytes));
}
