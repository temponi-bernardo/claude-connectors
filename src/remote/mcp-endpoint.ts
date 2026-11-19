/**
 * Sessionless `/mcp` endpoint: each HTTP request gets a new MCP server bound to the user's secret, and the
 * response comes back as JSON (no SSE), which works on any host and with several instances.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';

/** Serves an MCP request with the given server and closes it when done. */
export async function serveMcpRequest(server: McpServer, request: Request): Promise<Response> {
  // No `sessionIdGenerator`: stateless mode.
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await server.connect(transport);
  try {
    return await transport.handleRequest(request);
  } finally {
    await server.close();
  }
}

/** 401 response that points the client to the resource metadata (RFC 9728), starting OAuth. */
export function mcpUnauthorizedResponse(issuer: string): Response {
  const metadata = `${issuer}/.well-known/oauth-protected-resource/mcp`;
  return new Response(JSON.stringify({ error: 'invalid_token' }), {
    status: 401,
    headers: {
      'content-type': 'application/json',
      'www-authenticate': `Bearer error="invalid_token", resource_metadata="${metadata}"`,
    },
  });
}

/** Path of the public tool catalog: the server's `tools/list` answer, with no user data (post-deploy smoke test). */
export const TOOL_CATALOG_PATH = '/tools';

/** JSON-RPC `tools/list` request, as an MCP client would POST it to `/mcp`. */
export function toolsListRequest(origin: string): Request {
  return new Request(`${origin}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
  });
}

/** Answers the catalog route with the `tools/list` response of a server that only lists its tools. */
export function serveToolCatalog(server: McpServer, origin: string): Promise<Response> {
  return serveMcpRequest(server, toolsListRequest(origin));
}
