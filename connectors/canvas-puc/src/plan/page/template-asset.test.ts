// @vitest-environment jsdom
// The versioned page template (assets/plan-template.html, kept current by plan-skill.test.ts) run end to end.
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { samplePlan } from '../../fixtures/plan-sample.js';
import { injectPlan } from '../plan-embed.js';
import { replaceDocument } from './fixtures/plan-dom.js';

const ASSET = join(
  resolve(import.meta.dirname, '..', '..', '..'),
  'plugin/skills/planejamento/assets/plan-template.html',
);

/** The runtime script inlined in a built template (its last plain `<script>`). */
function runtimeOf(html: string): string {
  const start = html.lastIndexOf('<script>');
  return start < 0 ? '' : html.slice(start + '<script>'.length, html.indexOf('</script>', start));
}

describe('the versioned plan template', () => {
  it('renders a plan with hostile text without breaking the page', async () => {
    const plan = samplePlan();
    plan.program = '</script><img src=x onerror="window.pwned=1">';
    plan.courses[0]!.name = '"><svg onload="window.pwned=1">';
    const html = injectPlan(readFileSync(ASSET, 'utf8'), plan);
    const runtime = runtimeOf(html);
    expect(runtime.length).toBeGreaterThan(1000);
    replaceDocument(html.replace(`<script>${runtime}</script>`, ''));
    window.eval(runtime);
    await new Promise((r) => setTimeout(r, 0));
    expect(document.querySelectorAll('.card')).toHaveLength(3);
    expect(document.querySelectorAll('main img, main svg')).toHaveLength(0);
    expect(document.getElementById('plan-situation')?.textContent).toContain('</script><img');
    expect((window as unknown as { pwned?: number }).pwned).toBeUndefined();
  });
});
