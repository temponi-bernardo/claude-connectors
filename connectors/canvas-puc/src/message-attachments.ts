/**
 * Attachments of Canvas inbox messages: files come inside the tool call (text or base64), are all checked before
 * anything is uploaded, then go through the three-step upload to the user's "conversation attachments" folder;
 * the message is only sent once every file is in. File contents are never logged.
 */
import type { CanvasAttachment, Id } from './canvas-types.js';
import type { CanvasClient, UploadedBytes } from './client.js';
import { errorMessage } from '../../../src/core/redact.js';
import {
  MAX_UPLOAD_MB,
  uploadCanvasFile,
  uploadedFileFromArgs,
  uploadSizeRefusal,
  type FileSubmissionArgs,
} from './upload.js';

/** Most files one message may carry. */
export const MAX_MESSAGE_ATTACHMENTS = 5;

/** Canvas folder of the user's inbox attachments (the API's `parent_folder_path`). */
export const CONVERSATION_ATTACHMENTS_FOLDER = 'conversation attachments';

/** Step-1 endpoint of a file in the user's own files. */
export const USER_FILES_PATH = '/users/self/files';

/** Why the files cannot be attached (the first empty or oversized one, by name), or null when all can. */
export function attachmentsRefusal(files: readonly UploadedBytes[]): string | null {
  for (const file of files) {
    const refusal = uploadSizeRefusal(file.bytes.length);
    if (refusal !== null) return `Attachment "${file.name}": ${refusal} Nothing was sent.`;
  }
  return null;
}

/** Decodes and checks the attachments of a tool call; throws (before any upload) when one cannot go. */
export function prepareAttachments(
  list: readonly FileSubmissionArgs[] | undefined,
): UploadedBytes[] {
  const files = (list ?? []).map(uploadedFileFromArgs);
  const refusal = attachmentsRefusal(files);
  if (refusal !== null) throw new Error(refusal);
  return files;
}

/** Error of a failed attachment upload: which file and that the message was not sent. */
export function attachmentUploadError(name: string, error: unknown): Error {
  return new Error(
    `Could not upload attachment "${name}" (${errorMessage(error)}). Nothing was sent.`,
  );
}

/** Uploads one attachment to the conversation attachments folder (steps 1–3). */
export async function uploadMessageAttachment(
  client: CanvasClient,
  file: UploadedBytes,
): Promise<CanvasAttachment> {
  const extra = { parent_folder_path: CONVERSATION_ATTACHMENTS_FOLDER, on_duplicate: 'rename' };
  try {
    return await uploadCanvasFile(client, { path: USER_FILES_PATH, file, extra });
  } catch (error) {
    throw attachmentUploadError(file.name, error);
  }
}

/** Uploads the attachments one by one, in order; stops at the first failure. */
export async function uploadMessageAttachments(
  client: CanvasClient,
  files: readonly UploadedBytes[],
): Promise<CanvasAttachment[]> {
  const uploaded: CanvasAttachment[] = [];
  for (const file of files) uploaded.push(await uploadMessageAttachment(client, file));
  return uploaded;
}

/** IDs of the uploaded files, for the message's `attachment_ids`. */
export function attachmentIds(uploaded: readonly CanvasAttachment[]): Id[] {
  return uploaded.map((file) => file.id ?? '').filter((id) => id !== '');
}

/** Short view of the attached files returned to Claude (id, name, size). */
export function attachmentSummary(uploaded: readonly CanvasAttachment[]): readonly unknown[] {
  return uploaded.map((f) => ({ id: f.id, name: f.display_name, size: f.size }));
}

/** Text of the attachments limit, for the tool descriptions. */
export const ATTACHMENTS_LIMIT_TEXT = `up to ${String(MAX_MESSAGE_ATTACHMENTS)} files of at most ${String(MAX_UPLOAD_MB)} MB each`;
