/**
 * Minimal ZIP reader (the .docx container): finds an entry by name and decompresses it.
 * No Node APIs: uses `DecompressionStream`, available in Node 22 and in Cloudflare Workers.
 */
import { byteView } from './bytes.js';

/** Signature of the "end of central directory" (EOCD) record. */
const EOCD_SIGNATURE = 0x06054b50;

/** Signature of each central directory entry. */
const CENTRAL_SIGNATURE = 0x02014b50;

/** Central directory entry: where it is and how it was compressed. */
export interface ZipEntry {
  readonly name: string;
  readonly method: number;
  readonly compressedSize: number;
  readonly localOffset: number;
}

/** Position of the EOCD record, searching backwards (the ZIP comment may come after it). */
export function findEndOfCentralDirectory(bytes: Uint8Array): number {
  const view = byteView(bytes);
  for (let pos = bytes.length - 22; pos >= 0; pos--) {
    if (view.getUint32(pos, true) === EOCD_SIGNATURE) return pos;
  }
  throw new Error('Invalid ZIP file: central directory not found.');
}

/** Reads the central directory entries. */
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

/** Compressed bytes of an entry, skipping the local header. */
export function zipEntryBytes(bytes: Uint8Array, entry: ZipEntry): Uint8Array {
  const view = byteView(bytes);
  const start =
    entry.localOffset +
    30 +
    view.getUint16(entry.localOffset + 26, true) +
    view.getUint16(entry.localOffset + 28, true);
  return bytes.subarray(start, start + entry.compressedSize);
}

/** Decompresses data with `DecompressionStream` in the given format (raw DEFLATE or with a zlib header). */
export async function decompressBytes(
  data: Uint8Array,
  format: 'deflate' | 'deflate-raw',
): Promise<Uint8Array> {
  const stream = new Blob([new Uint8Array(data)])
    .stream()
    .pipeThrough(new DecompressionStream(format));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Decompresses raw DEFLATE data (ZIP method 8). */
export function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  return decompressBytes(data, 'deflate-raw');
}

/** Decompressed content of the `name` entry, or `null` if it is not in the ZIP. */
export async function readZipEntry(bytes: Uint8Array, name: string): Promise<Uint8Array | null> {
  const entry = listZipEntries(bytes).find((e) => e.name === name);
  if (!entry) return null;
  const data = zipEntryBytes(bytes, entry);
  if (entry.method === 0) return data;
  if (entry.method === 8) return inflateRaw(data);
  throw new Error(`Unsupported ZIP compression (method ${entry.method}).`);
}
