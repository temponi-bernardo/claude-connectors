/**
 * Build dos conectores: decisões puras sobre o bundle do servidor remoto e a configuração do plugin.
 * Os conectores rodam só na nuvem (ADR 0012): o plugin do marketplace aponta para o servidor HTTP remoto.
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { BuildOptions } from 'esbuild';

/** Pasta dos conectores, relativa à raiz do repositório. */
export const CONNECTORS_DIR = 'connectors';

/** Manifesto do plugin do Claude dentro da pasta de cada conector. */
export const PLUGIN_MANIFEST_PATH = join('.claude-plugin', 'plugin.json');

/** Configuração MCP do plugin: o endereço do servidor remoto. */
export const PLUGIN_MCP_CONFIG_PATH = '.mcp.json';

/** Entrada do servidor remoto em Node (HTTP + OAuth, ADR 0009) e caminho do bundle gerado. */
export const REMOTE_ENTRY = join('src', 'remote-main.ts');
export const REMOTE_BUNDLE_PATH = join('server', 'remote.js');

/** Lista os conectores: subpastas de `connectors/` com manifesto de plugin, em ordem alfabética. */
export function listConnectors(rootDir: string): string[] {
  const dir = join(rootDir, CONNECTORS_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) => entry.isDirectory() && existsSync(join(dir, entry.name, PLUGIN_MANIFEST_PATH)),
    )
    .map((entry) => entry.name)
    .sort();
}

/** Problemas de um servidor do `.mcp.json`: precisa ser `http`, com URL `https://`, e sem comando local. */
export function mcpServerProblems(name: string, server: unknown): string[] {
  const entry = (server ?? {}) as Record<string, unknown>;
  const problems: string[] = [];
  if (entry.type !== 'http') problems.push(`${name}: "type" deve ser "http".`);
  if (typeof entry.url !== 'string' || !entry.url.startsWith('https://')) {
    problems.push(`${name}: "url" deve ser um endereço https://.`);
  }
  if ('command' in entry) problems.push(`${name}: não pode ter "command" (nada roda localmente).`);
  return problems;
}

/** Problemas da configuração MCP de um plugin: ao menos um servidor, todos remotos. */
export function pluginMcpProblems(config: unknown): string[] {
  const servers = (config as { mcpServers?: Record<string, unknown> } | null)?.mcpServers;
  if (!servers || Object.keys(servers).length === 0) return ['"mcpServers" está vazio.'];
  return Object.entries(servers).flatMap(([name, server]) => mcpServerProblems(name, server));
}

/** Opções do esbuild para unir o servidor remoto num ESM para Node 22 (com `require` para deps CommonJS). */
export function bundleOptions(entry: string, outfile: string): BuildOptions {
  return {
    entryPoints: [entry],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    banner: {
      js: "import { createRequire as __bundleCreateRequire } from 'node:module'; const require = __bundleCreateRequire(import.meta.url);",
    },
    logLevel: 'warning',
  };
}
