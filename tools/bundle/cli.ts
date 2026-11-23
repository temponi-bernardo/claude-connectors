/**
 * Build CLI: `npm run build`. For each connector, checks that the plugin points to a remote server and
 * generates the versioned bundle `server/remote.js` (used by the Dockerfile; the Worker compiles straight from `src/`).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { build } from 'esbuild';
import {
  CONNECTORS_DIR,
  PLAN_SKILL_DIR,
  PLAN_SOURCES,
  PLUGIN_MCP_CONFIG_PATH,
  REMOTE_BUNDLE_PATH,
  REMOTE_ENTRY,
  bundleOptions,
  listConnectors,
  pluginMcpProblems,
} from './bundle.js';
import { buildPlanTemplate, hasPlanSkill, planCliBundleOptions } from './plan-skill.js';

/** Writes the `/planejamento-faculdade` skill's generated script and page template. */
async function buildPlanSkill(dir: string): Promise<void> {
  const skillDir = join(dir, PLAN_SKILL_DIR);
  const cliOut = join(skillDir, PLAN_SOURCES.cliOut);
  await build(planCliBundleOptions(join(dir, PLAN_SOURCES.cliEntry), cliOut));
  const templateOut = join(skillDir, PLAN_SOURCES.templateOut);
  mkdirSync(dirname(templateOut), { recursive: true });
  writeFileSync(templateOut, await buildPlanTemplate(dir), 'utf8');
}

/** Checks the `.mcp.json` (if any; self-hosted has none) and builds the remote bundle and plan skill files, if any. */
async function buildConnector(root: string, name: string): Promise<void> {
  const dir = join(root, CONNECTORS_DIR, name);
  const configFile = join(dir, PLUGIN_MCP_CONFIG_PATH);
  const config: unknown = existsSync(configFile)
    ? JSON.parse(readFileSync(configFile, 'utf8'))
    : null;
  const problems = config === null ? [] : pluginMcpProblems(config);
  if (problems.length > 0)
    throw new Error(`${name}/${PLUGIN_MCP_CONFIG_PATH}:\n${problems.join('\n')}`);
  if (existsSync(join(dir, REMOTE_ENTRY))) {
    await build(bundleOptions(join(dir, REMOTE_ENTRY), join(dir, REMOTE_BUNDLE_PATH)));
  }
  if (hasPlanSkill(dir)) await buildPlanSkill(dir);
}

/** Entry point: builds every connector. */
export async function runBuildCli(): Promise<void> {
  const root = resolve(import.meta.dirname, '..', '..');
  for (const name of listConnectors(root)) {
    await buildConnector(root, name);
    console.log(`✔ ${name}`);
  }
}

await runBuildCli();
