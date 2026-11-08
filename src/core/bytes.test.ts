import { describe, expect, it } from 'vitest';
import { byteView, concatBytes, utf16leToString } from './bytes.js';

describe('byteView', () => {
  it('enxerga só a fatia dada, em little-endian', () => {
    const bytes = new Uint8Array([9, 1, 0, 9]).subarray(1, 3);
    const view = byteView(bytes);
    expect(view.byteLength).toBe(2);
    expect(view.getUint16(0, true)).toBe(1);
  });
});

describe('concatBytes', () => {
  it('junta pedaços em ordem', () => {
    expect(Array.from(concatBytes([new Uint8Array([1]), new Uint8Array([2, 3])]))).toEqual([
      1, 2, 3,
    ]);
    expect(concatBytes([])).toHaveLength(0);
  });
});

describe('utf16leToString', () => {
  it('decodifica UTF-16LE e ignora byte solto no fim', () => {
    expect(utf16leToString(new Uint8Array([0x4f, 0, 0xe1, 0, 0x21]))).toBe('Oá');
  });
});
