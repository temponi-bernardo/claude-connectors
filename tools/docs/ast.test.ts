import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  MODULE_SCOPE_SUFFIX,
  buildCallGraph,
  buildReferenceIndex,
  collectConstants,
  collectFileConstants,
  collectFileFunctions,
  collectFunctions,
  findDeclaration,
  isDataDeclaration,
  isIgnoredReference,
  ownerLabelOf,
  signatureOf,
  globToRegExp,
  isAnalyzedSource,
  openProject,
  toPosixRelative,
} from './ast.js';
import { DEFAULT_DOCS_CONFIG } from './config.js';

const A_TS = `
import { helper } from './b.js';

export const LIMIT = 10;
export const notData = () => 1;
const privateValue = 2;

/** Comentário com helper() dentro não conta. */
export function run(input: string): number {
  const text = 'helper() em string também não conta';
  const obj = { helper: 1 };
  return helper(input).length + obj.helper + LIMIT + privateValue + text.length;
}

export function passesAsValue(): (x: string) => string {
  return helper;
}

const atModule = helper('x');
export { atModule };
`;

const B_TS = `
export function helper(x: string): string {
  return x;
}

export async function later(): Promise<void> {}

export function inferred(x: number) {
  return x * 2;
}

export let uninit: number;

export default function anon() {}
`;

describe('análise AST', () => {
  let root = '';

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'docs-ast-'));
    mkdirSync(join(root, 'src/fixtures'), { recursive: true });
    writeFileSync(join(root, 'src/a.ts'), A_TS);
    writeFileSync(join(root, 'src/b.ts'), B_TS);
    writeFileSync(join(root, 'src/a.test.ts'), 'export function inTest() {}');
    writeFileSync(join(root, 'src/fixtures/f.ts'), 'export function inFixture() {}');
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('globToRegExp e isAnalyzedSource filtram testes, fixtures e .d.ts', () => {
    expect(globToRegExp('**/fixtures/**').test('src/fixtures/f.ts')).toBe(true);
    expect(globToRegExp('**/fixtures/**').test('tools/hooks/fixtures/util.ts')).toBe(true);
    expect(globToRegExp('**/fixtures/**').test('fixtures/a/b.ts')).toBe(true);
    expect(globToRegExp('**/fixtures/**').test('src/fixtures.ts')).toBe(false);
    expect(globToRegExp('src/*.ts').test('src/a.ts')).toBe(true);
    expect(globToRegExp('src/*.ts').test('src/x/a.ts')).toBe(false);
    expect(isAnalyzedSource('src/a.ts', DEFAULT_DOCS_CONFIG)).toBe(true);
    expect(isAnalyzedSource('src/a.test.ts', DEFAULT_DOCS_CONFIG)).toBe(false);
    expect(isAnalyzedSource('src/fixtures/f.ts', DEFAULT_DOCS_CONFIG)).toBe(false);
    expect(isAnalyzedSource('src/t.d.ts', DEFAULT_DOCS_CONFIG)).toBe(false);
    expect(isAnalyzedSource('src/x.json', DEFAULT_DOCS_CONFIG)).toBe(false);
  });

  it('toPosixRelative usa barras normais', () => {
    expect(toPosixRelative('/r', '/r/a/b.ts')).toBe('a/b.ts');
  });

  it('collectFunctions registra só funções de topo nomeadas, com assinatura', () => {
    const project = openProject(root, DEFAULT_DOCS_CONFIG);
    const functions = collectFunctions(root, project);
    expect(functions.map((f) => f.name)).toEqual([
      'run',
      'passesAsValue',
      'helper',
      'later',
      'inferred',
      'anon',
    ]);
    expect(functions.find((f) => f.name === 'run')?.signature).toBe('run(input: string): number');
    expect(functions.find((f) => f.name === 'later')?.signature).toBe(
      'async later(): Promise<void>',
    );
    expect(functions.find((f) => f.name === 'run')?.file).toBe('src/a.ts');
    expect(functions.find((f) => f.name === 'inferred')?.signature).toBe(
      'inferred(x: number): number',
    );
  });

  it('collectConstants lista constantes exportadas que não são funções', () => {
    const project = openProject(root, DEFAULT_DOCS_CONFIG);
    expect(collectConstants(root, project).map((c) => c.name)).toEqual(['LIMIT', 'uninit']);
  });

  it('buildReferenceIndex ignora declaração, imports, strings, comentários e chaves de objeto', () => {
    const project = openProject(root, DEFAULT_DOCS_CONFIG);
    const functions = collectFunctions(root, project);
    const index = buildReferenceIndex(root, project, functions);
    expect(index.get('helper')).toEqual(
      new Set(['run()', 'passesAsValue()', `src/a.ts${MODULE_SCOPE_SUFFIX}`]),
    );
    expect(index.get('run')).toEqual(new Set());
    expect(index.get('later')).toEqual(new Set());
  });

  it('buildCallGraph inverte o índice só para donos que são funções', () => {
    const project = openProject(root, DEFAULT_DOCS_CONFIG);
    const functions = collectFunctions(root, project);
    const graph = buildCallGraph(functions, buildReferenceIndex(root, project, functions));
    expect(graph.get('run')).toEqual(new Set(['helper']));
    expect(graph.get('passesAsValue')).toEqual(new Set(['helper']));
    expect(graph.get('helper')).toEqual(new Set());
  });

  it('findDeclaration devolve undefined para arquivo desconhecido', () => {
    const project = openProject(root, DEFAULT_DOCS_CONFIG);
    expect(
      findDeclaration(root, project, { name: 'x', file: 'src/nope.ts', signature: '' }),
    ).toBeUndefined();
  });
});

