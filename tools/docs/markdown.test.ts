import { describe, expect, it } from 'vitest';
import {
  GENERATED_END,
  GENERATED_START,
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

describe('stripCodeBlocks', () => {
  it('remove blocos ``` e ~~~ mantendo o resto', () => {
    const md = 'antes\n```ts\nexemplo()\n```\nmeio\n~~~\noutro()\n~~~\ndepois';
    const result = stripCodeBlocks(md);
    expect(result).not.toContain('exemplo()');
    expect(result).not.toContain('outro()');
    expect(result).toContain('antes');
    expect(result).toContain('depois');
  });
});

describe('firstGroup', () => {
  it('devolve o grupo 1 ou vazio', () => {
    expect(firstGroup(/a(b)/.exec('ab')!)).toBe('b');
    expect(firstGroup(/a(b)?/.exec('a')!)).toBe('');
  });
});

describe('extractCalledNames', () => {
  it('pega só nomes em crase com parênteses, ignorando blocos de código', () => {
    const md = 'Usa `slugify()` e `outra()`; não `const` nem `x`.\n```\n`dentro()`\n```';
    expect(extractCalledNames(md)).toEqual(new Set(['slugify', 'outra']));
  });
});

describe('sliceBetween / replaceBetween', () => {
  const text = `a\n${GENERATED_START}\nvelho\n${GENERATED_END}\nz`;

  it('extrai o miolo entre marcadores', () => {
    expect(sliceBetween(text, GENERATED_START, GENERATED_END)).toBe('velho');
  });

  it('devolve null sem marcadores', () => {
    expect(sliceBetween('nada', GENERATED_START, GENERATED_END)).toBeNull();
  });

  it('substitui o miolo', () => {
    const out = replaceBetween(text, [GENERATED_START, GENERATED_END], 'novo');
    expect(out).toBe(`a\n${GENERATED_START}\nnovo\n${GENERATED_END}\nz`);
  });

  it('não altera texto sem marcadores', () => {
    expect(replaceBetween('x', [GENERATED_START, GENERATED_END], 'novo')).toBe('x');
  });
});

describe('extractFunctionSections', () => {
  const md = [
    '# Funções',
    '## `src/a.ts`',
    '### `alpha`',
    GENERATED_START,
    '- **Arquivo:** `src/a.ts`',
    GENERATED_END,
    '- **Faz:** algo',
    '## `src/b.ts`',
    '### `beta`',
    '- **Faz:** outra coisa',
    '```',
    '### `naoConta`',
    '```',
  ].join('\n');

  it('lista seções com módulo, bloco gerado e texto manual', () => {
    const sections = extractFunctionSections(md);
    expect(sections.map((s) => s.name)).toEqual(['alpha', 'beta']);
    expect(sections[0]?.moduleHeading).toBe('`src/a.ts`');
    expect(sections[0]?.generatedBlock).toBe('- **Arquivo:** `src/a.ts`');
    expect(sections[0]?.manualText).toBe('- **Faz:** algo');
    expect(sections[1]?.moduleHeading).toBe('`src/b.ts`');
    expect(sections[1]?.generatedBlock).toBeNull();
  });

  it('buildSection funciona sem módulo', () => {
    const section = buildSection('x', null, '### `x`\n- **Faz:** y');
    expect(section).toEqual({
      name: 'x',
      moduleHeading: null,
      generatedBlock: null,
      manualText: '- **Faz:** y',
    });
  });
});

describe('extractProcessCitations', () => {
  it('agrupa funções citadas por processo', () => {
    const md =
      '## P01 — Fluxo\n1. `a()` chama `b()`\n## P02 — Outro\n`c()`\n## Não processo\n`d()`';
    const result = extractProcessCitations(md);
    expect(result.get('P01')).toEqual(new Set(['a', 'b']));
    expect(result.get('P02')).toEqual(new Set(['c']));
    expect(result.has('Não processo')).toBe(false);
  });
});

describe('extractDocumentedDirs / extractBacktickedNames', () => {
  it('pega pastas com barra final e nomes simples', () => {
    const md = '| `src/` | x |\n| `docs/adr/` | y |\n`Button` e `arquivo.ts`';
    expect(extractDocumentedDirs(md)).toEqual(new Set(['src/', 'docs/adr/']));
    expect(extractBacktickedNames(md)).toEqual(new Set(['Button']));
  });
});
