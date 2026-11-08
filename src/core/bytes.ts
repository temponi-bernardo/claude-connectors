/**
 * Utilitários de bytes compartilhados pelos leitores de formatos binários (ZIP, CFB, Word). Puros.
 */

/** Visão little-endian (`DataView`) sobre exatamente os bytes dados. */
export function byteView(bytes: Uint8Array): DataView {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

/** Junta pedaços de bytes num só buffer. */
export function concatBytes(parts: readonly Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let pos = 0;
  for (const part of parts) {
    out.set(part, pos);
    pos += part.length;
  }
  return out;
}

/** Decodifica UTF-16LE sem depender de `TextDecoder` (o Workers só garante UTF-8). */
export function utf16leToString(bytes: Uint8Array): string {
  const v = byteView(bytes);
  let out = '';
  for (let pos = 0; pos + 1 < bytes.length; pos += 2)
    out += String.fromCharCode(v.getUint16(pos, true));
  return out;
}
