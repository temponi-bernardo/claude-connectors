import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  buildCallGraph,
  buildReferenceIndex,
  collectConstants,
  collectFunctions,
  openProject,
} from './ast.js';
import type { DocsConfig, Inventory, TestExceptionEntry } from './types.js';

/** Pastas nunca percorridas quando o git não está disponível. */
export const WALK_IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'coverage',
  'build',
  'out',
]);

/** Lista os arquivos versionados pelo git (relativos à raiz); null se não houver git. */
export function listGitFiles(rootDir: string): string[] | null {
  try {
    const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return output.split('\n').filter((line) => line.length > 0);
  } catch {
    return null;
  }
}

/** Percorre o disco listando arquivos (relativos à raiz), pulando pastas ignoradas. */
export function walkFiles(rootDir: string, relativeDir = ''): string[] {
  const entries = readdirSync(join(rootDir, relativeDir), { withFileTypes: true });
  return entries.flatMap((entry) => {
    const relativePath = relativeDir === '' ? entry.name : `${relativeDir}/${entry.name}`;
    if (entry.isDirectory()) {
      return WALK_IGNORED_DIRS.has(entry.name) ? [] : walkFiles(rootDir, relativePath);
    }
    return [relativePath];
  });
}

/** Deriva, de uma lista de arquivos, todas as pastas (com barra final), incluindo as intermediárias. */
export function dirsFromFiles(files: readonly string[]): string[] {
  const dirs = new Set<string>();
  for (const file of files) {
    const parts = file.split('/');
    for (let depth = 1; depth < parts.length; depth += 1) {
      dirs.add(`${parts.slice(0, depth).join('/')}/`);
    }
  }
  return [...dirs].sort((a, b) => a.localeCompare(b));
}

/** Lista as pastas versionadas do repositório (git, com fallback para o disco). */
export function listVersionedDirs(rootDir: string): string[] {
  return dirsFromFiles(listGitFiles(rootDir) ?? walkFiles(rootDir));
}

/** Concatena o conteúdo de todos os arquivos de teste das pastas de código. */
export function readTestFilesText(rootDir: string, config: DocsConfig): string {
  const files = config.sourceDirs.flatMap((dir) => {
    const absolute = join(rootDir, dir);
    if (!existsSync(absolute)) return [];
    return walkFiles(absolute).map((file) => join(absolute, file));
  });
  return files
    .filter((file) => file.endsWith(config.testSuffix))
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');
}

/** Lista nomes de componentes de UI: arquivos `.tsx` da pasta configurada (sem testes). */
export function listUiComponents(rootDir: string, config: DocsConfig): string[] {
  if (config.uiDir === null) return [];
  const absolute = join(rootDir, config.uiDir);
  if (!existsSync(absolute) || !statSync(absolute).isDirectory()) return [];
  return walkFiles(absolute)
    .filter((file) => file.endsWith('.tsx') && !file.includes('.test.'))
    .map(
      (file) =>
        file
          .split('/')
          .pop()
          ?.replace(/\.tsx$/, '') ?? '',
    )
    .filter((name) => name.length > 0)
    .sort((a, b) => a.localeCompare(b));
}

/** Importa a lista de exceções de teste do arquivo configurado (vazia se ele não existir). */
export async function loadTestExceptions(
  rootDir: string,
  config: DocsConfig,
): Promise<TestExceptionEntry[]> {
  const absolute = join(rootDir, config.testExceptionsFile);
  if (!existsSync(absolute)) return [];
  const module = (await import(pathToFileURL(absolute).href)) as { TEST_EXCEPTIONS?: unknown };
  const list = module.TEST_EXCEPTIONS;
  if (!Array.isArray(list)) {
    throw new Error(`${config.testExceptionsFile} precisa exportar TEST_EXCEPTIONS como lista.`);
  }
  return list as TestExceptionEntry[];
}

/** Monta o inventário completo: código analisado, pastas, testes, UI e exceções. */
export async function buildInventory(rootDir: string, config: DocsConfig): Promise<Inventory> {
  const project = openProject(rootDir, config);
  const functions = collectFunctions(rootDir, project);
  const references = buildReferenceIndex(rootDir, project, functions);
  return {
    functions,
    constants: collectConstants(rootDir, project),
    references,
    callGraph: buildCallGraph(functions, references),
    versionedDirs: listVersionedDirs(rootDir),
    testFilesText: readTestFilesText(rootDir, config),
    uiComponents: listUiComponents(rootDir, config),
    testExceptions: await loadTestExceptions(rootDir, config),
  };
}
