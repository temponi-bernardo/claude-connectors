import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it } from 'vitest';
import { mcpUnauthorizedResponse, serveMcpRequest } from './mcp-endpoint.js';

describe('serveMcpRequest', () => {
  it('answers in JSON without a session and closes the server', async () => {
    const server = new McpServer({ name: 't', version: '1' });
    server.registerTool('hi', { description: 'x' }, () => ({
      content: [{ type: 'text', text: 'hi' }],
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
    expect(JSON.stringify(await res.json())).toContain('"hi"');
    expect(server.isConnected()).toBe(false);
  });
});

describe('mcpUnauthorizedResponse', () => {
  it('returns 401 with the resource metadata address', () => {
    const res = mcpUnauthorizedResponse('https://x.dev');
    expect(res.status).toBe(401);
    expect(res.headers.get('www-authenticate')).toBe(
      'Bearer error="invalid_token", resource_metadata="https://x.dev/.well-known/oauth-protected-resource/mcp"',
    );
  });
});
