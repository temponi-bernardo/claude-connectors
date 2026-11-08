/**
 * Leitura mínima de arquivos OLE/CFB (Compound File Binary, o contêiner do .doc do Word 97-2003):
 * acha um stream pelo nome e devolve seus bytes. Pura: só lê o buffer.
 */
import { byteView, concatBytes, utf16leToString } from './bytes.js';

/** Assinatura dos 8 primeiros bytes de todo arquivo CFB. */
export const CFB_SIGNATURE: readonly number[] = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

/** Marca de fim de cadeia na FAT. */
const END_OF_CHAIN = 0xfffffffe;

/** Campos do cabeçalho usados na leitura. */
export interface CfbHeader {
  readonly sectorSize: number;
  readonly miniSectorSize: number;
  readonly firstDirSector: number;
  readonly miniCutoff: number;
  readonly firstMiniFatSector: number;
  readonly firstDifatSector: number;
  readonly difatCount: number;
}

/** Entrada do diretório: nome, primeiro setor e tamanho do stream. */
export interface CfbEntry {
  readonly name: string;
  readonly start: number;
  readonly size: number;
}

/** Arquivo CFB já indexado (cabeçalho, FAT e diretório). */
export interface CfbFile {
  readonly bytes: Uint8Array;
  readonly header: CfbHeader;
  readonly fat: readonly number[];
  readonly entries: readonly CfbEntry[];
}

/** Diz se os bytes começam com a assinatura CFB. */
export function isCfb(bytes: Uint8Array): boolean {
  return CFB_SIGNATURE.every((b, i) => bytes[i] === b);
}

/** Lê o cabeçalho de 512 bytes. */
export function readCfbHeader(bytes: Uint8Array): CfbHeader {
  if (!isCfb(bytes)) throw new Error('Arquivo não é um documento do Office (OLE).');
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

/** Bytes de um setor regular (o setor 0 começa logo após o cabeçalho). */
export function cfbSector(bytes: Uint8Array, header: CfbHeader, id: number): Uint8Array {
  const start = (id + 1) * header.sectorSize;
  return bytes.subarray(start, start + header.sectorSize);
}

/** Lê um setor como lista de números de 32 bits. */
export function sectorWords(sector: Uint8Array): number[] {
  const v = byteView(sector);
  return Array.from({ length: sector.length >> 2 }, (_, i) => v.getUint32(i * 4, true));
}

/** Ids dos setores da FAT: 109 no cabeçalho e o resto na cadeia DIFAT. */
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

/** Segue uma cadeia de setores a partir de `start`, parando em fim de cadeia ou laço. */
export function followChain(table: readonly number[], start: number): number[] {
  const chain: number[] = [];
  let id: number | undefined = start;
  while (id !== undefined && id < table.length && chain.length < table.length) {
    chain.push(id);
    id = table[id];
  }
  return chain;
}

/** Bytes de uma cadeia de setores regulares. */
export function readRegularChain(file: Omit<CfbFile, 'entries'>, start: number): Uint8Array {
  return concatBytes(
    followChain(file.fat, start).map((id) => cfbSector(file.bytes, file.header, id)),
  );
}

/** Lê as entradas de 128 bytes do diretório (nome em UTF-16, primeiro setor e tamanho). */
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

/** Abre um arquivo CFB: cabeçalho, FAT e diretório. */
export function openCfb(bytes: Uint8Array): CfbFile {
  const header = readCfbHeader(bytes);
  const fat = fatSectorIds(bytes, header).flatMap((id) =>
    sectorWords(cfbSector(bytes, header, id)),
  );
  const entries = parseDirectory(readRegularChain({ bytes, header, fat }, header.firstDirSector));
  return { bytes, header, fat, entries };
}

/** Bytes de um stream pequeno, guardado no mini stream (setores de 64 bytes). */
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

/** Bytes do stream `name`, ou `null` se ele não existir. */
export function readCfbStream(file: CfbFile, name: string): Uint8Array | null {
  const entry = file.entries.find((e, i) => i > 0 && e.name === name);
  if (!entry) return null;
  const data =
    entry.size < file.header.miniCutoff
      ? readMiniStream(file, entry)
      : readRegularChain(file, entry.start);
  return data.subarray(0, entry.size);
}
