/**
 * Conjunto de ferramentas do conector Canvas: leitura, e escrita quando permitida.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { manifestVersion } from '../../../src/mcp/server-version.js';
import { registerToolSpecs, type ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasContext } from './context.js';
import { CANVAS_READ_TOOLS } from './tools-read.js';
import { CANVAS_WRITE_TOOLS } from './tools-write.js';
import manifest from '../plugin/.claude-plugin/plugin.json' with { type: 'json' };

/** MCP server name and version (the version comes from the plugin manifest). */
export const CANVAS_SERVER_INFO = {
  name: 'canvas-puc',
  version: manifestVersion(manifest),
} as const;

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
