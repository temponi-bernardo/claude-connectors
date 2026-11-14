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

/** Folders never walked when git is unavailable. */
export const WALK_IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'coverage',
  'build',
  'out',
]);

/** Lists the files versioned by git (relative to the root); null when there is no git. */
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

/** Walks the disk listing files (relative to the root), skipping ignored folders. */
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

/** Derives every folder (with trailing slash) from a file list, including intermediate ones. */
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

/** Lists the repository's versioned folders (git, falling back to the disk). */
export function listVersionedDirs(rootDir: string): string[] {
  return dirsFromFiles(listGitFiles(rootDir) ?? walkFiles(rootDir));
}

/** Concatenates the content of every test file in the code folders. */
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

/** Imports the test exceptions list from the configured file (empty if it does not exist). */
export async function loadTestExceptions(
  rootDir: string,
  config: DocsConfig,
): Promise<TestExceptionEntry[]> {
  const absolute = join(rootDir, config.testExceptionsFile);
  if (!existsSync(absolute)) return [];
  const module = (await import(pathToFileURL(absolute).href)) as { TEST_EXCEPTIONS?: unknown };
  const list = module.TEST_EXCEPTIONS;
  if (!Array.isArray(list)) {
    throw new Error(`${config.testExceptionsFile} must export TEST_EXCEPTIONS as a list.`);
  }
  return list as TestExceptionEntry[];
}

/** Builds the full inventory: analyzed code, folders, tests, UI and exceptions. */
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
