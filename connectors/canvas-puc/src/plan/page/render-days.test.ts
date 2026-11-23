// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { loadPlanDocument } from './fixtures/plan-dom.js';
import { samplePlan } from '../../fixtures/plan-sample.js';
import { createCheckStore } from './checks.js';
import {
  dayRowClass,
  progressText,
  renderChecklistItem,
  renderDayRow,
  renderQuestions,
  renderStudy,
  renderTimeline,
  renderToday,
  timelineEntry,
} from './render-days.js';
import type { DayContext } from './render-days.js';
import { courseLevels } from './render-header.js';

function context(): DayContext {
  const doc = loadPlanDocument(samplePlan());
  const store = createCheckStore({ key: 'k', storage: null, status: () => undefined });
  return { doc, today: '2026-11-23', levels: courseLevels(samplePlan()), store };
}

describe('dayRowClass', () => {
  it.each([
    ['2026-11-22', false, 'day past'],
    ['2026-11-23', false, 'day now'],
    ['2026-11-24', true, 'day clash'],
  ])('%s (conflict %s) → %s', (date, conflict, expected) => {
    expect(dayRowClass(date, '2026-11-23', conflict)).toBe(expected);
  });
});

describe('progressText', () => {
  it('counts checked boxes that are not disabled', () => {
    const boxes = [true, false, true].map((checked, i) => {
      const box = document.createElement('input');
      box.checked = checked;
      box.disabled = i === 2;
      return box;
    });
    expect(progressText(boxes, 'feitos')).toBe('1 de 2 feitos');
  });
});

describe('renderChecklistItem and renderDayRow', () => {
  it('builds a labelled row with time and points, dashed when optional', () => {
    const ctx = context();
    const [row, items] = renderDayRow(ctx, '2026-12-09');
    const box = renderChecklistItem(ctx, timelineEntry(samplePlan().timeline[2]!.items[1]!), items);
    const item = row.querySelector('.item')!;
    expect(item.className).toBe('item lvl-high optional');
    expect(row.querySelector('label')?.htmlFor).toBe(box.id);
    expect(item.textContent).toBe('ALGReavaliação (se precisar)10:3030 pts');
    expect(row.querySelector('.date')?.textContent).toBe('09/12qua');
  });
});

describe('renderStudy and renderTimeline', () => {
  it('render every day and item', () => {
    const ctx = context();
    expect(renderStudy(ctx, samplePlan().study)).toHaveLength(5);
    expect(renderTimeline(ctx, samplePlan().timeline, samplePlan().undated)).toHaveLength(6);
    expect(ctx.doc.querySelectorAll('#study-list .focus')).toHaveLength(3);
  });
  it('skips the undated block when empty', () => {
    const ctx = context();
    renderTimeline(ctx, [], []);
    expect(ctx.doc.querySelector('#timeline-list .undated')).toBeNull();
  });
});

describe('renderToday', () => {
  it('shows a single-day window and an empty state', () => {
    const plan = samplePlan();
    plan.focus = { from: '2026-11-24', to: '2026-11-24', blocks: [] };
    const doc = loadPlanDocument(plan);
    renderToday(doc, plan);
    expect(doc.getElementById('today-range')?.textContent).toBe('ter 24/11');
    expect(doc.querySelector('#today-list .empty')).not.toBeNull();
  });
  it('numbers the steps and keeps bold text', () => {
    const doc = loadPlanDocument(samplePlan());
    renderToday(doc, samplePlan());
    expect(doc.querySelector('#today-list ol li b')?.textContent).toBe('rotações AVL');
  });
});

describe('renderQuestions', () => {
  it('shows an empty state and sent questions without a date', () => {
    const plan = samplePlan();
    plan.questions = [];
    let doc = loadPlanDocument(plan);
    renderQuestions(doc, plan);
    expect(doc.querySelector('#question-list .empty')).not.toBeNull();
    plan.questions = [{ id: 'q-x', course: 'BD', text: 'x', status: 'sent' }];
    doc = loadPlanDocument(plan);
    renderQuestions(doc, plan);
    expect(doc.querySelector('.waiting')?.textContent).toBe('aguardando resposta');
  });
});
