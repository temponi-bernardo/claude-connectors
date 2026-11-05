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

/** Rótulo usado quando uma referência acontece fora de qualquer função (nível do módulo). */
export const MODULE_SCOPE_SUFFIX = ' (módulo)';

/** Converte um caminho absoluto em relativo à raiz, sempre com `/`. */
export function toPosixRelative(rootDir: string, absolutePath: string): string {
  return relative(rootDir, absolutePath).split('\\').join('/');
}

/** Converte um glob simples (`**`, `*`) em expressão regular aplicada a caminhos relativos. */
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

/** Decide se um arquivo (relativo) entra na análise: fonte `.ts`, fora dos ignorados e dos testes. */
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

/** Monta a assinatura legível de uma declaração de função (sem corpo nem `export`). */
export function signatureOf(fn: FunctionDeclaration): string {
  const params = fn
    .getParameters()
    .map((p) => p.getText())
    .join(', ');
  const returnType = fn.getReturnTypeNode()?.getText() ?? fn.getReturnType().getText(fn);
  const asyncPrefix = fn.isAsync() ? 'async ' : '';
  return `${asyncPrefix}${fn.getName() ?? '(anônima)'}(${params}): ${returnType}`;
}

/** Lista as funções de topo (`function nome`) de um arquivo. */
export function collectFileFunctions(rootDir: string, file: SourceFile): FunctionInfo[] {
  const relativeFile = toPosixRelative(rootDir, file.getFilePath());
  return file.getFunctions().flatMap((fn) => {
    const name = fn.getName();
    if (name === undefined) return [];
    return [{ name, file: relativeFile, signature: signatureOf(fn) }];
  });
}

/** Lista todas as funções de topo do projeto, em ordem de arquivo e posição. */
export function collectFunctions(rootDir: string, project: Project): FunctionInfo[] {
  return project
    .getSourceFiles()
    .sort((a, b) => a.getFilePath().localeCompare(b.getFilePath()))
    .flatMap((file) => collectFileFunctions(rootDir, file));
}

/** Decide se uma declaração de variável de topo exportada é um dado/constante (não uma função). */
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

/** Lista as constantes exportadas de topo do projeto (para a tabela "Dados e constantes"). */
export function collectConstants(rootDir: string, project: Project): ConstantInfo[] {
  return project.getSourceFiles().flatMap((file) => collectFileConstants(rootDir, file));
}

/** Decide se um nó de referência deve ser ignorado: a própria declaração, imports e exports. */
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

/** Descobre quem "é dono" de um nó: a função de topo que o contém, ou o módulo do arquivo. */
export function ownerLabelOf(rootDir: string, node: Node): string {
  const fn = node.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration);
  const name = fn?.getName();
  if (fn !== undefined && name !== undefined && Node.isSourceFile(fn.getParent())) {
    return `${name}()`;
  }
  return `${toPosixRelative(rootDir, node.getSourceFile().getFilePath())}${MODULE_SCOPE_SUFFIX}`;
}

/** Localiza a declaração de uma função do registro dentro do projeto. */
export function findDeclaration(
  rootDir: string,
  project: Project,
  info: FunctionInfo,
): FunctionDeclaration | undefined {
  const file = project.getSourceFile(`${rootDir}/${info.file}`);
  return file?.getFunction(info.name);
}

/** Monta o índice de referências: para cada função, quem a chama ou a passa como valor. */
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

/** Inverte o índice de referências em um grafo de chamadas: função → funções do registro que ela usa. */
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
