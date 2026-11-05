/**
 * Endpoint `/mcp` sem sessão: cada requisição HTTP ganha um servidor MCP novo, ligado ao segredo do usuário,
 * e a resposta volta em JSON (sem SSE), o que funciona em qualquer host e com várias instâncias.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';

/** Atende uma requisição MCP com o servidor dado e o fecha ao terminar. */
export async function serveMcpRequest(server: McpServer, request: Request): Promise<Response> {
  // Sem `sessionIdGenerator`: modo sem sessão (stateless).
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await server.connect(transport);
  try {
    return await transport.handleRequest(request);
  } finally {
    await server.close();
  }
}

/** Resposta 401 que aponta o cliente para os metadados do recurso (RFC 9728), iniciando o OAuth. */
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
