/**
 * CLI de build: `npm run build`. Para cada conector, confere que o plugin aponta para um servidor remoto e
 * gera o bundle versionado `server/remote.js` (usado pelo Dockerfile; o Worker compila direto do `src/`).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { build } from 'esbuild';
import {
  CONNECTORS_DIR,
  PLUGIN_MCP_CONFIG_PATH,
  REMOTE_BUNDLE_PATH,
  REMOTE_ENTRY,
  bundleOptions,
  listConnectors,
  pluginMcpProblems,
} from './bundle.js';

/** Confere o `.mcp.json` do conector e gera o bundle remoto, se o conector tiver um. */
async function buildConnector(root: string, name: string): Promise<void> {
  const dir = join(root, CONNECTORS_DIR, name);
  const config: unknown = JSON.parse(readFileSync(join(dir, PLUGIN_MCP_CONFIG_PATH), 'utf8'));
  const problems = pluginMcpProblems(config);
  if (problems.length > 0)
    throw new Error(`${name}/${PLUGIN_MCP_CONFIG_PATH}:\n${problems.join('\n')}`);
  if (existsSync(join(dir, REMOTE_ENTRY))) {
    await build(bundleOptions(join(dir, REMOTE_ENTRY), join(dir, REMOTE_BUNDLE_PATH)));
  }
}

/** Ponto de entrada: faz o build de todos os conectores. */
export async function runBuildCli(): Promise<void> {
  const root = resolve(import.meta.dirname, '..', '..');
  for (const name of listConnectors(root)) {
    await buildConnector(root, name);
    console.log(`✔ ${name}`);
  }
}

await runBuildCli();
