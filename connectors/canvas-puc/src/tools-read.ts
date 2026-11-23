/**
 * Canvas read tools (profile, courses, planner, assignments, grades, announcements, content, forums).
 */
import { z } from 'zod';
import { READ_ONLY_HINTS, toolAnnotations } from '../../../src/mcp/annotations.js';
import { defineTool, rawToolResult, textResult, type ToolSpec } from '../../../src/mcp/tools.js';
import type {
  CanvasAnnouncement,
  CanvasAssignment,
  CanvasAttachment,
  CanvasCalendarEvent,
  CanvasCourse,
  CanvasDiscussionTopic,
  CanvasDiscussionView,
  CanvasEnrollment,
  CanvasModule,
  CanvasPage,
  CanvasPlannerItem,
  CanvasProfile,
  CanvasSubmission,
} from './canvas-types.js';
import type { CanvasContext } from './context.js';
import { MAX_CHUNK_BYTES } from './chunks.js';
import { resolveCanvasFile } from './file-ref.js';
import { downloadCanvasFile, MAX_DOWNLOAD_MB, readCanvasFileText } from './files.js';
import * as f from './format.js';
import * as h from './helpers.js';
import { listFilesWithLinked, listLinkedFiles, LIST_FILES_HINT } from './linked-files.js';
import { canvasHtml } from './links.js';
import { canvasIdSchema, listPeerReviews } from './peer-reviews.js';

const id = z.union([z.string(), z.number()]);
const courseId = id.describe('Course ID (see list_courses)');
const rawHtml = z
  .boolean()
  .optional()
  .describe('Also return the original HTML, for debugging (default false)');

/** How to point to a file: `file_id`, a Canvas file `url` (from `links`) or both, plus the course. */
export const fileRefShape = {
  file_id: id.optional().describe('File ID (from list_files, list_linked_files or a link file_id)'),
  url: z
    .string()
    .max(2048)
    .optional()
    .describe('Full Canvas file link (the url of a file link); its verifier opens hidden files'),
  course_id: courseId.optional(),
} as const;

/** Arguments of `download_file`, shared with its streamed version in remote mode (ADR 0023, 0024). */
export const downloadFileShape = {
  ...fileRefShape,
  offset: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe(
      'First byte to return, for files sent in parts (use the offset given by the previous part)',
    ),
  length: z
    .number()
    .int()
    .min(1)
    .max(MAX_CHUNK_BYTES)
    .optional()
    .describe('Bytes to return (default and maximum 8 MB)'),
} as const;

