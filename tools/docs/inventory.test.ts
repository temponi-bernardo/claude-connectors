import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DEFAULT_DOCS_CONFIG } from './config.js';
import {
  buildInventory,
  dirsFromFiles,
  listGitFiles,
  listUiComponents,
  listVersionedDirs,
  loadTestExceptions,
  readTestFilesText,
  walkFiles,
} from './inventory.js';

describe('on-disk inventory', () => {
  let root = '';

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'docs-inv-'));
    mkdirSync(join(root, 'src/core'), { recursive: true });
    mkdirSync(join(root, 'ui/parts'), { recursive: true });
    mkdirSync(join(root, 'node_modules/x'), { recursive: true });
    writeFileSync(join(root, 'src/core/a.ts'), 'export function alpha(): number { return 1; }');
    writeFileSync(join(root, 'src/core/a.test.ts'), 'alpha');
    writeFileSync(
      join(root, 'src/test-exceptions.ts'),
      'export const TEST_EXCEPTIONS = [{ name: "alpha", reason: "r", manualTest: "m" }];',
    );
    writeFileSync(join(root, 'ui/Button.tsx'), '');
    writeFileSync(join(root, 'ui/Button.test.tsx'), '');
    writeFileSync(join(root, 'ui/parts/Card.tsx'), '');
    writeFileSync(join(root, 'node_modules/x/i.ts'), '');
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('walkFiles skips node_modules and dirsFromFiles includes intermediate directories', () => {
    const files = walkFiles(root);
    expect(files).toContain('src/core/a.ts');
    expect(files.some((f) => f.startsWith('node_modules'))).toBe(false);
    expect(dirsFromFiles(['a/b/c.ts', 'a/d.ts'])).toEqual(['a/', 'a/b/']);
  });

  it('listGitFiles returns null outside a repository and lists inside one', () => {
    expect(listGitFiles(root)).toBeNull();
    execFileSync('git', ['init', '-q'], { cwd: root });
    const files = listGitFiles(root);
    expect(files).toContain('src/core/a.ts');
    expect(listVersionedDirs(root)).toContain('src/core/');
  });

  it('readTestFilesText concatenates only test files', () => {
    expect(readTestFilesText(root, DEFAULT_DOCS_CONFIG)).toBe('alpha');
    expect(readTestFilesText(root, { ...DEFAULT_DOCS_CONFIG, sourceDirs: ['nothing'] })).toBe('');
  });

  it('listUiComponents lists .tsx outside tests, or nothing without uiDir', () => {
    expect(listUiComponents(root, DEFAULT_DOCS_CONFIG)).toEqual([]);
    expect(listUiComponents(root, { ...DEFAULT_DOCS_CONFIG, uiDir: 'ui' })).toEqual([
      'Button',
      'Card',
    ]);
    expect(listUiComponents(root, { ...DEFAULT_DOCS_CONFIG, uiDir: 'missing' })).toEqual([]);
  });

  it('loadTestExceptions imports the list and fails when it is not a list', async () => {
    expect(await loadTestExceptions(root, DEFAULT_DOCS_CONFIG)).toEqual([
      { name: 'alpha', reason: 'r', manualTest: 'm' },
    ]);
    expect(
      await loadTestExceptions(root, {
        ...DEFAULT_DOCS_CONFIG,
        testExceptionsFile: 'does-not-exist.ts',
      }),
    ).toEqual([]);
    writeFileSync(join(root, 'src/bad-exceptions.ts'), 'export const TEST_EXCEPTIONS = 1;');
    await expect(
      loadTestExceptions(root, {
        ...DEFAULT_DOCS_CONFIG,
        testExceptionsFile: 'src/bad-exceptions.ts',
      }),
    ).rejects.toThrow('TEST_EXCEPTIONS');
  });

  it('buildInventory puts everything together', async () => {
    const inventory = await buildInventory(root, { ...DEFAULT_DOCS_CONFIG, sourceDirs: ['src'] });
    expect(inventory.functions.map((f) => f.name)).toEqual(['alpha']);
    expect(inventory.versionedDirs).toContain('src/');
    expect(inventory.testExceptions).toHaveLength(1);
    expect(inventory.callGraph.get('alpha')).toEqual(new Set());
  });
});
