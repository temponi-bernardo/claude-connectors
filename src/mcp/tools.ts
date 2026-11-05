/**
 * Definição e registro de ferramentas MCP, compartilhados por todos os conectores.
 * Cada conector descreve suas ferramentas como dados (`ToolSpec`) e as registra com `registerToolSpecs`.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

/** Ferramenta já com tipos apagados, pronta para registrar. `C` é o contexto do conector (cliente etc.). */
export interface ToolSpec<C> {
  readonly name: string;
  readonly description: string;
  readonly shape: z.ZodRawShape;
  readonly run: (ctx: C, rawArgs: unknown) => Promise<unknown>;
}

/** Definição tipada de uma ferramenta: `run` recebe os argumentos já validados pelo `shape`. */
export interface ToolDefinition<C, S extends z.ZodRawShape> {
  readonly name: string;
  readonly description: string;
  readonly shape: S;
  readonly run: (ctx: C, args: z.infer<z.ZodObject<S>>) => Promise<unknown>;
}

/** Cria uma `ToolSpec` validando os argumentos com o `shape` antes de chamar `run`. */
export function defineTool<C, S extends z.ZodRawShape>(def: ToolDefinition<C, S>): ToolSpec<C> {
  const schema = z.object(def.shape);
  return {
    name: def.name,
    description: def.description,
    shape: def.shape,
    run: async (ctx, rawArgs) => def.run(ctx, schema.parse(rawArgs ?? {})),
  };
}

/** Converte o retorno de uma ferramenta em resultado MCP de texto (JSON indentado se não for string). */
export function textResult(data: unknown, notes: readonly string[] = []): CallToolResult {
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  return { content: [text, ...notes].map((t) => ({ type: 'text' as const, text: t })) };
}

/** Converte um erro em resultado MCP com `isError`, usando a mensagem do erro. */
export function errorResult(error: unknown): CallToolResult {
  const message = error instanceof Error ? error.message : String(error);
  return { isError: true, content: [{ type: 'text', text: message }] };
}

/** Executa uma ferramenta capturando erros: sucesso vira `textResult`, falha vira `errorResult`. */
export async function runToolSafely<C>(
  spec: ToolSpec<C>,
  ctx: C,
  rawArgs: unknown,
): Promise<CallToolResult> {
  try {
    return textResult(await spec.run(ctx, rawArgs));
  } catch (error) {
    return errorResult(error);
  }
}

/** Registra cada `ToolSpec` no servidor MCP com o contexto do conector. */
export function registerToolSpecs<C>(
  server: McpServer,
  specs: readonly ToolSpec<C>[],
  ctx: C,
): void {
  for (const spec of specs) {
    server.registerTool(
      spec.name,
      { description: spec.description, inputSchema: spec.shape },
      (args: unknown) => runToolSafely(spec, ctx, args),
    );
  }
}
