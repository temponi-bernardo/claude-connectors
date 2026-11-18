/**
 * File submissions (ADR 0026): the file comes inside the tool call (text or base64), is checked against the
 * assignment and goes through Canvas's three-step upload before the `online_upload` submission.
 */
import type { CanvasAssignment, CanvasAttachment, CanvasSubmission, Id } from './canvas-types.js';
import type { CanvasClient, CanvasUploadSlot, UploadedBytes } from './client.js';

/** Largest file `submit_file_assignment` accepts, in MB. */
export const MAX_UPLOAD_MB = 5;

/** Largest file `submit_file_assignment` accepts, in bytes. */
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  txt: 'text/plain',
  md: 'text/markdown',
  csv: 'text/csv',
  html: 'text/html',
  json: 'application/json',
  pdf: 'application/pdf',
  zip: 'application/zip',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

/** How `content` is written in the tool call. */
export type UploadEncoding = 'text' | 'base64';

/** Turns the tool's `content` into bytes: UTF-8 for text, decoded base64 (whitespace ignored) otherwise. */
export function decodeUploadContent(content: string, encoding: UploadEncoding): Uint8Array {
  if (encoding === 'text') return new TextEncoder().encode(content);
  const clean = content.replace(/\s+/g, '');
  if (clean.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) {
    throw new Error('The content is not valid base64; send text files with encoding "text".');
  }
  return Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
}

/** Lowercase extension of a file name without the dot, or `''` when it has none. */
export function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

/** MIME type for a file name, by extension (`application/octet-stream` when unknown). */
export function uploadContentType(name: string): string {
  return CONTENT_TYPES[fileExtension(name)] ?? 'application/octet-stream';
}

/** Why the extension is not accepted by the assignment's `allowed_extensions`, or `null` (empty list = any). */
export function extensionRefusal(
  allowed: readonly string[] | undefined,
  name: string,
): string | null {
  if (!allowed?.length) return null;
  const ext = fileExtension(name);
  if (allowed.some((a) => a.toLowerCase() === ext)) return null;
  const which = ext ? `".${ext}"` : 'no extension';
  return `"${name}" has ${which}; the assignment only accepts: ${allowed.join(', ')}.`;
}

/** Why the file size cannot be uploaded (empty or above `MAX_UPLOAD_BYTES`), or `null`. */
export function uploadSizeRefusal(size: number): string | null {
  if (size === 0) return 'The file is empty.';
  if (size <= MAX_UPLOAD_BYTES) return null;
  const mb = (size / 1024 / 1024).toFixed(1);
  return `The file is ${mb} MB, above the ${MAX_UPLOAD_MB} MB limit; submit it in Canvas itself.`;
}

/** Why the file cannot be submitted to the assignment (type, extension, size), or `null` when it can. */
export function uploadRefusal(
  assignment: CanvasAssignment,
  name: string,
  size: number,
): string | null {
  const types = assignment.submission_types ?? [];
  if (!types.includes('online_upload')) {
    const label = assignment.name ?? String(assignment.id);
    return `"${label}" does not accept file uploads (accepts: ${types.join(', ') || 'none'}).`;
  }
  return extensionRefusal(assignment.allowed_extensions, name) ?? uploadSizeRefusal(size);
}

/** Body of an `online_upload` submission. */
export interface OnlineUploadBody {
  readonly submission: {
    readonly submission_type: 'online_upload';
    readonly file_ids: readonly Id[];
  };
}

/** Submission body of an `online_upload` with the uploaded file IDs. */
export function onlineUploadPayload(fileIds: readonly Id[]): OnlineUploadBody {
  return { submission: { submission_type: 'online_upload', file_ids: fileIds } };
}

/** File arguments of `submit_file_assignment`. */
export interface FileSubmissionArgs {
  readonly file_name: string;
  readonly content: string;
  readonly encoding: UploadEncoding;
  readonly content_type?: string | undefined;
}

/** Builds the file to upload from the tool arguments (trimmed name, decoded bytes, type given or guessed). */
export function uploadedFileFromArgs(args: FileSubmissionArgs): UploadedBytes {
  const name = args.file_name.trim();
  const bytes = decodeUploadContent(args.content, args.encoding);
  return { name, bytes, contentType: args.content_type ?? uploadContentType(name) };
}

/** Result of a file submission returned to Claude. */
export interface FileSubmissionResult {
  readonly ok: true;
  readonly submitted_at: string | null | undefined;
  readonly attempt: number | null | undefined;
  readonly file: { readonly id: unknown; readonly name: unknown; readonly size: unknown };
}

/** Checks the assignment, uploads the file (steps 1–3) and submits it; `base` is `/courses/:c/assignments/:a`. */
export async function submitFileAssignment(
  client: CanvasClient,
  base: string,
  file: UploadedBytes,
): Promise<FileSubmissionResult> {
  const assignment = await client.get<CanvasAssignment>(base);
  const refusal = uploadRefusal(assignment, file.name, file.bytes.length);
  if (refusal !== null) throw new Error(refusal);
  const slot = await client.post<CanvasUploadSlot>(`${base}/submissions/self/files`, {
    name: file.name,
    size: file.bytes.length,
    content_type: file.contentType,
  });
  const uploaded = await client.upload<CanvasAttachment>(slot, file);
  const fileIds = [uploaded.id ?? ''];
  const s = await client.post<CanvasSubmission>(
    `${base}/submissions`,
    onlineUploadPayload(fileIds),
  );
  const summary = { id: uploaded.id, name: uploaded.display_name, size: uploaded.size };
  return { ok: true, submitted_at: s.submitted_at, attempt: s.attempt, file: summary };
}
