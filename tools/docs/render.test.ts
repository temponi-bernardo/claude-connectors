import { describe, expect, it } from 'vitest';
import { GENERATED_END, GENERATED_START, INDEX_END, INDEX_START, PLACEHOLDER } from './markdown.js';
import {
  appendSection,
  applyGenerated,
  closureOf,
  computeGeneratedData,
  formatList,
  insertBeforeDataTable,
  processesByFunction,
  pruneOrphanSections,
  removeEmptyModules,
  removeSection,
  renderGeneratedBlock,
  renderModuleIndex,
  renderNewSection,
  replaceSectionBlock,
} from './render.js';
import type { FunctionInfo } from './types.js';

const alpha: FunctionInfo = { name: 'alpha', file: 'src/a.ts', signature: 'alpha(): void' };
const beta: FunctionInfo = { name: 'beta', file: 'src/b.ts', signature: 'beta(x: number): string' };

describe('formatList', () => {
  it('uses an em dash for an empty list and backticks for items', () => {
    expect(formatList([])).toBe('—');
    expect(formatList(['a()', 'b (module)'])).toBe('`a()`, `b (module)`');
  });
});

describe('renderGeneratedBlock / renderNewSection', () => {
  it('renders the four generated fields', () => {
    const block = renderGeneratedBlock(alpha, { usedBy: ['beta()'], processes: ['P01'] });
    expect(block).toBe(
      '- **File:** `src/a.ts`\n- **Signature:** `alpha(): void`\n- **Used by:** `beta()`\n- **Processes:** P01',
    );
  });

  it('a new section has markers and manual fields to fill in', () => {
    const section = renderNewSection(alpha, { usedBy: [], processes: [] });
    expect(section.startsWith('### `alpha`')).toBe(true);
    expect(section).toContain(GENERATED_START);
    expect(section).toContain(GENERATED_END);
    expect(section).toContain(`- **Does:** ${PLACEHOLDER}`);
    expect(section).toContain('- **Processes:** —');
  });
});

describe('renderModuleIndex', () => {
  it('groups by file with links', () => {
    expect(renderModuleIndex([alpha, beta])).toBe(
      '- `src/a.ts`: [`alpha`](#alpha)\n- `src/b.ts`: [`beta`](#beta)',
    );
  });
});

describe('closureOf / processesByFunction / computeGeneratedData', () => {
  const graph = new Map([
    ['a', new Set(['b'])],
    ['b', new Set(['c'])],
    ['c', new Set<string>()],
    ['d', new Set(['a'])],
  ]);

  it('the transitive closure includes the roots and everything they call', () => {
    expect(closureOf(graph, new Set(['a']))).toEqual(new Set(['a', 'b', 'c']));
    expect(closureOf(graph, new Set(['outside']))).toEqual(new Set(['outside']));
  });

  it('inverts citations into processes per function', () => {
    const citations = new Map([
      ['P01', new Set(['a'])],
      ['P02', new Set(['c'])],
    ]);
    const result = processesByFunction(citations, graph);
    expect(result.get('c')).toEqual(new Set(['P01', 'P02']));
    expect(result.get('a')).toEqual(new Set(['P01']));
    expect(result.has('d')).toBe(false);
  });

  it('computeGeneratedData sorts and handles missing entries', () => {
    const refs = new Map([['a', new Set(['z()', 'b()'])]]);
    expect(computeGeneratedData('a', refs, new Map([['a', new Set(['P02', 'P01'])]]))).toEqual({
      usedBy: ['b()', 'z()'],
      processes: ['P01', 'P02'],
    });
    expect(computeGeneratedData('x', refs, new Map())).toEqual({ usedBy: [], processes: [] });
  });
});

