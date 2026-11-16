/**
 * Download parts of `download_file` (ADR 0024): Claude's client drops tool results above ~16 MB, so a file larger
 * than `MAX_CHUNK_BYTES` comes in parts of raw bytes that the caller joins. Pure.
 */
import type { CanvasAttachment } from './canvas-types.js';

/** Largest part `download_file` returns in one call (8 MB → ~10.7 MB of base64, below the client's limit). */
export const MAX_CHUNK_BYTES = 8 * 1024 * 1024;

/** Part asked by the caller: first byte (`offset`, default 0) and size (`length`, default and cap `MAX_CHUNK_BYTES`). */
export interface ChunkRequest {
  readonly offset?: number | undefined;
  readonly length?: number | undefined;
}

/** Planned part: bytes `[start, end)` of `total`; `step` is the asked part size; `whole` for the entire file. */
export interface DownloadChunk {
  readonly start: number;
  readonly end: number;
  readonly total: number;
  readonly step: number;
  readonly whole: boolean;
}

/** Plans the part to return, or explains why the offset is invalid. */
export function planDownloadChunk(total: number, request: ChunkRequest): DownloadChunk | string {
  const start = request.offset ?? 0;
  if (start > 0 && start >= total) {
    return `offset ${start} is past the end of the file (${total} bytes).`;
  }
  const length = Math.min(request.length ?? MAX_CHUNK_BYTES, MAX_CHUNK_BYTES);
  const end = Math.min(total, start + length);
  return { start, end, total, step: length, whole: start === 0 && end === total };
}

/** Description of what was returned: the file as before, or the part with its range and the next offset. */
export function chunkDescription(file: CanvasAttachment, chunk: DownloadChunk): string {
  const kb = Math.round(chunk.total / 1024);
  const head = `"${String(file.display_name)}" (${String(file['content-type'])}, ${kb} KB)`;
  const link = `Link: ${String(file.url)}`;
  if (chunk.whole) return `${head}. ${link}`;
  const part = `part ${Math.floor(chunk.start / chunk.step) + 1} of ${Math.ceil(chunk.total / chunk.step)}`;
  const next =
    chunk.end < chunk.total
      ? `next part: download_file with offset=${chunk.end}`
      : 'this is the last part';
  return `${head} is sent in parts of raw bytes. This part: bytes ${chunk.start}–${chunk.end - 1} of ${chunk.total} (${part}). Save the parts in order and join them; ${next}. ${link}`;
}

/** MIME type of the returned content: the file's own for a whole file, raw bytes for a part. */
export function chunkMimeType(file: CanvasAttachment, chunk: DownloadChunk): string {
  if (!chunk.whole) return 'application/octet-stream';
  return file['content-type'] ?? 'application/octet-stream';
}

/** URI of the returned content: the link, with `#bytes=<first>-<last>` for a part. */
export function chunkUri(url: string, chunk: DownloadChunk): string {
  return chunk.whole ? url : `${url}#bytes=${chunk.start}-${chunk.end - 1}`;
}

/** `Range` header for a part (none for a whole file). */
export function rangeHeaders(chunk: DownloadChunk): Record<string, string> {
  return chunk.whole ? {} : { range: `bytes=${chunk.start}-${chunk.end - 1}` };
}

/** Says whether the download honoured the range (206 starting at the asked byte); otherwise it is the whole file. */
export function isRangeAnswer(res: Response, chunk: DownloadChunk): boolean {
  const range = res.headers.get('content-range') ?? '';
  return res.status === 206 && range.startsWith(`bytes ${chunk.start}-`);
}
