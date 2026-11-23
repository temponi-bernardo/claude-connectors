import { describe, expect, it } from 'vitest';
import { canvasApiError, canvasErrorStatus, createCanvasClient } from './client.js';
import { fakeContext, graphqlRoute, type Routes } from './fixtures/fake-context.js';
import { ANONYMOUS_ASSIGNMENT, NAMED_ASSIGNMENT } from './fixtures/peer-reviews.js';
import {
  assignmentPeerReviews,
  sweepPeerReviews,
  assignmentPageUrl,
  canvasIdSchema,
  orNull,
  peerReviewAssignmentFields,
  reviewDueTime,
  reviewedSubmissionPath,
  reviewRank,
  explainPeerReviewError,
  fetchPeerReviewAssignment,
  listCoursePeerReviews,
  listPeerReviews,
  PEER_REVIEWS_QUERY,
  PEER_REVIEW_CONCURRENCY,
  peerReviewAssignmentIds,
  peerReviewDenial,
  peerReviewsOf,
  peerSubmissionView,
  reviewPageUrl,
  revieweeName,
  sortPeerReviews,
  toPeerReview,
} from './peer-reviews.js';

const BASE = 'https://x.test';
const [PENDING, DONE] = ANONYMOUS_ASSIGNMENT.assessmentRequestsForCurrentUser!;
const NAMED = NAMED_ASSIGNMENT.assessmentRequestsForCurrentUser![0]!;

/** Routes of a student with two courses: one with an anonymous peer review, one with a named one. */
function studentRoutes(extra: Routes = {}): Routes {
  return {
    '/courses': [
      { id: 501, name: 'Computação Distribuída' },
      { id: 502, name: 'Grafos' },
    ],
    '/courses/501/assignments': [{ id: 7001, peer_reviews: true }, { id: 7003 }],
    '/courses/502/assignments': [{ id: 7002, peer_reviews: true }],
    [graphqlRoute({ id: '7001' })]: { assignment: ANONYMOUS_ASSIGNMENT },
    [graphqlRoute({ id: '7002' })]: { assignment: NAMED_ASSIGNMENT },
    ...extra,
  };
}

describe('PEER_REVIEWS_QUERY', () => {
  it('is a read-only query on the current user requests', () => {
    expect(PEER_REVIEWS_QUERY).toMatch(/^query /);
    expect(PEER_REVIEWS_QUERY).not.toMatch(/mutation/);
    expect(PEER_REVIEWS_QUERY).toContain('assessmentRequestsForCurrentUser');
  });
});

describe('PEER_REVIEW_CONCURRENCY', () => {
  it('keeps the sweep gentle on Canvas', () => {
    expect(PEER_REVIEW_CONCURRENCY).toBeGreaterThanOrEqual(1);
    expect(PEER_REVIEW_CONCURRENCY).toBeLessThanOrEqual(6);
  });
});

describe('canvasIdSchema', () => {
  it('accepts numeric ids only', () => {
    expect(canvasIdSchema.parse('294408')).toBe('294408');
    expect(canvasIdSchema.parse(7)).toBe(7);
    for (const bad of ['1/../2', 'abc', '', -1, 1.5, '1'.repeat(25)]) {
      expect(canvasIdSchema.safeParse(bad).success).toBe(false);
    }
  });
});

describe('revieweeName', () => {
  it('gives the name when Canvas shows it and says why when reviews are anonymous', () => {
    expect(revieweeName(NAMED, false)).toBe('Aluna Exemplo');
    expect(revieweeName(PENDING!, true)).toMatch(/anonymous/i);
    expect(revieweeName({ _id: '1', user: null }, false)).toBe(
      'Unknown (Canvas did not return the name)',
    );
  });
});

describe('reviewPageUrl', () => {
  it('links the anonymous review page by anonymous id and the named one by user id', () => {
    expect(reviewPageUrl(ANONYMOUS_ASSIGNMENT, PENDING!, BASE)).toBe(
      `${BASE}/courses/501/assignments/7001/anonymous_submissions/aBcDe`,
    );
    expect(reviewPageUrl(NAMED_ASSIGNMENT, NAMED, BASE)).toBe(
      `${BASE}/courses/502/assignments/7002/submissions/3001`,
    );
  });

  it('falls back to the assignment page when neither id is known', () => {
    expect(reviewPageUrl(NAMED_ASSIGNMENT, { _id: '1' }, BASE)).toBe(
      'https://x.test/courses/502/assignments/7002',
    );
    expect(reviewPageUrl({ _id: '9' }, { _id: '1' }, BASE)).toBe(`${BASE}/assignments/9`);
  });
});

