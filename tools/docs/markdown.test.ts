import { describe, expect, it } from 'vitest';
import {
  GENERATED_END,
  GENERATED_START,
  INDEX_END,
  INDEX_START,
  PLACEHOLDER,
  buildSection,
  extractBacktickedNames,
  extractCalledNames,
  extractDocumentedDirs,
  extractFunctionSections,
  extractProcessCitations,
  firstGroup,
  replaceBetween,
  sliceBetween,
  stripCodeBlocks,
} from './markdown.js';

describe('markers', () => {
  it('uses English generated-block, index and placeholder markers', () => {
    expect(GENERATED_START).toBe('<!-- generated:start -->');
    expect(GENERATED_END).toBe('<!-- generated:end -->');
    expect(INDEX_START).toBe('<!-- index:start -->');
    expect(INDEX_END).toBe('<!-- index:end -->');
    expect(PLACEHOLDER).toBe('_fill_in_');
  });
});

describe('stripCodeBlocks', () => {
  it('removes ``` and ~~~ blocks keeping the rest', () => {
    const md = 'before\n```ts\nexample()\n```\nmiddle\n~~~\nother()\n~~~\nafter';
    const result = stripCodeBlocks(md);
    expect(result).not.toContain('example()');
    expect(result).not.toContain('other()');
    expect(result).toContain('before');
    expect(result).toContain('after');
  });
});

describe('firstGroup', () => {
  it('returns group 1 or empty', () => {
    expect(firstGroup(/a(b)/.exec('ab')!)).toBe('b');
    expect(firstGroup(/a(b)?/.exec('a')!)).toBe('');
  });
});

describe('extractCalledNames', () => {
  it('takes only backticked names with parentheses, ignoring code blocks', () => {
    const md = 'Uses `slugify()` and `other()`; not `const` nor `x`.\n```\n`inside()`\n```';
    expect(extractCalledNames(md)).toEqual(new Set(['slugify', 'other']));
  });
});

describe('sliceBetween / replaceBetween', () => {
  const text = `a\n${GENERATED_START}\nold\n${GENERATED_END}\nz`;

  it('extracts the content between markers', () => {
    expect(sliceBetween(text, GENERATED_START, GENERATED_END)).toBe('old');
  });

  it('returns null without markers', () => {
    expect(sliceBetween('nothing', GENERATED_START, GENERATED_END)).toBeNull();
  });

  it('replaces the content', () => {
    const out = replaceBetween(text, [GENERATED_START, GENERATED_END], 'new');
    expect(out).toBe(`a\n${GENERATED_START}\nnew\n${GENERATED_END}\nz`);
  });

  it('leaves text without markers unchanged', () => {
    expect(replaceBetween('x', [GENERATED_START, GENERATED_END], 'new')).toBe('x');
  });
});

describe('extractFunctionSections', () => {
  const md = [
    '# Functions',
    '## `src/a.ts`',
    '### `alpha`',
    GENERATED_START,
    '- **File:** `src/a.ts`',
    GENERATED_END,
    '- **Does:** something',
    '## `src/b.ts`',
    '### `beta`',
    '- **Does:** something else',
    '```',
    '### `doesNotCount`',
    '```',
  ].join('\n');

  it('lists sections with module, generated block and manual text', () => {
    const sections = extractFunctionSections(md);
    expect(sections.map((s) => s.name)).toEqual(['alpha', 'beta']);
    expect(sections[0]?.moduleHeading).toBe('`src/a.ts`');
    expect(sections[0]?.generatedBlock).toBe('- **File:** `src/a.ts`');
    expect(sections[0]?.manualText).toBe('- **Does:** something');
    expect(sections[1]?.moduleHeading).toBe('`src/b.ts`');
    expect(sections[1]?.generatedBlock).toBeNull();
  });

  it('buildSection works without a module', () => {
    const section = buildSection('x', null, '### `x`\n- **Does:** y');
    expect(section).toEqual({
      name: 'x',
      moduleHeading: null,
      generatedBlock: null,
      manualText: '- **Does:** y',
    });
  });
});

describe('extractProcessCitations', () => {
  it('groups cited functions by process', () => {
    const md =
      '## P01 — Flow\n1. `a()` calls `b()`\n## P02 — Other\n`c()`\n## Not a process\n`d()`';
    const result = extractProcessCitations(md);
    expect(result.get('P01')).toEqual(new Set(['a', 'b']));
    expect(result.get('P02')).toEqual(new Set(['c']));
    expect(result.has('Not a process')).toBe(false);
  });
});

describe('extractDocumentedDirs / extractBacktickedNames', () => {
  it('takes directories with a trailing slash and simple names', () => {
    const md = '| `src/` | x |\n| `docs/adr/` | y |\n`Button` and `file.ts`';
    expect(extractDocumentedDirs(md)).toEqual(new Set(['src/', 'docs/adr/']));
    expect(extractBacktickedNames(md)).toEqual(new Set(['Button']));
  });
});
