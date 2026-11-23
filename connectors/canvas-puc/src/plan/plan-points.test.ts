import { describe, expect, it } from 'vitest';
import type { PointSplit } from './plan-schema.js';
import {
  barSegments,
  formatPoints,
  pointsMissing,
  pointsTotal,
  riskLevel,
  roundPoints,
} from './plan-points.js';

function split(...[sure, pend, open, lost]: [number, number, number, number]): PointSplit {
  return { sure, pend, open, lost };
}

describe('roundPoints', () => {
  it('keeps one decimal', () => {
    expect(roundPoints(2.449)).toBe(2.4);
    expect(roundPoints(17.25)).toBe(17.3);
  });
});

describe('formatPoints', () => {
  it('uses a pt-BR comma and at most one decimal', () => {
    expect(formatPoints(17.25)).toBe('17,3');
    expect(formatPoints(60)).toBe('60');
  });
});

describe('pointsTotal', () => {
  it('adds the four parts', () => {
    expect(pointsTotal(split(10, 5, 60, 25))).toBe(100);
  });
});

describe('pointsMissing', () => {
  it('subtracts graded and pending points from the goal', () => {
    expect(pointsMissing(split(30, 8, 50, 12), 60)).toBe(22);
  });
  it('never goes below zero', () => {
    expect(pointsMissing(split(70, 0, 20, 10), 60)).toBe(0);
  });
});

describe('riskLevel', () => {
  it.each([
    [split(50, 0, 40, 10), 'ok'], // 10 of 40 = 25%
    [split(40, 0, 40, 20), 'warn'], // 20 of 40 = 50%
    [split(30, 0, 40, 30), 'high'], // 30 of 40 = 75%
    [split(10, 0, 40, 50), 'high'], // 50 > 40: beyond reach
    [split(60, 0, 0, 40), 'ok'], // nothing missing
  ] as const)('classifies %o as %s', (points, level) => {
    expect(riskLevel(points, 60)).toBe(level);
  });
  it('is high when the course depends on recovery', () => {
    expect(riskLevel(split(50, 0, 40, 10), 60, true)).toBe('high');
  });
  it('uses the course goal', () => {
    expect(riskLevel(split(50, 0, 40, 10), 70)).toBe('warn');
  });
});

describe('barSegments', () => {
  it('returns the four widths in order, adding up to 100', () => {
    const segments = barSegments(split(33.3, 3.3, 33.3, 30.1));
    expect(segments.map((s) => s.kind)).toEqual(['sure', 'pend', 'open', 'lost']);
    expect(segments.reduce((sum, s) => sum + s.percent, 0)).toBeCloseTo(100, 6);
  });
  it('normalizes a total other than 100', () => {
    expect(barSegments(split(25, 0, 25, 0)).map((s) => s.percent)).toEqual([50, 0, 50, 0]);
  });
  it('draws an empty course as all open', () => {
    expect(barSegments(split(0, 0, 0, 0))).toEqual([{ kind: 'open', percent: 100 }]);
  });
});
