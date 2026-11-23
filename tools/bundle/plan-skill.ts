/**
 * Build of the `/planejamento` skill files (canvas-puc): the plan script bundled to `scripts/plan.mjs` and the
 * page template with its runtime inlined to `assets/plan-template.html`. Both are generated and versioned,
 * like `server/remote.js`; `pr:check` fails when they are stale.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'esbuild';
import type { BuildOptions } from 'esbuild';
import { GENERATED_NOTE, PLAN_RUNTIME_SLOT, PLAN_SOURCES } from './bundle.js';

/** Says whether a connector has the plan skill sources. */
export function hasPlanSkill(connectorDir: string): boolean {
  return existsSync(join(connectorDir, PLAN_SOURCES.cliEntry));
}

/** esbuild options of the plan script: one Node ESM file with no dependencies left outside. */
export function planCliBundleOptions(entry: string, outfile: string): BuildOptions {
  return {
    entryPoints: [entry],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
    banner: { js: `#!/usr/bin/env node\n// ${GENERATED_NOTE}` },
    logLevel: 'warning',
  };
}

/** esbuild options of the page runtime: one browser script, returned in memory. */
export function planRuntimeBundleOptions(entry: string): BuildOptions & { write: false } {
  return {
    entryPoints: [entry],
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    target: 'es2020',
    charset: 'utf8',
    legalComments: 'none',
    logLevel: 'warning',
  };
}

/** Template with the runtime inlined in place of the slot; throws when either side is unsafe to join. */
export function inlinePlanRuntime(template: string, runtime: string): string {
  if (template.split(PLAN_RUNTIME_SLOT).length !== 2) {
    throw new Error(`The plan template needs exactly one ${PLAN_RUNTIME_SLOT}.`);
  }
  if (/<\/script|<!--/i.test(runtime)) {
    throw new Error('The plan runtime contains "</script" or "<!--": it cannot be inlined safely.');
  }
  const script = `<script>\n// ${GENERATED_NOTE}\n${runtime}</script>`;
  return template.replace(PLAN_RUNTIME_SLOT, () => script);
}

/** Builds the page template of a connector in memory (template source + bundled runtime). */
export async function buildPlanTemplate(connectorDir: string): Promise<string> {
  const result = await build(
    planRuntimeBundleOptions(join(connectorDir, PLAN_SOURCES.runtimeEntry)),
  );
  const runtime = result.outputFiles[0]?.text ?? '';
  return inlinePlanRuntime(
    readFileSync(join(connectorDir, PLAN_SOURCES.template), 'utf8'),
    runtime,
  );
}
