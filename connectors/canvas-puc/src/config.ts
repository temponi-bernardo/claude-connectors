/**
 * Configuração do conector Canvas, lida das variáveis de ambiente que o manifesto `.mcpb` preenche.
 */
import { join } from 'node:path';
import { envValue, parseFlag, type EnvVars } from '../../../src/core/env.js';

/** Canvas da PUC Minas, usado quando `CANVAS_BASE_URL` não vem preenchida. */
export const DEFAULT_CANVAS_URL = 'https://pucminas.instructure.com';

/** Trecho do texto do botão "Aluno / Professor (@pucminas.edu.br)" na tela de escolha de login. */
export const DEFAULT_LOGIN_BUTTON = 'pucminas.edu.br';

/** Configuração resolvida do conector. */
export interface CanvasConfig {
  readonly baseUrl: string;
  readonly token: string | null;
  readonly allowWrite: boolean;
  readonly loginButtonText: string;
  readonly dataDir: string;
}

/** Monta a configuração a partir do ambiente; `homeDir` define onde a sessão é guardada. */
export function readCanvasConfig(env: EnvVars, homeDir: string): CanvasConfig {
  const baseUrl = envValue(env, 'CANVAS_BASE_URL') ?? DEFAULT_CANVAS_URL;
  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    token: envValue(env, 'CANVAS_API_TOKEN'),
    allowWrite: parseFlag(envValue(env, 'CANVAS_ALLOW_WRITE')),
    loginButtonText: envValue(env, 'CANVAS_LOGIN_BUTTON') ?? DEFAULT_LOGIN_BUTTON,
    dataDir: envValue(env, 'CANVAS_DATA_DIR') ?? join(homeDir, '.canvas-puc'),
  };
}
