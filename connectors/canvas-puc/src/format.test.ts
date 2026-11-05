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
      nome: 'A',
      email: 'a@x',
      login: 'l',
      fuso: 'tz',
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
      nome: 'N',
      codigo: 'C',
      periodo: 'T',
      nota_atual: 9,
      conceito_atual: 'A',
    });
  });

  it('usa null sem matrícula', () => {
    expect(toCourse({ id: 1 })).toMatchObject({
      nota_atual: null,
      conceito_atual: null,
      periodo: undefined,
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
      entregue: true,
      atrasado: false,
      faltando: false,
      corrigido: true,
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
      tipo: 'assignment',
      titulo: 'P2',
      pontos: 30,
      url: 'https://x.test/c/1',
      entrega: null,
    });
    expect(toPlannerItem({ plannable: { name: 'Ev' } }, 'b')).toMatchObject({
      titulo: 'Ev',
      url: undefined,
    });
    expect(toPlannerItem({}, 'b')).toMatchObject({ titulo: undefined, pontos: undefined });
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
      nome: 'T',
      status: 'graded',
      nota: 8,
      atrasada: true,
      faltando: false,
    });
  });

  it('usa null sem entrega', () => {
    expect(toAssignmentSummary({ id: 1 })).toMatchObject({
      nota: null,
      atrasada: null,
      faltando: null,
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
      criterio: 'C',
      pontos: 5,
      niveis: ['5: ótimo'],
    });
    expect(toRubricCriterion({})).toMatchObject({ niveis: [] });
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
      nome: 'a.pdf',
      tamanho_kb: 2,
      tipo: 'application/pdf',
      download: 'u',
    });
    expect(toFileInfo({})).toMatchObject({ tamanho_kb: 0 });
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
      comentarios: [{ autor: 'Prof', texto: 'bom', data: 'd' }],
      avaliacao_rubrica: null,
    });
    expect(s.anexos as unknown[]).toHaveLength(1);
    expect(toSubmissionDetail({})).toMatchObject({ comentarios: [], anexos: [] });
  });
});

describe('toAssignmentDetail', () => {
  it('converte o enunciado e inclui a entrega quando houver', () => {
    const a = { id: 1, description: '<p>Faça</p>', rubric: [{ description: 'C' }] };
    expect(toAssignmentDetail(a, null)).toMatchObject({ enunciado: 'Faça', entrega: null });
    expect(toAssignmentDetail({ id: 2 }, { score: 7 })).toMatchObject({
      rubrica: [],
      entrega: { nota: 7 },
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
      tarefa: 'T',
      nota: 7,
      de: 10,
    });
    expect(toGradeRow({})).toMatchObject({ tarefa: undefined, de: undefined });
  });
});

describe('toEnrollmentGrade', () => {
  it('busca o nome do curso pelo id', () => {
    const names = new Map([['5', 'Curso']]);
    expect(
      toEnrollmentGrade({ course_id: 5, grades: { current_score: 80, final_score: 70 } }, names),
    ).toMatchObject({
      curso: 'Curso',
      nota_atual: 80,
      nota_final: 70,
    });
    expect(toEnrollmentGrade({ course_id: 6 }, names)).toMatchObject({
      curso: undefined,
      nota_atual: undefined,
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
    ).toMatchObject({ autor: 'A', texto: 'oi' });
    expect(toAnnouncement({ id: 1, user_name: 'B' })).toMatchObject({ autor: 'B', texto: '' });
  });
});

describe('toModule e toModuleItem', () => {
  it('traduz itens e conclusão', () => {
    expect(toModuleItem({ id: 1, completion_requirement: { completed: true } })).toMatchObject({
      concluido: true,
    });
    expect(toModuleItem({ id: 1 })).toMatchObject({ concluido: null });
    expect(toModule({ id: 1, name: 'M', items: [{ id: 2, title: 'Aula' }] })).toMatchObject({
      nome: 'M',
      itens: [{ titulo: 'Aula' }],
    });
    expect(toModule({ id: 1 })).toMatchObject({ itens: [] });
  });
});

describe('toDiscussionSummary', () => {
  it('traz o prazo da tarefa vinculada ou null', () => {
    expect(toDiscussionSummary({ id: 1, assignment: { due_at: 'd' } })).toMatchObject({
      prazo: 'd',
    });
    expect(toDiscussionSummary({ id: 1 })).toMatchObject({ prazo: null });
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
      { nivel: 0, autor: 'Ana', data: undefined, texto: 'a' },
      { nivel: 1, autor: undefined, data: undefined, texto: 'b' },
    ]);
    expect(flattenDiscussion(undefined, names)).toEqual([]);
  });
});

describe('toCalendarEvent', () => {
  it('limita a descrição a 1000 caracteres', () => {
    expect(
      (toCalendarEvent({ title: 'E', description: 'x'.repeat(2000) }).descricao as string).length,
    ).toBe(1000);
  });
});