describe('peerSubmissionView', () => {
  it('returns the URL the reviewee sent, without the page snapshot', () => {
    expect(peerSubmissionView(DONE!.submission)).toEqual({
      type: 'online_url',
      url: 'https://youtu.be/video-two',
      submitted_at: '2026-11-22T20:00:00Z',
    });
  });

  it('lists the attachments when there is no URL, and null without a submission', () => {
    expect(peerSubmissionView(NAMED.submission)).toEqual({
      type: 'online_upload',
      url: null,
      submitted_at: '2026-11-29T10:00:00Z',
      attachments: [{ name: 'relatorio.pdf', url: 'https://x.test/files/1/download' }],
    });
    expect(peerSubmissionView(null)).toBeNull();
    expect(peerSubmissionView({ attachments: [{}] })).toMatchObject({
      type: null,
      attachments: [{ name: null, url: null }],
    });
  });
});

describe('toPeerReview and peerReviewsOf', () => {
  it('builds a pending anonymous review with course, assignment, due date and links', () => {
    expect(toPeerReview(ANONYMOUS_ASSIGNMENT, PENDING!, BASE)).toEqual({
      course: 'Computação Distribuída - 2026/2',
      course_id: '501',
      assignment: 'Apresentação de Artigo Científico',
      assignment_id: '7001',
      due_at: '2026-11-23T00:00:00-03:00',
      assignment_due_at: '2026-11-22T23:59:59-03:00',
      reviewee: expect.stringMatching(/anonymous/i) as unknown,
      anonymous: true,
      status: 'pending',
      available: true,
      submission: {
        type: 'online_url',
        url: 'https://youtu.be/video-one',
        submitted_at: '2026-11-22T21:27:18Z',
      },
      review_url: `${BASE}/courses/501/assignments/7001/anonymous_submissions/aBcDe`,
    });
  });

  it('maps every request, completed ones included, and tolerates a bare assignment', () => {
    const reviews = peerReviewsOf(ANONYMOUS_ASSIGNMENT, BASE);
    expect(reviews.map((r) => r.status)).toEqual(['pending', 'completed']);
    expect(peerReviewsOf({ _id: '1' }, BASE)).toEqual([]);
    expect(toPeerReview({ _id: '1' }, { _id: '2' }, BASE)).toMatchObject({
      course: null,
      due_at: null,
      anonymous: false,
      available: null,
      submission: null,
    });
  });
});

describe('assignmentPageUrl and reviewedSubmissionPath', () => {
  it('builds the assignment page under its course and the submission path', () => {
    expect(assignmentPageUrl(ANONYMOUS_ASSIGNMENT, BASE)).toBe(
      `${BASE}/courses/501/assignments/7001`,
    );
    expect(reviewedSubmissionPath(true, PENDING!)).toBe('/anonymous_submissions/aBcDe');
    expect(reviewedSubmissionPath(false, NAMED)).toBe('/submissions/3001');
    expect(reviewedSubmissionPath(true, { _id: '1' })).toBeNull();
  });
});

describe('orNull and peerReviewAssignmentFields', () => {
  it('turns missing values into null', () => {
    expect(orNull(undefined)).toBeNull();
    expect(orNull(0)).toBe(0);
    expect(peerReviewAssignmentFields(NAMED_ASSIGNMENT)).toMatchObject({
      course: 'Grafos - 2026/2',
      due_at: null,
      anonymous: false,
    });
  });
});

