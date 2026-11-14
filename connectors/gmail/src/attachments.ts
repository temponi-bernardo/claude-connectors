/**
 * Reads attachments as text: the type is detected from the bytes themselves (Gmail does not return the MIME
 * type on download and the `attachmentId` changes on every read). Accepts PDF, Word, HTML and text; the
 * rest is refused.
 */
import { htmlToText } from '../../../src/core/html.js';
import { pdfToText, isPdf } from '../../../src/core/pdf.js';
import { wordToText } from '../../../src/core/word.js';
import type { AccountRef } from './accounts.js';
import type { OwnerDeps } from './context.js';
import { gmailGet, gmailUrl } from './gmail-api.js';
import { base64UrlToBytes, truncateText } from './message-format.js';

/** Largest attachment read as text (5 MB). */
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

/** Longest text returned from an attachment, in characters. */
export const MAX_ATTACHMENT_CHARS = 50_000;

/** Attachment type recognized from the bytes. */
export type AttachmentKind = 'pdf' | 'docx' | 'doc' | 'html' | 'text' | null;

/** Tells whether the text looks like real text (no control characters besides spaces and line breaks). */
export function looksLikeText(text: string): boolean {
  const sample = text.slice(0, 4096);
  let control = 0;
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);
    if (code === 0xfffd || (code < 0x20 && ![0x09, 0x0a, 0x0c, 0x0d].includes(code))) control++;
  }
  return sample.length > 0 && control / sample.length < 0.01;
}

/** Detects the attachment type from the first bytes and, for text, from the content. */
export function detectAttachmentKind(bytes: Uint8Array): AttachmentKind {
  if (isPdf(bytes)) return 'pdf';
  const magic = Array.from(bytes.subarray(0, 4), (b) => b.toString(16).padStart(2, '0')).join('');
  if (magic === '504b0304') return 'docx';
  if (magic === 'd0cf11e0') return 'doc';
  const text = new TextDecoder().decode(bytes.subarray(0, 4096));
  if (!looksLikeText(text)) return null;
  return /<html|<body|<div|<table/i.test(text) ? 'html' : 'text';
}

/** Converts the attachment bytes to text by type; throws for unsupported types. */
export async function attachmentBytesToText(bytes: Uint8Array): Promise<string> {
  const kind = detectAttachmentKind(bytes);
  if (kind === 'pdf') return pdfToText(bytes);
  if (kind === 'docx' || kind === 'doc') return wordToText(kind, bytes);
  if (kind === null) {
    throw new Error('Unsupported attachment type: only PDF, Word (.doc/.docx), HTML and text.');
  }
  const text = new TextDecoder().decode(bytes);
  return kind === 'html' ? htmlToText(text) : text;
}

/** Ids of an attachment: the message and the attachment within it. */
export interface AttachmentIds {
  readonly messageId: string;
  readonly attachmentId: string;
}

/** Downloads an attachment's bytes with the size Gmail reports (or the bytes' size, if missing). */
export async function downloadAttachment(
  deps: OwnerDeps,
  ref: AccountRef,
  ids: AttachmentIds,
): Promise<{ size: number; bytes: Uint8Array }> {
  const path = `messages/${ids.messageId}/attachments/${ids.attachmentId}`;
  const body = await gmailGet<{ size?: number; data?: string }>(deps, ref, gmailUrl(path));
  const bytes = base64UrlToBytes(body.data ?? '');
  return { size: body.size ?? bytes.length, bytes };
}

/** Downloads an attachment and returns its (capped) text; refuses attachments above 5 MB. */
export async function readAttachmentText(
  deps: OwnerDeps,
  ref: AccountRef,
  ids: AttachmentIds,
): Promise<Record<string, unknown>> {
  const { size, bytes } = await downloadAttachment(deps, ref, ids);
  if (size > MAX_ATTACHMENT_BYTES) {
    throw new Error(
      `Attachment is ${(size / 1024 / 1024).toFixed(1)} MB, above the 5 MB reading limit.`,
    );
  }
  const text = await attachmentBytesToText(bytes);
  return {
    account: ref.alias,
    message_id: ids.messageId,
    size,
    text: truncateText(text || '(no extractable text: maybe a scanned PDF)', MAX_ATTACHMENT_CHARS),
  };
}
