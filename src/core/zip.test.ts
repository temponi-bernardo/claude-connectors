import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  findEndOfCentralDirectory,
  inflateRaw,
  listZipEntries,
  readZipEntry,
  zipEntryBytes,
} from './zip.js';

const docx = new Uint8Array(readFileSync(new URL('./fixtures/exemplo.docx', import.meta.url)));

/** ZIP mínimo com uma entrada sem compressão (método 0) ou com o método dado. */
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
  it('acha o EOCD ou falha em arquivo que não é ZIP', () => {
    expect(findEndOfCentralDirectory(docx)).toBeGreaterThan(0);
    expect(() => findEndOfCentralDirectory(new Uint8Array(30))).toThrow('ZIP inválido');
  });
});

describe('listZipEntries', () => {
  it('lista as entradas do .docx e para em entrada corrompida', () => {
    expect(listZipEntries(docx).map((e) => e.name)).toContain('word/document.xml');
    const zip = storedZip('a.txt', 'oi');
    zip[zip.length - 22 + 16] = 0; // diretório central apontando para o cabeçalho local
    expect(listZipEntries(zip)).toEqual([]);
  });
});

describe('zipEntryBytes', () => {
  it('pula o cabeçalho local', () => {
    const zip = storedZip('a.txt', 'oi');
    const [entry] = listZipEntries(zip);
    expect(new TextDecoder().decode(zipEntryBytes(zip, entry!))).toBe('oi');
  });
});

describe('inflateRaw', () => {
  it('descomprime DEFLATE puro', async () => {
    const compressed = new Uint8Array(
      await new Response(
        new Blob(['olá olá olá']).stream().pipeThrough(new CompressionStream('deflate-raw')),
      ).arrayBuffer(),
    );
    expect(new TextDecoder().decode(await inflateRaw(compressed))).toBe('olá olá olá');
  });
});

describe('readZipEntry', () => {
  it('lê entradas comprimidas e guardadas, e devolve null para nome ausente', async () => {
    const xml = await readZipEntry(docx, 'word/document.xml');
    expect(new TextDecoder().decode(xml!)).toContain('<w:document');
    const stored = await readZipEntry(storedZip('a.txt', 'oi'), 'a.txt');
    expect(new TextDecoder().decode(stored!)).toBe('oi');
    await expect(readZipEntry(docx, 'nada.xml')).resolves.toBeNull();
  });

  it('recusa métodos de compressão desconhecidos', async () => {
    await expect(readZipEntry(storedZip('a', 'b', 12), 'a')).rejects.toThrow('método 12');
  });
});
