/**
 * Turns Canvas responses into lean objects, with English keys, for the model.
 * All pure: takes the API JSON and returns only the useful fields.
 */
import { htmlToText } from '../../../src/core/html.js';
import { canvasHtml, type CanvasLink } from './links.js';
import type {
  CanvasAnnouncement,
  CanvasAssignment,
  CanvasAttachment,
  CanvasCalendarEvent,
  CanvasCourse,
  CanvasDiscussionEntry,
  CanvasDiscussionTopic,
  CanvasEnrollment,
  CanvasModule,
  CanvasModuleItem,
  CanvasPlannerItem,
  CanvasProfile,
  CanvasRubricCriterion,
  CanvasSubmission,
  CanvasSubmissionFlags,
} from './canvas-types.js';

/** View object returned to the model (serialized as JSON). */
export type View = Readonly<Record<string, unknown>>;

/** Maximum length of long texts (announcements, descriptions) returned to the model. */
export const MAX_TEXT_LENGTH = 3000;

/** Converts HTML to text and cuts it at `MAX_TEXT_LENGTH`. */
export function shortText(html: string | null | undefined): string {
  return htmlToText(html).slice(0, MAX_TEXT_LENGTH);
}

/** `{ [key]: html }` when the raw HTML was asked for (`raw_html: true`), else `{}`; spread into a view. */
export function rawHtmlField(key: string, html: string | null | undefined, wanted: boolean): View {
  return wanted ? { [key]: html ?? '' } : {};
}

/** `{ links }` when there are links, else `{}`: keeps long lists (forum posts) lean. */
export function linksField(links: readonly CanvasLink[]): View {
  return links.length > 0 ? { links } : {};
}

/** Profile of the signed-in user. */
export function toProfile(p: CanvasProfile): View {
  return {
    id: p.id,
    name: p.name,
    email: p.primary_email,
    login: p.login_id,
    time_zone: p.time_zone,
  };
}

/** Course with the current grade of the student's enrollment. */
export function toCourse(c: CanvasCourse): View {
  const enrollment: CanvasEnrollment = c.enrollments?.[0] ?? {};
  return {
    id: c.id,
    name: c.name,
    code: c.course_code,
    term: c.term?.name,
    current_score: enrollment.computed_current_score ?? null,
    current_grade: enrollment.computed_current_grade ?? null,
  };
}

/** Submission status of a planner item (`null` when the item has no submission). */
export function toSubmissionFlags(flags: CanvasSubmissionFlags | false | undefined): View | null {
  if (!flags) return null;
  return {
    submitted: flags.submitted,
    late: flags.late,
    missing: flags.missing,
    graded: flags.graded,
  };
}

/** Item of the student's planner (assignment, quiz, event) with an absolute link. */
export function toPlannerItem(i: CanvasPlannerItem, baseUrl: string): View {
  return {
    type: i.plannable_type,
    title: i.plannable?.title ?? i.plannable?.name,
    course: i.context_name,
    course_id: i.course_id,
    id: i.plannable_id,
    date: i.plannable_date,
    points: i.plannable?.points_possible,
    submission: toSubmissionFlags(i.submissions),
    url: i.html_url ? `${baseUrl}${i.html_url}` : undefined,
  };
}

/** Assignment in a listing, with the status and score of the student's submission. */
export function toAssignmentSummary(a: CanvasAssignment): View {
  const s: CanvasSubmission = a.submission ?? {};
  return {
    id: a.id,
    name: a.name,
    due_at: a.due_at,
    points: a.points_possible,
    submission_types: a.submission_types,
    status: s.workflow_state,
    score: s.score ?? null,
    late: s.late ?? null,
    missing: s.missing ?? null,
    url: a.html_url,
  };
}

/** Rubric criterion with its ratings as `points: description`. */
export function toRubricCriterion(r: CanvasRubricCriterion): View {
  const levels = (r.ratings ?? []).map((x) => `${String(x.points)}: ${String(x.description)}`);
  return { criterion: r.description, points: r.points, ratings: levels };
}

/** Attachment (submitted file or course file) with its size in KB. */
export function toFileInfo(f: CanvasAttachment): View {
  return {
    id: f.id,
    name: f.display_name,
    content_type: f['content-type'],
    size_kb: Math.round((f.size ?? 0) / 1024),
    updated_at: f.updated_at,
    download: f.url,
  };
}

