/**
 * Tools that act on Canvas on the student's behalf. They are only registered with `CANVAS_ALLOW_WRITE` on,
 * are annotated as destructive, and their description asks the model to confirm with the user first.
 */
import { z } from 'zod';
import { SEND_HINTS, toolAnnotations } from '../../../src/mcp/annotations.js';
import { defineTool, type ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasSubmission, Id } from './canvas-types.js';
import type { CanvasContext } from './context.js';

const id = z.union([z.string(), z.number()]);

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
