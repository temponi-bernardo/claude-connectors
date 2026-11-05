import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CANVAS_URL,
  DEFAULT_LOGIN_BUTTON,
  envValue,
  parseFlag,
  readCanvasConfig,
} from './config.js';

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

describe('readCanvasConfig', () => {
  it('usa os padrões da PUC Minas quando o ambiente está vazio', () => {
    expect(readCanvasConfig({}, '/home/a')).toEqual({
      baseUrl: DEFAULT_CANVAS_URL,
      token: null,
      allowWrite: false,
      loginButtonText: DEFAULT_LOGIN_BUTTON,
      dataDir: join('/home/a', '.canvas-puc'),
    });
  });

  it('lê as variáveis e remove barras finais da URL', () => {
    const config = readCanvasConfig(
      {
        CANVAS_BASE_URL: 'https://x.test//',
        CANVAS_API_TOKEN: 't',
        CANVAS_ALLOW_WRITE: 'true',
        CANVAS_LOGIN_BUTTON: 'b',
        CANVAS_DATA_DIR: '/d',
      },
      '/home/a',
    );
    expect(config).toEqual({
      baseUrl: 'https://x.test',
      token: 't',
      allowWrite: true,
      loginButtonText: 'b',
      dataDir: '/d',
    });
  });
});
