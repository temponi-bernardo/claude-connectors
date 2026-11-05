/**
 * CLI de empacotamento: `npm run pack -- <conector>` ou `npm run pack:all`.
 * Atualiza o runtime versionado do conector (bundle + package.json + lockfile, usados pelo plugin do
 * Claude Code) e gera `dist/connectors/<nome>-<versão>.mcpb` (Claude Desktop → Extensões).
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { build } from 'esbuild';
import {
  BUNDLE_PATH,
  CONNECTORS_DIR,
  CONNECTOR_ENTRY,
  PACK_OUT_DIR,
  REMOTE_BUNDLE_PATH,
  REMOTE_ENTRY,
  RUNTIME_EXTERNALS,
  RUNTIME_FILES,
  bundleOptions,
  listConnectors,
  readManifestIdentity,
  pluginManifest,
  pluginMcpConfig,
  runtimePackageJson,
  type McpbManifest,
} from './pack.js';

/** Versões instaladas (em node_modules da raiz) das dependências externas. */
function installedExternalVersions(root: string): Record<string, string> {
  return Object.fromEntries(
    RUNTIME_EXTERNALS.map((dep) => {
      const pkg = JSON.parse(
        readFileSync(join(root, 'node_modules', dep, 'package.json'), 'utf8'),
      ) as { version: string };
      return [dep, pkg.version];
    }),
  );
}

/** Roda `npm` ou `npx` de forma portátil entre Windows e Unix. */
function runNodeBin(bin: 'npm' | 'npx', args: readonly string[], cwd: string): void {
  execFileSync(process.platform === 'win32' ? `${bin}.cmd` : bin, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}

/** Grava um JSON indentado com quebra de linha final. */
function writeJson(file: string, data: unknown): void {
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

/** Gera na pasta do conector o que o plugin usa: bundle, package.json, lockfile, plugin.json e .mcp.json. */
async function buildConnectorRuntime(root: string, name: string): Promise<void> {
  const dir = join(root, CONNECTORS_DIR, name);
  const identity = readManifestIdentity(join(dir, 'manifest.json'));
  await build(bundleOptions(join(dir, CONNECTOR_ENTRY), join(dir, BUNDLE_PATH)));
  if (existsSync(join(dir, REMOTE_ENTRY))) {
    await build(bundleOptions(join(dir, REMOTE_ENTRY), join(dir, REMOTE_BUNDLE_PATH)));
  }
  writeJson(
    join(dir, 'package.json'),
    runtimePackageJson(identity, installedExternalVersions(root)),
  );
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8')) as McpbManifest;
  mkdirSync(join(dir, '.claude-plugin'), { recursive: true });
  writeJson(join(dir, '.claude-plugin', 'plugin.json'), pluginManifest(manifest));
  writeJson(join(dir, '.mcp.json'), pluginMcpConfig(manifest));
  runNodeBin('npm', ['install', '--package-lock-only', '--no-audit', '--no-fund', '--silent'], dir);
}

/** Copia os arquivos de runtime do conector para o staging, instala as externas e gera o `.mcpb`. */
function packMcpb(root: string, name: string): string {
  const dir = join(root, CONNECTORS_DIR, name);
  const stage = join(root, 'dist', 'stage', name);
  const identity = readManifestIdentity(join(dir, 'manifest.json'));
  rmSync(stage, { recursive: true, force: true });
  for (const file of RUNTIME_FILES) {
    mkdirSync(dirname(join(stage, file)), { recursive: true });
    copyFileSync(join(dir, file), join(stage, file));
  }
  runNodeBin('npm', ['ci', '--omit=dev', '--no-audit', '--no-fund', '--silent'], stage);
  const out = join(root, PACK_OUT_DIR, `${identity.name}-${identity.version}.mcpb`);
  mkdirSync(join(root, PACK_OUT_DIR), { recursive: true });
  runNodeBin('npx', ['--no-install', 'mcpb', 'pack', stage, out], root);
  return out;
}

/** Ponto de entrada: empacota o conector pedido, ou todos com `--all`. */
export async function runPackCli(argv: readonly string[]): Promise<void> {
  const root = resolve(import.meta.dirname, '..', '..');
  const names = argv.includes('--all')
    ? listConnectors(root)
    : argv.filter((a) => !a.startsWith('-'));
  if (names.length === 0) throw new Error('Uso: npm run pack -- <conector>  |  npm run pack:all');
  for (const name of names) {
    await buildConnectorRuntime(root, name);
    console.log(`✔ ${packMcpb(root, name)}`);
  }
}

await runPackCli(process.argv.slice(2));
