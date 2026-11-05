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

/** Entrada opcional do servidor remoto (HTTP + OAuth, ADR 0009) e caminho do bundle dele. */
export const REMOTE_ENTRY = join('src', 'remote-main.ts');
export const REMOTE_BUNDLE_PATH = join('server', 'remote.js');

/** Arquivos de runtime de um conector, versionados na pasta dele e copiados para o `.mcpb`. */
export const RUNTIME_FILES: readonly string[] = [
  'manifest.json',
  'package.json',
  'package-lock.json',
  BUNDLE_PATH,
];

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

/** Partes do manifesto `.mcpb` usadas para gerar os arquivos do plugin do Claude Code. */
export interface McpbManifest {
  readonly name: string;
  readonly description?: string;
  readonly author?: { readonly name: string };
  readonly repository?: { readonly url: string };
  readonly server: {
    readonly mcp_config: {
      readonly command: string;
      readonly args: readonly string[];
      readonly env?: Readonly<Record<string, string>>;
    };
  };
  readonly user_config?: Readonly<Record<string, unknown>>;
}

/** Gera o `plugin.json` do plugin a partir do manifesto `.mcpb` (fonte única de nome e configuração). */
export function pluginManifest(manifest: McpbManifest): Record<string, unknown> {
  return {
    name: manifest.name,
    description: manifest.description,
    author: manifest.author,
    repository: manifest.repository?.url,
    userConfig: manifest.user_config,
  };
}

/** Gera o `.mcp.json` do plugin: o mesmo comando do `.mcpb`, com `${__dirname}` → `${CLAUDE_PLUGIN_ROOT}`. */
export function pluginMcpConfig(manifest: McpbManifest): Record<string, unknown> {
  const { command, args, env } = manifest.server.mcp_config;
  const pluginArgs = args.map((arg) => arg.replaceAll('${__dirname}', '${CLAUDE_PLUGIN_ROOT}'));
  return { mcpServers: { [manifest.name]: { command, args: pluginArgs, env: env ?? {} } } };
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
      js: "import { createRequire as __bundleCreateRequire } from 'node:module'; const require = __bundleCreateRequire(import.meta.url);",
    },
    logLevel: 'warning',
  };
}
