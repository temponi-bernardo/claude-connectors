import { describe, expect, it } from 'vitest';
import { samplePlan } from '../fixtures/plan-sample.js';
import {
  countMatches,
  escapeHtmlText,
  extractPlan,
  injectPlan,
  planTitle,
  PLAN_DATA_PATTERN,
  serializePlanJson,
} from './plan-embed.js';

const TEMPLATE =
  '<!doctype html><html><head><title>x</title></head><body>' +
  '<script id="plan-data" type="application/json">{}</script><script>/*runtime*/</script></body></html>';

const HOSTILE = '</script><img src=x onerror="alert(1)">\'"&\u2028$&$1';

describe('planTitle', () => {
  it('names the term', () => {
    expect(planTitle('2026/2')).toBe('Plano do Semestre 2026/2');
  });
});

describe('serializePlanJson', () => {
  it('escapes everything that could end the script element', () => {
    const plan = samplePlan();
    plan.program = HOSTILE;
    const json = serializePlanJson(plan);
    expect(json).not.toMatch(/[<>&\u2028]/);
    expect((JSON.parse(json) as { program: string }).program).toBe(HOSTILE);
  });
});

describe('escapeHtmlText', () => {
  it('escapes markup characters and quotes', () => {
    expect(escapeHtmlText(`<a href="x">'&`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;');
  });
});

describe('countMatches', () => {
  it('counts global matches', () => {
    expect(countMatches(TEMPLATE + TEMPLATE, PLAN_DATA_PATTERN)).toBe(2);
  });
});

describe('injectPlan', () => {
  it('fills the data block and the title', () => {
    const html = injectPlan(TEMPLATE, samplePlan());
    expect(html).toContain('<title>Plano do Semestre 2026/2</title>');
    expect(html).toContain('"planKey":"plano-2026-2"');
    expect(html).toContain('<script>/*runtime*/</script>');
  });
  it('keeps hostile text inside the data block', () => {
    const plan = samplePlan();
    plan.term = '2026/2';
    plan.courses[0]!.name = HOSTILE;
    const html = injectPlan(TEMPLATE, plan);
    expect(countMatches(html, /<\/script>/g)).toBe(2);
    expect(html).not.toContain('<img');
    expect(html).toContain('<script>/*runtime*/</script>');
  });
  it('refuses a template without a single data block', () => {
    expect(() => injectPlan(TEMPLATE + TEMPLATE, samplePlan())).toThrow(/exactly one/);
    expect(() => injectPlan('<title>x</title>', samplePlan())).toThrow(/exactly one/);
  });
});

describe('extractPlan', () => {
  it('round-trips: inject then extract gives the same plan', () => {
    const plan = samplePlan();
    plan.courses[1]!.path = HOSTILE;
    expect(extractPlan(injectPlan(TEMPLATE, plan))).toEqual(plan);
  });
  it('refuses a page without the data block', () => {
    expect(() => extractPlan('<html></html>')).toThrow(/plan-data/);
  });
});
