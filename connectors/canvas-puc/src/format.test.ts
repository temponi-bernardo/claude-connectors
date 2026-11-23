import { describe, expect, it } from 'vitest';
import {
  MAX_TEXT_LENGTH,
  flattenDiscussion,
  linksField,
  rawHtmlField,
  shortText,
  toAnnouncement,
  toAssignmentDetail,
  toAssignmentSummary,
  toCalendarEvent,
  toCourse,
  toDiscussionSummary,
  toEnrollmentGrade,
  toFileInfo,
  toGradeRow,
  toModule,
  toModuleItem,
  toPlannerItem,
  plannerItemType,
  reviewStatus,
  toProfile,
  toRubricCriterion,
  toSubmissionDetail,
  toSubmissionFlags,
} from './format.js';

import { PLANNER_WITH_PEER_REVIEW } from './fixtures/peer-reviews.js';

const BASE = 'https://c.test';

describe('shortText', () => {
  it('converts HTML and cuts at the limit', () => {
    expect(shortText('<p>hi</p>')).toBe('hi');
    expect(shortText('x'.repeat(MAX_TEXT_LENGTH + 10))).toHaveLength(MAX_TEXT_LENGTH);
  });
});

describe('toProfile', () => {
  it('maps the profile fields', () => {
    expect(
      toProfile({ id: 1, name: 'A', primary_email: 'a@x', login_id: 'l', time_zone: 'tz' }),
    ).toEqual({
      id: 1,
      name: 'A',
      email: 'a@x',
      login: 'l',
      time_zone: 'tz',
    });
  });
});

describe('toCourse', () => {
  it('uses the first enrollment for the grade', () => {
    const c = toCourse({
      id: 1,
      name: 'N',
      course_code: 'C',
      term: { name: 'T' },
      enrollments: [{ computed_current_score: 9, computed_current_grade: 'A' }],
    });
    expect(c).toEqual({
      id: 1,
      name: 'N',
      code: 'C',
      term: 'T',
      current_score: 9,
      current_grade: 'A',
    });
  });

  it('uses null without an enrollment', () => {
    expect(toCourse({ id: 1 })).toMatchObject({
      current_score: null,
      current_grade: null,
      term: undefined,
    });
  });
});

describe('toSubmissionFlags', () => {
  it('returns null without a submission and maps the flags', () => {
    expect(toSubmissionFlags(false)).toBeNull();
    expect(toSubmissionFlags(undefined)).toBeNull();
    expect(
      toSubmissionFlags({ submitted: true, late: false, missing: false, graded: true }),
    ).toEqual({
      submitted: true,
      late: false,
      missing: false,
      graded: true,
    });
  });
});

describe('toPlannerItem', () => {
  it('builds an absolute link and uses title or name', () => {
    const item = toPlannerItem(
      {
        plannable_type: 'assignment',
        plannable: { title: 'P2', points_possible: 30 },
        html_url: '/c/1',
      },
      'https://x.test',
    );
    expect(item).toMatchObject({
      type: 'assignment',
      title: 'P2',
      points: 30,
      url: 'https://x.test/c/1',
      submission: null,
    });
    expect(toPlannerItem({ plannable: { name: 'Ev' } }, 'b')).toMatchObject({
      title: 'Ev',
      url: undefined,
    });
    expect(toPlannerItem({}, 'b')).toMatchObject({ title: undefined, points: undefined });
  });
});

describe('plannerItemType', () => {
  it('names a peer review peer_review and keeps every other planner type', () => {
    expect(plannerItemType('assessment_request')).toBe('peer_review');
    for (const type of [
      'assignment',
      'quiz',
      'discussion_topic',
      'calendar_event',
      'planner_note',
    ]) {
      expect(plannerItemType(type)).toBe(type);
    }
    expect(plannerItemType(undefined)).toBeUndefined();
  });
});

describe('reviewStatus', () => {
  it('is completed only when Canvas says so', () => {
    expect(reviewStatus('completed')).toBe('completed');
    expect(reviewStatus('assigned')).toBe('pending');
    expect(reviewStatus(null)).toBe('pending');
  });
});

