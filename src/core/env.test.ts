import { describe, expect, it } from 'vitest';
import { envValue, parseFlag } from './env.js';

describe('envValue', () => {
  it('devolve o valor sem espaços', () => {
    expect(envValue({ A: '  x ' }, 'A')).toBe('x');
  });

  it('trata ausente, vazio e placeholder não resolvido como nulo', () => {
    expect(envValue({}, 'A')).toBeNull();
    expect(envValue({ A: '' }, 'A')).toBeNull();
    expect(envValue({ A: '${user_config.api_token}' }, 'A')).toBeNull();
  });
});

describe('parseFlag', () => {
  it('liga com 1, true, sim e yes, sem diferenciar maiúsculas', () => {
    expect(['1', 'TRUE', 'sim', 'Yes'].map(parseFlag)).toEqual([true, true, true, true]);
  });

  it('desliga com o resto e com nulo', () => {
    expect(['0', 'false', 'x'].map(parseFlag)).toEqual([false, false, false]);
    expect(parseFlag(null)).toBe(false);
  });
});
