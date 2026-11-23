// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { loadPlanDocument } from './fixtures/plan-dom.js';
import { samplePlan } from '../../fixtures/plan-sample.js';
import {
  courseGoal,
  courseLevels,
  levelClass,
  renderFooter,
  renderHeader,
  renderRiskChips,
  situationText,
} from './render-header.js';

describe('courseGoal and courseLevels', () => {
  it('uses the syllabus goal when there is one', () => {
    const plan = samplePlan();
    plan.courses[2]!.goal = 70;
    expect(courseGoal(plan, 'BD')).toBe(70);
    expect(courseGoal(plan, 'ALG')).toBe(60);
    expect(courseLevels(plan).get('BD')).toBe('warn');
  });
});

describe('levelClass', () => {
  it('is neutral for tags that are not courses', () => {
    const levels = courseLevels(samplePlan());
    expect(levelClass(levels, 'ALG')).toBe('lvl-high');
    expect(levelClass(levels, 'ENADE')).toBe('lvl-none');
  });
});

describe('situationText', () => {
  it('mentions course-specific goals only when there are any', () => {
    const plan = samplePlan();
    expect(situationText(plan)).not.toContain('outra meta');
    plan.courses[0]!.goal = 70;
    expect(situationText(plan)).toContain('outra meta');
    plan.courses = plan.courses.slice(0, 1);
    expect(situationText(plan)).toContain('1 matéria.');
  });
});

describe('renderHeader, renderRiskChips and renderFooter', () => {
  it('fill their containers', () => {
    const doc = loadPlanDocument(samplePlan());
    renderHeader(doc, samplePlan());
    renderRiskChips(doc, samplePlan());
    renderFooter(doc, samplePlan());
    expect(doc.querySelector('#plan-assumptions strong')?.textContent).toBe('Informado por você: ');
    expect(doc.querySelector('.chip-need')?.textContent).toBe('faltam 20,5 pts');
    expect(doc.querySelector('.missing-sources')).not.toBeNull();
  });
});
