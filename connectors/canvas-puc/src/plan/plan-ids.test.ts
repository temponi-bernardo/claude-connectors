import { describe, expect, it } from 'vitest';
import { samplePlan } from '../fixtures/plan-sample.js';
import {
  assignPlanIds,
  carryDays,
  carryPreviousItems,
  fnvHash36,
  idEntry,
  itemMatchKey,
  mergeWithPrevious,
  normalizeMatchText,
  planIdEntries,
  previousIdIndex,
  stableItemId,
} from './plan-ids.js';
import { validatePlan } from './plan-validate.js';

describe('normalizeMatchText', () => {
  it('drops accents, case and punctuation', () => {
    expect(normalizeMatchText('  Rotações AVL — Lista 5! ')).toBe('rotacoes-avl-lista-5');
  });
});

describe('fnvHash36', () => {
  it('is deterministic and differs for different texts', () => {
    expect(fnvHash36('abc')).toBe(fnvHash36('abc'));
    expect(fnvHash36('abc')).not.toBe(fnvHash36('abd'));
  });
});

describe('itemMatchKey and idEntry', () => {
  it('joins the normalized parts after the kind', () => {
    expect(itemMatchKey('t', ['2026-11-26', 'EDA', 'Prova 3'])).toBe('t|2026-11-26|eda|prova-3');
    expect(idEntry('q', ['ALG', 'Dúvida'], { id: 'q-1' }).key).toBe('q|alg|duvida');
  });
});

describe('stableItemId', () => {
  it('adds a suffix when the id is taken', () => {
    const first = stableItemId('s', 'k', new Set());
    expect(stableItemId('s', 'k', new Set([first]))).toBe(`${first}-2`);
  });
});

describe('planIdEntries and previousIdIndex', () => {
  it('keys every item and indexes the existing ids', () => {
    const plan = samplePlan();
    expect(planIdEntries(plan)).toHaveLength(13);
    expect(previousIdIndex(plan).size).toBe(13);
    expect(previousIdIndex(null).size).toBe(0);
  });
});

describe('assignPlanIds', () => {
  it('keeps given ids and reuses the previous id of an unchanged item', () => {
    const previous = samplePlan();
    const next = samplePlan();
    Reflect.deleteProperty(next.study[1]!.items[0]!, 'id');
    expect(assignPlanIds(next, previous).study[1]!.items[0]!.id).toBe('s-eda-avl');
  });
  it('matches ignoring accents and case', () => {
    const previous = samplePlan();
    const next = samplePlan();
    const item = next.timeline[1]!.items[0]!;
    Reflect.deleteProperty(item, 'id');
    item.title = 'PROVA 3';
    expect(assignPlanIds(next, previous).timeline[1]!.items[0]!.id).toBe('t-eda-p3');
  });
  it('gives new items a stable id, the same on every run', () => {
    const next = samplePlan();
    next.undated.push({ course: 'BD', title: 'Novo item', status: 'open' });
    const a = assignPlanIds(next, null).undated[1]!.id;
    expect(a).toMatch(/^u-[a-z0-9]+$/);
    expect(assignPlanIds(next, null).undated[1]!.id).toBe(a);
  });
  it('does not reuse an id already taken in the new plan', () => {
    const previous = samplePlan();
    const next = samplePlan();
    const copy = { ...next.study[1]!.items[0]! };
    Reflect.deleteProperty(copy, 'id');
    next.study[1]!.items.push(copy);
    const ids = assignPlanIds(next, previous).study[1]!.items.map((i) => i.id);
    expect(new Set(ids).size).toBe(3);
  });
  it('does not change the input', () => {
    const next = samplePlan();
    Reflect.deleteProperty(next.questions[0]!, 'id');
    assignPlanIds(next, null);
    expect(next.questions[0]!.id).toBeUndefined();
  });
});

describe('carryDays', () => {
  it('recreates a missing day in date order', () => {
    const previous = samplePlan().study;
    const days = carryDays(previous.slice(1), previous, (id) => id === 's-old-1');
    expect(days.map((d) => d.date)).toEqual(['2026-11-22', '2026-11-23', '2026-11-24']);
    expect(days[0]!.items.map((i) => i.id)).toEqual(['s-old-1']);
  });
});

describe('carryPreviousItems', () => {
  it('never drops an item of the previous version', () => {
    const previous = samplePlan();
    const next = samplePlan();
    next.study.shift();
    next.timeline[1]!.items.pop();
    next.undated = [];
    const merged = carryPreviousItems(next, previous);
    expect(merged.study[0]!.items[0]!.status).toBe('done');
    expect(merged.timeline[1]!.items.map((i) => i.id)).toContain('t-bd-check');
    expect(merged.undated.map((i) => i.id)).toEqual(['t-eda-ex']);
  });
});

describe('mergeWithPrevious', () => {
  it('produces a valid plan with the previous ids', () => {
    const previous = samplePlan();
    const next = samplePlan();
    for (const day of next.study) for (const item of day.items) Reflect.deleteProperty(item, 'id');
    const merged = mergeWithPrevious(next, previous);
    expect(validatePlan(merged).ok).toBe(true);
    expect(merged.study.flatMap((d) => d.items.map((i) => i.id))).toEqual(
      previous.study.flatMap((d) => d.items.map((i) => i.id)),
    );
  });
  it('only assigns ids without a previous plan', () => {
    expect(mergeWithPrevious(samplePlan(), null)).toEqual(samplePlan());
  });
});