/** The student's submission with score, teacher comments, rubric and attachments. */
export function toSubmissionDetail(s: CanvasSubmission): View {
  return {
    status: s.workflow_state,
    submitted_at: s.submitted_at,
    score: s.score,
    grade: s.grade,
    late: s.late,
    comments: (s.submission_comments ?? []).map((c) => ({
      author: c.author_name,
      text: c.comment,
      date: c.created_at,
    })),
    rubric_assessment: s.rubric_assessment ?? null,
    attachments: (s.attachments ?? []).map(toFileInfo),
  };
}

/** Full assignment: description as text with `[link N]` marks, its links, dates, rubric and submission. */
export function toAssignmentDetail(
  a: CanvasAssignment,
  submission: CanvasSubmission | null,
  baseUrl: string,
): View {
  const description = canvasHtml(a.description, baseUrl);
  return {
    id: a.id,
    name: a.name,
    due_at: a.due_at,
    unlock_at: a.unlock_at,
    lock_at: a.lock_at,
    points: a.points_possible,
    submission_types: a.submission_types,
    allowed_extensions: a.allowed_extensions,
    description: description.text,
    links: description.links,
    rubric: (a.rubric ?? []).map(toRubricCriterion),
    submission: submission ? toSubmissionDetail(submission) : null,
    url: a.html_url,
  };
}

/** Score of an assignment (from `students/submissions` with `include[]=assignment`). */
export function toGradeRow(s: CanvasSubmission): View {
  return {
    assignment: s.assignment?.name,
    assignment_id: s.assignment_id,
    score: s.score,
    points_possible: s.assignment?.points_possible,
    grade: s.grade,
    status: s.workflow_state,
    due_at: s.assignment?.due_at,
  };
}

/** Grade summary of an enrollment, with the course name. */
export function toEnrollmentGrade(
  e: CanvasEnrollment,
  courseNames: ReadonlyMap<string, string>,
): View {
  return {
    course_id: e.course_id,
    course: courseNames.get(String(e.course_id)),
    current_score: e.grades?.current_score,
    current_grade: e.grades?.current_grade,
    final_score: e.grades?.final_score,
  };
}

/** Course announcement with its text converted and cut, and the links of the whole message. */
export function toAnnouncement(a: CanvasAnnouncement, baseUrl: string): View {
  const message = canvasHtml(a.message, baseUrl);
  return {
    id: a.id,
    title: a.title,
    course: a.context_code,
    author: a.author?.display_name ?? a.user_name,
    posted_at: a.posted_at,
    text: message.text.slice(0, MAX_TEXT_LENGTH),
    links: message.links,
    url: a.html_url,
  };
}

/** Module item (lesson, file, page, assignment). */
export function toModuleItem(i: CanvasModuleItem): View {
  return {
    id: i.id,
    type: i.type,
    title: i.title,
    content_id: i.content_id,
    page_url: i.page_url,
    external_url: i.external_url,
    completed: i.completion_requirement?.completed ?? null,
  };
}

/** Module with its items. */
export function toModule(m: CanvasModule): View {
  return { id: m.id, name: m.name, items: (m.items ?? []).map(toModuleItem) };
}

/** Discussion forum in a listing. */
export function toDiscussionSummary(d: CanvasDiscussionTopic): View {
  return {
    id: d.id,
    title: d.title,
    due_at: d.assignment?.due_at ?? null,
    reply_count: d.discussion_subentry_count,
    unread_count: d.unread_count,
    last_reply_at: d.last_reply_at,
    url: d.html_url,
  };
}

/** What `flattenDiscussion` needs besides the entries: participant names and the Canvas base URL. */
export interface DiscussionContext {
  readonly names: ReadonlyMap<string, string>;
  readonly baseUrl: string;
}

/** Flattens a forum's post tree, marking the depth of each reply and keeping the links of each post. */
export function flattenDiscussion(
  entries: readonly CanvasDiscussionEntry[] | undefined,
  ctx: DiscussionContext,
  depth = 0,
): View[] {
  return (entries ?? []).flatMap((e) => {
    const message = canvasHtml(e.message, ctx.baseUrl);
    const post = {
      depth,
      author: ctx.names.get(String(e.user_id)),
      date: e.created_at,
      text: message.text,
      ...linksField(message.links),
    };
    return [post, ...flattenDiscussion(e.replies, ctx, depth + 1)];
  });
}

/** Calendar event with a short text description. */
export function toCalendarEvent(e: CanvasCalendarEvent): View {
  return {
    title: e.title,
    start_at: e.start_at,
    end_at: e.end_at,
    location: e.location_name,
    course: e.context_name,
    description: shortText(e.description).slice(0, 1000),
  };
}
