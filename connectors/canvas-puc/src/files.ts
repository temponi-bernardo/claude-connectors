/**
 * Canvas files: read as text (including .doc/.docx) and download the content into the conversation.
 */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { htmlToText } from '../../../src/core/html.js';
import { wordKind, wordToText } from '../../../src/core/word.js';
import { binaryContentBlock, rawToolResult, type RawToolResult } from '../../../src/mcp/tools.js';
import type { CanvasAttachment } from './canvas-types.js';
import type { CanvasClient } from './client.js';
import { isTextFile } from './helpers.js';

/** Largest file `download_file` embeds in the conversation (10 MB; base64 grows it ~33%). */
export const MAX_DOWNLOAD_BYTES = 10 * 1024 * 1024;

/** Longest text returned by `read_file_text`, in characters. */
export const MAX_TEXT_CHARS = 100_000;

/** MCP block with the file content: an image for `image/*`, an embedded resource for the rest. */
export function fileContentBlock(
  file: CanvasAttachment,
  bytes: Uint8Array,
): CallToolResult['content'][number] {
  const mimeType = file['content-type'] ?? 'application/octet-stream';
  return binaryContentBlock(mimeType, bytes, file.url ?? `canvas-file:${String(file.id)}`);
}

/** Result of `download_file`: a description line and the file content. */
export function downloadedFileResult(file: CanvasAttachment, bytes: Uint8Array): RawToolResult {
  const kb = Math.round(bytes.length / 1024);
  const text = `"${String(file.display_name)}" (${String(file['content-type'])}, ${kb} KB). Link: ${String(file.url)}`;
  return rawToolResult({ content: [{ type: 'text', text }, fileContentBlock(file, bytes)] });
}

/** Why the file cannot be downloaded into the conversation (no link or too large), or `null` if it can. */
export function downloadRefusal(file: CanvasAttachment): string | null {
  const name = String(file.display_name);
  if (!file.url) return `"${name}" has no download link available for this account.`;
  if ((file.size ?? 0) > MAX_DOWNLOAD_BYTES) {
    const mb = ((file.size ?? 0) / 1024 / 1024).toFixed(1);
    return `"${name}" is ${mb} MB, above the 10 MB limit for the conversation; download it from the link: ${file.url}`;
  }
  return null;
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