describe('replaceSectionBlock / appendSection / insertBeforeDataTable', () => {
  const base = [
    '# Functions',
    INDEX_START,
    INDEX_END,
    '',
    '## `src/a.ts`',
    '',
    '### `alpha`',
    '',
    GENERATED_START,
    'old',
    GENERATED_END,
    '- **Does:** x',
    '',
    '## Data and constants',
    '',
    '| Name | File | What it is |',
  ].join('\n');

  it('replaces only the generated block of the right section', () => {
    const out = replaceSectionBlock(base, 'alpha', 'new');
    expect(out).toContain(`${GENERATED_START}\nnew\n${GENERATED_END}`);
    expect(out).not.toContain('old');
    expect(out).toContain('- **Does:** x');
  });

  it('appends a section under an existing heading, before the next heading', () => {
    const out = appendSection(base, { ...beta, file: 'src/a.ts' }, '### `beta`\n\ncontent\n');
    const posBeta = out.indexOf('### `beta`');
    expect(posBeta).toBeGreaterThan(out.indexOf('### `alpha`'));
    expect(posBeta).toBeLessThan(out.indexOf('## Data and constants'));
  });

  it('creates a new heading before the data table when the file has no section', () => {
    const out = appendSection(base, beta, '### `beta`\n');
    const posHeading = out.indexOf('## `src/b.ts`');
    expect(posHeading).toBeGreaterThan(-1);
    expect(posHeading).toBeLessThan(out.indexOf('## Data and constants'));
  });

  it('appends at the end when there is no next heading or table', () => {
    const md = '## `src/a.ts`\n\n### `alpha`\n';
    expect(
      appendSection(md, { ...beta, file: 'src/a.ts' }, '### `beta`').endsWith('### `beta`'),
    ).toBe(true);
    expect(insertBeforeDataTable('x', 'y')).toBe('x\n\ny');
  });
});

describe('applyGenerated', () => {
  it('updates the index and existing blocks and creates new sections', () => {
    const md = `# F\n${INDEX_START}\n${INDEX_END}\n\n## \`src/a.ts\`\n\n### \`alpha\`\n\n${GENERATED_START}\nold\n${GENERATED_END}\n- **Does:** x\n`;
    const out = applyGenerated(md, [alpha, beta], () => ({ usedBy: [], processes: [] }));
    expect(out).toContain('- `src/a.ts`: [`alpha`](#alpha)');
    expect(out).toContain('- **Signature:** `alpha(): void`');
    expect(out).toContain('## `src/b.ts`');
    expect(out).toContain('### `beta`');
    expect(out).not.toContain('old');
  });
});

describe('removeSection / removeEmptyModules / pruneOrphanSections', () => {
  const md = `# F\n\n## \`src/a.ts\`\n\n### \`alpha\`\n\n- **Does:** a\n\n## \`src/old.ts\`\n\n### \`gone\`\n\n- **Does:** g\n\n### \`gone2\`\n\n- **Does:** g2\n\n## Data and constants\n`;

  it('removes a section up to the next heading', () => {
    const out = removeSection(md, 'gone');
    expect(out).not.toContain('### `gone`\n');
    expect(out).toContain('### `gone2`');
    expect(out).toContain('### `alpha`');
  });

  it('removes module headings left empty', () => {
    const out = removeEmptyModules('# F\n\n## `src/x.ts`\n\n## `src/a.ts`\n\n### `alpha`\n');
    expect(out).toBe('# F\n\n## `src/a.ts`\n\n### `alpha`\n');
    expect(removeEmptyModules('# F\n\n## `src/x.ts`\n')).toBe('# F\n');
  });

  it('prunes sections of functions no longer in the code and the empty module', () => {
    const out = pruneOrphanSections(md, [alpha]);
    expect(out).not.toContain('gone');
    expect(out).not.toContain('src/old.ts');
    expect(out).toContain('### `alpha`');
    expect(out).toContain('## Data and constants');
  });

  it('applyGenerated also prunes orphans', () => {
    const out = applyGenerated(md, [alpha], () => ({ usedBy: [], processes: [] }));
    expect(out).not.toContain('### `gone`');
  });
});
