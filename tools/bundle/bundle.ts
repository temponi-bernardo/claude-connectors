/**
 * Build dos conectores: decisões puras sobre o bundle do servidor remoto e a configuração do plugin.
 * Os conectores rodam só na nuvem (ADR 0013): o plugin do marketplace aponta para o servidor HTTP remoto.
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { BuildOptions } from 'esbuild';

/** Pasta dos conectores, relativa à raiz do repositório. */
export const CONNECTORS_DIR = 'connectors';

/** Plugin subfolder of each connector: only plugin content, no server code (ADR 0020). */
export const PLUGIN_DIR = 'plugin';

/** Claude plugin manifest, relative to the connector folder. */
export const PLUGIN_MANIFEST_PATH = join(PLUGIN_DIR, '.claude-plugin', 'plugin.json');

/** Plugin MCP config (the remote server address), relative to the connector folder. */
export const PLUGIN_MCP_CONFIG_PATH = join(PLUGIN_DIR, '.mcp.json');

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

/** Diz se a URL é remota e fixa (`https://`); `${user_config.*}` é recusado porque quebra o Vincular (ADR 0018). */
export function isRemoteMcpUrl(url: unknown): boolean {
  return typeof url === 'string' && url.startsWith('https://') && !url.includes('${');
}

/** Problemas de um servidor do `.mcp.json`: precisa ser `http`, com URL `https://`, e sem comando local. */
export function mcpServerProblems(name: string, server: unknown): string[] {
  const entry = (server ?? {}) as Record<string, unknown>;
  const problems: string[] = [];
  if (entry.type !== 'http') problems.push(`${name}: "type" deve ser "http".`);
  if (!isRemoteMcpUrl(entry.url)) {
    problems.push(`${name}: "url" deve ser um endereço https:// fixo (sem \${user_config.*}).`);
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
