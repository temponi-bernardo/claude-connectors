// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { fakeAccount, loadPlanDocument } from './fixtures/plan-dom.js';
import { samplePlan } from '../../fixtures/plan-sample.js';
import type { PlanData } from '../plan-schema.js';
import {
  bootPlanPage,
  readEmbeddedPlan,
  renderPlanSections,
  safeLocalStorage,
  showSyncState,
  startPlanPage,
  updateCounters,
} from './main.js';
import { createCheckStore } from './checks.js';
import type { ClaudeLike } from './checks.js';
import { courseLevels } from './render-header.js';

const NOW = new Date('2026-11-23T12:00:00Z');

async function boot(plan: PlanData, claude?: ClaudeLike): Promise<Document> {
  const doc = loadPlanDocument(plan);
  await bootPlanPage({ doc, now: NOW, storage: localStorage, claude });
  return doc;
}

function text(doc: Document, id: string): string {
  return doc.getElementById(id)?.textContent ?? '';
}

afterEach(() => {
  localStorage.clear();
});

describe('bootPlanPage', () => {
  it('renders a chip and a card per course', async () => {
    const doc = await boot(samplePlan());
    expect(doc.querySelectorAll('#risk-list .chip')).toHaveLength(3);
    expect(doc.querySelectorAll('#course-list .card')).toHaveLength(3);
    expect(doc.querySelector<HTMLAnchorElement>('.chip')?.getAttribute('href')).toBe('#curso-alg');
    expect(doc.getElementById('curso-alg')?.className).toBe('card lvl-high');
  });
  it('shows the counters of both checklists', async () => {
    const doc = await boot(samplePlan());
    expect(text(doc, 'study-progress')).toBe('1 de 5 feitos');
    expect(text(doc, 'timeline-progress')).toBe('1 de 6 concluídos');
  });
  it('draws bars whose widths add up to 100%', async () => {
    const doc = await boot(samplePlan());
    for (const bar of doc.querySelectorAll<HTMLElement>('.bar')) {
      const widths = [...bar.querySelectorAll<HTMLElement>('.seg')].map((s) =>
        parseFloat(s.style.width),
      );
      expect(widths.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 6);
      expect(bar.getAttribute('role')).toBe('img');
      expect(bar.getAttribute('aria-label')).toMatch(/meta 60$/);
    }
  });
  it('fades past days, highlights today and marks conflicts', async () => {
    const doc = await boot(samplePlan());
    const study = doc.querySelectorAll('#study-list .day');
    expect(study[0]?.className).toBe('day past');
    expect(study[1]?.className).toBe('day now');
    expect(doc.querySelector('#timeline-list .clash .clash-note')?.textContent).toContain(
      'Dia cheio',
    );
    expect(doc.querySelector('#timeline-list .undated')?.textContent).toContain('sem data');
  });
  it('fills the header, the today blocks, the questions and the footer', async () => {
    const doc = await boot(samplePlan());
    expect(text(doc, 'plan-title')).toBe('Plano do Semestre 2026/2');
    expect(text(doc, 'plan-situation')).toContain('Situação em 23/11/2026, 07h00');
    expect(doc.querySelectorAll('#plan-assumptions p')).toHaveLength(3);
    expect(text(doc, 'today-range')).toBe('seg 23/11 → ter 24/11');
    expect(doc.querySelectorAll('#today-list .slot.critical')).toHaveLength(1);
    expect(doc.querySelector('#question-list .waiting')?.textContent).toBe(
      'aguardando resposta (enviada em 21/11)',
    );
    expect(text(doc, 'plan-footer')).toContain('Fontes não conectadas: Gmail, WhatsApp.');
  });
  it('works with Canvas only and lists nothing missing when every source answered', async () => {
    const plan = samplePlan();
    plan.missingSources = [];
    plan.assumptions = [];
    const doc = await boot(plan);
    expect(text(doc, 'plan-footer')).not.toContain('não conectadas');
    expect(doc.getElementById('plan-assumptions')?.hidden).toBe(true);
  });
  it('keeps a tick after a reload and after the plan is regenerated with the same ids', async () => {
    let doc = await boot(samplePlan());
    const box = doc.getElementById('chk-s-eda-avl') as HTMLInputElement;
    box.checked = true;
    box.dispatchEvent(new Event('change'));
    expect(text(doc, 'study-progress')).toBe('2 de 5 feitos');
    doc = await boot(samplePlan());
    expect((doc.getElementById('chk-s-eda-avl') as HTMLInputElement).checked).toBe(true);
    const regenerated = samplePlan();
    regenerated.study[1]!.items[0]!.task = 'Rotações AVL (texto revisto)';
    doc = await boot(regenerated);
    expect((doc.getElementById('chk-s-eda-avl') as HTMLInputElement).checked).toBe(true);
  });
  it('syncs the ticks with the viewer account', async () => {
    const account = fakeAccount({ 't-eda-p3': true });
    const doc = await boot(samplePlan(), account.claude);
    expect((doc.getElementById('chk-t-eda-p3') as HTMLInputElement).checked).toBe(true);
    expect(doc.querySelector('.sync')?.getAttribute('data-state')).toBe('account');
  });
  it('renders hostile text as text', async () => {
    const plan = samplePlan();
    plan.courses[0]!.rules[0]!.text = '</script><img src=x onerror="alert(1)">';
    plan.study[1]!.items[0]!.task = '<svg onload=alert(1)>';
    plan.questions[0]!.text = '**<a href="javascript:alert(1)">x</a>**';
    const doc = await boot(plan);
    expect(doc.querySelectorAll('main img, main svg, main a[href^="javascript"]')).toHaveLength(0);
    expect(doc.querySelector('.rules li')?.textContent).toContain('<img src=x');
  });
  it('marks dropped items and leaves them out of the counter', async () => {
    const plan = samplePlan();
    plan.study[1]!.items[1]!.status = 'dropped';
    const doc = await boot(plan);
    expect((doc.getElementById('chk-s-alg-mt') as HTMLInputElement).disabled).toBe(true);
    expect(text(doc, 'study-progress')).toBe('1 de 4 feitos');
  });
});

