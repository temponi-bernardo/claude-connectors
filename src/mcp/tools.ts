/**
 * MCP tool definition and registration, shared by every connector.
 * Each connector describes its tools as data (`ToolSpec`) and registers them with `registerToolSpecs`.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { bytesToBase64 } from '../core/bytes.js';
import type { RequiredToolAnnotations } from './annotations.js';

/** Tool with erased types, ready to register. `C` is the connector context (client etc.). */
export interface ToolSpec<C> {
  readonly name: string;
  readonly description: string;
  readonly shape: z.ZodRawShape;
  /** Required `title` and behaviour hints (`readOnlyHint`, `destructiveHint`...): clients ask for confirmation with them. */
  readonly annotations: RequiredToolAnnotations;
  readonly run: (ctx: C, rawArgs: unknown) => Promise<unknown>;
}

/** Typed tool definition: `run` receives the arguments already validated by the `shape`. */
export interface ToolDefinition<C, S extends z.ZodRawShape> {
  readonly name: string;
  readonly description: string;
  readonly shape: S;
  readonly annotations: RequiredToolAnnotations;
  readonly run: (ctx: C, args: z.infer<z.ZodObject<S>>) => Promise<unknown>;
}

/** Creates a `ToolSpec` that validates the arguments with the `shape` before calling `run`. */
export function defineTool<C, S extends z.ZodRawShape>(def: ToolDefinition<C, S>): ToolSpec<C> {
  const schema = z.object(def.shape);
  return {
    name: def.name,
    description: def.description,
    shape: def.shape,
    annotations: def.annotations,
    run: async (ctx, rawArgs) => def.run(ctx, schema.parse(rawArgs ?? {})),
  };
}

/** Converts a tool return value into a text MCP result (indented JSON if it is not a string). */
export function textResult(data: unknown, notes: readonly string[] = []): CallToolResult {
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  return { content: [text, ...notes].map((t) => ({ type: 'text' as const, text: t })) };
}

/** Marker of a ready MCP result, returned by a tool that builds its own content. */
const RAW_RESULT: unique symbol = Symbol('rawToolResult');

/** Ready MCP result (image, embedded file...), which `runToolSafely` passes through unconverted. */
export interface RawToolResult {
  readonly [RAW_RESULT]: CallToolResult;
}

/** Wraps a ready MCP result so the tool can return it without going through `textResult`. */
export function rawToolResult(result: CallToolResult): RawToolResult {
  return { [RAW_RESULT]: result };
}

/** Converts a tool return value into an MCP result: a ready one passes through, the rest becomes text. */
export function toToolResult(data: unknown): CallToolResult {
  if (typeof data === 'object' && data !== null && RAW_RESULT in data) {
    return (data as RawToolResult)[RAW_RESULT];
  }
  return textResult(data);
}

/** Converts an error into an MCP result with `isError`, using the error message. */
export function errorResult(error: unknown): CallToolResult {
  const message = error instanceof Error ? error.message : String(error);
  return { isError: true, content: [{ type: 'text', text: message }] };
}

/** Runs a tool catching errors: success becomes `toToolResult`, failure becomes `errorResult`. */
export async function runToolSafely<C>(
  spec: ToolSpec<C>,
  ctx: C,
  rawArgs: unknown,
): Promise<CallToolResult> {
  try {
    return toToolResult(await spec.run(ctx, rawArgs));
  } catch (error) {
    return errorResult(error);
  }
}

/** Registers each `ToolSpec` on the MCP server, with its title and annotations, bound to the connector context. */
export function registerToolSpecs<C>(
  server: McpServer,
  specs: readonly ToolSpec<C>[],
  ctx: C,
): void {
  for (const spec of specs) {
    server.registerTool(
      spec.name,
      {
        title: spec.annotations.title,
        description: spec.description,
        inputSchema: spec.shape,
        annotations: spec.annotations,
      },
      (args: unknown) => runToolSafely(spec, ctx, args),
    );
  }
}

/** MCP block with binary content: image, audio or, for the rest, an embedded resource with the given `uri`. */
export function binaryContentBlock(
  mimeType: string,
  bytes: Uint8Array,
  uri: string,
): CallToolResult['content'][number] {
  return base64ContentBlock(mimeType, bytesToBase64(bytes), uri);
}

/** MCP block with content already in base64: image, audio or an embedded resource with the given `uri`. */
export function base64ContentBlock(
  mimeType: string,
  data: string,
  uri: string,
): CallToolResult['content'][number] {
  if (mimeType.startsWith('image/')) return { type: 'image', data, mimeType };
  if (mimeType.startsWith('audio/')) return { type: 'audio', data, mimeType };
  return { type: 'resource', resource: { uri, mimeType, blob: data } };
}
