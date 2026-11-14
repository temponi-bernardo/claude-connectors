/**
 * Connector build: pure decisions about the remote server bundle and the plugin configuration.
 * The connectors only run in the cloud (ADR 0013): the marketplace plugin points to the remote HTTP server.
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { BuildOptions } from 'esbuild';

/** Connectors folder, relative to the repository root. */
export const CONNECTORS_DIR = 'connectors';

/** Plugin subfolder of each connector: only plugin content, no server code (ADR 0020). */
export const PLUGIN_DIR = 'plugin';

/** Claude plugin manifest, relative to the connector folder. */
export const PLUGIN_MANIFEST_PATH = join(PLUGIN_DIR, '.claude-plugin', 'plugin.json');

/** Plugin MCP config (the remote server address), relative to the connector folder. */
export const PLUGIN_MCP_CONFIG_PATH = join(PLUGIN_DIR, '.mcp.json');

/** Entry of the remote Node server (HTTP + OAuth, ADR 0009) and path of the generated bundle. */
export const REMOTE_ENTRY = join('src', 'remote-main.ts');
export const REMOTE_BUNDLE_PATH = join('server', 'remote.js');

/** Lists the connectors: subfolders of `connectors/` with a plugin manifest, in alphabetical order. */
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

/** Says whether the URL is remote and fixed (`https://`); `${user_config.*}` is rejected because it breaks Connect (ADR 0018). */
export function isRemoteMcpUrl(url: unknown): boolean {
  return typeof url === 'string' && url.startsWith('https://') && !url.includes('${');
}

/** Problems of a `.mcp.json` server: it must be `http`, with an `https://` URL, and no local command. */
export function mcpServerProblems(name: string, server: unknown): string[] {
  const entry = (server ?? {}) as Record<string, unknown>;
  const problems: string[] = [];
  if (entry.type !== 'http') problems.push(`${name}: "type" must be "http".`);
  if (!isRemoteMcpUrl(entry.url)) {
    problems.push(`${name}: "url" must be a fixed https:// address (no \${user_config.*}).`);
  }
  if ('command' in entry) problems.push(`${name}: must not have "command" (nothing runs locally).`);
  return problems;
}

/** Problems of a plugin MCP configuration: at least one server, all of them remote. */
export function pluginMcpProblems(config: unknown): string[] {
  const servers = (config as { mcpServers?: Record<string, unknown> } | null)?.mcpServers;
  if (!servers || Object.keys(servers).length === 0) return ['"mcpServers" is empty.'];
  return Object.entries(servers).flatMap(([name, server]) => mcpServerProblems(name, server));
}

/** esbuild options to bundle the remote server into an ESM for Node 22 (with `require` for CommonJS deps). */
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
