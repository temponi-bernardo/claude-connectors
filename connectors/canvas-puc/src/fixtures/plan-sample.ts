/** Fictitious plan for the `/planejamento-faculdade` tests (no real student, course or instructor data). */
import sample from './plan-sample.json' with { type: 'json' };
import type { PlanData } from '../plan/plan-schema.js';

/** A fresh, mutable copy of the sample plan. */
export function samplePlan(): PlanData {
  return structuredClone(sample) as PlanData;
}
