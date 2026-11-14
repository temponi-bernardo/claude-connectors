import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  CONNECTORS_DIR,
  PLUGIN_DIR,
  PLUGIN_MANIFEST_PATH,
  PLUGIN_MCP_CONFIG_PATH,
  bundleOptions,
  listConnectors,
  mcpServerProblems,
  pluginMcpProblems,
  isRemoteMcpUrl,
} from './bundle.js';

const dirs: string[] = [];
function tempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'bundle-'));
  dirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const REPO_ROOT = resolve(import.meta.dirname, '..', '..');

describe('listConnectors', () => {
  it('lists only folders with a plugin manifest, in order', () => {
    const root = tempRoot();
    for (const name of ['zeta', 'alpha', 'no-plugin'])
      mkdirSync(join(root, 'connectors', name, dirname(PLUGIN_MANIFEST_PATH)), { recursive: true });
    writeFileSync(join(root, 'connectors', 'zeta', PLUGIN_MANIFEST_PATH), '{}');
    writeFileSync(join(root, 'connectors', 'alpha', PLUGIN_MANIFEST_PATH), '{}');
    writeFileSync(join(root, 'connectors', 'file.txt'), '');
    expect(listConnectors(root)).toEqual(['alpha', 'zeta']);
  });

  it('returns empty without the connectors folder', () => {
    expect(listConnectors(tempRoot())).toEqual([]);
  });
});

describe('isRemoteMcpUrl', () => {
  it('accepts only fixed https', () => {
    expect(isRemoteMcpUrl('https://x.dev/mcp')).toBe(true);
  });

  it('rejects http, a plugin config field (breaks Connect on claude.ai) and non-text values', () => {
    expect(isRemoteMcpUrl('http://x.dev/mcp')).toBe(false);
    expect(isRemoteMcpUrl('${user_config.server_url}')).toBe(false);
    expect(isRemoteMcpUrl('http://${user_config.server_url}')).toBe(false);
    expect(isRemoteMcpUrl(undefined)).toBe(false);
  });
});

describe('mcpServerProblems', () => {
  it('accepts an http server with an https URL', () => {
    expect(mcpServerProblems('c', { type: 'http', url: 'https://x.dev/mcp' })).toEqual([]);
  });

  it('rejects a local server, a missing http type or an insecure URL', () => {
    expect(mcpServerProblems('c', { command: 'node', args: [] })).toEqual([
      'c: "type" must be "http".',
      'c: "url" must be a fixed https:// address (no ${user_config.*}).',
      'c: must not have "command" (nothing runs locally).',
    ]);
    expect(mcpServerProblems('c', { type: 'http', url: 'http://x.dev/mcp' })).toHaveLength(1);
    expect(mcpServerProblems('c', null)).toHaveLength(2);
  });
});

describe('pluginMcpProblems', () => {
  it('requires at least one server and joins the problems of each', () => {
    expect(pluginMcpProblems({})).toEqual(['"mcpServers" is empty.']);
    expect(pluginMcpProblems(null)).toEqual(['"mcpServers" is empty.']);
    expect(pluginMcpProblems({ mcpServers: { a: { type: 'stdio' } } })).toHaveLength(2);
  });

  it('the plugin of each connector with a fixed server points only to remote servers', () => {
    const names = listConnectors(REPO_ROOT);
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      const file = join(REPO_ROOT, CONNECTORS_DIR, name, PLUGIN_MCP_CONFIG_PATH);
      if (!existsSync(file)) continue;
      expect(pluginMcpProblems(JSON.parse(readFileSync(file, 'utf8')))).toEqual([]);
    }
  });

  it('the self-hosted WhatsApp plugin ships no server (each person connects their own)', () => {
    expect(existsSync(join(REPO_ROOT, CONNECTORS_DIR, 'whatsapp', PLUGIN_MCP_CONFIG_PATH))).toBe(
      false,
    );
    expect(existsSync(join(REPO_ROOT, CONNECTORS_DIR, 'canvas-puc', PLUGIN_MCP_CONFIG_PATH))).toBe(
      true,
    );
    expect(existsSync(join(REPO_ROOT, CONNECTORS_DIR, 'gmail', PLUGIN_MCP_CONFIG_PATH))).toBe(true);
  });
});

describe('plugin folder (ADR 0020)', () => {
  it('every marketplace entry points at the connector plugin subfolder', () => {
    const file = join(REPO_ROOT, '.claude-plugin', 'marketplace.json');
    const market = JSON.parse(readFileSync(file, 'utf8')) as {
      plugins: { name: string; source: string }[];
    };
    for (const entry of market.plugins) {
      expect(entry.source).toBe(`./${CONNECTORS_DIR}/${entry.name}/${PLUGIN_DIR}`);
    }
  });

  it('the plugin subfolder ships no server code', () => {
    for (const name of listConnectors(REPO_ROOT)) {
      const dir = join(REPO_ROOT, CONNECTORS_DIR, name, PLUGIN_DIR);
      for (const item of ['src', 'server', 'bridge', 'Dockerfile', 'wrangler.toml', 'package.json'])
        expect(existsSync(join(dir, item))).toBe(false);
    }
  });
});

describe('plugin version (ADR 0022)', () => {
  function readJson(...parts: string[]): Record<string, unknown> {
    return JSON.parse(readFileSync(join(REPO_ROOT, ...parts), 'utf8')) as Record<string, unknown>;
  }

  it('each plugin.json has a semver version that release-please tracks and bumps', () => {
    const config = readJson('release-please-config.json') as {
      packages: Record<string, { 'extra-files'?: unknown[] }>;
    };
    const manifest = readJson('.release-please-manifest.json');
    for (const name of listConnectors(REPO_ROOT)) {
      const path = `${CONNECTORS_DIR}/${name}`;
      const { version } = readJson(path, PLUGIN_MANIFEST_PATH);
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(manifest[path]).toBe(version);
      expect(config.packages[path]?.['extra-files']).toContainEqual({
        type: 'json',
        path: `${PLUGIN_DIR}/.claude-plugin/plugin.json`,
        jsonpath: '$.version',
      });
    }
  });

  it('the marketplace entries carry no version (plugin.json is the only source)', () => {
    const market = readJson('.claude-plugin', 'marketplace.json') as {
      plugins: Record<string, unknown>[];
    };
    for (const entry of market.plugins) expect(entry).not.toHaveProperty('version');
  });
});

describe('bundleOptions', () => {
  it('generates a single ESM for Node, with no external dependencies', () => {
    const options = bundleOptions('in.ts', 'out.js');
    expect(options).toMatchObject({
      entryPoints: ['in.ts'],
      outfile: 'out.js',
      bundle: true,
      platform: 'node',
      format: 'esm',
    });
    expect(options.external).toBeUndefined();
  });
});
