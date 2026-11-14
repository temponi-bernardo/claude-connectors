/**
 * Arquivos do Canvas: ler como texto (inclusive .doc/.docx) e baixar o conteúdo para a conversa.
 */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { htmlToText } from '../../../src/core/html.js';
import { wordKind, wordToText } from '../../../src/core/word.js';
import { binaryContentBlock, rawToolResult, type RawToolResult } from '../../../src/mcp/tools.js';
import type { CanvasAttachment } from './canvas-types.js';
import type { CanvasClient } from './client.js';
import { isTextFile } from './helpers.js';

/** Maior arquivo que `download_file` embute na conversa (10 MB; em base64 cresce ~33%). */
export const MAX_DOWNLOAD_BYTES = 10 * 1024 * 1024;

/** Maior texto devolvido por `read_file_text`, em caracteres. */
export const MAX_TEXT_CHARS = 100_000;

/** Bloco MCP com o conteúdo do arquivo: imagem para `image/*`, recurso embutido para o resto. */
export function fileContentBlock(
  file: CanvasAttachment,
  bytes: Uint8Array,
): CallToolResult['content'][number] {
  const mimeType = file['content-type'] ?? 'application/octet-stream';
  return binaryContentBlock(mimeType, bytes, file.url ?? `canvas-file:${String(file.id)}`);
}

/** Resultado de `download_file`: uma linha de descrição e o conteúdo do arquivo. */
export function downloadedFileResult(file: CanvasAttachment, bytes: Uint8Array): RawToolResult {
  const kb = Math.round(bytes.length / 1024);
  const text = `"${String(file.display_name)}" (${String(file['content-type'])}, ${kb} KB). Link: ${String(file.url)}`;
  return rawToolResult({ content: [{ type: 'text', text }, fileContentBlock(file, bytes)] });
}

/** Motivo para não baixar o arquivo pela conversa (sem link ou grande demais), ou `null` se pode. */
export function downloadRefusal(file: CanvasAttachment): string | null {
  const name = String(file.display_name);
  if (!file.url) return `"${name}" has no download link available for this account.`;
  if ((file.size ?? 0) > MAX_DOWNLOAD_BYTES) {
    const mb = ((file.size ?? 0) / 1024 / 1024).toFixed(1);
    return `"${name}" is ${mb} MB, above the 10 MB limit for the conversation; download it from the link: ${file.url}`;
  }
  return null;
}

/** Baixa o arquivo e devolve seu conteúdo para a conversa, ou o motivo de não baixar. */
export async function downloadCanvasFile(
  client: CanvasClient,
  file: CanvasAttachment,
): Promise<RawToolResult | string> {
  const refusal = downloadRefusal(file);
  if (refusal !== null) return refusal;
  return downloadedFileResult(file, await client.fetchBytes(String(file.url)));
}

/** Lê um arquivo como texto: texto puro, HTML ou documento do Word; outros tipos devolvem o link. */
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