describe('reviewRank and reviewDueTime', () => {
  it('ranks pending first and sends undated or invalid dates last', () => {
    expect(reviewRank({ status: 'pending' })).toBeLessThan(reviewRank({ status: 'completed' }));
    expect(reviewDueTime({ due_at: '2026-11-23T00:00:00-03:00' })).toBe(
      Date.parse('2026-11-23T03:00:00Z'),
    );
    expect(reviewDueTime({ due_at: null })).toBe(Number.MAX_SAFE_INTEGER);
    expect(reviewDueTime({ due_at: 'not a date' })).toBe(Number.MAX_SAFE_INTEGER);
  });
});

describe('sortPeerReviews', () => {
  it('puts pending first, then the nearest due date, undated last', () => {
    const list = [
      { status: 'completed', due_at: '2026-11-01' },
      { status: 'pending', due_at: null },
      { status: 'pending', due_at: '2026-11-30' },
      { status: 'pending', due_at: '2026-11-23' },
    ];
    expect(sortPeerReviews(list).map((r) => `${r.status}:${String(r.due_at)}`)).toEqual([
      'pending:2026-11-23',
      'pending:2026-11-30',
      'pending:null',
      'completed:2026-11-01',
    ]);
  });
});

describe('peerReviewDenial and explainPeerReviewError', () => {
  it('explains 401/403 as a route not available to students and 404 as not found', () => {
    expect(peerReviewDenial(403, 'course 1')).toMatch(/may be closed to student accounts/);
    expect(peerReviewDenial(401, 'course 1')).toMatch(/may be closed to student accounts/);
    expect(peerReviewDenial(404, 'assignment 2')).toMatch(/assignment 2 was not found/);
    expect(peerReviewDenial(500, 'x')).toBeNull();
    expect(peerReviewDenial(null, 'x')).toBeNull();
  });

  it('keeps the status, passes a rejected token and other errors unchanged', () => {
    const explained = explainPeerReviewError(canvasApiError('raw', 403), 'course 1');
    expect(String(explained)).toMatch(/may be closed to student accounts/);
    expect(canvasErrorStatus(explained)).toBe(403);
    const token = canvasApiError('reconnect', 401, true);
    expect(explainPeerReviewError(token, 'course 1')).toBe(token);
    const other = new Error('boom');
    expect(explainPeerReviewError(other, 'course 1')).toBe(other);
  });
});

describe('fetchPeerReviewAssignment', () => {
  it('queries GraphQL with the assignment id as a variable', async () => {
    const { ctx, query } = fakeContext(studentRoutes());
    await expect(fetchPeerReviewAssignment(ctx.client, 7001)).resolves.toBe(ANONYMOUS_ASSIGNMENT);
    expect(query).toHaveBeenCalledWith(PEER_REVIEWS_QUERY, { id: '7001' });
  });

  it('fails with 404 when Canvas hides or lacks the assignment', async () => {
    const { ctx } = fakeContext({ [graphqlRoute({ id: '9' })]: { assignment: null } });
    const error: unknown = await fetchPeerReviewAssignment(ctx.client, 9).catch((e: unknown) => e);
    expect(canvasErrorStatus(error)).toBe(404);
    expect(String(error)).toContain('assignment 9 was not found');
  });
});

describe('peerReviewAssignmentIds and listCoursePeerReviews', () => {
  it('keeps only the assignments with peer reviews', async () => {
    const { ctx, getAll } = fakeContext(studentRoutes());
    await expect(peerReviewAssignmentIds(ctx.client, 501)).resolves.toEqual([7001]);
    expect(getAll).toHaveBeenCalledWith('/courses/501/assignments', { order_by: 'due_at' });
  });

  it('lists the reviews of every peer-review assignment of a course', async () => {
    const { ctx, query } = fakeContext(studentRoutes());
    const reviews = await listCoursePeerReviews(ctx.client, 501);
    expect(reviews).toHaveLength(2);
    expect(query).toHaveBeenCalledTimes(1);
  });
});

describe('assignmentPeerReviews and sweepPeerReviews', () => {
  it('reads one assignment, with or without its course', async () => {
    const { ctx } = fakeContext(studentRoutes());
    await expect(assignmentPeerReviews(ctx.client, { assignment_id: 7002 })).resolves.toHaveLength(
      1,
    );
    await expect(
      assignmentPeerReviews(ctx.client, { course_id: 502, assignment_id: 7002 }),
    ).resolves.toHaveLength(1);
  });

  it('sweeps every active course into one sorted list', async () => {
    const { ctx } = fakeContext(studentRoutes());
    const result = await sweepPeerReviews(ctx.client);
    expect(result.peer_reviews).toHaveLength(3);
  });
});

