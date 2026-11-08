/**
 * Leitura mínima de arquivos ZIP (o contêiner do .docx): acha uma entrada pelo nome e a descompacta.
 * Sem Node: usa `DecompressionStream`, presente no Node 22 e no Cloudflare Workers.
 */
import { byteView } from './bytes.js';

/** Assinatura do registro "fim do diretório central" (EOCD). */
const EOCD_SIGNATURE = 0x06054b50;

/** Assinatura de cada entrada do diretório central. */
const CENTRAL_SIGNATURE = 0x02014b50;

/** Entrada do diretório central: onde está e como foi comprimida. */
export interface ZipEntry {
  readonly name: string;
  readonly method: number;
  readonly compressedSize: number;
  readonly localOffset: number;
}

/** Posição do registro EOCD, procurando de trás para frente (o comentário do ZIP pode vir depois). */
export function findEndOfCentralDirectory(bytes: Uint8Array): number {
  const view = byteView(bytes);
  for (let pos = bytes.length - 22; pos >= 0; pos--) {
    if (view.getUint32(pos, true) === EOCD_SIGNATURE) return pos;
  }
  throw new Error('Arquivo ZIP inválido: diretório central não encontrado.');
}

/** Lê as entradas do diretório central. */
export function listZipEntries(bytes: Uint8Array): ZipEntry[] {
  const view = byteView(bytes);
  const eocd = findEndOfCentralDirectory(bytes);
  const entries: ZipEntry[] = [];
  let pos = view.getUint32(eocd + 16, true);
  for (let i = 0; i < view.getUint16(eocd + 10, true); i++) {
    if (view.getUint32(pos, true) !== CENTRAL_SIGNATURE) break;
    const nameLength = view.getUint16(pos + 28, true);
    entries.push({
      name: new TextDecoder().decode(bytes.subarray(pos + 46, pos + 46 + nameLength)),
      method: view.getUint16(pos + 10, true),
      compressedSize: view.getUint32(pos + 20, true),
      localOffset: view.getUint32(pos + 42, true),
    });
    pos += 46 + nameLength + view.getUint16(pos + 30, true) + view.getUint16(pos + 32, true);
  }
  return entries;
}

/** Bytes comprimidos de uma entrada, pulando o cabeçalho local. */
export function zipEntryBytes(bytes: Uint8Array, entry: ZipEntry): Uint8Array {
  const view = byteView(bytes);
  const start =
    entry.localOffset +
    30 +
    view.getUint16(entry.localOffset + 26, true) +
    view.getUint16(entry.localOffset + 28, true);
  return bytes.subarray(start, start + entry.compressedSize);
}

/** Descomprime dados em DEFLATE puro (método 8 do ZIP). */
export async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([new Uint8Array(data)])
    .stream()
    .pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Conteúdo descompactado da entrada `name`, ou `null` se ela não existir no ZIP. */
export async function readZipEntry(bytes: Uint8Array, name: string): Promise<Uint8Array | null> {
  const entry = listZipEntries(bytes).find((e) => e.name === name);
  if (!entry) return null;
  const data = zipEntryBytes(bytes, entry);
  if (entry.method === 0) return data;
  if (entry.method === 8) return inflateRaw(data);
  throw new Error(`Compressão ZIP não suportada (método ${entry.method}).`);
}