/** Read tools, in the order the model sees them. */
export const CANVAS_READ_TOOLS: readonly ToolSpec<CanvasContext>[] = [
  defineTool({
    name: 'whoami',
    description: "Show the signed-in user's Canvas profile (useful to test the connection).",
    shape: {},
    annotations: toolAnnotations('Who am I', READ_ONLY_HINTS),
    run: async ({ client }) => f.toProfile(await client.get<CanvasProfile>('/users/self/profile')),
  }),
  defineTool({
    name: 'list_courses',
    description: "List the student's courses with the current grade. Active ones only by default.",
    shape: { include_completed: z.boolean().optional().describe('Include courses that ended') },
    annotations: toolAnnotations('List courses', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const state = args.include_completed ? undefined : 'active';
      const params = { include: ['term', 'total_scores'], enrollment_state: state };
      const courses = await client.getAll<CanvasCourse>('/courses', params);
      return courses.filter((c) => c.name).map(f.toCourse);
    },
  }),
  defineTool({
    name: 'upcoming_assignments',
    description:
      "What is due from today (00:00 São Paulo time) through the next days across all courses: every item of the student's planner — assignments, quizzes, discussions, events, notes and peer reviews to do (type peer_review; details with list_peer_reviews).",
    shape: {
      days: z.number().int().min(1).max(120).optional().describe('Days after today (default 14)'),
    },
    annotations: toolAnnotations('Upcoming assignments', READ_ONLY_HINTS),
    run: async ({ client, now }, args) => {
      const params = h.plannerWindow(now(), args.days ?? 14);
      const items = await client.getAll<CanvasPlannerItem>('/planner/items', params);
      return items.map((i) => f.toPlannerItem(i, client.baseUrl));
    },
  }),
  defineTool({
    name: 'list_assignments',
    description: 'List the assignments of a course with due date, submission status and score.',
    shape: {
      course_id: courseId,
      filter: z.enum(['all', 'upcoming', 'past', 'unsubmitted', 'overdue']).optional(),
    },
    annotations: toolAnnotations('List assignments', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const params = {
        include: ['submission'],
        order_by: 'due_at',
        bucket: h.ASSIGNMENT_BUCKETS[args.filter ?? 'all'],
      };
      const list = await client.getAll<CanvasAssignment>(
        `/courses/${String(args.course_id)}/assignments`,
        params,
      );
      return list.map(f.toAssignmentSummary);
    },
  }),
  defineTool({
    name: 'get_assignment',
    description:
      "Assignment details: description as text with [link N] marks, its links (embedded files, videos, pages; open files with download_file), rubric, dates and the student's submission and feedback.",
    shape: { course_id: courseId, assignment_id: id, raw_html: rawHtml },
    annotations: toolAnnotations('Get assignment', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/assignments/${String(args.assignment_id)}`;
      const [assignment, submission] = await Promise.all([
        client.get<CanvasAssignment>(path),
        h.fetchOwnSubmission(client, args.course_id, args.assignment_id),
      ]);
      return {
        ...f.toAssignmentDetail(assignment, submission, client.baseUrl),
        ...f.rawHtmlField('description_html', assignment.description, args.raw_html === true),
      };
    },
  }),
  defineTool({
    name: 'list_peer_reviews',
    description:
      'Peer reviews the student must do (pending and completed): course, assignment, review due date, who is reviewed (Canvas hides the name when the instructor made reviews anonymous), the URL or files the reviewee sent and the link to the review page. Read-only: it never submits a review. Without course_id, sweeps every active course.',
    shape: {
      course_id: canvasIdSchema
        .optional()
        .describe('Course ID (see list_courses); omit to sweep every active course'),
      assignment_id: canvasIdSchema
        .optional()
        .describe('Assignment ID, to read a single assignment'),
    },
    annotations: toolAnnotations('List peer reviews', READ_ONLY_HINTS),
    run: ({ client }, args) => listPeerReviews(client, args),
  }),
  defineTool({
    name: 'get_grades',
    description:
      "The student's grades. Without course_id: summary of every active course. With course_id: the score of each assignment.",
    shape: { course_id: courseId.optional() },
    annotations: toolAnnotations('Get grades', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      if (args.course_id === undefined) {
        const params = { type: ['StudentEnrollment'], state: ['active'] };
        const [enrollments, courses] = await Promise.all([
          client.getAll<CanvasEnrollment>('/users/self/enrollments', params),
          h.activeCourses(client),
        ]);
        return enrollments.map((e) => f.toEnrollmentGrade(e, h.courseNameMap(courses)));
      }
      const path = `/courses/${String(args.course_id)}/students/submissions`;
      const subs = await client.getAll<CanvasSubmission>(path, {
        student_ids: ['self'],
        include: ['assignment'],
      });
      return subs.filter((s) => s.assignment).map(f.toGradeRow);
    },
  }),
  defineTool({
    name: 'list_announcements',
    description: 'Recent announcements of one course or of every active course.',
    shape: {
      course_id: courseId.optional().describe('When omitted, searches every active course'),
      days: z.number().int().min(1).max(365).optional().describe('Days back (default 30)'),
      raw_html: rawHtml,
    },
    annotations: toolAnnotations('List announcements', READ_ONLY_HINTS),
    run: async ({ client, now }, args) => {
      const ids =
        args.course_id !== undefined
          ? [args.course_id]
          : (await h.activeCourses(client)).map((c) => c.id);
      if (ids.length === 0) return [];
      const params = {
        context_codes: h.courseContextCodes(ids),
        start_date: h.isoDaysFrom(now(), -(args.days ?? 30)),
        end_date: now().toISOString(),
      };
      return (await client.getAll<CanvasAnnouncement>('/announcements', params)).map((a) => ({
        ...f.toAnnouncement(a, client.baseUrl),
        ...f.rawHtmlField('message_html', a.message, args.raw_html === true),
      }));
    },
  }),
  defineTool({
    name: 'list_modules',
    description:
      'Modules of a course and the items of each one (lessons, files, pages, assignments).',
    shape: { course_id: courseId },
    annotations: toolAnnotations('List modules', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/modules`;
      return (await client.getAll<CanvasModule>(path, { include: ['items'] })).map(f.toModule);
    },
  }),
  defineTool({
    name: 'get_page',
    description:
      "Read a course page as text with [link N] marks and its links (files, videos, pages). Use the page_url from list_modules, or 'front_page' for the home page.",
    shape: { course_id: courseId, page_url: z.string(), raw_html: rawHtml },
    annotations: toolAnnotations('Get page', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/pages/${encodeURIComponent(args.page_url)}`;
      const p = await client.get<CanvasPage>(path);
      const body = canvasHtml(p.body, client.baseUrl);
      return {
        title: p.title,
        updated_at: p.updated_at,
        body: body.text,
        links: body.links,
        url: p.html_url,
        ...f.rawHtmlField('body_html', p.body, args.raw_html === true),
      };
    },
  }),
  defineTool({
    name: 'list_files',
    description:
      'Files of a course (PDFs, slides etc.) with a download link, newest first. Canvas hides hidden or locked files from students here; files embedded in assignments and pages come with include_linked or list_linked_files.',
    shape: {
      course_id: courseId,
      search: z.string().min(2).optional().describe('Part of the file name'),
      include_linked: z
        .boolean()
        .optional()
        .describe(
          'Also add the files linked from assignments, pages, forums and modules that this list misses',
        ),
    },
    annotations: toolAnnotations('List files', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const params = { search_term: args.search, sort: 'updated_at', order: 'desc' };
      const files = await client.getAll<CanvasAttachment>(
        `/courses/${String(args.course_id)}/files`,
        params,
      );
      const listed = files.map(f.toFileInfo);
      if (!args.include_linked) return rawToolResult(textResult(listed, [LIST_FILES_HINT]));
      return listFilesWithLinked(client, args.course_id, listed);
    },
  }),
  defineTool({
    name: 'list_linked_files',
    description:
      'Every file and video the content of a course points to (assignment descriptions, pages, forums, announcements and module items), one entry per file with where it appears. Finds files the teacher embedded but hid from list_files; open them with download_file.',
    shape: { course_id: courseId },
    annotations: toolAnnotations('List linked files', READ_ONLY_HINTS),
    run: ({ client }, args) => listLinkedFiles(client, args.course_id),
  }),
  defineTool({
    name: 'read_file_text',
    description:
      'Read a course file as text (txt, md, csv, code, html, doc and docx), by file_id or by a Canvas file url from links (works for files hidden from list_files). For PDF or slides, use download_file.',
    shape: fileRefShape,
    annotations: toolAnnotations('Read file as text', READ_ONLY_HINTS),
    run: async ({ client }, args) =>
      readCanvasFileText(client, await resolveCanvasFile(client, args)),
  }),
  defineTool({
    name: 'download_file',
    description: `Download a course file (PDF, slides, image etc., up to ${MAX_DOWNLOAD_MB} MB) and bring its content into the conversation. Pass file_id or a Canvas file url from links (works for files hidden from list_files; tries the course, global and verifier endpoints).`,
    shape: downloadFileShape,
    annotations: toolAnnotations('Download file', READ_ONLY_HINTS),
    run: async ({ client }, args) =>
      downloadCanvasFile(client, await resolveCanvasFile(client, args), args),
  }),
  defineTool({
    name: 'list_discussions',
    description: 'List the discussion forums of a course.',
    shape: { course_id: courseId },
    annotations: toolAnnotations('List discussions', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/discussion_topics`;
      return (await client.getAll<CanvasDiscussionTopic>(path)).map(f.toDiscussionSummary);
    },
  }),
  defineTool({
    name: 'get_discussion',
    description:
      'Read a discussion forum: its prompt and every post, with the depth of each reply and the links of each one.',
    shape: { course_id: courseId, topic_id: id, raw_html: rawHtml },
    annotations: toolAnnotations('Get discussion', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/discussion_topics/${String(args.topic_id)}`;
      const [topic, view] = await Promise.all([
        client.get<CanvasDiscussionTopic>(path),
        client.get<CanvasDiscussionView>(`${path}/view`).catch((): CanvasDiscussionView => ({})),
      ]);
      const names = h.participantNames(view);
      const posts = f.flattenDiscussion(view.view, { names, baseUrl: client.baseUrl });
      const prompt = canvasHtml(topic.message, client.baseUrl);
      return {
        title: topic.title,
        description: prompt.text,
        links: prompt.links,
        posts,
        ...f.rawHtmlField('description_html', topic.message, args.raw_html === true),
      };
    },
  }),
  defineTool({
    name: 'get_calendar',
    description:
      'Calendar events (classes, scheduled exams) in a date range, from every active course.',
    shape: {
      start_date: z.string().optional().describe('Start date YYYY-MM-DD (default today)'),
      end_date: z.string().optional().describe('End date YYYY-MM-DD (default +30 days)'),
    },
    annotations: toolAnnotations('Get calendar', READ_ONLY_HINTS),
    run: async ({ client, now }, args) => {
      const ids = (await h.activeCourses(client)).map((c) => c.id);
      const params = {
        type: 'event',
        start_date: args.start_date ?? h.dateOnly(now().toISOString()),
        end_date: args.end_date ?? h.dateOnly(h.isoDaysFrom(now(), 30)),
        context_codes: ['user_self', ...h.courseContextCodes(ids)].slice(0, 10),
      };
      return (await client.getAll<CanvasCalendarEvent>('/calendar_events', params)).map(
        f.toCalendarEvent,
      );
    },
  }),
  defineTool({
    name: 'search',
    description:
      'Search a term in the names of the assignments, pages, files and module items of a course.',
    shape: { course_id: courseId, term: z.string().min(2) },
    annotations: toolAnnotations('Search course', READ_ONLY_HINTS),
    run: async ({ client }, args) => {
      const base = `/courses/${String(args.course_id)}`;
      const search = { search_term: args.term };
      const [assignments, pages, files, modules] = await Promise.all([
        h.getAllOrEmpty<CanvasAssignment>(client, `${base}/assignments`, search),
        h.getAllOrEmpty<CanvasPage>(client, `${base}/pages`, search),
        h.getAllOrEmpty<CanvasAttachment>(client, `${base}/files`, search),
        h.getAllOrEmpty<CanvasModule>(client, `${base}/modules`, { include: ['items'] }),
      ]);
      return {
        assignments: assignments.map((a) => ({ id: a.id, name: a.name, due_at: a.due_at })),
        pages: pages.map((p) => ({ page_url: p.url, title: p.title })),
        files: files.map(f.toFileInfo),
        module_items: h.matchModuleItems(modules, args.term),
      };
    },
  }),
];
