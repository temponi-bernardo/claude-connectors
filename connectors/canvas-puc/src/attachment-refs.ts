/**
 * Message attachments that do not travel inside the tool call (ADR 0028): files already in Canvas, referenced by
 * id and copied into the user's "conversation attachments" folder when needed, and files on the user's computer,
 * sent straight to Canvas with a one-time `curl` command so their bytes never pass through Claude or the Worker.
 */
import type { CanvasAttachment, Id } from './canvas-types.js';
import type { CanvasClient, CanvasUploadSlot } from './client.js';
import { errorMessage } from '../../../src/core/redact.js';
import {
  CONVERSATION_ATTACHMENTS_FOLDER,
  MAX_MESSAGE_ATTACHMENTS,
  prepareAttachments,
  uploadMessageAttachments,
  USER_FILES_PATH,
} from './message-attachments.js';
import { uploadContentType, type FileSubmissionArgs } from './upload.js';

/** Largest file `prepare_attachment_upload` accepts, in MB (the bytes go straight to Canvas). */
export const MAX_DIRECT_UPLOAD_MB = 25;

/** Largest file `prepare_attachment_upload` accepts, in bytes. */
export const MAX_DIRECT_UPLOAD_BYTES = MAX_DIRECT_UPLOAD_MB * 1024 * 1024;

/** Placeholder the user's file path replaces in the returned `curl` command. */
export const LOCAL_PATH_PLACEHOLDER = '<LOCAL_FILE_PATH>';

/** API path that resolves the user's conversation attachments folder. */
export const CONVERSATION_FOLDER_PATH = `/users/self/folders/by_path/${encodeURIComponent(CONVERSATION_ATTACHMENTS_FOLDER)}`;

/** Why the message cannot carry this many files (inline plus by id), or null when it can. */
export function attachmentCountRefusal(inline: number, byId: number): string | null {
  if (inline + byId <= MAX_MESSAGE_ATTACHMENTS) return null;
  return `A message carries at most ${String(MAX_MESSAGE_ATTACHMENTS)} attachments (got ${String(inline + byId)}). Nothing was sent.`;
}

/** Id of the user's conversation attachments folder: the last folder of the resolved path. */
export async function conversationFolderId(client: CanvasClient): Promise<Id> {
  let folders: readonly { readonly id?: Id }[];
  try {
    folders = await client.get<{ id?: Id }[]>(CONVERSATION_FOLDER_PATH);
  } catch (error) {
    throw new Error(
      `Could not find the "${CONVERSATION_ATTACHMENTS_FOLDER}" folder (${errorMessage(error)}); use prepare_attachment_upload instead. Nothing was sent.`,
      { cause: error },
    );
  }
  const id = folders.at(-1)?.id;
  if (id === undefined)
    throw new Error(
      `Canvas returned no "${CONVERSATION_ATTACHMENTS_FOLDER}" folder. Nothing was sent.`,
    );
  return id;
}

/** Reads one Canvas file the user can access; throws a clear error when it is missing or not allowed. */
export async function fetchAttachmentFile(
  client: CanvasClient,
  fileId: Id,
): Promise<CanvasAttachment> {
  try {
    return await client.get<CanvasAttachment>(`/files/${String(fileId)}`);
  } catch (error) {
    throw new Error(
      `Canvas file ${String(fileId)} is not accessible (${errorMessage(error)}). Nothing was sent.`,
      { cause: error },
    );
  }
}

/** Whether the file must be copied into the conversation attachments folder before it can be attached. */
export function needsConversationCopy(file: CanvasAttachment, folderId: Id): boolean {
  return String(file.folder_id) !== String(folderId);
}

/** Copies a file into the conversation attachments folder (renaming on a name clash) and returns the copy. */
export function copyToConversationFolder(
  client: CanvasClient,
  file: CanvasAttachment,
  folderId: Id,
): Promise<CanvasAttachment> {
  const body = { source_file_id: String(file.id), on_duplicate: 'rename' };
  return client.post<CanvasAttachment>(`/folders/${String(folderId)}/copy_file`, body);
}

/** Turns file ids into attachable files: checks every one first, then copies those outside the folder. */
export async function resolveFileAttachments(
  client: CanvasClient,
  fileIds: readonly Id[] | undefined,
): Promise<CanvasAttachment[]> {
  if (!fileIds?.length) return [];
  const folderId = await conversationFolderId(client);
  const files: CanvasAttachment[] = [];
  for (const fileId of fileIds) files.push(await fetchAttachmentFile(client, fileId));
  const ready: CanvasAttachment[] = [];
  for (const file of files) {
    ready.push(
      needsConversationCopy(file, folderId)
        ? await copyToConversationFolder(client, file, folderId)
        : file,
    );
  }
  return ready;
}

/** Attachments of a send or reply: files inside the call and Canvas file ids. */
export interface MessageAttachmentArgs {
  readonly attachments?: readonly FileSubmissionArgs[] | undefined;
  readonly file_ids?: readonly Id[] | undefined;
}

/** Checks every attachment, then uploads the inline files and readies the ids; nothing is sent on a failure. */
export async function collectMessageAttachments(
  client: CanvasClient,
  args: MessageAttachmentArgs,
): Promise<CanvasAttachment[]> {
  const refusal = attachmentCountRefusal(args.attachments?.length ?? 0, args.file_ids?.length ?? 0);
  if (refusal !== null) throw new Error(refusal);
  const files = prepareAttachments(args.attachments);
  const referenced = await resolveFileAttachments(client, args.file_ids);
  return [...(await uploadMessageAttachments(client, files)), ...referenced];
}

/** Quotes a value for a POSIX shell (single quotes, inner quotes escaped). */
export function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/** `curl` command that sends a local file to an upload slot: Canvas's fields as plain strings, the file last. */
export function curlUploadCommand(slot: CanvasUploadSlot): string {
  const fields = Object.entries(slot.upload_params ?? {}).map(
    ([key, value]) => `--form-string ${shellQuote(`${key}=${value}`)}`,
  );
  const file = `-F ${shellQuote('file=@')}"${LOCAL_PATH_PLACEHOLDER}"`;
  return ['curl -sS -X POST', shellQuote(slot.upload_url), ...fields, file].join(' ');
}

/** Arguments of `prepare_attachment_upload` after validation. */
export interface DirectUploadArgs {
  readonly file_name: string;
  readonly size: number;
  readonly content_type?: string | undefined;
}

/** Steps Claude follows after asking for an upload slot. */
export const DIRECT_UPLOAD_NEXT_STEPS = `Run the curl command on the machine that has the file, replacing ${LOCAL_PATH_PLACEHOLDER} with its path (keep the double quotes). It prints the file as JSON: pass its "id" in file_ids of send_message or reply_message. The slot is single-use and expires in minutes; ask for a new one if it fails.`;

/** Asks Canvas for an upload slot in the conversation attachments folder and returns the `curl` to fill it. */
export async function prepareAttachmentUpload(
  client: CanvasClient,
  args: DirectUploadArgs,
): Promise<Readonly<Record<string, unknown>>> {
  const name = args.file_name.trim();
  const slot = await client.post<CanvasUploadSlot>(USER_FILES_PATH, {
    name,
    size: args.size,
    content_type: args.content_type ?? uploadContentType(name),
    parent_folder_path: CONVERSATION_ATTACHMENTS_FOLDER,
    on_duplicate: 'rename',
  });
  return { file_name: name, curl: curlUploadCommand(slot), next_steps: DIRECT_UPLOAD_NEXT_STEPS };
}
