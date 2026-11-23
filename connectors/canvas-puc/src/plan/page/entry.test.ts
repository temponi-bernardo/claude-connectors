// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { loadPlanDocument } from './fixtures/plan-dom.js';
import { samplePlan } from '../../fixtures/plan-sample.js';

describe('entry', () => {
  it('starts the page on import (the bundle entry of startPlanPage)', async () => {
    loadPlanDocument(samplePlan());
    await import('./entry.js');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.querySelectorAll('.card')).toHaveLength(3);
  });
});
