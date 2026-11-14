import { relative } from 'node:path';
import {
  ModuleKind,
  ModuleResolutionKind,
  Node,
  Project,
  ScriptTarget,
  SyntaxKind,
  type FunctionDeclaration,
  type SourceFile,
  type VariableDeclaration,
} from 'ts-morph';
import type { CallGraph, ConstantInfo, DocsConfig, FunctionInfo, ReferenceIndex } from './types.js';

/** Label used when a reference happens outside any function (module level). */
export const MODULE_SCOPE_SUFFIX = ' (module)';

/** Converts an absolute path to one relative to the root, always with `/`. */
export function toPosixRelative(rootDir: string, absolutePath: string): string {
  return relative(rootDir, absolutePath).split('\\').join('/');
}

/** Converts a simple glob (`**`, `*`) into a regular expression applied to relative paths. */
export function globToRegExp(glob: string): RegExp {
  const DIR_WILDCARD = '\u0000DIR\u0000';
  const ANY_WILDCARD = '\u0000ANY\u0000';
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replaceAll('**/', DIR_WILDCARD)
    .replaceAll('**', ANY_WILDCARD)
    .replace(/\*/g, '[^/]*')
    .replaceAll(DIR_WILDCARD, '(?:.*/)?')
    .replaceAll(ANY_WILDCARD, '.*');
  return new RegExp(`^${escaped}$`);
}

/** Decides whether a (relative) file is analyzed: a `.ts` source, not ignored and not a test. */
export function isAnalyzedSource(relativePath: string, config: DocsConfig): boolean {
  if (!relativePath.endsWith('.ts') || relativePath.endsWith('.d.ts')) return false;
  if (relativePath.endsWith(config.testSuffix)) return false;
  return !config.ignore.some((glob) => globToRegExp(glob).test(relativePath));
}

/** Cria o projeto ts-morph com os arquivos-fonte das pastas configuradas. */
export function openProject(rootDir: string, config: DocsConfig): Project {
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.ES2022,
      module: ModuleKind.NodeNext,
      moduleResolution: ModuleResolutionKind.NodeNext,
      strict: true,
      skipLibCheck: true,
    },
    skipAddingFilesFromTsConfig: true,
  });
  for (const dir of config.sourceDirs) {
    project.addSourceFilesAtPaths(`${rootDir}/${dir}/**/*.ts`);
  }
  for (const file of project.getSourceFiles()) {
    if (!isAnalyzedSource(toPosixRelative(rootDir, file.getFilePath()), config)) {
      project.removeSourceFile(file);
    }
  }
  return project;
}

/** Builds the readable signature of a function declaration (no body or `export`). */
export function signatureOf(fn: FunctionDeclaration): string {
  const params = fn
    .getParameters()
    .map((p) => p.getText())
    .join(', ');
  const returnType = fn.getReturnTypeNode()?.getText() ?? fn.getReturnType().getText(fn);
  const asyncPrefix = fn.isAsync() ? 'async ' : '';
  return `${asyncPrefix}${fn.getName() ?? '(anonymous)'}(${params}): ${returnType}`;
}

/** Lists the top-level functions (`function name`) of a file. */
export function collectFileFunctions(rootDir: string, file: SourceFile): FunctionInfo[] {
  const relativeFile = toPosixRelative(rootDir, file.getFilePath());
  return file.getFunctions().flatMap((fn) => {
    const name = fn.getName();
    if (name === undefined) return [];
    return [{ name, file: relativeFile, signature: signatureOf(fn) }];
  });
}

/** Lists every top-level function in the project, ordered by file and position. */
export function collectFunctions(rootDir: string, project: Project): FunctionInfo[] {
  return project
    .getSourceFiles()
    .sort((a, b) => a.getFilePath().localeCompare(b.getFilePath()))
    .flatMap((file) => collectFileFunctions(rootDir, file));
}

/** Decides whether an exported top-level variable declaration is data/a constant (not a function). */
export function isDataDeclaration(declaration: VariableDeclaration): boolean {
  const initializer = declaration.getInitializer();
  if (initializer === undefined) return true;
  return !Node.isArrowFunction(initializer) && !Node.isFunctionExpression(initializer);
}

/** Lista as constantes exportadas de topo de um arquivo. */
export function collectFileConstants(rootDir: string, file: SourceFile): ConstantInfo[] {
  const relativeFile = toPosixRelative(rootDir, file.getFilePath());
  return file
    .getVariableStatements()
    .filter((statement) => statement.isExported())
    .flatMap((statement) => statement.getDeclarations())
    .filter((declaration) => isDataDeclaration(declaration))
    .map((declaration) => ({ name: declaration.getName(), file: relativeFile }));
}

/** Lista as constantes exportadas de topo do projeto (para a tabela "Data and constants"). */
export function collectConstants(rootDir: string, project: Project): ConstantInfo[] {
  return project.getSourceFiles().flatMap((file) => collectFileConstants(rootDir, file));
}

/** Decides whether a reference node is ignored: the declaration itself, imports and exports. */
export function isIgnoredReference(node: Node): boolean {
  const parent = node.getParent();
  if (parent === undefined) return true;
  if (Node.isFunctionDeclaration(parent)) return true;
  return (
    Node.isImportSpecifier(parent) ||
    Node.isExportSpecifier(parent) ||
    Node.isImportClause(parent) ||
    Node.isExportAssignment(parent)
  );
}

/** Finds who "owns" a node: the top-level function containing it, or the file's module. */
export function ownerLabelOf(rootDir: string, node: Node): string {
  const fn = node.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration);
  const name = fn?.getName();
  if (fn !== undefined && name !== undefined && Node.isSourceFile(fn.getParent())) {
    return `${name}()`;
  }
  return `${toPosixRelative(rootDir, node.getSourceFile().getFilePath())}${MODULE_SCOPE_SUFFIX}`;
}

/** Locates the declaration of a registry function within the project. */
export function findDeclaration(
  rootDir: string,
  project: Project,
  info: FunctionInfo,
): FunctionDeclaration | undefined {
  const file = project.getSourceFile(`${rootDir}/${info.file}`);
  return file?.getFunction(info.name);
}

/** Builds the reference index: for each function, who calls it or passes it as a value. */
export function buildReferenceIndex(
  rootDir: string,
  project: Project,
  functions: readonly FunctionInfo[],
): ReferenceIndex {
  const index = new Map<string, Set<string>>();
  for (const info of functions) {
    const owners = new Set<string>();
    const declaration = findDeclaration(rootDir, project, info);
    for (const ref of declaration?.findReferencesAsNodes() ?? []) {
      if (!isIgnoredReference(ref)) owners.add(ownerLabelOf(rootDir, ref));
    }
    index.set(info.name, owners);
  }
  return index;
}

/** Inverts the reference index into a call graph: function → registry functions it uses. */
export function buildCallGraph(
  functions: readonly FunctionInfo[],
  references: ReferenceIndex,
): CallGraph {
  const graph = new Map<string, Set<string>>(functions.map((f) => [f.name, new Set<string>()]));
  for (const [callee, owners] of references) {
    for (const owner of owners) {
      const caller = owner.endsWith('()') ? owner.slice(0, -2) : null;
      if (caller !== null) graph.get(caller)?.add(callee);
    }
  }
  return graph;
}
