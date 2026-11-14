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

const echo = defineTool({
  name: 'eco',
  description: 'devolve o texto',
  shape: { texto: z.string() },
  run: (ctx: { prefix: string }, args) => Promise.resolve(`${ctx.prefix}${args.texto}`),
});

describe('defineTool', () => {
  it('valida os argumentos antes de chamar run', async () => {
    await expect(echo.run({ prefix: '> ' }, { texto: 'oi' })).resolves.toBe('> oi');
    await expect(echo.run({ prefix: '' }, { texto: 1 })).rejects.toThrow();
  });

  it('aceita argumentos ausentes quando o shape é vazio', async () => {
    const none = defineTool({
      name: 'n',
      description: 'd',
      shape: {},
      run: () => Promise.resolve('ok'),
    });
    await expect(none.run(undefined, undefined)).resolves.toBe('ok');
  });
});

describe('textResult', () => {
  it('mantém string e serializa objetos', () => {
    expect(textResult('oi').content).toEqual([{ type: 'text', text: 'oi' }]);
    expect(textResult({ a: 1 }).content[0]).toEqual({ type: 'text', text: '{\n  "a": 1\n}' });
  });

  it('acrescenta notas como blocos extras', () => {
    expect(textResult('a', ['aviso']).content).toHaveLength(2);
  });
});

describe('errorResult', () => {
  it('usa a mensagem do Error ou o texto', () => {
    expect(errorResult(new Error('falhou'))).toEqual({
      isError: true,
      content: [{ type: 'text', text: 'falhou' }],
    });
    expect(errorResult('x').content[0]).toEqual({ type: 'text', text: 'x' });
  });
});

describe('runToolSafely', () => {
  it('converte sucesso e erro em resultado MCP', async () => {
    expect((await runToolSafely(echo, { prefix: '' }, { texto: 'a' })).isError).toBeUndefined();
    expect((await runToolSafely(echo, { prefix: '' }, {})).isError).toBe(true);
  });
});

describe('rawToolResult', () => {
  it('embrulha o resultado sem alterá-lo', () => {
    const result = { content: [{ type: 'image' as const, data: 'AA==', mimeType: 'image/png' }] };
    expect(toToolResult(rawToolResult(result))).toBe(result);
  });
});

describe('toToolResult', () => {
  it('repassa o resultado pronto e converte o resto em texto', () => {
    const ready = { content: [{ type: 'text' as const, text: 'pronto' }] };
    expect(toToolResult(rawToolResult(ready))).toBe(ready);
    expect(toToolResult({ a: 1 })).toEqual(textResult({ a: 1 }));
    expect(toToolResult(null)).toEqual(textResult(null));
  });
});

describe('registerToolSpecs', () => {
  it('registra cada ferramenta com o shape e um handler que executa a spec', async () => {
    const registerTool = vi.fn();
    registerToolSpecs({ registerTool } as unknown as McpServer, [echo], { prefix: '' });
    expect(registerTool).toHaveBeenCalledWith(
      'eco',
      { description: 'devolve o texto', inputSchema: echo.shape },
      expect.any(Function),
    );
    const handler = registerTool.mock.calls[0]![2] as (
      a: unknown,
    ) => Promise<{ content: unknown[] }>;
    expect((await handler({ texto: 'z' })).content).toEqual([{ type: 'text', text: 'z' }]);
  });

  it('repassa as anotações MCP quando a ferramenta tem', () => {
    const registerTool = vi.fn();
    const annotations = { readOnlyHint: false, destructiveHint: true };
    const send = defineTool({ ...echoDefinition(), annotations });
    expect(send.annotations).toEqual(annotations);
    registerToolSpecs({ registerTool } as unknown as McpServer, [send], { prefix: '' });
    expect(registerTool).toHaveBeenCalledWith(
      'eco',
      { description: 'devolve o texto', inputSchema: send.shape, annotations },
      expect.any(Function),
    );
  });
});

/** Definição da ferramenta de eco, para variar só as anotações. */
function echoDefinition(): {
  name: string;
  description: string;
  shape: { texto: z.ZodString };
  run: (ctx: { prefix: string }, args: { texto: string }) => Promise<string>;
} {
  return {
    name: 'eco',
    description: 'devolve o texto',
    shape: { texto: z.string() },
    run: (ctx, args) => Promise.resolve(`${ctx.prefix}${args.texto}`),
  };
}

describe('binaryContentBlock', () => {
  it('usa imagem para image/*, áudio para audio/* e recurso embutido para o resto', () => {
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
