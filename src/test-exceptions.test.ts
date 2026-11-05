import { describe, expect, it } from 'vitest';
import { TEST_EXCEPTIONS } from './test-exceptions.js';

describe('TEST_EXCEPTIONS', () => {
  it('toda exceção tem nome, motivo e teste manual não vazios', () => {
    for (const exception of TEST_EXCEPTIONS) {
      expect(exception.name.length).toBeGreaterThan(0);
      expect(exception.reason.length).toBeGreaterThan(10);
      expect(exception.manualTest.length).toBeGreaterThan(10);
    }
  });

  it('não repete nomes', () => {
    const names = TEST_EXCEPTIONS.map((e) => e.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
