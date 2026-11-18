/**
 * Architecture guard for data isolation (docs/security/isolation.md): a Worker isolate serves many users at once,
 * so module-level mutable state could carry one user's data into another user's request. This test fails when a
 * source file declares, at the top level, a `let`/`var`, a mutable `Map`/`Set`/`WeakMap`/`WeakSet`/array or a
 * plain object literal that is not typed read-only, unless it is in the reviewed allowlist below.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..');

/** Reviewed module-level state: `file#name` → why it cannot mix users. */
const ALLOWED_MODULE_STATE: Readonly<Record<string, string>> = {
  'connectors/gmail/src/access-token.ts#accessTokenCache':
    'Keyed by owner AND account email (accessTokenKey); isolation.test.ts proves user B never gets user A’s token.',
};

/** Source files of the shared code and of every connector (tests and fixtures excluded). */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory())
      return entry.name === 'fixtures' || entry.name === 'bridge' ? [] : sourceFiles(path);
    return entry.name.endsWith('.ts') &&
      !entry.name.endsWith('.test.ts') &&
      !entry.name.endsWith('.d.ts')
      ? [path]
      : [];
  });
}

/** Says whether a declared type is read-only (`readonly T[]`, `Readonly<...>`, `ReadonlySet`, `ReadonlyMap`). */
function isReadonlyType(type: ts.TypeNode | undefined): boolean {
  return type !== undefined && /^(readonly\s|Readonly)/.test(type.getText());
}

/** Says whether an initializer creates a mutable container. */
function isMutableInitializer(init: ts.Expression | undefined): boolean {
  if (!init) return false;
  if (ts.isAsExpression(init))
    return init.type.getText() !== 'const' && isMutableInitializer(init.expression);
  if (ts.isNewExpression(init))
    return /^(Map|Set|WeakMap|WeakSet|Array)$/.test(init.expression.getText());
  return ts.isArrayLiteralExpression(init) || ts.isObjectLiteralExpression(init);
}

/** Top-level mutable declarations of a file, as `file#name`. */
function mutableModuleState(path: string): string[] {
  const file = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
  const found: string[] = [];
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const decl of statement.declarationList.declarations) {
      if (isMutableDeclaration(statement, decl))
        found.push(`${relative(ROOT, path)}#${decl.name.getText()}`);
    }
  }
  return found;
}

/** Says whether one declaration of a top-level statement is mutable state. */
function isMutableDeclaration(
  statement: ts.VariableStatement,
  decl: ts.VariableDeclaration,
): boolean {
  const isConst = (statement.declarationList.flags & ts.NodeFlags.Const) !== 0;
  return !isConst || (isMutableInitializer(decl.initializer) && !isReadonlyType(decl.type));
}

/** Parses one statement of code and says whether it declares mutable state. */
function probe(code: string): boolean {
  const statement = ts.createSourceFile('p.ts', code, ts.ScriptTarget.Latest, true).statements[0];
  if (!statement || !ts.isVariableStatement(statement)) return false;
  const [decl] = statement.declarationList.declarations;
  return decl !== undefined && isMutableDeclaration(statement, decl);
}

describe('module-level state', () => {
  const files = ['src', 'connectors'].flatMap((dir) => sourceFiles(join(ROOT, dir)));

  it('scans the shared code and every connector', () => {
    expect(files.some((f) => f.endsWith('src/remote/handler.ts'))).toBe(true);
    expect(files.some((f) => f.endsWith('connectors/gmail/src/worker.ts'))).toBe(true);
  });

  it('has no mutable top-level state outside the reviewed allowlist', () => {
    const found = files.flatMap(mutableModuleState);
    expect(found.filter((entry) => !(entry in ALLOWED_MODULE_STATE))).toEqual([]);
  });

  it('keeps the allowlist free of entries that no longer exist', () => {
    const found = new Set(files.flatMap(mutableModuleState));
    expect(Object.keys(ALLOWED_MODULE_STATE).filter((entry) => !found.has(entry))).toEqual([]);
  });

  it('detects the forbidden shapes', () => {
    expect(probe('let user = null;')).toBe(true);
    expect(probe('const cache = new Map<string, string>();')).toBe(true);
    expect(probe('const seen: string[] = [];')).toBe(true);
    expect(probe('const state = {};')).toBe(true);
    expect(probe('const NAMES: ReadonlySet<string> = new Set(["a"]);')).toBe(false);
    expect(probe('const LIMITS = { a: 1 } as const;')).toBe(false);
    expect(probe('const HOSTS: readonly string[] = ["a"];')).toBe(false);
    expect(probe('const TTL = 60;')).toBe(false);
  });
});
