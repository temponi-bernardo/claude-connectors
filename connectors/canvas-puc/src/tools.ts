/**
 * Tool set of the Canvas connector: read tools, plus write tools when allowed.
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

/** Picks the tools: read tools always, write tools with `allowWrite`. */
export function canvasTools(allowWrite: boolean): readonly ToolSpec<CanvasContext>[] {
  return [...CANVAS_READ_TOOLS, ...(allowWrite ? CANVAS_WRITE_TOOLS : [])];
}

/** Creates the Canvas MCP server with the given tools bound to the context. */
export function createCanvasMcpServer(
  specs: readonly ToolSpec<CanvasContext>[],
  ctx: CanvasContext,
): McpServer {
  const server = new McpServer({ ...CANVAS_SERVER_INFO });
  registerToolSpecs(server, specs, ctx);
  return server;
}
