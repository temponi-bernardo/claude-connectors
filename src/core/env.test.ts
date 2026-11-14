import { describe, expect, it } from 'vitest';
import { envValue, parseFlag, toEnvVars } from './env.js';

describe('envValue', () => {
  it('returns the trimmed value', () => {
    expect(envValue({ A: '  x ' }, 'A')).toBe('x');
  });

  it('treats missing, empty and unresolved placeholder as null', () => {
    expect(envValue({}, 'A')).toBeNull();
    expect(envValue({ A: '' }, 'A')).toBeNull();
    expect(envValue({ A: '${user_config.api_token}' }, 'A')).toBeNull();
  });
});

describe('parseFlag', () => {
  it('turns on with 1, true, sim and yes, case-insensitively', () => {
    expect(['1', 'TRUE', 'sim', 'Yes'].map(parseFlag)).toEqual([true, true, true, true]);
  });

  it('turns off with anything else and with null', () => {
    expect(['0', 'false', 'x'].map(parseFlag)).toEqual([false, false, false]);
    expect(parseFlag(null)).toBe(false);
  });
});

describe('toEnvVars', () => {
  it('keeps only the text values of the Worker environment', () => {
    expect(toEnvVars({ A: 'x', B: 1, C: { binding: true } })).toEqual({ A: 'x' });
  });
});
