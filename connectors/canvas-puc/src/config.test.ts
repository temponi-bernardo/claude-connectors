import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_CANVAS_URL, DEFAULT_LOGIN_BUTTON, readCanvasConfig } from './config.js';

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
