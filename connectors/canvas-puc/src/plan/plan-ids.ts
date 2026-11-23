/**
 * Stable ids for checklist items and questions across plan updates (the saved ticks depend on them):
 * new items without an id reuse the id of the same item in the previous version, or get a deterministic one;
 * items of the previous version that the new one left out are carried over, never deleted. Pure.
 */
import type { PlanData, StudyDay, TimelineDay } from './plan-schema.js';

type IdKind = 's' | 't' | 'u' | 'q';

interface IdEntry {
  readonly kind: IdKind;
  readonly key: string;
  readonly item: { id?: string | undefined };
}

/** Lowercase text without accents, with every run of other characters as one hyphen. */
export function normalizeMatchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 32-bit FNV-1a hash of a text, in base 36. */
export function fnvHash36(value: string): string {
  let hash = 0x811c9dc5;
  for (const char of value) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

/** Deterministic id for a key, with a numeric suffix when the base id is already taken. */
export function stableItemId(kind: IdKind, key: string, taken: ReadonlySet<string>): string {
  const base = `${kind}-${fnvHash36(key)}`;
  let id = base;
  for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`;
  return id;
}

/** Matching key of an item: its kind and parts (date, course, title) normalized and joined. */
export function itemMatchKey(kind: IdKind, parts: readonly string[]): string {
  return [kind, ...parts].map(normalizeMatchText).join('|');
}

/** Id entry of an item, keyed by its kind and parts. */
export function idEntry(kind: IdKind, parts: readonly string[], item: IdEntry['item']): IdEntry {
  return { kind, key: itemMatchKey(kind, parts), item };
}

/** Every item of a plan with its matching key (kind, date, course and normalized title). */
export function planIdEntries(plan: PlanData): IdEntry[] {
  return [
    ...plan.study.flatMap((d) =>
      d.items.map((it) => idEntry('s', [d.date, it.course, it.task], it)),
    ),
    ...plan.timeline.flatMap((d) =>
      d.items.map((it) => idEntry('t', [d.date, it.course, it.title], it)),
    ),
    ...plan.undated.map((it) => idEntry('u', [it.course, it.title], it)),
    ...plan.questions.map((it) => idEntry('q', [it.course, it.text], it)),
  ];
}

/** Map from matching key to id, for the items of a previous plan that have one. */
export function previousIdIndex(previous: PlanData | null): Map<string, string> {
  const index = new Map<string, string>();
  for (const entry of previous ? planIdEntries(previous) : []) {
    if (entry.item.id !== undefined && !index.has(entry.key)) index.set(entry.key, entry.item.id);
  }
  return index;
}

/** Copy of the plan where every item without an id gets the previous version's id or a new stable one. */
export function assignPlanIds(next: PlanData, previous: PlanData | null): PlanData {
  const plan = structuredClone(next);
  const entries = planIdEntries(plan);
  const taken = new Set(entries.flatMap((e) => (e.item.id === undefined ? [] : [e.item.id])));
  const index = previousIdIndex(previous);
  for (const entry of entries.filter((e) => e.item.id === undefined)) {
    const reused = index.get(entry.key);
    const id =
      reused !== undefined && !taken.has(reused)
        ? reused
        : stableItemId(entry.kind, entry.key, taken);
    entry.item.id = id;
    taken.add(id);
  }
  return plan;
}

/** Copy of the day list with the previous day's left-out items added back (the day is recreated if missing). */
export function carryDays<D extends StudyDay | TimelineDay>(
  days: readonly D[],
  previousDays: readonly D[],
  keep: (id: string | undefined) => boolean,
): D[] {
  const result = structuredClone([...days]);
  for (const previous of previousDays) {
    const left = previous.items.filter((item) => keep(item.id));
    if (left.length === 0) continue;
    let day = result.find((d) => d.date === previous.date);
    if (!day) {
      day = { ...structuredClone(previous), items: [] };
      result.push(day);
    }
    (day.items as D['items'][number][]).push(...structuredClone(left));
  }
  return result.sort((a, b) => a.date.localeCompare(b.date));
}

/** Copy of the plan with the previous version's checklist items that it left out carried over. */
export function carryPreviousItems(next: PlanData, previous: PlanData): PlanData {
  const present = new Set(planIdEntries(next).map((e) => e.item.id));
  function keep(id: string | undefined): boolean {
    return id !== undefined && !present.has(id);
  }
  return {
    ...structuredClone(next),
    study: carryDays(next.study, previous.study, keep),
    timeline: carryDays(next.timeline, previous.timeline, keep),
    undated: [
      ...structuredClone(next.undated),
      ...structuredClone(previous.undated.filter((i) => keep(i.id))),
    ],
  };
}

/** Merges a new plan with the previous version: ids reused or assigned, left-out items carried over. */
export function mergeWithPrevious(next: PlanData, previous: PlanData | null): PlanData {
  const withIds = assignPlanIds(next, previous);
  return previous ? carryPreviousItems(withIds, previous) : withIds;
}