describe('listPeerReviews', () => {
  it('sweeps the active courses without course_id, pending first', async () => {
    const { ctx, getAll } = fakeContext(studentRoutes());
    const result = await listPeerReviews(ctx.client, {});
    expect(getAll).toHaveBeenCalledWith('/courses', { enrollment_state: 'active' });
    expect(
      result.peer_reviews.map((r) => `${String(r.assignment_id)}:${String(r.status)}`),
    ).toEqual(['7001:pending', '7002:pending', '7001:completed']);
    expect(result).not.toHaveProperty('unavailable');
  });

  it('reads one course with course_id and one assignment with assignment_id', async () => {
    const course = await listPeerReviews(fakeContext(studentRoutes()).ctx.client, {
      course_id: 502,
    });
    expect(course.peer_reviews.map((r) => r.reviewee)).toEqual(['Aluna Exemplo']);
    const fake = fakeContext(studentRoutes());
    const one = await listPeerReviews(fake.ctx.client, { course_id: '501', assignment_id: '7001' });
    expect(one.peer_reviews).toHaveLength(2);
    expect(fake.getAll).not.toHaveBeenCalled();
  });

  it('refuses an assignment that belongs to another course', async () => {
    const { ctx } = fakeContext(studentRoutes());
    await expect(
      listPeerReviews(ctx.client, { course_id: 999, assignment_id: 7001 }),
    ).rejects.toThrow(/assignment 7001 in course 999 was not found/);
  });

  it('notes a course whose route is closed to students and keeps the others', async () => {
    const { ctx } = fakeContext(
      studentRoutes({ '/courses/502/assignments': canvasApiError('Canvas 403', 403) }),
    );
    const result = await listPeerReviews(ctx.client, {});
    expect(result.peer_reviews).toHaveLength(2);
    expect(result.unavailable).toEqual([
      {
        course_id: 502,
        reason: expect.stringMatching(/may be closed to student accounts/) as unknown,
      },
    ]);
  });

  it('fails clearly when the one course asked for is closed, and on a rejected token', async () => {
    const closed = fakeContext(
      studentRoutes({ '/courses/501/assignments': canvasApiError('x', 404) }),
    );
    await expect(listPeerReviews(closed.ctx.client, { course_id: 501 })).rejects.toThrow(
      /course 501 was not found/,
    );
    const token = canvasApiError('Canvas rejected the token', 401, true);
    const expired = fakeContext(studentRoutes({ '/courses/502/assignments': token }));
    await expect(listPeerReviews(expired.ctx.client, {})).rejects.toBe(token);
  });

  it('returns an empty list for a student without courses', async () => {
    const { ctx } = fakeContext({ '/courses': [] });
    await expect(listPeerReviews(ctx.client, {})).resolves.toEqual({ peer_reviews: [] });
  });
});

describe('pagination of the assignments (real client, Link header)', () => {
  it('follows rel="next" and finds a peer-review assignment on page 2', async () => {
    const next = 'https://x.test/api/v1/courses/501/assignments?page=2&per_page=100';
    const pages = [
      new Response(JSON.stringify([{ id: 1 }]), { headers: { link: `<${next}>; rel="next"` } }),
      new Response(JSON.stringify([{ id: 7001, peer_reviews: true }])),
      new Response(JSON.stringify({ data: { assignment: ANONYMOUS_ASSIGNMENT } })),
    ];
    const calls: string[] = [];
    const fetchFn = ((url: URL | string) => {
      calls.push(String(url));
      return Promise.resolve(pages.shift()!);
    }) as typeof fetch;
    const client = createCanvasClient({ baseUrl: BASE, token: 't', fetchFn });
    const reviews = await listCoursePeerReviews(client, 501);
    expect(reviews).toHaveLength(2);
    expect(calls).toEqual([
      'https://x.test/api/v1/courses/501/assignments?per_page=100&order_by=due_at',
      next,
      'https://x.test/api/graphql',
    ]);
  });
});
