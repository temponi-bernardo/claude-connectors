import { describe, expect, it } from 'vitest';
import { fakeContext } from './fixtures/fake-context.js';
import {
  ASSIGNMENT_BUCKETS,
  activeCourses,
  courseContextCodes,
  courseNameMap,
  dateOnly,
  fetchOwnSubmission,
  getAllOrEmpty,
  isTextFile,
  isoDaysFrom,
  matchModuleItems,
  participantNames,
} from './helpers.js';

describe('isoDaysFrom e dateOnly', () => {
  it('soma e subtrai dias e extrai a data', () => {
    const now = new Date('2026-11-05T12:00:00Z');
    expect(isoDaysFrom(now, 2)).toBe('2026-11-07T12:00:00.000Z');
    expect(isoDaysFrom(now, -5)).toBe('2026-10-31T12:00:00.000Z');
    expect(dateOnly('2026-11-07T12:00:00.000Z')).toBe('2026-11-07');
  });
});

describe('ASSIGNMENT_BUCKETS', () => {
  it('não filtra em todas', () => {
    expect(ASSIGNMENT_BUCKETS.todas).toBeUndefined();
    expect(ASSIGNMENT_BUCKETS.atrasadas).toBe('overdue');
  });
});

describe('courseContextCodes, courseNameMap e participantNames', () => {
  it('monta códigos e mapas por id', () => {
    expect(courseContextCodes([1, '2'])).toEqual(['course_1', 'course_2']);
    expect(courseNameMap([{ id: 1, name: 'A' }, { id: 2 }]).get('2')).toBe('');
    expect(
      participantNames({ participants: [{ id: 3, display_name: 'Ana' }, { id: 4 }] }).get('3'),
    ).toBe('Ana');
    expect(participantNames({}).size).toBe(0);
  });
});

describe('isTextFile', () => {
  it('aceita por tipo ou extensão e recusa binários', () => {
    expect(isTextFile('text/plain', 'a')).toBe(true);
    expect(isTextFile('application/octet-stream', 'main.py')).toBe(true);
    expect(isTextFile('application/pdf', 'a.pdf')).toBe(false);
  });
});

describe('matchModuleItems', () => {
  it('encontra itens pelo título sem diferenciar maiúsculas', () => {
    const modules = [
      { id: 1, name: 'M1', items: [{ id: 1, title: 'Aula de Grafos', type: 'Page' }, { id: 2 }] },
      { id: 2 },
    ];
    expect(matchModuleItems(modules, 'grafos')).toEqual([
      { modulo: 'M1', titulo: 'Aula de Grafos', tipo: 'Page' },
    ]);
  });
});

describe('activeCourses', () => {
  it('pede só cursos ativos', async () => {
    const { ctx, getAll } = fakeContext({ '/courses': [{ id: 1 }] });
    await expect(activeCourses(ctx.client)).resolves.toEqual([{ id: 1 }]);
    expect(getAll).toHaveBeenCalledWith('/courses', { enrollment_state: 'active' });
  });
});

describe('fetchOwnSubmission', () => {
  it('devolve a entrega ou null em erro', async () => {
    const path = '/courses/1/assignments/2/submissions/self';
    await expect(
      fetchOwnSubmission(fakeContext({ [path]: { score: 1 } }).ctx.client, 1, 2),
    ).resolves.toEqual({ score: 1 });
    await expect(
      fetchOwnSubmission(fakeContext({ [path]: new Error('403') }).ctx.client, 1, 2),
    ).resolves.toBeNull();
  });
});

describe('getAllOrEmpty', () => {
  it('troca falha por lista vazia', async () => {
    const { ctx } = fakeContext({ '/ok': [1], '/ruim': new Error('x') });
    await expect(getAllOrEmpty(ctx.client, '/ok', {})).resolves.toEqual([1]);
    await expect(getAllOrEmpty(ctx.client, '/ruim', {})).resolves.toEqual([]);
  });
});
