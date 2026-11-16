/**
 * Streamed tool results (ADR 0023): a tool that returns a large file answers `tools/call` with the JSON-RPC
 * response written piece by piece — the file goes from the service to the client as base64 without ever
 * being whole in memory, which the Worker's 128 MB would not hold.
 */
import { base64EncodeStream, framedStream } from '../core/stream.js';
import { base64ContentBlock } from '../mcp/tools.js';

/** A `tools/call` request: JSON-RPC id, tool name and raw arguments. */
export interface ToolCallRequest {
  readonly id: string | number;
  readonly name: string;
  readonly args: unknown;
}

/** Streamed result: a description line and the binary content (MIME type, URI and the raw byte stream). */
export interface StreamedToolContent {
  readonly text: string;
  readonly mimeType: string;
  readonly uri: string;
  readonly body: ReadableStream<Uint8Array>;
}

/** Plain JSON object as a record; `null` for arrays, primitives and `null`. */
export function asJsonObject(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

/** Reads a single (non-batch) JSON-RPC `tools/call` message; `null` for anything else. */
export function parseToolCallRequest(message: unknown): ToolCallRequest | null {
  const { id, method, params } = asJsonObject(message) ?? {};
  if (method !== 'tools/call' || (typeof id !== 'string' && typeof id !== 'number')) return null;
  const { name, arguments: args } = asJsonObject(params) ?? {};
  if (typeof name !== 'string') return null;
  return { id, name, args: args ?? {} };
}

/** Reads the `tools/call` from a POST without consuming the request (it may still go to the MCP server). */
export async function readToolCallRequest(request: Request): Promise<ToolCallRequest | null> {
  if (request.method !== 'POST') return null;
  try {
    return parseToolCallRequest(await request.clone().json());
  } catch {
    return null;
  }
}

/** JSON-RPC result split around the base64 data: `[prefix, suffix]`. `marker` must not occur in the text. */
export function streamedResultFrame(
  id: string | number,
  content: StreamedToolContent,
  marker: string,
): readonly [string, string] {
  const block = base64ContentBlock(content.mimeType, marker, content.uri);
  const result = { content: [{ type: 'text', text: content.text }, block] };
  const json = JSON.stringify({ jsonrpc: '2.0', id, result });
  const at = json.indexOf(marker);
  return [json.slice(0, at), json.slice(at + marker.length)];
}

/** HTTP response with the JSON-RPC result, the content encoded as base64 while it streams. */
export function streamedToolResponse(id: string | number, content: StreamedToolContent): Response {
  const [prefix, suffix] = streamedResultFrame(id, content, `stream-${crypto.randomUUID()}`);
  const body = content.body
    .pipeThrough(base64EncodeStream())
    .pipeThrough(framedStream(prefix, suffix));
  return new Response(body, { status: 200, headers: { 'content-type': 'application/json' } });
}
