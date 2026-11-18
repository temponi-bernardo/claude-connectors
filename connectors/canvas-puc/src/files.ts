/**
 * Canvas files: read as text (including .doc/.docx) and download the content into the conversation.
 */
import { byteRangeStream } from '../../../src/core/stream.js';
import { htmlToText } from '../../../src/core/html.js';
import { wordKind, wordToText } from '../../../src/core/word.js';
import { binaryContentBlock, rawToolResult, type RawToolResult } from '../../../src/mcp/tools.js';
import type { StreamedToolContent } from '../../../src/remote/streamed-tool.js';
import type { CanvasAttachment } from './canvas-types.js';
import {
  chunkDescription,
  chunkMimeType,
  chunkUri,
  isRangeAnswer,
  planDownloadChunk,
  rangeHeaders,
  type ChunkRequest,
  type DownloadChunk,
} from './chunks.js';
import type { CanvasClient } from './client.js';
import { isTextFile } from './helpers.js';

/** Largest file `download_file` brings into the conversation, in MB (ADR 0023). */
export const MAX_DOWNLOAD_MB = 70;

/** Largest file `download_file` brings into the conversation, in bytes (in parts of `MAX_CHUNK_BYTES`). */
export const MAX_DOWNLOAD_BYTES = MAX_DOWNLOAD_MB * 1024 * 1024;

/** Longest text returned by `read_file_text`, in characters. */
export const MAX_TEXT_CHARS = 100_000;

/** Refusal for a file above `MAX_DOWNLOAD_BYTES`, pointing to the link. */
export function tooLargeMessage(name: string, size: number, url: string): string {
  const mb = (size / 1024 / 1024).toFixed(1);
  return `"${name}" is ${mb} MB, above the ${MAX_DOWNLOAD_MB} MB limit for the conversation; download it from the link: ${url}`;
}

/** Why the file cannot be downloaded into the conversation (no link or too large), or `null` if it can. */
export function downloadRefusal(file: CanvasAttachment): string | null {
  const name = String(file.display_name);
  if (!file.url) {
    const why = file.lock_explanation ? ` Canvas says: ${htmlToText(file.lock_explanation)}` : '';
    return `"${name}" has no download link available for this account (locked or restricted).${why}`;
  }
  if ((file.size ?? 0) > MAX_DOWNLOAD_BYTES) return tooLargeMessage(name, file.size ?? 0, file.url);
  return null;
}

/** Plans the part of the file to return (ADR 0024), or the reason it cannot be returned. */
export function planCanvasDownload(
  file: CanvasAttachment,
  request: ChunkRequest,
): DownloadChunk | string {
  const refusal = downloadRefusal(file);
  if (refusal !== null) return refusal;
  const name = String(file.display_name);
  if (file.size === undefined) {
    return `Canvas did not report the size of "${name}"; download it from the link: ${String(file.url)}`;
  }
  const plan = planDownloadChunk(file.size, request);
  return typeof plan === 'string' ? `"${name}": ${plan}` : plan;
}

/** Opens the bytes of the part: asks Canvas for the range and, if it sends the whole file, skips to it. */
export async function openCanvasChunk(
  client: CanvasClient,
  url: string,
  chunk: DownloadChunk,
): Promise<ReadableStream<Uint8Array>> {
  const res = await client.fetchStream(url, rangeHeaders(chunk));
  if (!res.body) throw new Error('Canvas sent an empty download.');
  const skip = isRangeAnswer(res, chunk) ? 0 : chunk.start;
  return res.body.pipeThrough(byteRangeStream(skip, chunk.end - chunk.start));
}

/**
 * Streams the planned part for the remote server (ADR 0023, 0024): never more than `MAX_CHUNK_BYTES`, never
 * whole in memory; `null` when it cannot be returned (the regular tool then explains why).
 */
export async function streamCanvasFile(
  client: CanvasClient,
  file: CanvasAttachment,
  request: ChunkRequest,
): Promise<StreamedToolContent | null> {
  const chunk = planCanvasDownload(file, request);
  if (typeof chunk === 'string') return null;
  const url = String(file.url);
  return {
    text: chunkDescription(file, chunk),
    mimeType: chunkMimeType(file, chunk),
    uri: chunkUri(url, chunk),
    body: await openCanvasChunk(client, url, chunk),
  };
}

/** Result of `download_file`: the description line and the content of the part. */
export function chunkToolResult(
  file: CanvasAttachment,
  chunk: DownloadChunk,
  bytes: Uint8Array,
): RawToolResult {
  const block = binaryContentBlock(
    chunkMimeType(file, chunk),
    bytes,
    chunkUri(String(file.url), chunk),
  );
  return rawToolResult({ content: [{ type: 'text', text: chunkDescription(file, chunk) }, block] });
}

/** Downloads the planned part and returns it to the conversation, or the reason it was not downloaded. */
export async function downloadCanvasFile(
  client: CanvasClient,
  file: CanvasAttachment,
  request: ChunkRequest,
): Promise<RawToolResult | string> {
  const chunk = planCanvasDownload(file, request);
  if (typeof chunk === 'string') return chunk;
  const body = await openCanvasChunk(client, String(file.url), chunk);
  return chunkToolResult(file, chunk, new Uint8Array(await new Response(body).arrayBuffer()));
}

/** Reads a file as text: plain text, HTML or a Word document; other types return the link. */
export async function readCanvasFileText(
  client: CanvasClient,
  file: CanvasAttachment,
): Promise<string> {
  const type = file['content-type'] ?? '';
  const name = file.display_name ?? '';
  const word = wordKind(type, name);
  if (!file.url || (!word && !isTextFile(type, name))) {
    return `"${name}" is ${type}; use \`download_file\` to bring its content or download it from the link: ${String(file.url)}`;
  }
  const text = word
    ? await wordToText(word, await client.fetchBytes(file.url))
    : await client.fetchText(file.url);
  const body = type.includes('html') ? htmlToText(text) : text;
  return `# ${name}\n\n${body}`.slice(0, MAX_TEXT_CHARS);
}
