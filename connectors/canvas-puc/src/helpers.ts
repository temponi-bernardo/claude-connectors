/**
 * Helpers of the Canvas tools: dates, filters and composite lookups.
 */
import { startOfDayIn } from '../../../src/core/time.js';
import type { CanvasClient } from './client.js';
import type {
  CanvasCourse,
  CanvasDiscussionView,
  CanvasModule,
  CanvasSubmission,
  Id,
} from './canvas-types.js';

/** `list_assignments` filters → Canvas API `bucket` (`all` does not filter). */
export const ASSIGNMENT_BUCKETS: Readonly<Record<string, string | undefined>> = {
  all: undefined,
  upcoming: 'upcoming',
  past: 'past',
  unsubmitted: 'unsubmitted',
  overdue: 'overdue',
};

/** ISO date/time `days` days after (or before, if negative) `now`. */
export function isoDaysFrom(now: Date, days: number): string {
  return new Date(now.getTime() + days * 86_400_000).toISOString();
}

/** Time zone of PUC Minas: the student's "today" starts at 00:00 here. */
export const CANVAS_TIME_ZONE = 'America/Sao_Paulo';

/** Planner window: from 00:00 of today in São Paulo to the end of the day `days` days later. */
export function plannerWindow(now: Date, days: number): { start_date: string; end_date: string } {
  const start = startOfDayIn(now, CANVAS_TIME_ZONE);
  return { start_date: start.toISOString(), end_date: isoDaysFrom(start, days + 1) };
}

/** The `YYYY-MM-DD` part of an ISO date. */
export function dateOnly(iso: string): string {
  return iso.slice(0, 10);
}

/** Context codes (`course_<id>`) used by announcements and the calendar. */
export function courseContextCodes(ids: readonly Id[]): string[] {
  return ids.map((id) => `course_${String(id)}`);
}

/** Course id → name map, to enrich other listings. */
export function courseNameMap(courses: readonly CanvasCourse[]): Map<string, string> {
  return new Map(courses.map((c) => [String(c.id), c.name ?? '']));
}

/** Id → name map of a forum's participants. */
export function participantNames(view: CanvasDiscussionView): Map<string, string> {
  return new Map((view.participants ?? []).map((p) => [String(p.id), p.display_name ?? '']));
}

/** Decides whether a file can be read as text, by MIME type or by extension. */
export function isTextFile(contentType: string, name: string): boolean {
  return (
    /^text\/|json|xml|javascript|csv/.test(contentType) ||
    /\.(txt|md|csv|py|js|ts|java|c|cpp|h|html?)$/i.test(name)
  );
}

/** Module item found by `matchModuleItems`. */
export interface ModuleMatch {
  readonly module: string | undefined;
  readonly title: string | undefined;
  readonly type: string | undefined;
}

/** Module items whose title contains the term (case-insensitive). */
export function matchModuleItems(modules: readonly CanvasModule[], term: string): ModuleMatch[] {
  const q = term.toLowerCase();
  return modules.flatMap((m) =>
    (m.items ?? [])
      .filter((i) => i.title?.toLowerCase().includes(q))
      .map((i) => ({ module: m.name, title: i.title, type: i.type })),
  );
}

/** The student's active courses. */
export function activeCourses(client: CanvasClient): Promise<CanvasCourse[]> {
  return client.getAll<CanvasCourse>('/courses', { enrollment_state: 'active' });
}

/** The student's own submission to an assignment, with comments and rubric; `null` without access. */
export async function fetchOwnSubmission(
  client: CanvasClient,
  courseId: Id,
  assignmentId: Id,
): Promise<CanvasSubmission | null> {
  const path = `/courses/${String(courseId)}/assignments/${String(assignmentId)}/submissions/self`;
  try {
    return await client.get<CanvasSubmission>(path, {
      include: ['submission_comments', 'rubric_assessment'],
    });
  } catch {
    return null;
  }
}

/** Parallel lookup; a lookup that fails becomes an empty list instead of failing the others. */
export function getAllOrEmpty<T>(
  client: CanvasClient,
  path: string,
  params: Record<string, string | readonly string[]>,
): Promise<T[]> {
  return client.getAll<T>(path, params).catch(() => []);
}
