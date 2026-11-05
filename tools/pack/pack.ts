/**
 * Empacotamento de conectores em extensões `.mcpb`: decisões puras (o que entra no pacote) e descoberta.
 * O código do conector é unido num só arquivo (esbuild); só as dependências externas vão em node_modules.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BuildOptions } from 'esbuild';

/** Pasta dos conectores, relativa à raiz do repositório. */
export const CONNECTORS_DIR = 'connectors';

/** Saída dos pacotes `.mcpb`, relativa à raiz. */
export const PACK_OUT_DIR = join('dist', 'connectors');

/** Dependências que não podem ser unidas pelo esbuild (carregam arquivos em tempo de execução). */
export const RUNTIME_EXTERNALS: readonly string[] = ['playwright-core'];

/** Arquivo de entrada de cada conector e caminho do bundle dentro do pacote. */
export const CONNECTOR_ENTRY = join('src', 'main.ts');
export const BUNDLE_PATH = join('server', 'index.js');

/** `package.json` mínimo gravado no pacote para instalar as dependências externas. */
export interface RuntimePackageJson {
  readonly name: string;
  readonly version: string;
  readonly private: true;
  readonly type: 'module';
  readonly dependencies: Readonly<Record<string, string>>;
}

/** Lista os conectores: subpastas de `connectors/` que têm `manifest.json`, em ordem alfabética. */
export function listConnectors(rootDir: string): string[] {
  const dir = join(rootDir, CONNECTORS_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(dir, entry.name, 'manifest.json')))
    .map((entry) => entry.name)
    .sort();
}

/** Lê `name` e `version` do manifesto de um conector. */
export function readManifestIdentity(manifestPath: string): { name: string; version: string } {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    name?: unknown;
    version?: unknown;
  };
  if (typeof manifest.name !== 'string' || typeof manifest.version !== 'string') {
    throw new Error(`${manifestPath}: manifesto sem "name" ou "version".`);
  }
  return { name: manifest.name, version: manifest.version };
}

/** Monta o `package.json` do pacote com as versões exatas instaladas das dependências externas. */
export function runtimePackageJson(
  identity: { name: string; version: string },
  installedVersions: Readonly<Record<string, string>>,
): RuntimePackageJson {
  const dependencies = Object.fromEntries(
    RUNTIME_EXTERNALS.map((dep) => {
      const version = installedVersions[dep];
      if (!version) throw new Error(`Dependência externa "${dep}" não está instalada.`);
      return [dep, version];
    }),
  );
  return {
    name: identity.name,
    version: identity.version,
    private: true,
    type: 'module',
    dependencies,
  };
}

/** Opções do esbuild para unir o conector num ESM para Node 18+ (com `require` para deps CommonJS). */
export function bundleOptions(entry: string, outfile: string): BuildOptions {
  return {
    entryPoints: [entry],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    external: [...RUNTIME_EXTERNALS],
    banner: {
      js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
    },
    logLevel: 'warning',
  };
}
