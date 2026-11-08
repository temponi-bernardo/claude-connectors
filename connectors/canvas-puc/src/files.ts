/**
 * Arquivos do Canvas: ler como texto (inclusive .doc/.docx) e baixar o conteúdo para a conversa.
 */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { htmlToText } from '../../../src/core/html.js';
import { wordKind, wordToText } from '../../../src/core/word.js';
import { rawToolResult, type RawToolResult } from '../../../src/mcp/tools.js';
import type { CanvasAttachment } from './canvas-types.js';
import type { CanvasClient } from './client.js';
import { isTextFile } from './helpers.js';

/** Maior arquivo que `baixar_arquivo` embute na conversa (10 MB; em base64 cresce ~33%). */
export const MAX_DOWNLOAD_BYTES = 10 * 1024 * 1024;

/** Maior texto devolvido por `ler_arquivo_texto`, em caracteres. */
export const MAX_TEXT_CHARS = 100_000;

/** Codifica bytes em base64 sem `Buffer` (funciona no Node e no Workers). */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let pos = 0; pos < bytes.length; pos += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(pos, pos + 0x8000));
  }
  return btoa(binary);
}

/** Bloco MCP com o conteúdo do arquivo: imagem para `image/*`, recurso embutido para o resto. */
export function fileContentBlock(
  file: CanvasAttachment,
  bytes: Uint8Array,
): CallToolResult['content'][number] {
  const mimeType = file['content-type'] ?? 'application/octet-stream';
  const data = bytesToBase64(bytes);
  if (mimeType.startsWith('image/')) return { type: 'image', data, mimeType };
  const uri = file.url ?? `canvas-file:${String(file.id)}`;
  return { type: 'resource', resource: { uri, mimeType, blob: data } };
}

/** Resultado de `baixar_arquivo`: uma linha de descrição e o conteúdo do arquivo. */
export function downloadedFileResult(file: CanvasAttachment, bytes: Uint8Array): RawToolResult {
  const kb = Math.round(bytes.length / 1024);
  const text = `"${String(file.display_name)}" (${String(file['content-type'])}, ${kb} KB). Link: ${String(file.url)}`;
  return rawToolResult({ content: [{ type: 'text', text }, fileContentBlock(file, bytes)] });
}

/** Motivo para não baixar o arquivo pela conversa (sem link ou grande demais), ou `null` se pode. */
export function downloadRefusal(file: CanvasAttachment): string | null {
  const name = String(file.display_name);
  if (!file.url) return `"${name}" não tem link de download disponível para esta conta.`;
  if ((file.size ?? 0) > MAX_DOWNLOAD_BYTES) {
    const mb = ((file.size ?? 0) / 1024 / 1024).toFixed(1);
    return `"${name}" tem ${mb} MB, acima do limite de 10 MB para trazer à conversa; baixe pelo link: ${file.url}`;
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
    return `"${name}" é ${type}; use \`baixar_arquivo\` para trazer o conteúdo ou baixe pelo link: ${String(file.url)}`;
  }
  const text = word
    ? await wordToText(word, await client.fetchBytes(file.url))
    : await client.fetchText(file.url);
  const body = type.includes('html') ? htmlToText(text) : text;
  return `# ${name}\n\n${body}`.slice(0, MAX_TEXT_CHARS);
}
