import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it } from 'vitest';
import { mcpUnauthorizedResponse, serveMcpRequest } from './mcp-endpoint.js';

describe('serveMcpRequest', () => {
  it('responde em JSON sem sessão e fecha o servidor', async () => {
    const server = new McpServer({ name: 't', version: '1' });
    server.registerTool('oi', { description: 'x' }, () => ({
      content: [{ type: 'text', text: 'oi' }],
    }));
    const res = await serveMcpRequest(
      server,
      new Request('https://x.dev/mcp', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
      }),
    );
    expect(res.headers.get('content-type')).toContain('application/json');
    expect(res.headers.get('mcp-session-id')).toBeNull();
    expect(JSON.stringify(await res.json())).toContain('"oi"');
    expect(server.isConnected()).toBe(false);
  });
});

describe('mcpUnauthorizedResponse', () => {
  it('dá 401 com o endereço dos metadados do recurso', () => {
    const res = mcpUnauthorizedResponse('https://x.dev');
    expect(res.status).toBe(401);
    expect(res.headers.get('www-authenticate')).toBe(
      'Bearer error="invalid_token", resource_metadata="https://x.dev/.well-known/oauth-protected-resource/mcp"',
    );
  });
});
