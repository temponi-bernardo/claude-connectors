import { readFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import {
  findEndOfCentralDirectory,
  decompressBytes,
  inflateRaw,
  listZipEntries,
  readZipEntry,
  zipEntryBytes,
} from './zip.js';

const docx = new Uint8Array(readFileSync(new URL('./fixtures/exemplo.docx', import.meta.url)));

/** Minimal ZIP with one uncompressed entry (method 0) or with the given method. */
function storedZip(name: string, content: string, method = 0): Uint8Array {
  const n = new TextEncoder().encode(name);
  const data = new TextEncoder().encode(content);
  const local = new Uint8Array(30 + n.length + data.length);
  const lv = new DataView(local.buffer);
  lv.setUint32(0, 0x04034b50, true);
  lv.setUint16(26, n.length, true);
  local.set(n, 30);
  local.set(data, 30 + n.length);
  const central = new Uint8Array(46 + n.length);
  const cv = new DataView(central.buffer);
  cv.setUint32(0, 0x02014b50, true);
  cv.setUint16(10, method, true);
  cv.setUint32(20, data.length, true);
  cv.setUint16(28, n.length, true);
  central.set(n, 46);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(10, 1, true);
  ev.setUint32(16, local.length, true);
  const out = new Uint8Array(local.length + central.length + eocd.length);
  out.set(local);
  out.set(central, local.length);
  out.set(eocd, local.length + central.length);
  return out;
}

describe('findEndOfCentralDirectory', () => {
  it('finds the EOCD or fails on a file that is not a ZIP', () => {
    expect(findEndOfCentralDirectory(docx)).toBeGreaterThan(0);
    expect(() => findEndOfCentralDirectory(new Uint8Array(30))).toThrow('Invalid ZIP');
  });
});

describe('listZipEntries', () => {
  it('lists the .docx entries and stops at a corrupt entry', () => {
    expect(listZipEntries(docx).map((e) => e.name)).toContain('word/document.xml');
    const zip = storedZip('a.txt', 'oi');
    zip[zip.length - 22 + 16] = 0; // central directory pointing at the local header
    expect(listZipEntries(zip)).toEqual([]);
  });
});

describe('zipEntryBytes', () => {
  it('skips the local header', () => {
    const zip = storedZip('a.txt', 'oi');
    const [entry] = listZipEntries(zip);
    expect(new TextDecoder().decode(zipEntryBytes(zip, entry!))).toBe('oi');
  });
});

describe('inflateRaw', () => {
  it('decompresses raw DEFLATE', async () => {
    const compressed = new Uint8Array(
      await new Response(
        new Blob(['olá olá olá']).stream().pipeThrough(new CompressionStream('deflate-raw')),
      ).arrayBuffer(),
    );
    expect(new TextDecoder().decode(await inflateRaw(compressed))).toBe('olá olá olá');
  });
});

describe('readZipEntry', () => {
  it('reads compressed and stored entries, and returns null for a missing name', async () => {
    const xml = await readZipEntry(docx, 'word/document.xml');
    expect(new TextDecoder().decode(xml!)).toContain('<w:document');
    const stored = await readZipEntry(storedZip('a.txt', 'oi'), 'a.txt');
    expect(new TextDecoder().decode(stored!)).toBe('oi');
    await expect(readZipEntry(docx, 'missing.xml')).resolves.toBeNull();
  });

  it('rejects unknown compression methods', async () => {
    await expect(readZipEntry(storedZip('a', 'b', 12), 'a')).rejects.toThrow('method 12');
  });
});

describe('decompressBytes', () => {
  it('decompresses data with a zlib header (deflate format)', async () => {
    const compressed = deflateSync(Buffer.from('PDF stream'));
    expect(new TextDecoder().decode(await decompressBytes(compressed, 'deflate'))).toBe(
      'PDF stream',
    );
  });
});
