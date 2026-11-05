/**
 * CLI de empacotamento: `npm run pack -- <conector>` ou `npm run pack:all`.
 * Gera `dist/connectors/<nome>-<versão>.mcpb` para instalar no Claude Desktop (Configurações → Extensões).
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { build } from 'esbuild';
import {
  BUNDLE_PATH,
  CONNECTORS_DIR,
  CONNECTOR_ENTRY,
  PACK_OUT_DIR,
  RUNTIME_EXTERNALS,
  bundleOptions,
  listConnectors,
  readManifestIdentity,
  runtimePackageJson,
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

/** Monta a pasta de staging de um conector e gera o `.mcpb`; devolve o caminho do pacote. */
async function packConnector(root: string, name: string): Promise<string> {
  const dir = join(root, CONNECTORS_DIR, name);
  const stage = join(root, 'dist', 'stage', name);
  const identity = readManifestIdentity(join(dir, 'manifest.json'));
  rmSync(stage, { recursive: true, force: true });
  mkdirSync(stage, { recursive: true });
  copyFileSync(join(dir, 'manifest.json'), join(stage, 'manifest.json'));
  await build(bundleOptions(join(dir, CONNECTOR_ENTRY), join(stage, BUNDLE_PATH)));
  const pkg = runtimePackageJson(identity, installedExternalVersions(root));
  writeFileSync(join(stage, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);
  runNodeBin('npm', ['install', '--omit=dev', '--no-audit', '--no-fund', '--silent'], stage);
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
  for (const name of names) console.log(`✔ ${await packConnector(root, name)}`);
}

await runPackCli(process.argv.slice(2));
