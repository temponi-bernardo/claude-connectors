/**
 * Conjunto de ferramentas do conector Canvas: leitura, e escrita quando permitida.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerToolSpecs, type ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasContext } from './context.js';
import { CANVAS_READ_TOOLS } from './tools-read.js';
import { CANVAS_WRITE_TOOLS } from './tools-write.js';

/** Nome e versão anunciados pelo servidor MCP do Canvas. */
export const CANVAS_SERVER_INFO = { name: 'canvas-puc', version: '2.0.0' } as const;

/** Seleciona as ferramentas: leitura sempre, e escrita com `allowWrite`. */
export function canvasTools(allowWrite: boolean): readonly ToolSpec<CanvasContext>[] {
  return [...CANVAS_READ_TOOLS, ...(allowWrite ? CANVAS_WRITE_TOOLS : [])];
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
