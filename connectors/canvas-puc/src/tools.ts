/**
 * Tool set of the Canvas connector: read tools, plus write tools that refuse with a reason when not allowed.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { manifestVersion } from '../../../src/mcp/server-version.js';
import { gateToolSpecs } from '../../../src/mcp/tool-gate.js';
import { registerToolSpecs, type ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasContext } from './context.js';
import { CANVAS_INBOX_READ_TOOLS, CANVAS_INBOX_WRITE_TOOLS } from './tools-inbox.js';
import { CANVAS_READ_TOOLS } from './tools-read.js';
import { CANVAS_WRITE_TOOLS } from './tools-write.js';
import manifest from '../plugin/.claude-plugin/plugin.json' with { type: 'json' };

/** MCP server name and version (the version comes from the plugin manifest). */
export const CANVAS_SERVER_INFO = {
  name: 'canvas-puc',
  version: manifestVersion(manifest),
} as const;

/**
 * Every tool, always listed: the write ones run when `writeBlock` is null and otherwise answer each call with
 * that reason (how to turn writing on), so no description ever points at a tool the model cannot see.
 */
export function canvasTools(writeBlock: string | null): readonly ToolSpec<CanvasContext>[] {
  const writes = gateToolSpecs([...CANVAS_WRITE_TOOLS, ...CANVAS_INBOX_WRITE_TOOLS], writeBlock);
  return [...CANVAS_READ_TOOLS, ...CANVAS_INBOX_READ_TOOLS, ...writes];
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
