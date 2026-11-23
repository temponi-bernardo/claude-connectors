/** Course cards: points missing, guaranteed and maximum, stacked bar with the goal, assessments, path and rules. */
import type { Assessment, PlanCourse, PlanData } from '../plan-schema.js';
import { barSegments, formatPoints, pointsMissing, riskLevel } from '../plan-points.js';
import { createEl, createRichEl, requireEl } from './dom.js';
import { formatDayMonth } from './format.js';
import { LEVEL_LABELS } from './render-header.js';

/** pt-BR name of each bar segment, for the accessible description. */
export const SEGMENT_LABELS = {
  sure: 'garantidos',
  pend: 'enviados sem nota',
  open: 'em aberto',
  lost: 'perdidos ou incertos',
} as const;

/** "15 / 30", "≈8 / 10" (estimated) or "— / 30" (no grade yet). */
export function assessmentValueText(a: Assessment): string {
  const score = a.score === null ? '—' : `${a.estimated ? '≈' : ''}${formatPoints(a.score)}`;
  return `${score} / ${formatPoints(a.max)}`;
}

/** Assessment name with its date and whether the student gave the grade ("Prova 3 · 09/12"). */
export function assessmentTitleText(a: Assessment): string {
  const date = a.date ? ` · ${formatDayMonth(a.date)}` : '';
  return `${a.title}${date}${a.informedByStudent ? ' · informado por você' : ''}`;
}

/** Accessible description of the bar: every segment in points and the goal. */
export function barLabel(course: PlanCourse, goal: number): string {
  const parts = (Object.keys(SEGMENT_LABELS) as (keyof typeof SEGMENT_LABELS)[])
    .filter((kind) => course.points[kind] > 0)
    .map((kind) => `${formatPoints(course.points[kind])} ${SEGMENT_LABELS[kind]}`);
  return `${course.code}: ${parts.join(', ')}; meta ${formatPoints(goal)}`;
}

/** Stacked bar (sure / pending / open / lost) with the goal marker. */
export function renderPointsBar(doc: Document, course: PlanCourse, goal: number): HTMLElement {
  const bar = createEl(doc, 'div', { className: 'bar' });
  bar.setAttribute('role', 'img');
  bar.setAttribute('aria-label', barLabel(course, goal));
  for (const segment of barSegments(course.points)) {
    const span = createEl(doc, 'span', { className: `seg seg-${segment.kind}` });
    span.style.width = `${segment.percent}%`;
    bar.append(span);
  }
  const marker = createEl(doc, 'span', { className: 'goal' });
  marker.dataset.label = formatPoints(goal);
  marker.style.left = `${Math.min(100, goal)}%`;
  bar.append(marker);
  return bar;
}

/** Big number and the guaranteed / maximum line. */
export function renderNeed(doc: Document, course: PlanCourse, goal: number): HTMLElement {
  const p = course.points;
  const need = createEl(doc, 'div', { className: 'need' });
  need.append(
    createEl(doc, 'span', {
      className: 'need-big num',
      text: formatPoints(pointsMissing(p, goal)),
    }),
  );
  need.append(
    createEl(doc, 'span', {
      className: 'need-label',
      text: `pts faltando · garantido ${formatPoints(p.sure + p.pend)} · máx. possível ${formatPoints(p.sure + p.pend + p.open)}`,
    }),
  );
  return need;
}

/** List of assessments with their grade or value. */
export function renderAssessments(doc: Document, course: PlanCourse): HTMLElement {
  const list = createEl(doc, 'ul', { className: 'facts' });
  for (const a of course.assessments) {
    const li = createEl(doc, 'li');
    li.append(createEl(doc, 'span', { text: assessmentTitleText(a) }));
    li.append(createEl(doc, 'span', { className: 'num', text: assessmentValueText(a) }));
    list.append(li);
  }
  return list;
}

/** Collapsible "Regras e avisos", each rule with its source and date. */
export function renderRules(doc: Document, course: PlanCourse): HTMLElement {
  const details = createEl(doc, 'details', { className: 'rules' });
  details.append(createEl(doc, 'summary', { text: `Regras e avisos (${course.rules.length})` }));
  const list = createEl(doc, 'ul');
  for (const rule of course.rules) {
    const li = createRichEl(doc, 'li', rule.text);
    li.append(
      createEl(doc, 'span', {
        className: 'rule-source',
        text: ` — ${rule.source}, ${formatDayMonth(rule.date)}`,
      }),
    );
    list.append(li);
  }
  details.append(list);
  return details;
}

/** Card head: code, name, instructor and level pill. */
export function renderCardHead(doc: Document, course: PlanCourse, label: string): HTMLElement {
  const head = createEl(doc, 'div', { className: 'card-head' });
  const names = createEl(doc, 'div');
  names.append(createEl(doc, 'h3', { text: course.code }));
  const teacher = course.teacher ? ` · ${course.teacher}` : '';
  names.append(createEl(doc, 'p', { className: 'card-name', text: `${course.name}${teacher}` }));
  head.append(names, createEl(doc, 'span', { className: 'pill', text: label }));
  return head;
}

/** Fills the course cards. */
export function renderCourses(doc: Document, plan: PlanData): void {
  const grid = requireEl(doc, 'course-list');
  for (const course of plan.courses) {
    const goal = course.goal ?? plan.goal;
    const level = riskLevel(course.points, goal, course.needsRecovery);
    const card = createEl(doc, 'article', { className: `card lvl-${level}` });
    card.id = `curso-${course.id}`;
    const path = createRichEl(doc, 'p', `Caminho até a meta: ${course.path}`);
    path.className = 'path';
    const barWrap = createEl(doc, 'div', { className: 'bar-wrap' });
    barWrap.append(renderPointsBar(doc, course, goal));
    card.append(
      renderCardHead(doc, course, LEVEL_LABELS[level]),
      renderNeed(doc, course, goal),
      barWrap,
    );
    card.append(renderAssessments(doc, course), path, renderRules(doc, course));
    grid.append(card);
  }
}
