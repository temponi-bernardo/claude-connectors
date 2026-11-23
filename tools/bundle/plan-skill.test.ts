import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { build } from 'esbuild';
import { afterAll, describe, expect, it } from 'vitest';
import { GENERATED_NOTE, PLAN_RUNTIME_SLOT, PLAN_SKILL_DIR, PLAN_SOURCES } from './bundle.js';
import {
  buildPlanTemplate,
  hasPlanSkill,
  inlinePlanRuntime,
  planCliBundleOptions,
  planRuntimeBundleOptions,
} from './plan-skill.js';

const CANVAS = resolve(import.meta.dirname, '..', '..', 'connectors', 'canvas-puc');
const SKILL = join(CANVAS, PLAN_SKILL_DIR);
/** The runtime script inlined in a built template (its last plain `<script>`). */
function runtimeOf(html: string): string {
  const start = html.lastIndexOf('<script>');
  return start < 0 ? '' : html.slice(start + '<script>'.length, html.indexOf('</script>', start));
}

const tmp = mkdtempSync(join(tmpdir(), 'plan-skill-'));
const built = buildPlanTemplate(CANVAS);

afterAll(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe('hasPlanSkill', () => {
  it('is true only for the connector with the plan sources', () => {
    expect(hasPlanSkill(CANVAS)).toBe(true);
    expect(hasPlanSkill(join(CANVAS, '..', 'gmail'))).toBe(false);
  });
});

describe('planCliBundleOptions and planRuntimeBundleOptions', () => {
  it('bundle a Node script and an in-memory browser script', () => {
    expect(planCliBundleOptions('a.ts', 'b.mjs')).toMatchObject({
      platform: 'node',
      format: 'esm',
      bundle: true,
    });
    expect(planRuntimeBundleOptions('a.ts')).toMatchObject({
      platform: 'browser',
      format: 'iife',
      write: false,
    });
  });
});

describe('inlinePlanRuntime', () => {
  it('replaces the slot with the script', () => {
    expect(inlinePlanRuntime(`a${PLAN_RUNTIME_SLOT}b`, 'x();')).toBe(
      `a<script>\n// ${GENERATED_NOTE}\nx();</script>b`,
    );
  });
  it('refuses a template without one slot and a runtime that could close the tag', () => {
    expect(() => inlinePlanRuntime('a', 'x')).toThrow(/exactly one/);
    expect(() => inlinePlanRuntime(PLAN_RUNTIME_SLOT, 'a="</script>"')).toThrow(/inlined safely/);
  });
});

describe('buildPlanTemplate', () => {
  it('matches the versioned asset (run npm run build when this fails)', async () => {
    expect(readFileSync(join(SKILL, PLAN_SOURCES.templateOut), 'utf8')).toBe(await built);
  });
  it('inlines JavaScript that passes node --check', async () => {
    const file = join(tmp, 'runtime.js');
    writeFileSync(file, runtimeOf(await built));
    expect(() => execFileSync(process.execPath, ['--check', file])).not.toThrow();
  });
});

describe('the versioned plan script', () => {
  it('matches a fresh bundle (run npm run build when this fails)', async () => {
    const out = join(tmp, 'plan.mjs');
    await build(planCliBundleOptions(join(CANVAS, PLAN_SOURCES.cliEntry), out));
    expect(readFileSync(join(SKILL, PLAN_SOURCES.cliOut), 'utf8')).toBe(readFileSync(out, 'utf8'));
  });
});
