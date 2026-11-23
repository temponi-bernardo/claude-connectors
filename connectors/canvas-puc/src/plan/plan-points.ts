/**
 * Points model of a course (total 100): `sure` already graded, `pend` submitted without a grade (estimated),
 * `open` still to earn and `lost` lost or uncertain. Pure: shared by the CLI and the page runtime.
 */
import type { PointSplit, RiskLevel } from './plan-schema.js';

/** Segment kinds of the stacked bar, in drawing order. */
export const BAR_SEGMENT_KINDS = ['sure', 'pend', 'open', 'lost'] as const;

/** Share of the open points that may still be missing for each level (above the last one: high risk). */
export const RISK_THRESHOLDS = { ok: 0.3, warn: 0.6 } as const;

export interface BarSegment {
  readonly kind: (typeof BAR_SEGMENT_KINDS)[number];
  readonly percent: number;
}

/** Rounds points to one decimal (how the plan shows them). */
export function roundPoints(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Points with at most one decimal and a pt-BR comma: 17.25 → "17,3". */
export function formatPoints(value: number): string {
  return roundPoints(value).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

/** Sum of the four parts of a course's points. */
export function pointsTotal(points: PointSplit): number {
  return points.sure + points.pend + points.open + points.lost;
}

/** Points still missing to reach the goal: max(0, goal − sure − pend). */
export function pointsMissing(points: PointSplit, goal: number): number {
  return roundPoints(Math.max(0, goal - points.sure - points.pend));
}

/** Risk level: ok up to 30% of the open points missing, warn up to 60%, high above, beyond reach or on recovery. */
export function riskLevel(points: PointSplit, goal: number, needsRecovery = false): RiskLevel {
  const missing = pointsMissing(points, goal);
  if (missing === 0) return 'ok';
  if (needsRecovery || missing > points.open) return 'high';
  const share = missing / points.open;
  if (share <= RISK_THRESHOLDS.ok) return 'ok';
  return share <= RISK_THRESHOLDS.warn ? 'warn' : 'high';
}

/** Widths (in %) of the stacked bar, in drawing order; they always add up to exactly 100. */
export function barSegments(points: PointSplit): BarSegment[] {
  const total = pointsTotal(points);
  if (total <= 0) return [{ kind: 'open', percent: 100 }];
  let used = 0;
  return BAR_SEGMENT_KINDS.map((kind, index) => {
    const last = index === BAR_SEGMENT_KINDS.length - 1;
    const percent = last ? 100 - used : Math.round((points[kind] / total) * 1e6) / 1e4;
    used += percent;
    return { kind, percent: Math.max(0, Math.round(percent * 1e4) / 1e4) };
  });
}
