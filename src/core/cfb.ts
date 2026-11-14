/**
 * Minimal OLE/CFB reader (Compound File Binary, the container of Word 97-2003 .doc files):
 * finds a stream by name and returns its bytes. Pure: only reads the buffer.
 */
import { byteView, concatBytes, utf16leToString } from './bytes.js';

/** Signature in the first 8 bytes of every CFB file. */
export const CFB_SIGNATURE: readonly number[] = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

/** End-of-chain mark in the FAT. */
const END_OF_CHAIN = 0xfffffffe;

/** Header fields used for reading. */
export interface CfbHeader {
  readonly sectorSize: number;
  readonly miniSectorSize: number;
  readonly firstDirSector: number;
  readonly miniCutoff: number;
  readonly firstMiniFatSector: number;
  readonly firstDifatSector: number;
  readonly difatCount: number;
}

/** Directory entry: name, first sector and stream size. */
export interface CfbEntry {
  readonly name: string;
  readonly start: number;
  readonly size: number;
}

/** Indexed CFB file (header, FAT and directory). */
export interface CfbFile {
  readonly bytes: Uint8Array;
  readonly header: CfbHeader;
  readonly fat: readonly number[];
  readonly entries: readonly CfbEntry[];
}

/** Says whether the bytes start with the CFB signature. */
export function isCfb(bytes: Uint8Array): boolean {
  return CFB_SIGNATURE.every((b, i) => bytes[i] === b);
}

/** Reads the 512-byte header. */
export function readCfbHeader(bytes: Uint8Array): CfbHeader {
  if (!isCfb(bytes)) throw new Error('File is not an Office (OLE) document.');
  const v = byteView(bytes);
  return {
    sectorSize: 1 << v.getUint16(0x1e, true),
    miniSectorSize: 1 << v.getUint16(0x20, true),
    firstDirSector: v.getUint32(0x30, true),
    miniCutoff: v.getUint32(0x38, true),
    firstMiniFatSector: v.getUint32(0x3c, true),
    firstDifatSector: v.getUint32(0x44, true),
    difatCount: v.getUint32(0x48, true),
  };
}

/** Bytes of a regular sector (sector 0 starts right after the header). */
export function cfbSector(bytes: Uint8Array, header: CfbHeader, id: number): Uint8Array {
  const start = (id + 1) * header.sectorSize;
  return bytes.subarray(start, start + header.sectorSize);
}

/** Reads a sector as a list of 32-bit numbers. */
export function sectorWords(sector: Uint8Array): number[] {
  const v = byteView(sector);
  return Array.from({ length: sector.length >> 2 }, (_, i) => v.getUint32(i * 4, true));
}

/** FAT sector ids: 109 in the header and the rest in the DIFAT chain. */
export function fatSectorIds(bytes: Uint8Array, header: CfbHeader): number[] {
  const ids = sectorWords(bytes.subarray(0x4c, 0x200));
  let next = header.firstDifatSector;
  for (let i = 0; i < header.difatCount && next < END_OF_CHAIN; i++) {
    const words = sectorWords(cfbSector(bytes, header, next));
    next = words.pop() ?? END_OF_CHAIN;
    ids.push(...words);
  }
  return ids.filter((id) => id < END_OF_CHAIN);
}

/** Follows a sector chain from `start`, stopping at end of chain or on a loop. */
export function followChain(table: readonly number[], start: number): number[] {
  const chain: number[] = [];
  let id: number | undefined = start;
  while (id !== undefined && id < table.length && chain.length < table.length) {
    chain.push(id);
    id = table[id];
  }
  return chain;
}

/** Bytes of a chain of regular sectors. */
export function readRegularChain(file: Omit<CfbFile, 'entries'>, start: number): Uint8Array {
  return concatBytes(
    followChain(file.fat, start).map((id) => cfbSector(file.bytes, file.header, id)),
  );
}

/** Reads the 128-byte directory entries (UTF-16 name, first sector and size). */
export function parseDirectory(dir: Uint8Array): CfbEntry[] {
  const v = byteView(dir);
  const entries: CfbEntry[] = [];
  for (let pos = 0; pos + 128 <= dir.length; pos += 128) {
    const nameBytes = Math.max(0, v.getUint16(pos + 0x40, true) - 2);
    entries.push({
      name: utf16leToString(dir.subarray(pos, pos + nameBytes)),
      start: v.getUint32(pos + 0x74, true),
      size: v.getUint32(pos + 0x78, true),
    });
  }
  return entries;
}

/** Opens a CFB file: header, FAT and directory. */
export function openCfb(bytes: Uint8Array): CfbFile {
  const header = readCfbHeader(bytes);
  const fat = fatSectorIds(bytes, header).flatMap((id) =>
    sectorWords(cfbSector(bytes, header, id)),
  );
  const entries = parseDirectory(readRegularChain({ bytes, header, fat }, header.firstDirSector));
  return { bytes, header, fat, entries };
}

/** Bytes of a small stream, stored in the mini stream (64-byte sectors). */
export function readMiniStream(file: CfbFile, entry: CfbEntry): Uint8Array {
  const root = file.entries[0];
  const container = root ? readRegularChain(file, root.start) : new Uint8Array();
  const miniFat = sectorWords(readRegularChain(file, file.header.firstMiniFatSector));
  const size = file.header.miniSectorSize;
  const parts = followChain(miniFat, entry.start).map((id) =>
    container.subarray(id * size, (id + 1) * size),
  );
  return concatBytes(parts);
}

/** Bytes of the `name` stream, or `null` if it does not exist. */
export function readCfbStream(file: CfbFile, name: string): Uint8Array | null {
  const entry = file.entries.find((e, i) => i > 0 && e.name === name);
  if (!entry) return null;
  const data =
    entry.size < file.header.miniCutoff
      ? readMiniStream(file, entry)
      : readRegularChain(file, entry.start);
  return data.subarray(0, entry.size);
}
