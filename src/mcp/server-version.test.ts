import { describe, expect, it } from 'vitest';
import { FALLBACK_SERVER_VERSION, manifestVersion } from './server-version.js';

describe('manifestVersion', () => {
  it('reads the version of a plugin manifest', () => {
    expect(manifestVersion({ name: 'x', version: '3.0.0' })).toBe('3.0.0');
  });

  it('falls back when the manifest has no usable version', () => {
    expect(manifestVersion({ name: 'x' })).toBe(FALLBACK_SERVER_VERSION);
    expect(manifestVersion({ version: '' })).toBe(FALLBACK_SERVER_VERSION);
    expect(manifestVersion({ version: 3 })).toBe(FALLBACK_SERVER_VERSION);
    expect(manifestVersion(null)).toBe(FALLBACK_SERVER_VERSION);
  });
});
