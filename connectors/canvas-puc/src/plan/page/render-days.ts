/** "Hoje e amanhã" blocks, the day-by-day study plan, the timeline and the questions for instructors. */
import type {
  ItemStatus,
  PlanData,
  RiskLevel,
  StudyDay,
  TimelineDay,
  TimelineItem,
} from '../plan-schema.js';
import type { CheckStore } from './checks.js';
import { registerCheck } from './checks.js';
import { createEl, createRichEl, requireEl } from './dom.js';
import { formatDayMonth, weekdayOf } from './format.js';
import { courseLevels, levelClass } from './render-header.js';

export interface ChecklistEntry {
  readonly id: string;
  readonly course: string;
  readonly title: string;
  readonly time?: string | undefined;
  readonly meta?: string | undefined;
  readonly optional?: boolean | undefined;
  readonly status: ItemStatus;
}

export interface DayContext {
  readonly doc: Document;
  readonly today: string;
  readonly levels: ReadonlyMap<string, RiskLevel>;
  readonly store: CheckStore;
}

/** Classes of a day row: past days faded, today highlighted, conflict days in red. */
export function dayRowClass(date: string, today: string, conflict: boolean): string {
  let when = '';
  if (date < today) when = ' past';
  else if (date === today) when = ' now';
  return `day${when}${conflict ? ' clash' : ''}`;
}

/** "X de Y feitos": checked items among those not dropped. */
export function progressText(boxes: readonly HTMLInputElement[], verb: string): string {
  const live = boxes.filter((box) => !box.disabled);
  return `${live.filter((box) => box.checked).length} de ${live.length} ${verb}`;
}

/** Appends one checklist row (checkbox, course tag, title, time and points or duration) to a day. */
export function renderChecklistItem(
  ctx: DayContext,
  entry: ChecklistEntry,
  parent: HTMLElement,
): HTMLInputElement {
  const { doc } = ctx;
  const dropped = entry.status === 'dropped';
  const row = createEl(doc, 'div', {
    className: `item ${levelClass(ctx.levels, entry.course)}${entry.optional ? ' optional' : ''}${dropped ? ' dropped' : ''}`,
  });
  const box = createEl(doc, 'input');
  box.type = 'checkbox';
  box.id = `chk-${entry.id}`;
  box.disabled = dropped;
  const label = createEl(doc, 'label', {
    text: dropped ? `${entry.title} (cancelado)` : entry.title,
  });
  label.htmlFor = box.id;
  if (entry.time) label.append(createEl(doc, 'span', { className: 'time', text: entry.time }));
  row.append(box, createEl(doc, 'span', { className: 'tag', text: entry.course }), label);
  row.append(createEl(doc, 'span', { className: 'meta', text: entry.meta ?? '' }));
  registerCheck(ctx.store, { id: entry.id, def: entry.status === 'done' }, { box, row });
  parent.append(row);
  return box;
}

/** Day row with its date column; returns the row and its items container. */
export function renderDayRow(
  ctx: DayContext,
  date: string | null,
  conflict?: string,
): [HTMLElement, HTMLElement] {
  const { doc } = ctx;
  const row = createEl(doc, 'div', {
    className: date ? dayRowClass(date, ctx.today, conflict !== undefined) : 'day undated',
  });
  const when = createEl(doc, 'div', { className: 'date' });
  when.append(createEl(doc, 'b', { text: date ? formatDayMonth(date) : '?' }));
  when.append(doc.createTextNode(date ? weekdayOf(date) : 'sem data'));
  const items = createEl(doc, 'div', { className: 'items' });
  if (conflict) items.append(createEl(doc, 'p', { className: 'clash-note', text: conflict }));
  row.append(when, items);
  return [row, items];
}

/** The day-by-day study plan with its "X de Y feitos" counter. */
export function renderStudy(ctx: DayContext, days: readonly StudyDay[]): HTMLInputElement[] {
  const list = requireEl(ctx.doc, 'study-list');
  const boxes: HTMLInputElement[] = [];
  for (const day of days) {
    const [row, items] = renderDayRow(ctx, day.date);
    items.append(createEl(ctx.doc, 'p', { className: 'focus', text: day.focus }));
    for (const item of day.items) {
      const entry = { ...item, id: item.id ?? '', title: item.task, meta: item.duration };
      boxes.push(renderChecklistItem(ctx, entry, items));
    }
    list.append(row);
  }
  return boxes;
}

/** Timeline entry of a deadline or exam. */
export function timelineEntry(item: TimelineItem): ChecklistEntry {
  return { ...item, id: item.id ?? '', meta: item.points };
}

/** The timeline (dated days, then the "sem data" block). */
export function renderTimeline(
  ctx: DayContext,
  days: readonly TimelineDay[],
  undated: readonly TimelineItem[],
): HTMLInputElement[] {
  const list = requireEl(ctx.doc, 'timeline-list');
  const boxes: HTMLInputElement[] = [];
  for (const day of days) {
    const [row, items] = renderDayRow(ctx, day.date, day.conflict);
    for (const item of day.items) boxes.push(renderChecklistItem(ctx, timelineEntry(item), items));
    list.append(row);
  }
  if (undated.length > 0) {
    const [row, items] = renderDayRow(ctx, null);
    list.append(row);
    for (const item of undated) boxes.push(renderChecklistItem(ctx, timelineEntry(item), items));
  }
  return boxes;
}

/** The "Hoje e amanhã" window and its blocks (critical ones highlighted, steps numbered). */
export function renderToday(doc: Document, plan: PlanData): void {
  const { from, to, blocks } = plan.focus;
  const range = from === to ? '' : ` → ${weekdayOf(to)} ${formatDayMonth(to)}`;
  requireEl(doc, 'today-range').textContent = `${weekdayOf(from)} ${formatDayMonth(from)}${range}`;
  const grid = requireEl(doc, 'today-list');
  for (const block of blocks) {
    const slot = createEl(doc, 'div', { className: `slot${block.critical ? ' critical' : ''}` });
    slot.append(createEl(doc, 'span', { className: 'when', text: block.label }));
    slot.append(createEl(doc, 'h3', { text: block.title }));
    if (block.text) slot.append(createRichEl(doc, 'p', block.text));
    if (block.steps.length > 0) {
      const steps = createEl(doc, 'ol');
      for (const step of block.steps) steps.append(createRichEl(doc, 'li', step));
      slot.append(steps);
    }
    grid.append(slot);
  }
  if (blocks.length === 0)
    grid.append(
      createEl(doc, 'p', { className: 'empty', text: 'Nada vence nem tem prova nesses dias.' }),
    );
}

/** Questions for instructors, the sent ones marked as waiting for an answer. */
export function renderQuestions(doc: Document, plan: PlanData): void {
  const list = requireEl(doc, 'question-list');
  const levels = courseLevels(plan);
  for (const q of plan.questions) {
    const card = createEl(doc, 'div', { className: `ask ${levelClass(levels, q.course)}` });
    card.append(createEl(doc, 'span', { className: 'tag', text: q.course }));
    card.append(createRichEl(doc, 'p', q.text));
    if (q.status === 'sent') {
      const since = q.sentOn ? ` (enviada em ${formatDayMonth(q.sentOn)})` : '';
      card.append(
        createEl(doc, 'span', { className: 'waiting', text: `aguardando resposta${since}` }),
      );
    }
    list.append(card);
  }
  if (plan.questions.length === 0)
    list.append(createEl(doc, 'p', { className: 'empty', text: 'Nenhuma pergunta em aberto.' }));
}
