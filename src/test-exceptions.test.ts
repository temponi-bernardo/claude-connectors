import { describe, expect, it } from 'vitest';
import { TEST_EXCEPTIONS } from './test-exceptions.js';

describe('TEST_EXCEPTIONS', () => {
  it('every exception has a non-empty name, reason and manual test', () => {
    for (const exception of TEST_EXCEPTIONS) {
      expect(exception.name.length).toBeGreaterThan(0);
      expect(exception.reason.length).toBeGreaterThan(10);
      expect(exception.manualTest.length).toBeGreaterThan(10);
    }
  });

  it('does not repeat names', () => {
    const names = TEST_EXCEPTIONS.map((e) => e.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
