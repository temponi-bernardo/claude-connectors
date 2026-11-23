/**
 * Canvas answers about peer reviews, captured from a real student account on 2026-11-23 and anonymized
 * (ids, anonymous ids, names and video links replaced; field names and shapes kept exactly).
 */
import type { CanvasPlannerItem, GqlPeerReviewAssignment } from '../canvas-types.js';

/** `GET /api/v1/planner/items`: a peer review (`assessment_request`) due at 00:00 São Paulo, plus an assignment. */
export const PLANNER_WITH_PEER_REVIEW: readonly CanvasPlannerItem[] = [
  {
    context_type: 'Course',
    course_id: 501,
    plannable_id: 9001,
    plannable_type: 'assessment_request',
    submissions: false,
    plannable_date: '2026-11-23T03:00:00Z',
    plannable: {
      id: 9001,
      title: 'Apresentação de Artigo Científico',
      todo_date: '2026-11-23T03:00:00Z',
      workflow_state: 'assigned',
    },
    html_url: '/courses/501/assignments/7001/anonymous_submissions/aBcDe',
    context_name: 'Computação Distribuída - 2026/2',
  },
  {
    context_type: 'Course',
    course_id: 502,
    plannable_id: 7101,
    plannable_type: 'assignment',
    submissions: { submitted: false, late: false, missing: false, graded: false },
    plannable_date: '2026-11-26T15:20:00Z',
    plannable: { id: 7101, title: 'Prova 3', points_possible: 30, workflow_state: 'published' },
    html_url: '/courses/502/assignments/7101',
    context_name: 'Grafos - 2026/2',
  },
];

/** GraphQL `assignment.assessmentRequestsForCurrentUser` of an anonymous peer review (the real shape). */
export const ANONYMOUS_ASSIGNMENT: GqlPeerReviewAssignment = {
  _id: '7001',
  name: 'Apresentação de Artigo Científico',
  dueAt: '2026-11-22T23:59:59-03:00',
  htmlUrl: 'https://x.test/courses/501/assignments/7001',
  course: { _id: '501', name: 'Computação Distribuída - 2026/2' },
  peerReviews: { enabled: true, anonymousReviews: true, dueAt: '2026-11-23T00:00:00-03:00' },
  assessmentRequestsForCurrentUser: [
    {
      _id: '9001',
      anonymousId: 'aBcDe',
      workflowState: 'assigned',
      available: true,
      user: null,
      submission: {
        submissionType: 'online_url',
        url: 'https://youtu.be/video-one',
        submittedAt: '2026-11-22T21:27:18Z',
        attachments: [],
      },
    },
    {
      _id: '9002',
      anonymousId: 'FgHiJ',
      workflowState: 'completed',
      available: true,
      user: null,
      submission: {
        submissionType: 'online_url',
        url: 'https://youtu.be/video-two',
        submittedAt: '2026-11-22T20:00:00Z',
        attachments: [
          {
            displayName: 'websnappr-snapshot.png',
            url: 'https://x.test/courses/501/assignments/7001/anonymous_submissions/FgHiJ?download=1',
          },
        ],
      },
    },
  ],
};

/** Same query on a peer review that is not anonymous: Canvas fills `user`. */
export const NAMED_ASSIGNMENT: GqlPeerReviewAssignment = {
  _id: '7002',
  name: 'Relatório Final',
  dueAt: '2026-11-30T23:59:59-03:00',
  htmlUrl: 'https://x.test/courses/502/assignments/7002',
  course: { _id: '502', name: 'Grafos - 2026/2' },
  peerReviews: { enabled: true, anonymousReviews: false, dueAt: null },
  assessmentRequestsForCurrentUser: [
    {
      _id: '9101',
      anonymousId: 'KlMnO',
      workflowState: 'assigned',
      available: false,
      user: { _id: '3001', name: 'Aluna Exemplo' },
      submission: {
        submissionType: 'online_upload',
        url: null,
        submittedAt: '2026-11-29T10:00:00Z',
        attachments: [{ displayName: 'relatorio.pdf', url: 'https://x.test/files/1/download' }],
      },
    },
  ],
};
