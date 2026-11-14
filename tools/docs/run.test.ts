import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PLACEHOLDER } from './markdown.js';
import {
  formatIssues,
  generateFunctionsDoc,
  readDocsTexts,
  readOptional,
  runCheck,
  runGenerate,
} from './run.js';
import { DEFAULT_DOCS_CONFIG } from './config.js';
import { buildInventory } from './inventory.js';

const FUNCTIONS_SEED =
  '# Functions\n\n<!-- index:start -->\n<!-- index:end -->\n\n## Data and constants\n\n| Name | File | What it is |\n| --- | --- | --- |\n| `LIMIT` | `src/a.ts` | limit |\n';

describe('runCheck / runGenerate', () => {
  let root = '';

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'docs-run-'));
    mkdirSync(join(root, 'src'), { recursive: true });
    mkdirSync(join(root, 'docs'), { recursive: true });
    writeFileSync(join(root, 'docs.config.json'), JSON.stringify({ sourceDirs: ['src'] }));
    writeFileSync(
      join(root, 'src/a.ts'),
      'export const LIMIT = 1;\nexport function alpha(): number { return beta(); }\nexport function beta(): number { return LIMIT; }',
    );
    writeFileSync(join(root, 'src/a.test.ts'), 'alpha beta');
    writeFileSync(join(root, 'docs/FUNCTIONS.md'), FUNCTIONS_SEED);
    writeFileSync(join(root, 'docs/PROCESSES.md'), '## P01 — Example\n\n1. `alpha()`\n');
    writeFileSync(join(root, 'docs/STRUCTURE.md'), '| `src/` | code |\n| `docs/` | docs |\n');
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('readOptional / readDocsTexts handle missing files', () => {
    expect(readOptional(root, 'missing.md')).toBeNull();
    const empty = mkdtempSync(join(tmpdir(), 'docs-empty-'));
    expect(readDocsTexts(empty, DEFAULT_DOCS_CONFIG)).toEqual({
      functions: '',
      processes: '',
      structure: '',
      ui: null,
    });
    rmSync(empty, { recursive: true, force: true });
    const docs = readDocsTexts(root, DEFAULT_DOCS_CONFIG);
    expect(docs.ui).toBeNull();
    expect(docs.functions).toBe(FUNCTIONS_SEED);
  });

  it('formatIssues summarizes success and lists numbered problems', () => {
    expect(formatIssues([])).toContain('✔');
    const text = formatIssues([
      { code: 'X', message: 'm1' },
      { code: 'Y', message: 'm2' },
    ]);
    expect(text).toContain('2 problem(s)');
    expect(text).toContain('1. [X] m1');
    expect(text).toContain('2. [Y] m2');
  });

  it('check fails before generating, generate creates sections, then check only asks for the manual fields', async () => {
    const before = await runCheck(root);
    expect(before.map((i) => i.code)).toEqual(['FUNCTION_UNDOCUMENTED', 'FUNCTION_UNDOCUMENTED']);

    expect(await runGenerate(root)).toBe(true);
    const generated = readFileSync(join(root, 'docs/FUNCTIONS.md'), 'utf8');
    expect(generated).toContain('## `src/a.ts`');
    expect(generated).toContain('- **Used by:** `alpha()`');
    expect(generated).toContain('- **Processes:** P01');
    expect(generated).toContain('- `src/a.ts`: [`alpha`](#alpha), [`beta`](#beta)');

    const after = await runCheck(root);
    expect(new Set(after.map((i) => i.code))).toEqual(new Set(['MANUAL_FIELD_UNFILLED']));
    expect(after).toHaveLength(10);

    const filled = generated.replaceAll(PLACEHOLDER, 'ok');
    writeFileSync(join(root, 'docs/FUNCTIONS.md'), filled);
    expect(await runCheck(root)).toEqual([]);
    expect(await runGenerate(root)).toBe(false);
  });

  it('generateFunctionsDoc is pure: the same inventory and text produce the same result', async () => {
    const inventory = await buildInventory(root, { ...DEFAULT_DOCS_CONFIG, sourceDirs: ['src'] });
    const docs = readDocsTexts(root, DEFAULT_DOCS_CONFIG);
    expect(generateFunctionsDoc(inventory, docs)).toBe(docs.functions);
  });

  it('detects an outdated generated block after a code change', async () => {
    writeFileSync(
      join(root, 'src/a.ts'),
      'export const LIMIT = 1;\nexport function alpha(): number { return 2; }\nexport function beta(): number { return LIMIT; }',
    );
    const issues = await runCheck(root);
    expect(issues.map((i) => i.code)).toEqual(['GENERATED_BLOCK_OUTDATED']);
    expect(issues[0]?.message).toContain('`beta`');
    expect(await runGenerate(root)).toBe(true);
    expect(await runCheck(root)).toEqual([]);
  });
});
