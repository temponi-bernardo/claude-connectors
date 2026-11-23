/**
 * Peer reviews assigned to the signed-in student (`list_peer_reviews`), read-only.
 *
 * Canvas has no REST route that lists them for a student: `GET .../peer_reviews` only shows who reviews the
 * student's own submission. The GraphQL field `Assignment.assessmentRequestsForCurrentUser` lists the reviews the
 * student must do, pending and completed, with the reviewed submission (checked on a real student account).
 */
import { z } from 'zod';
import { mapWithLimit } from '../../../src/core/async.js';
import { errorMessage } from '../../../src/core/redact.js';
import {
  canvasApiError,
  canvasErrorStatus,
  type CanvasApiError,
  type CanvasClient,
} from './client.js';
import type {
  CanvasAssignment,
  GqlAssessmentRequest,
  GqlPeerReviewAssignment,
  GqlPeerSubmission,
  Id,
} from './canvas-types.js';
import { reviewStatus, type View } from './format.js';
import { activeCourses } from './helpers.js';

/** GraphQL query of an assignment's peer reviews assigned to the current user (a read: no mutation). */
export const PEER_REVIEWS_QUERY = `query PeerReviews($id: ID!) {
  assignment(id: $id) {
    _id name dueAt htmlUrl
    course { _id name }
    peerReviews { enabled anonymousReviews dueAt }
    assessmentRequestsForCurrentUser {
      _id anonymousId workflowState available
      user { _id name }
      submission { submissionType url submittedAt attachments { displayName url } }
    }
  }
}`;

/** Canvas calls running at once per level of the sweep (courses, then assignments): spares rate limits. */
export const PEER_REVIEW_CONCURRENCY = 3;

/** A Canvas id: digits only (string or positive integer), so it cannot change the path it goes into. */
export const canvasIdSchema = z.union([
  z.string().regex(/^\d{1,20}$/, 'must be a numeric Canvas id'),
  z.number().int().positive(),
]);

/** Arguments of `list_peer_reviews`. */
export interface PeerReviewArgs {
  readonly course_id?: Id | undefined;
  readonly assignment_id?: Id | undefined;
}

/** Result of `list_peer_reviews`: the reviews and, when sweeping, the courses that could not be read. */
export interface PeerReviewList {
  readonly peer_reviews: View[];
  readonly unavailable?: { readonly course_id: Id; readonly reason: string }[];
}

/** Who is reviewed: the name, or why Canvas hides it (anonymous peer reviews). */
export function revieweeName(req: GqlAssessmentRequest, anonymous: boolean): string {
  if (req.user?.name) return req.user.name;
  return anonymous
    ? 'Anonymous (the instructor turned on anonymous peer reviews, so Canvas hides the name)'
    : 'Unknown (Canvas did not return the name)';
}

/** Absolute link of an assignment page, under its course when the course is known. */
export function assignmentPageUrl(a: GqlPeerReviewAssignment, baseUrl: string): string {
  const course = a.course?._id ? `/courses/${a.course._id}` : '';
  return `${baseUrl}${course}/assignments/${a._id}`;
}

/** Path of the reviewed submission under its assignment (anonymous id or user id); `null` when neither is known. */
export function reviewedSubmissionPath(
  anonymous: boolean,
  req: GqlAssessmentRequest,
): string | null {
  if (anonymous && req.anonymousId) return `/anonymous_submissions/${req.anonymousId}`;
  return req.user?._id ? `/submissions/${req.user._id}` : null;
}

/** Canvas page where the student does the review; the assignment page when the submission is unknown. */
export function reviewPageUrl(
  a: GqlPeerReviewAssignment,
  req: GqlAssessmentRequest,
  baseUrl: string,
): string {
  const page = assignmentPageUrl(a, baseUrl);
  const submission = reviewedSubmissionPath(a.peerReviews?.anonymousReviews === true, req);
  return submission ? `${page}${submission}` : (a.htmlUrl ?? page);
}

/** What the reviewee sent: the URL, or the attached files when there is no URL; `null` without a submission. */
export function peerSubmissionView(sub: GqlPeerSubmission | null | undefined): View | null {
  if (!sub) return null;
  const view = {
    type: sub.submissionType ?? null,
    url: sub.url ?? null,
    submitted_at: sub.submittedAt ?? null,
  };
  if (sub.url) return view;
  const attachments = (sub.attachments ?? []).map((file) => ({
    name: file.displayName ?? null,
    url: file.url ?? null,
  }));
  return { ...view, attachments };
}

/** The value, or `null` when it is missing (keeps absent fields explicit for the model). */
export function orNull<T>(value: T | null | undefined): T | null {
  return value ?? null;
}

/** Fields of a peer review that come from its assignment: course, names, due dates and anonymity. */
export function peerReviewAssignmentFields(a: GqlPeerReviewAssignment): View {
  const course = a.course ?? { _id: null, name: null };
  const reviews = a.peerReviews ?? {};
  return {
    course: orNull(course.name),
    course_id: course._id,
    assignment: orNull(a.name),
    assignment_id: a._id,
    due_at: orNull(reviews.dueAt),
    assignment_due_at: orNull(a.dueAt),
    anonymous: reviews.anonymousReviews === true,
  };
}

/** One peer review the student must do, ready for the model. */
export function toPeerReview(
  a: GqlPeerReviewAssignment,
  req: GqlAssessmentRequest,
  baseUrl: string,
): View {
  const fields = peerReviewAssignmentFields(a);
  return {
    ...fields,
    reviewee: revieweeName(req, fields.anonymous === true),
    status: reviewStatus(req.workflowState),
    available: orNull(req.available),
    submission: peerSubmissionView(req.submission),
    review_url: reviewPageUrl(a, req, baseUrl),
  };
}

