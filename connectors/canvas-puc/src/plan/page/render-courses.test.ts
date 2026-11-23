// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { loadPlanDocument } from './fixtures/plan-dom.js';
import { samplePlan } from '../../fixtures/plan-sample.js';
import type { PlanCourse } from '../plan-schema.js';
import {
  assessmentTitleText,
  assessmentValueText,
  barLabel,
  renderAssessments,
  renderCardHead,
  renderCourses,
  renderNeed,
  renderPointsBar,
  renderRules,
} from './render-courses.js';

function course(): PlanCourse {
  return samplePlan().courses[2]!;
}

describe('assessmentValueText', () => {
  it.each([
    [{ title: 'P', max: 30, score: 25 }, '25 / 30'],
    [{ title: 'P', max: 10, score: 8, estimated: true }, '≈8 / 10'],
    [{ title: 'P', max: 30, score: null }, '— / 30'],
  ])('%o → %s', (assessment, expected) => {
    expect(assessmentValueText(assessment)).toBe(expected);
  });
});

describe('assessmentTitleText', () => {
  it('adds the date and the student note', () => {
    expect(
      assessmentTitleText({
        title: 'ADA',
        max: 5,
        score: 2.5,
        informedByStudent: true,
        date: '2026-12-01',
      }),
    ).toBe('ADA · 01/12 · informado por você');
    expect(assessmentTitleText({ title: 'P1', max: 30, score: 20 })).toBe('P1');
  });
});

describe('barLabel', () => {
  it('describes the non-empty segments and the goal', () => {
    expect(barLabel(course(), 60)).toBe(
      'BD: 47,5 garantidos, 8 enviados sem nota, 30 em aberto, 14,5 perdidos ou incertos; meta 60',
    );
  });
});

describe('renderPointsBar', () => {
  it('places the goal marker', () => {
    const bar = renderPointsBar(document, course(), 60);
    expect(bar.querySelectorAll('.seg')).toHaveLength(4);
    expect(bar.querySelector<HTMLElement>('.goal')?.style.left).toBe('60%');
    expect(bar.querySelector<HTMLElement>('.goal')?.dataset.label).toBe('60');
  });
});

describe('renderNeed', () => {
  it('shows missing, guaranteed and maximum points', () => {
    const need = renderNeed(document, course(), 60);
    expect(need.querySelector('.need-big')?.textContent).toBe('4,5');
    expect(need.textContent).toContain('garantido 55,5 · máx. possível 85,5');
  });
});

describe('renderAssessments, renderRules and renderCardHead', () => {
  it('list the assessments with dates and the rules with source and date', () => {
    expect(renderAssessments(document, course()).textContent).toContain(
      'Trabalho final · 15/12— / 30',
    );
    expect(renderRules(document, course()).textContent).toContain('— aviso do professor, 17/11');
    expect(renderCardHead(document, course(), 'Tranquila').textContent).toBe(
      'BDBanco de Dados · Prof. Exemplo TrêsTranquila',
    );
  });
  it('leaves out an empty instructor', () => {
    const c = course();
    c.teacher = '';
    expect(renderCardHead(document, c, 'x').querySelector('.card-name')?.textContent).toBe(
      'Banco de Dados',
    );
  });
});

describe('renderCourses', () => {
  it('shows a concrete path to the goal on each card', () => {
    const doc = loadPlanDocument(samplePlan());
    renderCourses(doc, samplePlan());
    expect(doc.querySelector('#curso-alg .path b')?.textContent).toBe('19 de 30');
  });
});
