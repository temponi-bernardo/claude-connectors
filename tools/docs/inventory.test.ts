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

describe('inventário em disco', () => {
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

  it('walkFiles pula node_modules e dirsFromFiles inclui pastas intermediárias', () => {
    const files = walkFiles(root);
    expect(files).toContain('src/core/a.ts');
    expect(files.some((f) => f.startsWith('node_modules'))).toBe(false);
    expect(dirsFromFiles(['a/b/c.ts', 'a/d.ts'])).toEqual(['a/', 'a/b/']);
  });

  it('listGitFiles devolve null fora de um repositório e lista dentro de um', () => {
    expect(listGitFiles(root)).toBeNull();
    execFileSync('git', ['init', '-q'], { cwd: root });
    const files = listGitFiles(root);
    expect(files).toContain('src/core/a.ts');
    expect(listVersionedDirs(root)).toContain('src/core/');
  });

  it('readTestFilesText concatena só arquivos de teste', () => {
    expect(readTestFilesText(root, DEFAULT_DOCS_CONFIG)).toBe('alpha');
    expect(readTestFilesText(root, { ...DEFAULT_DOCS_CONFIG, sourceDirs: ['nada'] })).toBe('');
  });

  it('listUiComponents lista .tsx fora de testes, ou nada sem uiDir', () => {
    expect(listUiComponents(root, DEFAULT_DOCS_CONFIG)).toEqual([]);
    expect(listUiComponents(root, { ...DEFAULT_DOCS_CONFIG, uiDir: 'ui' })).toEqual([
      'Button',
      'Card',
    ]);
    expect(listUiComponents(root, { ...DEFAULT_DOCS_CONFIG, uiDir: 'inexistente' })).toEqual([]);
  });

  it('loadTestExceptions importa a lista e falha se não for lista', async () => {
    expect(await loadTestExceptions(root, DEFAULT_DOCS_CONFIG)).toEqual([
      { name: 'alpha', reason: 'r', manualTest: 'm' },
    ]);
    expect(
      await loadTestExceptions(root, {
        ...DEFAULT_DOCS_CONFIG,
        testExceptionsFile: 'nao-existe.ts',
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

  it('buildInventory junta tudo', async () => {
    const inventory = await buildInventory(root, { ...DEFAULT_DOCS_CONFIG, sourceDirs: ['src'] });
    expect(inventory.functions.map((f) => f.name)).toEqual(['alpha']);
    expect(inventory.versionedDirs).toContain('src/');
    expect(inventory.testExceptions).toHaveLength(1);
    expect(inventory.callGraph.get('alpha')).toEqual(new Set());
  });
});
