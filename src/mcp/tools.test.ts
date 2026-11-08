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
});
