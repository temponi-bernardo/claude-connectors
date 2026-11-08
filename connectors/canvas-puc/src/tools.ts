/**
 * Conjunto de ferramentas do conector Canvas: conexão + leitura, e escrita quando permitida.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { defineTool, registerToolSpecs, type ToolSpec } from '../../../src/mcp/tools.js';
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

/** Nome e versão anunciados pelo servidor MCP do Canvas (stdio e remoto). */
export const CANVAS_SERVER_INFO = { name: 'canvas-puc', version: '1.3.0' } as const;

/** Ferramentas do serviço (leitura, e escrita com `allowWrite`), sem as de conexão. */
export function canvasServiceTools(allowWrite: boolean): readonly ToolSpec<CanvasContext>[] {
  return [...CANVAS_READ_TOOLS, ...(allowWrite ? CANVAS_WRITE_TOOLS : [])];
}

/** Seleciona as ferramentas do modo local: conexão + serviço. */
export function canvasTools(allowWrite: boolean): readonly ToolSpec<CanvasContext>[] {
  return [...CANVAS_ACCOUNT_TOOLS, ...canvasServiceTools(allowWrite)];
}

/** Cria o servidor MCP do Canvas com as ferramentas dadas ligadas ao contexto. */
export function createCanvasMcpServer(
  specs: readonly ToolSpec<CanvasContext>[],
  ctx: CanvasContext,
): McpServer {
  const server = new McpServer({ ...CANVAS_SERVER_INFO });
  registerToolSpecs(server, specs, ctx);
  return server;
}
