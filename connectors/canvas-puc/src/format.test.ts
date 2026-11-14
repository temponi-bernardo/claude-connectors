import { describe, expect, it } from 'vitest';
import {
  MAX_TEXT_LENGTH,
  flattenDiscussion,
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
  toProfile,
  toRubricCriterion,
  toSubmissionDetail,
  toSubmissionFlags,
} from './format.js';

describe('shortText', () => {
  it('converte HTML e corta no limite', () => {
    expect(shortText('<p>oi</p>')).toBe('oi');
    expect(shortText('x'.repeat(MAX_TEXT_LENGTH + 10))).toHaveLength(MAX_TEXT_LENGTH);
  });
});

describe('toProfile', () => {
  it('traduz os campos do perfil', () => {
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
  it('usa a primeira matrícula para a nota', () => {
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

  it('usa null sem matrícula', () => {
    expect(toCourse({ id: 1 })).toMatchObject({
      current_score: null,
      current_grade: null,
      term: undefined,
    });
  });
});

describe('toSubmissionFlags', () => {
  it('devolve null sem entrega e traduz as flags', () => {
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
  it('monta link absoluto e usa title ou name', () => {
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

describe('toAssignmentSummary', () => {
  it('inclui status e nota da entrega', () => {
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

  it('usa null sem entrega', () => {
    expect(toAssignmentSummary({ id: 1 })).toMatchObject({
      score: null,
      late: null,
      missing: null,
    });
  });
});

describe('toRubricCriterion', () => {
  it('formata os níveis', () => {
    expect(
      toRubricCriterion({
        description: 'C',
        points: 5,
        ratings: [{ points: 5, description: 'ótimo' }],
      }),
    ).toEqual({
      criterion: 'C',
      points: 5,
      ratings: ['5: ótimo'],
    });
    expect(toRubricCriterion({})).toMatchObject({ ratings: [] });
  });
});

describe('toFileInfo', () => {
  it('converte o tamanho para KB', () => {
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
  it('traz comentários e anexos', () => {
    const s = toSubmissionDetail({
      workflow_state: 'graded',
      submission_comments: [{ author_name: 'Prof', comment: 'bom', created_at: 'd' }],
      attachments: [{ display_name: 'a.txt' }],
    });
    expect(s).toMatchObject({
      comments: [{ author: 'Prof', text: 'bom', date: 'd' }],
      rubric_assessment: null,
    });
    expect(s.attachments as unknown[]).toHaveLength(1);
    expect(toSubmissionDetail({})).toMatchObject({ comments: [], attachments: [] });
  });
});

describe('toAssignmentDetail', () => {
  it('converte o enunciado e inclui a entrega quando houver', () => {
    const a = { id: 1, description: '<p>Faça</p>', rubric: [{ description: 'C' }] };
    expect(toAssignmentDetail(a, null)).toMatchObject({ description: 'Faça', submission: null });
    expect(toAssignmentDetail({ id: 2 }, { score: 7 })).toMatchObject({
      rubric: [],
      submission: { score: 7 },
    });
  });
});

describe('toGradeRow', () => {
  it('usa os dados da tarefa incluída', () => {
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
  it('busca o nome do curso pelo id', () => {
    const names = new Map([['5', 'Curso']]);
    expect(
      toEnrollmentGrade({ course_id: 5, grades: { current_score: 80, final_score: 70 } }, names),
    ).toMatchObject({
      course: 'Curso',
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
  it('prefere o nome do autor e converte o texto', () => {
    expect(
      toAnnouncement({
        id: 1,
        message: '<b>oi</b>',
        author: { display_name: 'A' },
        user_name: 'B',
      }),
    ).toMatchObject({ author: 'A', text: 'oi' });
    expect(toAnnouncement({ id: 1, user_name: 'B' })).toMatchObject({ author: 'B', text: '' });
  });
});

describe('toModule e toModuleItem', () => {
  it('traduz itens e conclusão', () => {
    expect(toModuleItem({ id: 1, completion_requirement: { completed: true } })).toMatchObject({
      completed: true,
    });
    expect(toModuleItem({ id: 1 })).toMatchObject({ completed: null });
    expect(toModule({ id: 1, name: 'M', items: [{ id: 2, title: 'Aula' }] })).toMatchObject({
      name: 'M',
      items: [{ title: 'Aula' }],
    });
    expect(toModule({ id: 1 })).toMatchObject({ items: [] });
  });
});

describe('toDiscussionSummary', () => {
  it('traz o prazo da tarefa vinculada ou null', () => {
    expect(toDiscussionSummary({ id: 1, assignment: { due_at: 'd' } })).toMatchObject({
      due_at: 'd',
    });
    expect(toDiscussionSummary({ id: 1 })).toMatchObject({ due_at: null });
  });
});

describe('flattenDiscussion', () => {
  it('achata respostas aninhadas com o nível e o autor', () => {
    const names = new Map([['1', 'Ana']]);
    const flat = flattenDiscussion(
      [{ user_id: 1, message: '<p>a</p>', replies: [{ user_id: 2, message: 'b' }] }],
      names,
    );
    expect(flat).toEqual([
      { depth: 0, author: 'Ana', date: undefined, text: 'a' },
      { depth: 1, author: undefined, date: undefined, text: 'b' },
    ]);
    expect(flattenDiscussion(undefined, names)).toEqual([]);
  });
});

describe('toCalendarEvent', () => {
  it('limita a descrição a 1000 caracteres', () => {
    expect(
      (toCalendarEvent({ title: 'E', description: 'x'.repeat(2000) }).description as string).length,
    ).toBe(1000);
  });
});
