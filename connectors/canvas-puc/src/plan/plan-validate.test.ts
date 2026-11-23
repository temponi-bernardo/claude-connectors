import { describe, expect, it } from 'vitest';
import { samplePlan } from '../fixtures/plan-sample.js';
import type { PlanData } from './plan-schema.js';
import {
  checkCourseRefs,
  checkDayOrder,
  checkPlanDates,
  checkPlanIds,
  checkPointSums,
  isRealIsoDate,
  planDates,
  planItemIds,
  repeatedValues,
  validatePlan,
  zodIssueLines,
} from './plan-validate.js';
import { planSchema } from './plan-schema.js';

function errorsOf(change: (plan: PlanData) => void): readonly string[] {
  const plan = samplePlan();
  change(plan);
  const result = validatePlan(plan);
  return result.ok ? [] : result.errors;
}

describe('validatePlan', () => {
  it('accepts the sample plan', () => {
    expect(validatePlan(samplePlan()).ok).toBe(true);
  });
  it('rejects a missing required field', () => {
    expect(errorsOf((p) => Reflect.deleteProperty(p, 'term')).join()).toContain('term');
  });
  it('rejects unknown fields', () => {
    expect(errorsOf((p) => Object.assign(p, { extra: 1 })).join()).toContain('extra');
  });
  it('rejects an invalid item status', () => {
    expect(
      errorsOf((p) => Object.assign(p.study[1]!.items[0]!, { status: 'maybe' })).length,
    ).toBeGreaterThan(0);
  });
  it('rejects points that do not add up to 100', () => {
    expect(errorsOf((p) => (p.courses[0]!.points.lost = 10)).join()).toContain('must be 100');
  });
  it('rejects a date that is not ISO', () => {
    expect(errorsOf((p) => (p.timeline[0]!.date = '20/11/2026')).join()).toContain('YYYY-MM-DD');
  });
  it('rejects unordered days', () => {
    expect(errorsOf((p) => p.study.reverse()).join()).toContain('increasing order');
  });
  it('rejects repeated ids', () => {
    expect(errorsOf((p) => (p.undated[0]!.id = 't-eda-p3')).join()).toContain('more than once');
  });
  it('rejects a question about an unknown course', () => {
    expect(errorsOf((p) => (p.questions[0]!.course = 'XYZ')).join()).toContain('not a course code');
  });
  it('rejects a generatedAt without offset', () => {
    expect(errorsOf((p) => (p.generatedAt = '2026-11-23 07:00')).join()).toContain('generatedAt');
  });
});

describe('isRealIsoDate', () => {
  it.each([
    ['2026-11-23', true],
    ['2026-02-30', false],
    ['2026-13-01', false],
    ['23/11/2026', false],
  ])('%s → %s', (value, expected) => {
    expect(isRealIsoDate(value)).toBe(expected);
  });
});

describe('zodIssueLines', () => {
  it('prefixes each issue with its path', () => {
    const parsed = planSchema.safeParse({});
    expect(parsed.success).toBe(false);
    if (!parsed.success)
      expect(zodIssueLines(parsed.error)).toContain('schema: Invalid literal value, expected 1');
  });
});

describe('checkPointSums', () => {
  it('flags a grade above the assessment value', () => {
    const plan = samplePlan();
    plan.courses[0]!.assessments[0]!.score = 31;
    expect(checkPointSums(plan)).toEqual([
      'courses.alg.assessments: "Prova 1" score is above its value',
    ]);
  });
  it('accepts small rounding differences', () => {
    const plan = samplePlan();
    plan.courses[0]!.points.lost = 28.53;
    expect(checkPointSums(plan)).toEqual([]);
  });
});

describe('planDates', () => {
  it('lists dates from every part of the plan', () => {
    const paths = planDates(samplePlan()).map(([path]) => path);
    expect(paths).toEqual(
      expect.arrayContaining([
        'focus.from',
        'study.0.date',
        'questions.1.sentOn',
        'courses.alg.rules.0.date',
      ]),
    );
  });
});

describe('checkDayOrder', () => {
  it('rejects repeated days', () => {
    expect(checkDayOrder('t', [{ date: '2026-01-01' }, { date: '2026-01-01' }])).toHaveLength(1);
  });
});

describe('checkPlanDates', () => {
  it('flags impossible dates and an inverted focus window', () => {
    const plan = samplePlan();
    plan.focus.to = '2026-11-22';
    plan.courses[0]!.rules[0]!.date = '2026-02-31';
    expect(checkPlanDates(plan)).toEqual([
      'courses.alg.rules.0.date: 2026-02-31 is not a real date',
      'focus: "from" must not be after "to"',
    ]);
  });
});

describe('planItemIds and checkPlanIds', () => {
  it('collects study, timeline, undated and question ids', () => {
    expect(planItemIds(samplePlan())).toHaveLength(13);
  });
  it('flags missing and malformed ids and repeated course codes', () => {
    const plan = samplePlan();
    plan.study[1]!.items[0]!.id = 'Bad Id';
    Reflect.deleteProperty(plan.study[1]!.items[1]!, 'id');
    plan.courses[1]!.code = 'ALG';
    expect(checkPlanIds(plan)).toEqual([
      'study.2026-11-23.0: id "Bad Id" is malformed',
      'study.2026-11-23.1: id is missing',
      'course code "ALG" repeats',
    ]);
  });
});

describe('repeatedValues', () => {
  it('returns each repeated value once', () => {
    expect(repeatedValues(['a', 'b', 'a', 'a', 'c', 'b'])).toEqual(['a', 'b']);
  });
});

describe('checkCourseRefs', () => {
  it('flags a WhatsApp group mapped to an unknown course', () => {
    const plan = samplePlan();
    plan.whatsappGroups.push({ jid: '123@g.us', name: 'Turma', course: 'ZZ' });
    expect(checkCourseRefs(plan)).toEqual(['whatsappGroups.0.course: "ZZ" is not a course code']);
  });
});