/** Every peer review of an assignment assigned to the student. */
export function peerReviewsOf(a: GqlPeerReviewAssignment, baseUrl: string): View[] {
  return (a.assessmentRequestsForCurrentUser ?? []).map((req) => toPeerReview(a, req, baseUrl));
}

/** Sort rank of a peer review: pending (0) before completed (1). */
export function reviewRank(review: View): number {
  return review.status === 'pending' ? 0 : 1;
}

/** Due instant of a peer review in ms; undated reviews sort last. */
export function reviewDueTime(review: View): number {
  const time = typeof review.due_at === 'string' ? Date.parse(review.due_at) : Number.NaN;
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
}

/** Pending reviews first, then the nearest due date; undated last. Returns a new list. */
export function sortPeerReviews<T extends View>(reviews: readonly T[]): T[] {
  return [...reviews].sort(
    (x, y) => reviewRank(x) - reviewRank(y) || reviewDueTime(x) - reviewDueTime(y),
  );
}

/** Clear message for a status Canvas uses to refuse or hide a resource; `null` for any other status. */
export function peerReviewDenial(status: number | null, target: string): string | null {
  if (status === 401 || status === 403) {
    return `Canvas refused access to the peer reviews of ${target} (HTTP ${status}): the route may be closed to student accounts, or the course may be unpublished or restricted.`;
  }
  if (status === 404) {
    return `${target} was not found or is not visible to you (HTTP 404): check course_id and assignment_id with list_courses and list_assignments.`;
  }
  return null;
}

/** Rewrites a 401/403/404 into a clear `CanvasApiError`; a rejected token and other errors pass unchanged. */
export function explainPeerReviewError(error: unknown, target: string): unknown {
  if ((error as Partial<CanvasApiError>).tokenRejected) return error;
  const status = canvasErrorStatus(error);
  const message = peerReviewDenial(status, target);
  return message && status !== null ? canvasApiError(message, status) : error;
}

/** The assignment with the student's peer reviews (GraphQL); 404 when Canvas hides or lacks it. */
export async function fetchPeerReviewAssignment(
  client: CanvasClient,
  assignmentId: Id,
): Promise<GqlPeerReviewAssignment> {
  const data = await client.query<{ assignment: GqlPeerReviewAssignment | null }>(
    PEER_REVIEWS_QUERY,
    { id: String(assignmentId) },
  );
  if (data.assignment) return data.assignment;
  const target = `assignment ${String(assignmentId)}`;
  throw canvasApiError(peerReviewDenial(404, target) ?? target, 404);
}

/** Ids of a course's assignments that have peer reviews (every page, via the `Link` header). */
export async function peerReviewAssignmentIds(client: CanvasClient, courseId: Id): Promise<Id[]> {
  const path = `/courses/${String(courseId)}/assignments`;
  const list = await client.getAll<CanvasAssignment>(path, { order_by: 'due_at' });
  return list.filter((a) => a.peer_reviews === true).map((a) => a.id);
}

/** Every peer review the student must do in a course. */
export async function listCoursePeerReviews(client: CanvasClient, courseId: Id): Promise<View[]> {
  try {
    const ids = await peerReviewAssignmentIds(client, courseId);
    const assignments = await mapWithLimit(ids, PEER_REVIEW_CONCURRENCY, (id) =>
      fetchPeerReviewAssignment(client, id),
    );
    return assignments.flatMap((a) => peerReviewsOf(a, client.baseUrl));
  } catch (error) {
    throw explainPeerReviewError(error, `course ${String(courseId)}`);
  }
}

/** The peer reviews of one assignment, checking it belongs to `courseId` when given. */
export async function assignmentPeerReviews(
  client: CanvasClient,
  args: PeerReviewArgs,
): Promise<View[]> {
  const assignmentId = String(args.assignment_id);
  const a = await fetchPeerReviewAssignment(client, assignmentId);
  if (args.course_id !== undefined && a.course?._id !== String(args.course_id)) {
    const target = `assignment ${assignmentId} in course ${String(args.course_id)}`;
    throw canvasApiError(peerReviewDenial(404, target) ?? target, 404);
  }
  return peerReviewsOf(a, client.baseUrl);
}

/** Sweeps the active courses; a course Canvas refuses goes to `unavailable` instead of failing the rest. */
export async function sweepPeerReviews(client: CanvasClient): Promise<PeerReviewList> {
  const courses = await activeCourses(client);
  const unavailable: { course_id: Id; reason: string }[] = [];
  const lists = await mapWithLimit(courses, PEER_REVIEW_CONCURRENCY, (c) =>
    listCoursePeerReviews(client, c.id).catch((error: unknown) => {
      if ((error as Partial<CanvasApiError>).tokenRejected) throw error;
      unavailable.push({ course_id: c.id, reason: errorMessage(error) });
      return [];
    }),
  );
  const peer_reviews = sortPeerReviews(lists.flat());
  return unavailable.length > 0 ? { peer_reviews, unavailable } : { peer_reviews };
}

/** `list_peer_reviews`: one assignment, one course or every active course. */
export async function listPeerReviews(
  client: CanvasClient,
  args: PeerReviewArgs,
): Promise<PeerReviewList> {
  if (args.assignment_id !== undefined) {
    return { peer_reviews: sortPeerReviews(await assignmentPeerReviews(client, args)) };
  }
  if (args.course_id !== undefined) {
    return { peer_reviews: sortPeerReviews(await listCoursePeerReviews(client, args.course_id)) };
  }
  return sweepPeerReviews(client);
}