describe('toPlannerItem with a peer review', () => {
  it('keeps the real planner peer review with type peer_review, status and link', () => {
    const [review, assignment] = PLANNER_WITH_PEER_REVIEW.map((i) => toPlannerItem(i, BASE));
    expect(review).toMatchObject({
      type: 'peer_review',
      title: 'Apresentação de Artigo Científico',
      course_id: 501,
      date: '2026-11-23T03:00:00Z',
      status: 'pending',
      submission: null,
      url: `${BASE}/courses/501/assignments/7001/anonymous_submissions/aBcDe`,
    });
    expect(assignment).toMatchObject({ type: 'assignment', title: 'Prova 3' });
    expect(assignment).not.toHaveProperty('status');
  });
});

describe('toAssignmentSummary', () => {
  it('includes the submission status and score', () => {
    const a = toAssignmentSummary({
      id: 1,
      name: 'T',
      submission: { workflow_state: 'graded', score: 8, late: true, missing: false },
    });
    expect(a).toMatchObject({
      id: 1,
      name: 'T',
      status: 'graded',
      score: 8,
      late: true,
      missing: false,
    });
  });

  it('uses null without a submission', () => {
    expect(toAssignmentSummary({ id: 1 })).toMatchObject({
      score: null,
      late: null,
      missing: null,
    });
  });
});

describe('toRubricCriterion', () => {
  it('formats the ratings', () => {
    expect(
      toRubricCriterion({
        description: 'C',
        points: 5,
        ratings: [{ points: 5, description: 'great' }],
      }),
    ).toEqual({
      criterion: 'C',
      points: 5,
      ratings: ['5: great'],
    });
    expect(toRubricCriterion({})).toMatchObject({ ratings: [] });
  });
});

describe('toFileInfo', () => {
  it('converts the size to KB', () => {
    expect(
      toFileInfo({
        id: 1,
        display_name: 'a.pdf',
        size: 2048,
        'content-type': 'application/pdf',
        url: 'u',
      }),
    ).toMatchObject({
      name: 'a.pdf',
      size_kb: 2,
      content_type: 'application/pdf',
      download: 'u',
    });
    expect(toFileInfo({})).toMatchObject({ size_kb: 0 });
  });
});

describe('toSubmissionDetail', () => {
  it('brings comments and attachments', () => {
    const s = toSubmissionDetail({
      workflow_state: 'graded',
      submission_comments: [{ author_name: 'Prof', comment: 'good', created_at: 'd' }],
      attachments: [{ display_name: 'a.txt' }],
    });
    expect(s).toMatchObject({
      comments: [{ author: 'Prof', text: 'good', date: 'd' }],
      rubric_assessment: null,
    });
    expect(s.attachments as unknown[]).toHaveLength(1);
    expect(toSubmissionDetail({})).toMatchObject({ comments: [], attachments: [] });
  });
});

describe('toAssignmentDetail', () => {
  it('converts the description and includes the submission when there is one', () => {
    const a = { id: 1, description: '<p>Do it</p>', rubric: [{ description: 'C' }] };
    expect(toAssignmentDetail(a, null, BASE)).toMatchObject({
      description: 'Do it',
      links: [],
      submission: null,
    });
    expect(toAssignmentDetail({ id: 2 }, { score: 7 }, BASE)).toMatchObject({
      rubric: [],
      submission: { score: 7 },
    });
  });
});

describe('toAssignmentDetail links', () => {
  it('marks the embedded file in the text and returns it in links', () => {
    const a = {
      id: 1,
      description: '<p><a href="/courses/9/files/5?verifier=v">Lista 1</a></p>',
    };
    const view = toAssignmentDetail(a, null, BASE);
    expect(view.description).toBe('Lista 1 [link 1]');
    expect(view.links).toEqual([
      expect.objectContaining({ type: 'file', file_id: '5', course_id: '9', followable: true }),
    ]);
  });
});

describe('rawHtmlField and linksField', () => {
  it('adds the raw HTML only when asked', () => {
    expect(rawHtmlField('body_html', '<p>x</p>', true)).toEqual({ body_html: '<p>x</p>' });
    expect(rawHtmlField('body_html', null, true)).toEqual({ body_html: '' });
    expect(rawHtmlField('body_html', '<p>x</p>', false)).toEqual({});
  });

  it('adds links only when there are some', () => {
    expect(linksField([])).toEqual({});
    const link = { n: 1, type: 'external' as const, title: 't', url: 'u', followable: false };
    expect(linksField([link])).toEqual({ links: [link] });
  });
});

