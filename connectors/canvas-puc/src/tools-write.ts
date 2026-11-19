/**
 * Tools that act on Canvas on the student's behalf. They only run when writing is on for the user (otherwise
 * they answer how to turn it on), are annotated as destructive, and their description asks the model to confirm with the user first.
 */
import { z } from 'zod';
import { SEND_HINTS, toolAnnotations } from '../../../src/mcp/annotations.js';
import { defineTool, type ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasSubmission, Id } from './canvas-types.js';
import type { CanvasContext } from './context.js';
import { MAX_UPLOAD_MB, submitFileAssignment, uploadedFileFromArgs } from './upload.js';

const id = z.union([z.string(), z.number()]);

/** Fields of a file passed inside a tool call (submissions and message attachments). */
export const FILE_FIELDS = {
  file_name: z.string().trim().min(1).max(255).describe('Name with extension, e.g. report.txt'),
  content: z.string().min(1).describe('File content: text, or base64 with encoding "base64"'),
  encoding: z.enum(['text', 'base64']).default('text'),
  content_type: z.string().min(1).optional().describe('MIME type; guessed from the extension'),
} as const;

/** Submission body for the chosen kind: text (HTML accepted) or a link. */
export function submissionPayload(
  kind: 'text' | 'url',
  content: string,
): { submission: Readonly<Record<string, string>> } {
  return kind === 'text'
    ? { submission: { submission_type: 'online_text_entry', body: content } }
    : { submission: { submission_type: 'online_url', url: content } };
}

/** Write tools. */
export const CANVAS_WRITE_TOOLS: readonly ToolSpec<CanvasContext>[] = [
  defineTool({
    name: 'submit_text_assignment',
    description:
      'SUBMITS a text or link entry to an assignment. Real action, visible to the teacher: confirm with the user first.',
    shape: {
      course_id: id,
      assignment_id: id,
      type: z.enum(['text', 'url']),
      content: z.string().min(1).describe('Text (HTML allowed) or the URL'),
    },
    annotations: toolAnnotations('Submit text assignment', SEND_HINTS),
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/assignments/${String(args.assignment_id)}/submissions`;
      const s = await client.post<CanvasSubmission>(
        path,
        submissionPayload(args.type, args.content),
      );
      return { ok: true, submitted_at: s.submitted_at, attempt: s.attempt };
    },
  }),
  defineTool({
    name: 'submit_file_assignment',
    description: `SUBMITS a file to an assignment that accepts uploads (online_upload). Real action, visible to the teacher: show the file name and content and confirm with the user first. Pass the file in content: plain text with encoding "text" (e.g. a .txt report), or base64 with encoding "base64". At most ${MAX_UPLOAD_MB} MB; the extension must be in the assignment's allowed_extensions.`,
    shape: {
      course_id: id,
      assignment_id: id,
      ...FILE_FIELDS,
    },
    annotations: toolAnnotations('Submit file assignment', SEND_HINTS),
    run: ({ client }, args) => {
      const base = `/courses/${String(args.course_id)}/assignments/${String(args.assignment_id)}`;
      return submitFileAssignment(client, base, uploadedFileFromArgs(args));
    },
  }),
  defineTool({
    name: 'reply_to_discussion',
    description:
      'POSTS a reply to a discussion forum. Real action, visible to the class: confirm with the user first.',
    shape: { course_id: id, topic_id: id, message: z.string().min(1) },
    annotations: toolAnnotations('Reply to discussion', SEND_HINTS),
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/discussion_topics/${String(args.topic_id)}/entries`;
      const entry = await client.post<{ id: Id; created_at?: string }>(path, {
        message: args.message,
      });
      return { ok: true, id: entry.id, created_at: entry.created_at };
    },
  }),
];
