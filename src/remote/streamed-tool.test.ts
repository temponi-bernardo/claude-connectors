import { describe, expect, it } from 'vitest';
import {
  asJsonObject,
  parseToolCallRequest,
  readToolCallRequest,
  streamedResultFrame,
  streamedToolResponse,
  type StreamedToolContent,
} from './streamed-tool.js';

function content(body: string, mimeType = 'application/pdf'): StreamedToolContent {
  return {
    text: 'file "a"',
    mimeType,
    uri: 'https://x/a',
    body: new Response(body).body!,
  };
}

function post(body: string): Request {
  return new Request('https://h/mcp', { method: 'POST', body });
}

describe('asJsonObject', () => {
  it('accepts plain objects only', () => {
    expect(asJsonObject({ a: 1 })).toEqual({ a: 1 });
    expect(asJsonObject([1])).toBeNull();
    expect(asJsonObject(null)).toBeNull();
    expect(asJsonObject('x')).toBeNull();
  });
});

describe('parseToolCallRequest', () => {
  it('accepts a single tools/call and refuses the rest', () => {
    const call = {
      jsonrpc: '2.0',
      id: 7,
      method: 'tools/call',
      params: { name: 'n', arguments: { a: 1 } },
    };
    expect(parseToolCallRequest(call)).toEqual({ id: 7, name: 'n', args: { a: 1 } });
    expect(parseToolCallRequest({ ...call, id: 's', params: { name: 'n' } })).toEqual({
      id: 's',
      name: 'n',
      args: {},
    });
    expect(parseToolCallRequest([call])).toBeNull();
    expect(parseToolCallRequest({ ...call, method: 'tools/list' })).toBeNull();
    expect(parseToolCallRequest({ ...call, id: undefined })).toBeNull();
    expect(parseToolCallRequest({ ...call, params: { name: 3 } })).toBeNull();
    expect(parseToolCallRequest(null)).toBeNull();
  });
});

describe('readToolCallRequest', () => {
  it('reads the call without consuming the original request', async () => {
    const request = post('{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"n"}}');
    await expect(readToolCallRequest(request)).resolves.toEqual({ id: 1, name: 'n', args: {} });
    expect(request.bodyUsed).toBe(false);
  });

  it('returns null for a body that is not JSON or a request that is not POST', async () => {
    await expect(readToolCallRequest(post('{'))).resolves.toBeNull();
    await expect(readToolCallRequest(new Request('https://h/mcp'))).resolves.toBeNull();
  });
});

describe('streamedResultFrame', () => {
  it('splits the JSON-RPC result around the base64 data', () => {
    const [prefix, suffix] = streamedResultFrame(3, content(''), 'MARK');
    const parsed: unknown = JSON.parse(`${prefix}QQ==${suffix}`);
    expect(parsed).toEqual({
      jsonrpc: '2.0',
      id: 3,
      result: {
        content: [
          { type: 'text', text: 'file "a"' },
          {
            type: 'resource',
            resource: { uri: 'https://x/a', mimeType: 'application/pdf', blob: 'QQ==' },
          },
        ],
      },
    });
  });
});

describe('streamedToolResponse', () => {
  it('streams a valid JSON-RPC response with the content in base64', async () => {
    const res = streamedToolResponse('r1', content('hello', 'image/png'));
    expect(res.headers.get('content-type')).toBe('application/json');
    const json = (await res.json()) as { id: string; result: { content: { data?: string }[] } };
    expect(json.id).toBe('r1');
    expect(json.result.content[1]?.data).toBe(btoa('hello'));
  });
});
