/**
 * Canvas files: read as text (including .doc/.docx) and download the content into the conversation.
 */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { byteLimitStream } from '../../../src/core/stream.js';
import { htmlToText } from '../../../src/core/html.js';
import { wordKind, wordToText } from '../../../src/core/word.js';
import { binaryContentBlock, rawToolResult, type RawToolResult } from '../../../src/mcp/tools.js';
import type { StreamedToolContent } from '../../../src/remote/streamed-tool.js';
import type { CanvasAttachment } from './canvas-types.js';
import type { CanvasClient } from './client.js';
import { isTextFile } from './helpers.js';

/** Largest file `download_file` brings into the conversation, in MB (ADR 0023). */
export const MAX_DOWNLOAD_MB = 70;

/** Largest file `download_file` brings into the conversation, in bytes; streamed, so it never sits whole in memory. */
export const MAX_DOWNLOAD_BYTES = MAX_DOWNLOAD_MB * 1024 * 1024;

/** Longest text returned by `read_file_text`, in characters. */
export const MAX_TEXT_CHARS = 100_000;

/** MIME type of the file, `application/octet-stream` when Canvas does not say. */
export function fileMimeType(file: CanvasAttachment): string {
  return file['content-type'] ?? 'application/octet-stream';
}

/** MCP block with the file content: an image for `image/*`, an embedded resource for the rest. */
export function fileContentBlock(
  file: CanvasAttachment,
  bytes: Uint8Array,
): CallToolResult['content'][number] {
  return binaryContentBlock(
    fileMimeType(file),
    bytes,
    file.url ?? `canvas-file:${String(file.id)}`,
  );
}

/** Description line of a downloaded file: name, type, size in KB and link. */
export function describeDownloadedFile(file: CanvasAttachment, size: number): string {
  const kb = Math.round(size / 1024);
  return `"${String(file.display_name)}" (${String(file['content-type'])}, ${kb} KB). Link: ${String(file.url)}`;
}

/** Result of `download_file`: a description line and the file content. */
export function downloadedFileResult(file: CanvasAttachment, bytes: Uint8Array): RawToolResult {
  const text = describeDownloadedFile(file, bytes.length);
  return rawToolResult({ content: [{ type: 'text', text }, fileContentBlock(file, bytes)] });
}

/** Refusal for a file above `MAX_DOWNLOAD_BYTES`, pointing to the link. */
export function tooLargeMessage(name: string, size: number, url: string): string {
  const mb = (size / 1024 / 1024).toFixed(1);
  return `"${name}" is ${mb} MB, above the ${MAX_DOWNLOAD_MB} MB limit for the conversation; download it from the link: ${url}`;
}

/** Why the file cannot be downloaded into the conversation (no link or too large), or `null` if it can. */
export function downloadRefusal(file: CanvasAttachment): string | null {
  const name = String(file.display_name);
  if (!file.url) return `"${name}" has no download link available for this account.`;
  if ((file.size ?? 0) > MAX_DOWNLOAD_BYTES) return tooLargeMessage(name, file.size ?? 0, file.url);
  return null;
}

/** Opens the download stream; `null` (body released) when Canvas declares more than `MAX_DOWNLOAD_BYTES`. */
export async function openCanvasFileStream(
  client: CanvasClient,
  url: string,
): Promise<{ readonly body: ReadableStream<Uint8Array>; readonly size: number } | null> {
  const res = await client.fetchStream(url);
  const size = Number(res.headers.get('content-length') ?? 0);
  if (!res.body || size > MAX_DOWNLOAD_BYTES) {
    await res.body?.cancel();
    return null;
  }
  return { body: res.body, size };
}

/**
 * Streams the file for the remote server (ADR 0023), capped at `MAX_DOWNLOAD_BYTES` whatever Canvas declares;
 * `null` when it refuses it or the download is declared too large (the regular tool then answers).
 */
export async function streamCanvasFile(
  client: CanvasClient,
  file: CanvasAttachment,
): Promise<StreamedToolContent | null> {
  if (downloadRefusal(file) !== null || !file.url) return null;
  const opened = await openCanvasFileStream(client, file.url);
  if (!opened) return null;
  const overflow = tooLargeMessage(String(file.display_name), MAX_DOWNLOAD_BYTES + 1, file.url);
  return {
    text: describeDownloadedFile(file, file.size ?? opened.size),
    mimeType: fileMimeType(file),
    uri: file.url,
    body: opened.body.pipeThrough(byteLimitStream(MAX_DOWNLOAD_BYTES, overflow)),
  };
}

/** Downloads the file and returns its content to the conversation, or the reason it was not downloaded. */
export async function downloadCanvasFile(
  client: CanvasClient,
  file: CanvasAttachment,
): Promise<RawToolResult | string> {
  const refusal = downloadRefusal(file);
  if (refusal !== null) return refusal;
  return downloadedFileResult(file, await client.fetchBytes(String(file.url)));
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
