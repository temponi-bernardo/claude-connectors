/**
 * Change detection for the Canvas listings: a `changed_since` cursor returns only what changed after it,
 * so a client that keeps a local snapshot (the semester plan, a routine) re-reads only the deltas.
 * Stateless on purpose: the cursor travels with the call and nothing about the user is stored server side.
 */
import { z } from 'zod';
import { rawToolResult, textResult, type RawToolResult } from '../../../src/mcp/tools.js';
import type {
  CanvasAnnouncement,
  CanvasAssignment,
  CanvasConversation,
  CanvasDiscussionTopic,
} from './canvas-types.js';

/** Timestamps an item may carry (any may be missing). */
export type Stamps = readonly (string | null | undefined)[];

/** Optional `changed_since` argument shared by the listings that support change detection. */
export const changedSinceArg = z
  .string()
  .datetime({ offset: true })
  .optional()
  .describe(
    'Only return items created or changed at or after this ISO time (the cursor a previous call returned); omit for everything',
  );

/** Latest valid timestamp of an item in milliseconds, or NaN when it has none. */
export function latestStamp(stamps: Stamps): number {
  const times = stamps.map((s) => (s ? Date.parse(s) : NaN)).filter((t) => !Number.isNaN(t));
  return times.length > 0 ? Math.max(...times) : NaN;
}

/** Items changed at or after `since`; items with no date stay (conservative); no cursor keeps all. */
export function keepChanged<T>(
  items: readonly T[],
  since: string | undefined,
  stampsOf: (item: T) => Stamps,
): readonly T[] {
  if (since === undefined) return items;
  const cursor = Date.parse(since);
  return items.filter((item) => {
    const latest = latestStamp(stampsOf(item));
    return Number.isNaN(latest) || latest >= cursor;
  });
}

/** Dates that change an assignment for the student: its edit, the submission and the grading. */
export function assignmentStamps(a: CanvasAssignment): Stamps {
  return [a.updated_at, a.submission?.submitted_at, a.submission?.graded_at];
}

/** Date of an announcement. */
export function announcementStamps(a: CanvasAnnouncement): Stamps {
  return [a.posted_at];
}

/** Dates of a forum: when it was posted and its last reply. */
export function topicStamps(t: CanvasDiscussionTopic): Stamps {
  return [t.posted_at, t.last_reply_at];
}

/** Date of the last message of an inbox conversation. */
export function conversationStamps(c: CanvasConversation): Stamps {
  return [c.last_message_at];
}

/** Note with the cursor for the next call (`checked_at`, taken before reading Canvas). */
export function checkedAtNote(now: Date): string {
  return `checked_at=${now.toISOString()} (pass it as changed_since next time to get only what changed)`;
}

/** Tool result with the data and the `checked_at` note. */
export function withCheckedAt(data: unknown, now: Date): RawToolResult {
  return rawToolResult(textResult(data, [checkedAtNote(now)]));
}
