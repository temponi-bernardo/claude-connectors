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
  it('lista só pastas com manifesto de plugin, em ordem', () => {
    const root = tempRoot();
    for (const name of ['zeta', 'alfa', 'sem-plugin'])
      mkdirSync(join(root, 'connectors', name, dirname(PLUGIN_MANIFEST_PATH)), { recursive: true });
    writeFileSync(join(root, 'connectors', 'zeta', PLUGIN_MANIFEST_PATH), '{}');
    writeFileSync(join(root, 'connectors', 'alfa', PLUGIN_MANIFEST_PATH), '{}');
    writeFileSync(join(root, 'connectors', 'arquivo.txt'), '');
    expect(listConnectors(root)).toEqual(['alfa', 'zeta']);
  });

  it('devolve vazio sem a pasta connectors', () => {
    expect(listConnectors(tempRoot())).toEqual([]);
  });
});

describe('isRemoteMcpUrl', () => {
  it('aceita só https fixo', () => {
    expect(isRemoteMcpUrl('https://x.dev/mcp')).toBe(true);
  });

  it('recusa http, campo de configuração do plugin (quebra o Vincular no claude.ai) e valores que não são texto', () => {
    expect(isRemoteMcpUrl('http://x.dev/mcp')).toBe(false);
    expect(isRemoteMcpUrl('${user_config.server_url}')).toBe(false);
    expect(isRemoteMcpUrl('http://${user_config.server_url}')).toBe(false);
    expect(isRemoteMcpUrl(undefined)).toBe(false);
  });
});

describe('mcpServerProblems', () => {
  it('aceita um servidor http com URL https', () => {
    expect(mcpServerProblems('c', { type: 'http', url: 'https://x.dev/mcp' })).toEqual([]);
  });

  it('recusa servidor local, sem tipo http ou com URL insegura', () => {
    expect(mcpServerProblems('c', { command: 'node', args: [] })).toEqual([
      'c: "type" deve ser "http".',
      'c: "url" deve ser um endereço https:// fixo (sem ${user_config.*}).',
      'c: não pode ter "command" (nada roda localmente).',
    ]);
    expect(mcpServerProblems('c', { type: 'http', url: 'http://x.dev/mcp' })).toHaveLength(1);
    expect(mcpServerProblems('c', null)).toHaveLength(2);
  });
});

describe('pluginMcpProblems', () => {
  it('exige ao menos um servidor e junta os problemas de cada um', () => {
    expect(pluginMcpProblems({})).toEqual(['"mcpServers" está vazio.']);
    expect(pluginMcpProblems(null)).toEqual(['"mcpServers" está vazio.']);
    expect(pluginMcpProblems({ mcpServers: { a: { type: 'stdio' } } })).toHaveLength(2);
  });

  it('o plugin de cada conector com servidor fixo aponta só para servidores remotos', () => {
    const names = listConnectors(REPO_ROOT);
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      const file = join(REPO_ROOT, CONNECTORS_DIR, name, PLUGIN_MCP_CONFIG_PATH);
      if (!existsSync(file)) continue;
      expect(pluginMcpProblems(JSON.parse(readFileSync(file, 'utf8')))).toEqual([]);
    }
  });

  it('o WhatsApp self-host não embute servidor no plugin (cada pessoa conecta o próprio)', () => {
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

describe('bundleOptions', () => {
  it('gera um único ESM para Node, sem dependências externas', () => {
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
