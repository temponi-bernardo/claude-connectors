/**
 * Validation of the plan JSON before it is injected into the page: the zod shape plus the rules zod cannot
 * express (points add up to 100, real and ordered dates, unique ids, known course references). Pure.
 */
import type { ZodError } from 'zod';
import { planSchema } from './plan-schema.js';
import type { PlanData } from './plan-schema.js';
import { pointsTotal } from './plan-points.js';

/** Format of a checklist or question id (stable across updates: the saved ticks depend on it). */
export const PLAN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/;

/** Tolerance when checking that a course's points add up to 100. */
export const POINTS_TOLERANCE = 0.05;

export type PlanValidation =
  | { readonly ok: true; readonly plan: PlanData }
  | { readonly ok: false; readonly errors: readonly string[] };

/** Says whether a YYYY-MM-DD string is a real calendar date (2026-02-30 is not). */
export function isRealIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

/** Turns zod issues into `path: message` lines. */
export function zodIssueLines(error: ZodError): string[] {
  return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`);
}

/** Errors of courses whose points do not add up to 100 or whose grades exceed the assessment value. */
export function checkPointSums(plan: PlanData): string[] {
  return plan.courses.flatMap((course) => {
    const total = pointsTotal(course.points);
    const sum =
      Math.abs(total - 100) > POINTS_TOLERANCE
        ? [`courses.${course.id}.points: sure + pend + open + lost must be 100 (got ${total})`]
        : [];
    const grades = course.assessments
      .filter((a) => a.score !== null && a.score > a.max)
      .map((a) => `courses.${course.id}.assessments: "${a.title}" score is above its value`);
    return [...sum, ...grades];
  });
}

/** Every date in the plan with its path, for the calendar check. */
export function planDates(plan: PlanData): [string, string][] {
  const dates: [string, string][] = [
    ['focus.from', plan.focus.from],
    ['focus.to', plan.focus.to],
  ];
  plan.focus.blocks.forEach((b, i) => dates.push([`focus.blocks.${i}.date`, b.date]));
  plan.study.forEach((d, i) => dates.push([`study.${i}.date`, d.date]));
  plan.timeline.forEach((d, i) => dates.push([`timeline.${i}.date`, d.date]));
  plan.questions.forEach((q, i) => {
    if (q.sentOn) dates.push([`questions.${i}.sentOn`, q.sentOn]);
  });
  for (const course of plan.courses) {
    course.rules.forEach((r, i) => dates.push([`courses.${course.id}.rules.${i}.date`, r.date]));
    course.assessments.forEach((a, i) => {
      if (a.date) dates.push([`courses.${course.id}.assessments.${i}.date`, a.date]);
    });
  }
  return dates;
}

/** Errors of a day list that is not in strictly increasing date order. */
export function checkDayOrder(name: string, days: readonly { date: string }[]): string[] {
  return days.flatMap((day, i) => {
    const previous = days[i - 1];
    return previous && previous.date >= day.date
      ? [`${name}.${i}.date: days must be in increasing order without repeats (${day.date})`]
      : [];
  });
}

/** Errors of impossible dates, unordered day lists and a focus window that ends before it starts. */
export function checkPlanDates(plan: PlanData): string[] {
  const impossible = planDates(plan)
    .filter(([, value]) => !isRealIsoDate(value))
    .map(([path, value]) => `${path}: ${value} is not a real date`);
  const window = plan.focus.from > plan.focus.to ? ['focus: "from" must not be after "to"'] : [];
  return [
    ...impossible,
    ...window,
    ...checkDayOrder('study', plan.study),
    ...checkDayOrder('timeline', plan.timeline),
  ];
}

/** Every checklist item and question id with its path (undefined when the id is missing). */
export function planItemIds(plan: PlanData): [string, string | undefined][] {
  const ids: [string, string | undefined][] = [];
  for (const d of plan.study) d.items.forEach((it, j) => ids.push([`study.${d.date}.${j}`, it.id]));
  for (const d of plan.timeline) {
    d.items.forEach((it, j) => ids.push([`timeline.${d.date}.${j}`, it.id]));
  }
  plan.undated.forEach((it, j) => ids.push([`undated.${j}`, it.id]));
  plan.questions.forEach((q, j) => ids.push([`questions.${j}`, q.id]));
  return ids;
}

/** Values that appear more than once, in order of first repeat. */
export function repeatedValues(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) (seen.has(value) ? repeated : seen).add(value);
  return [...repeated];
}

/** Errors of missing, malformed or repeated ids, and of repeated course ids or codes. */
export function checkPlanIds(plan: PlanData): string[] {
  const ids = planItemIds(plan);
  const malformed = ids
    .filter(([, id]) => id === undefined || !PLAN_ID_PATTERN.test(id))
    .map(([path, id]) => `${path}: id ${id === undefined ? 'is missing' : `"${id}" is malformed`}`);
  const present = ids.flatMap(([, id]) => (id === undefined ? [] : [id]));
  return [
    ...malformed,
    ...repeatedValues(present).map((id) => `id "${id}" is used more than once`),
    ...repeatedValues(plan.courses.map((c) => c.id)).map((id) => `course id "${id}" repeats`),
    ...repeatedValues(plan.courses.map((c) => c.code)).map((c) => `course code "${c}" repeats`),
  ];
}

/** Errors of questions and WhatsApp groups that name a course code missing from `courses`. */
export function checkCourseRefs(plan: PlanData): string[] {
  const codes = new Set(plan.courses.map((c) => c.code));
  const refs: [string, string][] = [
    ...plan.questions.map((q, i): [string, string] => [`questions.${i}`, q.course]),
    ...plan.whatsappGroups.map((g, i): [string, string] => [`whatsappGroups.${i}`, g.course]),
  ];
  return refs
    .filter(([, code]) => !codes.has(code))
    .map(([path, code]) => `${path}.course: "${code}" is not a course code`);
}

/** Validates an unknown value as a plan: shape first, then the cross-field rules. */
export function validatePlan(input: unknown): PlanValidation {
  const parsed = planSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: zodIssueLines(parsed.error) };
  const plan = parsed.data;
  const errors = [
    ...checkPointSums(plan),
    ...checkPlanDates(plan),
    ...checkPlanIds(plan),
    ...checkCourseRefs(plan),
  ];
  return errors.length === 0 ? { ok: true, plan } : { ok: false, errors };
}
