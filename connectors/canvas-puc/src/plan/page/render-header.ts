/** Header (title, situation, sources, goal and assumptions), risk chips and footer of the plan page. */
import type { PlanData, RiskLevel } from '../plan-schema.js';
import { planTitle } from '../plan-embed.js';
import { formatPoints, pointsMissing, riskLevel } from '../plan-points.js';
import { appendRichText, createEl, requireEl } from './dom.js';
import { formatStamp } from './format.js';

/** pt-BR label of each risk level. */
export const LEVEL_LABELS: Readonly<Record<RiskLevel, string>> = {
  high: 'Risco alto',
  warn: 'Atenção',
  ok: 'Tranquila',
};

/** pt-BR heading of each assumption kind, in display order. */
export const ASSUMPTION_LABELS = {
  informed: 'Informado por você',
  estimate: 'Estimativas usadas',
  change: 'Mudanças recentes de data',
} as const;

/** Goal of a course: its own (from the syllabus) or the plan's. */
export function courseGoal(plan: PlanData, code: string): number {
  return plan.courses.find((c) => c.code === code)?.goal ?? plan.goal;
}

/** Risk level of every course, by code. */
export function courseLevels(plan: PlanData): Map<string, RiskLevel> {
  return new Map(
    plan.courses.map((c) => [c.code, riskLevel(c.points, c.goal ?? plan.goal, c.needsRecovery)]),
  );
}

/** CSS class that colors a tag: the course's level, or neutral for tags that are not a course. */
export function levelClass(levels: ReadonlyMap<string, RiskLevel>, code: string): string {
  return `lvl-${levels.get(code) ?? 'none'}`;
}

/** Sentence under the title: program, course count, situation time, sources and goal. */
export function situationText(plan: PlanData): string {
  const n = plan.courses.length;
  const custom = plan.courses.some((c) => c.goal !== undefined && c.goal !== plan.goal);
  return [
    `${plan.program} · PUC Minas · ${n} ${n === 1 ? 'matéria' : 'matérias'}.`,
    `Situação em ${formatStamp(plan.generatedAt)}, a partir de: ${plan.sources.join(', ')}.`,
    `Para aprovar: **${formatPoints(plan.goal)} de 100** pontos em cada matéria${custom ? ' (salvo onde o plano de ensino diz outra meta)' : ''}.`,
  ].join(' ');
}

/** Fills the header: title, situation and the assumptions box (hidden when empty). */
export function renderHeader(doc: Document, plan: PlanData): void {
  requireEl(doc, 'plan-title').textContent = planTitle(plan.term);
  appendRichText(requireEl(doc, 'plan-situation'), situationText(plan));
  const box = requireEl(doc, 'plan-assumptions');
  for (const [kind, label] of Object.entries(ASSUMPTION_LABELS)) {
    const texts = plan.assumptions.filter((a) => a.kind === kind).map((a) => a.text);
    if (texts.length === 0) continue;
    const row = createEl(doc, 'p');
    row.append(createEl(doc, 'strong', { text: `${label}: ` }));
    texts.forEach((t, i) => appendRichText(row, i === 0 ? t : ` · ${t}`));
    box.append(row);
  }
  box.hidden = plan.assumptions.length === 0;
}

/** One chip per course linking to its card: code, points missing and level. */
export function renderRiskChips(doc: Document, plan: PlanData): void {
  const list = requireEl(doc, 'risk-list');
  const levels = courseLevels(plan);
  for (const course of plan.courses) {
    const level = levels.get(course.code) ?? 'ok';
    const missing = pointsMissing(course.points, course.goal ?? plan.goal);
    const chip = createEl(doc, 'a', { className: `chip ${levelClass(levels, course.code)}` });
    chip.href = `#curso-${course.id}`;
    chip.append(createEl(doc, 'span', { className: 'chip-code', text: course.code }));
    chip.append(
      createEl(doc, 'span', {
        className: 'chip-need',
        text: `faltam ${formatPoints(missing)} pts`,
      }),
    );
    chip.append(createEl(doc, 'span', { className: 'chip-level', text: LEVEL_LABELS[level] }));
    list.append(chip);
  }
}

/** Footer: sources and time of the query, and the sources that were not connected. */
export function renderFooter(doc: Document, plan: PlanData): void {
  const footer = requireEl(doc, 'plan-footer');
  footer.append(
    createEl(doc, 'p', {
      text: `Fontes: ${plan.sources.join(', ')} · consultadas em ${formatStamp(plan.generatedAt)} (horário de Brasília).`,
    }),
  );
  if (plan.missingSources.length > 0) {
    footer.append(
      createEl(doc, 'p', {
        className: 'missing-sources',
        text: `Fontes não conectadas: ${plan.missingSources.join(', ')}.`,
      }),
    );
  }
}