describe('funções auxiliares da AST', () => {
  let root = '';

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'docs-ast2-'));
    mkdirSync(join(root, 'src'), { recursive: true });
    writeFileSync(
      join(root, 'src/c.ts'),
      [
        'export const DATA = 1;',
        'export const fnExpr = function () { return 1; };',
        'export function named(a: number) { return a; }',
        'export default function dflt() {}',
        'export { named as renamed };',
        'const value = named(2);',
        'export { value };',
      ].join('\n'),
    );
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('signatureOf, collectFileFunctions, isDataDeclaration e collectFileConstants', () => {
    const project = openProject(root, DEFAULT_DOCS_CONFIG);
    const file = project.getSourceFileOrThrow(`${root}/src/c.ts`);
    expect(signatureOf(file.getFunctionOrThrow('named'))).toBe('named(a: number): number');
    expect(collectFileFunctions(root, file).map((f) => f.name)).toEqual(['named', 'dflt']);
    const declarations = file.getVariableDeclarations();
    expect(isDataDeclaration(declarations.find((d) => d.getName() === 'DATA')!)).toBe(true);
    expect(isDataDeclaration(declarations.find((d) => d.getName() === 'fnExpr')!)).toBe(false);
    expect(collectFileConstants(root, file).map((c) => c.name)).toEqual(['DATA']);
  });

  it('isIgnoredReference e ownerLabelOf classificam cada referência', () => {
    const project = openProject(root, DEFAULT_DOCS_CONFIG);
    const file = project.getSourceFileOrThrow(`${root}/src/c.ts`);
    const refs = file.getFunctionOrThrow('named').findReferencesAsNodes();
    const kept = refs.filter((ref) => !isIgnoredReference(ref));
    expect(refs.length).toBeGreaterThan(kept.length);
    expect(kept).toHaveLength(1);
    expect(ownerLabelOf(root, kept[0]!)).toBe(`src/c.ts${MODULE_SCOPE_SUFFIX}`);
    const body = file.getFunctionOrThrow('named').getBodyOrThrow();
    expect(ownerLabelOf(root, body)).toBe('named()');
    expect(isIgnoredReference(file)).toBe(true);
  });
});
