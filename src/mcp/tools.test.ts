import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  defineTool,
  errorResult,
  rawToolResult,
  registerToolSpecs,
  runToolSafely,
  textResult,
  toToolResult,
  binaryContentBlock,
} from './tools.js';
import { READ_ONLY_HINTS, SEND_HINTS, toolAnnotations } from './annotations.js';

const echoAnnotations = toolAnnotations('Echo', READ_ONLY_HINTS);

const echo = defineTool({
  name: 'echo',
  description: 'returns the text',
  shape: { value: z.string() },
  annotations: echoAnnotations,
  run: (ctx: { prefix: string }, args) => Promise.resolve(`${ctx.prefix}${args.value}`),
});

describe('defineTool', () => {
  it('validates the arguments before calling run', async () => {
    await expect(echo.run({ prefix: '> ' }, { value: 'hi' })).resolves.toBe('> hi');
    await expect(echo.run({ prefix: '' }, { value: 1 })).rejects.toThrow();
  });

  it('accepts missing arguments when the shape is empty', async () => {
    const none = defineTool({
      name: 'n',
      description: 'd',
      shape: {},
      annotations: echoAnnotations,
      run: () => Promise.resolve('ok'),
    });
    await expect(none.run(undefined, undefined)).resolves.toBe('ok');
  });
});

describe('textResult', () => {
  it('keeps strings and serializes objects', () => {
    expect(textResult('hi').content).toEqual([{ type: 'text', text: 'hi' }]);
    expect(textResult({ a: 1 }).content[0]).toEqual({ type: 'text', text: '{\n  "a": 1\n}' });
  });

  it('appends notes as extra blocks', () => {
    expect(textResult('a', ['note']).content).toHaveLength(2);
  });
});

describe('errorResult', () => {
  it('uses the Error message or the text', () => {
    expect(errorResult(new Error('failed'))).toEqual({
      isError: true,
      content: [{ type: 'text', text: 'failed' }],
    });
    expect(errorResult('x').content[0]).toEqual({ type: 'text', text: 'x' });
  });
});

describe('runToolSafely', () => {
  it('turns success and error into an MCP result', async () => {
    expect((await runToolSafely(echo, { prefix: '' }, { value: 'a' })).isError).toBeUndefined();
    expect((await runToolSafely(echo, { prefix: '' }, {})).isError).toBe(true);
  });
});

describe('rawToolResult', () => {
  it('wraps the result without changing it', () => {
    const result = { content: [{ type: 'image' as const, data: 'AA==', mimeType: 'image/png' }] };
    expect(toToolResult(rawToolResult(result))).toBe(result);
  });
});

describe('toToolResult', () => {
  it('passes a ready result through and turns the rest into text', () => {
    const ready = { content: [{ type: 'text' as const, text: 'ready' }] };
    expect(toToolResult(rawToolResult(ready))).toBe(ready);
    expect(toToolResult({ a: 1 })).toEqual(textResult({ a: 1 }));
    expect(toToolResult(null)).toEqual(textResult(null));
  });
});

describe('registerToolSpecs', () => {
  it('registers each tool with its title, shape, annotations and a handler that runs the spec', async () => {
    const registerTool = vi.fn();
    registerToolSpecs({ registerTool } as unknown as McpServer, [echo], { prefix: '' });
    expect(registerTool).toHaveBeenCalledWith(
      'echo',
      {
        title: 'Echo',
        description: 'returns the text',
        inputSchema: echo.shape,
        annotations: echoAnnotations,
      },
      expect.any(Function),
    );
    const handler = registerTool.mock.calls[0]![2] as (
      a: unknown,
    ) => Promise<{ content: unknown[] }>;
    expect((await handler({ value: 'z' })).content).toEqual([{ type: 'text', text: 'z' }]);
  });

  it('passes the destructive hints of a write tool through', () => {
    const registerTool = vi.fn();
    const annotations = toolAnnotations('Send echo', SEND_HINTS);
    const send = defineTool({ ...echoDefinition(), annotations });
    expect(send.annotations).toEqual(annotations);
    registerToolSpecs({ registerTool } as unknown as McpServer, [send], { prefix: '' });
    expect(registerTool).toHaveBeenCalledWith(
      'echo',
      expect.objectContaining({ title: 'Send echo', annotations }),
      expect.any(Function),
    );
  });
});

/** Echo tool definition, to vary only the annotations. */
function echoDefinition(): {
  name: string;
  description: string;
  shape: { value: z.ZodString };
  run: (ctx: { prefix: string }, args: { value: string }) => Promise<string>;
} {
  return {
    name: 'echo',
    description: 'returns the text',
    shape: { value: z.string() },
    run: (ctx, args) => Promise.resolve(`${ctx.prefix}${args.value}`),
  };
}

describe('binaryContentBlock', () => {
  it('uses image for image/*, audio for audio/* and an embedded resource for the rest', () => {
    const bytes = new Uint8Array([1]);
    expect(binaryContentBlock('image/png', bytes, 'u')).toEqual({
      type: 'image',
      data: 'AQ==',
      mimeType: 'image/png',
    });
    expect(binaryContentBlock('audio/ogg', bytes, 'u')).toEqual({
      type: 'audio',
      data: 'AQ==',
      mimeType: 'audio/ogg',
    });
    expect(binaryContentBlock('application/pdf', bytes, 'x:1')).toEqual({
      type: 'resource',
      resource: { uri: 'x:1', mimeType: 'application/pdf', blob: 'AQ==' },
    });
  });
});