describe('toGradeRow', () => {
  it('uses the data of the included assignment', () => {
    expect(
      toGradeRow({
        assignment_id: 1,
        score: 7,
        assignment: { id: 1, name: 'T', points_possible: 10 },
      }),
    ).toMatchObject({
      assignment: 'T',
      score: 7,
      points_possible: 10,
    });
    expect(toGradeRow({})).toMatchObject({ assignment: undefined, points_possible: undefined });
  });
});

describe('toEnrollmentGrade', () => {
  it('looks up the course name by id', () => {
    const names = new Map([['5', 'Course']]);
    expect(
      toEnrollmentGrade({ course_id: 5, grades: { current_score: 80, final_score: 70 } }, names),
    ).toMatchObject({
      course: 'Course',
      current_score: 80,
      final_score: 70,
    });
    expect(toEnrollmentGrade({ course_id: 6 }, names)).toMatchObject({
      course: undefined,
      current_score: undefined,
    });
  });
});

describe('toAnnouncement', () => {
  it("prefers the author's name and converts the text", () => {
    expect(
      toAnnouncement(
        {
          id: 1,
          message: '<b>hi</b>',
          author: { display_name: 'A' },
          user_name: 'B',
        },
        BASE,
      ),
    ).toMatchObject({ author: 'A', text: 'hi', links: [] });
    expect(toAnnouncement({ id: 1, user_name: 'B' }, BASE)).toMatchObject({
      author: 'B',
      text: '',
    });
  });

  it('keeps the links of the whole message even when the text is cut', () => {
    const message = `<p>${'x'.repeat(4000)}</p><a href="https://youtu.be/abc">aula</a>`;
    const view = toAnnouncement({ id: 1, message }, BASE);
    expect((view.text as string).length).toBe(3000);
    expect(view.links).toEqual([expect.objectContaining({ type: 'video', provider: 'youtube' })]);
  });
});

describe('toModule and toModuleItem', () => {
  it('maps items and completion', () => {
    expect(toModuleItem({ id: 1, completion_requirement: { completed: true } })).toMatchObject({
      completed: true,
    });
    expect(toModuleItem({ id: 1 })).toMatchObject({ completed: null });
    expect(toModule({ id: 1, name: 'M', items: [{ id: 2, title: 'Lesson' }] })).toMatchObject({
      name: 'M',
      items: [{ title: 'Lesson' }],
    });
    expect(toModule({ id: 1 })).toMatchObject({ items: [] });
  });
});

describe('toDiscussionSummary', () => {
  it('brings the due date of the linked assignment, or null', () => {
    expect(toDiscussionSummary({ id: 1, assignment: { due_at: 'd' } })).toMatchObject({
      due_at: 'd',
    });
    expect(toDiscussionSummary({ id: 1 })).toMatchObject({ due_at: null });
  });
});

describe('flattenDiscussion', () => {
  it('flattens nested replies with the depth and the author', () => {
    const names = new Map([['1', 'Ana']]);
    const flat = flattenDiscussion(
      [
        {
          user_id: 1,
          message: '<p>a <a href="https://e.test/x">site</a></p>',
          replies: [{ user_id: 2, message: 'b' }],
        },
      ],
      { names, baseUrl: BASE },
    );
    expect(flat).toEqual([
      {
        depth: 0,
        author: 'Ana',
        date: undefined,
        text: 'a site [link 1]',
        links: [
          { n: 1, type: 'external', title: 'site', url: 'https://e.test/x', followable: false },
        ],
      },
      { depth: 1, author: undefined, date: undefined, text: 'b' },
    ]);
    expect(flattenDiscussion(undefined, { names, baseUrl: BASE })).toEqual([]);
  });
});

describe('toCalendarEvent', () => {
  it('limits the description to 1000 characters', () => {
    expect(
      (toCalendarEvent({ title: 'E', description: 'x'.repeat(2000) }).description as string).length,
    ).toBe(1000);
  });
});
