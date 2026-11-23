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
  plannerWindow,
} from './helpers.js';

describe('plannerWindow', () => {
  it('starts at 00:00 of today in São Paulo and ends at the end of the last day', () => {
    expect(plannerWindow(new Date('2026-11-23T14:30:00Z'), 7)).toEqual({
      start_date: '2026-11-23T03:00:00.000Z',
      end_date: '2026-12-01T03:00:00.000Z',
    });
  });

  it('keeps an item due at 00:00 today inside the window late at night', () => {
    // 23:50 on the 23rd in São Paulo (02:50Z on the 24th): the window still starts on the 23rd.
    const window = plannerWindow(new Date('2026-11-24T02:50:00Z'), 1);
    expect(window.start_date).toBe('2026-11-23T03:00:00.000Z');
    expect(window.start_date <= '2026-11-23T03:00:00Z').toBe(true);
  });
});

describe('isoDaysFrom and dateOnly', () => {
  it('adds and subtracts days and extracts the date', () => {
    const now = new Date('2026-11-05T12:00:00Z');
    expect(isoDaysFrom(now, 2)).toBe('2026-11-07T12:00:00.000Z');
    expect(isoDaysFrom(now, -5)).toBe('2026-10-31T12:00:00.000Z');
    expect(dateOnly('2026-11-07T12:00:00.000Z')).toBe('2026-11-07');
  });
});

describe('ASSIGNMENT_BUCKETS', () => {
  it('does not filter with all', () => {
    expect(ASSIGNMENT_BUCKETS.all).toBeUndefined();
    expect(ASSIGNMENT_BUCKETS.overdue).toBe('overdue');
  });
});

describe('courseContextCodes, courseNameMap and participantNames', () => {
  it('builds codes and maps by id', () => {
    expect(courseContextCodes([1, '2'])).toEqual(['course_1', 'course_2']);
    expect(courseNameMap([{ id: 1, name: 'A' }, { id: 2 }]).get('2')).toBe('');
    expect(
      participantNames({ participants: [{ id: 3, display_name: 'Ana' }, { id: 4 }] }).get('3'),
    ).toBe('Ana');
    expect(participantNames({}).size).toBe(0);
  });
});

describe('isTextFile', () => {
  it('accepts by type or extension and refuses binaries', () => {
    expect(isTextFile('text/plain', 'a')).toBe(true);
    expect(isTextFile('application/octet-stream', 'main.py')).toBe(true);
    expect(isTextFile('application/pdf', 'a.pdf')).toBe(false);
  });
});

describe('matchModuleItems', () => {
  it('finds items by title, case-insensitively', () => {
    const modules = [
      { id: 1, name: 'M1', items: [{ id: 1, title: 'Graphs Lecture', type: 'Page' }, { id: 2 }] },
      { id: 2 },
    ];
    expect(matchModuleItems(modules, 'graphs')).toEqual([
      { module: 'M1', title: 'Graphs Lecture', type: 'Page' },
    ]);
  });
});

describe('activeCourses', () => {
  it('asks for active courses only', async () => {
    const { ctx, getAll } = fakeContext({ '/courses': [{ id: 1 }] });
    await expect(activeCourses(ctx.client)).resolves.toEqual([{ id: 1 }]);
    expect(getAll).toHaveBeenCalledWith('/courses', { enrollment_state: 'active' });
  });
});

describe('fetchOwnSubmission', () => {
  it('returns the submission, or null on error', async () => {
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
  it('turns a failure into an empty list', async () => {
    const { ctx } = fakeContext({ '/ok': [1], '/bad': new Error('x') });
    await expect(getAllOrEmpty(ctx.client, '/ok', {})).resolves.toEqual([1]);
    await expect(getAllOrEmpty(ctx.client, '/bad', {})).resolves.toEqual([]);
  });
});
