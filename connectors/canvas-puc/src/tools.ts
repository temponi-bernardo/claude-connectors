/**
 * Conjunto de ferramentas do conector Canvas: conexão + leitura, e escrita quando permitida.
 */
import { defineTool, type ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasProfile } from './canvas-types.js';
import type { CanvasContext } from './context.js';
import { CANVAS_READ_TOOLS } from './tools-read.js';
import { CANVAS_WRITE_TOOLS } from './tools-write.js';

/** Ferramentas de conexão: login pela janela do navegador e logout. */
export const CANVAS_ACCOUNT_TOOLS: readonly ToolSpec<CanvasContext>[] = [
  defineTool({
    name: 'conectar_canvas',
    description:
      'Abre uma janela do navegador para o usuário fazer login no Canvas. A sessão fica salva e é renovada sozinha. Use se o Canvas não estiver conectado ou a sessão tiver expirado.',
    shape: {},
    run: async ({ client, auth }) => {
      const session = await auth.connect();
      const profile = await client.get<CanvasProfile>('/users/self/profile');
      return `Conectado ao Canvas como ${String(profile.name)} (${String(session.cookies.length)} cookies salvos).`;
    },
  }),
  defineTool({
    name: 'desconectar_canvas',
    description: 'Apaga a sessão do Canvas salva neste computador.',
    shape: {},
    run: ({ auth }) => {
      auth.disconnect();
      return Promise.resolve(
        'Sessão do Canvas apagada. Use `conectar_canvas` para entrar de novo.',
      );
    },
  }),
];

/** Seleciona as ferramentas a registrar: escrita só com `allowWrite`. */
export function canvasTools(allowWrite: boolean): readonly ToolSpec<CanvasContext>[] {
  return [...CANVAS_ACCOUNT_TOOLS, ...CANVAS_READ_TOOLS, ...(allowWrite ? CANVAS_WRITE_TOOLS : [])];
}
