import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  cfbSector,
  fatSectorIds,
  followChain,
  isCfb,
  openCfb,
  parseDirectory,
  readCfbHeader,
  readCfbStream,
  readMiniStream,
  readRegularChain,
  sectorWords,
} from './cfb.js';

const doc = new Uint8Array(readFileSync(new URL('./fixtures/exemplo.doc', import.meta.url)));

describe('isCfb', () => {
  it('recognizes the OLE signature', () => {
    expect(isCfb(doc)).toBe(true);
    expect(isCfb(new Uint8Array(8))).toBe(false);
  });
});

describe('readCfbHeader', () => {
  it('reads the sector sizes and rejects what is not OLE', () => {
    expect(readCfbHeader(doc)).toMatchObject({
      sectorSize: 512,
      miniSectorSize: 64,
      miniCutoff: 4096,
    });
    expect(() => readCfbHeader(new Uint8Array(512))).toThrow('not an Office');
  });
});

describe('cfbSector', () => {
  it('skips the 512-byte header', () => {
    const header = readCfbHeader(doc);
    expect(cfbSector(doc, header, 0).byteOffset).toBe(512);
    expect(cfbSector(doc, header, 0)).toHaveLength(512);
  });
});

describe('sectorWords', () => {
  it('reads little-endian 32-bit integers', () => {
    expect(sectorWords(new Uint8Array([1, 0, 0, 0, 0xff, 0xff, 0xff, 0xff]))).toEqual([
      1, 0xffffffff,
    ]);
  });
});

describe('fatSectorIds', () => {
  it('uses the header list and follows the DIFAT chain', () => {
    const header = readCfbHeader(doc);
    expect(fatSectorIds(doc, header).length).toBeGreaterThan(0);
    const bytes = new Uint8Array(512 * 3);
    bytes.set(doc.subarray(0, 512));
    new DataView(bytes.buffer).setUint32(0x4c, 0xffffffff, true);
    const difat = new DataView(bytes.buffer, 512);
    for (let i = 0; i < 128; i++) difat.setUint32(i * 4, 0xffffffff, true);
    difat.setUint32(0, 1, true);
    difat.setUint32(127 * 4, 0xfffffffe, true);
    const withDifat = { ...header, firstDifatSector: 0, difatCount: 1 };
    expect(fatSectorIds(bytes, withDifat)).toEqual([1]);
  });
});

describe('followChain', () => {
  it('follows to the end of the chain and does not loop', () => {
    expect(followChain([1, 2, 0xfffffffe], 0)).toEqual([0, 1, 2]);
    expect(followChain([1, 0], 0)).toEqual([0, 1]);
    expect(followChain([], 0xfffffffe)).toEqual([]);
  });
});

describe('parseDirectory', () => {
  it('reads name, start and size of each 128-byte entry', () => {
    const dir = new Uint8Array(128);
    const v = new DataView(dir.buffer);
    dir.set([0x41, 0, 0x42, 0, 0, 0]);
    v.setUint16(0x40, 6, true);
    v.setUint32(0x74, 3, true);
    v.setUint32(0x78, 10, true);
    expect(parseDirectory(dir)).toEqual([{ name: 'AB', start: 3, size: 10 }]);
    expect(parseDirectory(new Uint8Array(128))[0]?.name).toBe('');
  });
});

describe('openCfb, readRegularChain, readMiniStream and readCfbStream', () => {
  it('opens the .doc and reads large and small streams', () => {
    const file = openCfb(doc);
    expect(file.entries[0]?.name).toBe('Root Entry');
    const word = readCfbStream(file, 'WordDocument');
    expect(new DataView(word!.buffer, word!.byteOffset).getUint16(0, true)).toBe(0xa5ec);
    expect(readRegularChain(file, file.header.firstDirSector).length % 512).toBe(0);
    expect(readCfbStream(file, 'Missing')).toBeNull();
  });

  it('reads small streams from the mini stream, following the mini FAT', () => {
    const END = 0xfffffffe;
    const bytes = new Uint8Array(512 * 3);
    const miniFat = new DataView(bytes.buffer, 512, 512);
    for (let i = 0; i < 128; i++) miniFat.setUint32(i * 4, END, true);
    miniFat.setUint32(0, 1, true);
    bytes.fill(0x41, 1024, 1024 + 64);
    bytes.fill(0x42, 1024 + 64, 1024 + 128);
    const file = {
      bytes,
      header: { ...readCfbHeader(doc), firstMiniFatSector: 0 },
      fat: [END, END],
      entries: [
        { name: 'Root Entry', start: 1, size: 128 },
        { name: 'x', start: 0, size: 100 },
      ],
    };
    const text = new TextDecoder().decode(readCfbStream(file, 'x')!);
    expect(text).toBe('A'.repeat(64) + 'B'.repeat(36));
  });

  it('tolerates a directory without a root entry when reading the mini stream', () => {
    const file = { ...openCfb(doc), entries: [] };
    expect(readMiniStream(file, { name: 'x', start: 0xfffffffe, size: 1 })).toHaveLength(0);
  });
});