describe('renderPlanSections and updateCounters', () => {
  it('render every section and count the boxes', () => {
    const doc = loadPlanDocument(samplePlan());
    const store = createCheckStore({ key: 'k', storage: null, status: () => undefined });
    const ctx = { doc, today: '2026-11-23', levels: courseLevels(samplePlan()), store };
    const [study, timeline] = renderPlanSections(ctx, samplePlan());
    updateCounters(doc, study, timeline);
    expect(text(doc, 'timeline-progress')).toBe('1 de 6 concluídos');
  });
});

describe('readEmbeddedPlan', () => {
  it('reads the JSON block', () => {
    expect(readEmbeddedPlan(loadPlanDocument(samplePlan()))).toEqual(samplePlan());
  });
});

describe('showSyncState', () => {
  it('writes the message in every status line', () => {
    const doc = loadPlanDocument(samplePlan());
    showSyncState(doc, 'error');
    const lines = [...doc.querySelectorAll('.sync')];
    expect(lines).toHaveLength(2);
    expect(lines.every((l) => l.getAttribute('data-state') === 'error')).toBe(true);
  });
});

describe('safeLocalStorage', () => {
  it('returns null when the browser blocks storage', () => {
    const blocked = Object.defineProperty({}, 'localStorage', {
      get: () => {
        throw new Error('SecurityError');
      },
    }) as Window;
    expect(safeLocalStorage(blocked)).toBeNull();
    expect(safeLocalStorage(window)).toBe(localStorage);
  });
});

describe('startPlanPage', () => {
  it('renders the page from the window', async () => {
    loadPlanDocument(samplePlan());
    await startPlanPage(window);
    expect(document.querySelectorAll('.card')).toHaveLength(3);
  });
  it('shows a message instead of a blank page when the data is broken', async () => {
    loadPlanDocument(samplePlan());
    document.getElementById('plan-data')!.textContent = 'null';
    await startPlanPage(window);
    const note = document.getElementById('plan-error')!;
    expect(note.hidden).toBe(false);
    expect(note.textContent).toContain('Não consegui montar o plano');
  });
});
