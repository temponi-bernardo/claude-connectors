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
  it('usa travessão para lista vazia e crases para itens', () => {
    expect(formatList([])).toBe('—');
    expect(formatList(['a()', 'b (módulo)'])).toBe('`a()`, `b (módulo)`');
  });
});

describe('renderGeneratedBlock / renderNewSection', () => {
  it('renderiza os quatro campos gerados', () => {
    const block = renderGeneratedBlock(alpha, { usedBy: ['beta()'], processes: ['P01'] });
    expect(block).toBe(
      '- **Arquivo:** `src/a.ts`\n- **Assinatura:** `alpha(): void`\n- **Usada por:** `beta()`\n- **Processos:** P01',
    );
  });

  it('seção nova traz marcadores e campos manuais a preencher', () => {
    const section = renderNewSection(alpha, { usedBy: [], processes: [] });
    expect(section.startsWith('### `alpha`')).toBe(true);
    expect(section).toContain(GENERATED_START);
    expect(section).toContain(GENERATED_END);
    expect(section).toContain(`- **Faz:** ${PLACEHOLDER}`);
    expect(section).toContain('- **Processos:** —');
  });
});

describe('renderModuleIndex', () => {
  it('agrupa por arquivo com links', () => {
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

  it('fecho transitivo inclui raízes e tudo o que chamam', () => {
    expect(closureOf(graph, new Set(['a']))).toEqual(new Set(['a', 'b', 'c']));
    expect(closureOf(graph, new Set(['fora']))).toEqual(new Set(['fora']));
  });

  it('inverte citações em processos por função', () => {
    const citations = new Map([
      ['P01', new Set(['a'])],
      ['P02', new Set(['c'])],
    ]);
    const result = processesByFunction(citations, graph);
    expect(result.get('c')).toEqual(new Set(['P01', 'P02']));
    expect(result.get('a')).toEqual(new Set(['P01']));
    expect(result.has('d')).toBe(false);
  });

  it('computeGeneratedData ordena e lida com ausentes', () => {
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
    '# Funções',
    INDEX_START,
    INDEX_END,
    '',
    '## `src/a.ts`',
    '',
    '### `alpha`',
    '',
    GENERATED_START,
    'velho',
    GENERATED_END,
    '- **Faz:** x',
    '',
    '## Dados e constantes',
    '',
    '| Nome | Arquivo | O que é |',
  ].join('\n');

  it('substitui só o bloco gerado da seção certa', () => {
    const out = replaceSectionBlock(base, 'alpha', 'novo');
    expect(out).toContain(`${GENERATED_START}\nnovo\n${GENERATED_END}`);
    expect(out).not.toContain('velho');
    expect(out).toContain('- **Faz:** x');
  });

  it('acrescenta seção sob heading existente, antes do próximo heading', () => {
    const out = appendSection(base, { ...beta, file: 'src/a.ts' }, '### `beta`\n\nconteudo\n');
    const posBeta = out.indexOf('### `beta`');
    expect(posBeta).toBeGreaterThan(out.indexOf('### `alpha`'));
    expect(posBeta).toBeLessThan(out.indexOf('## Dados e constantes'));
  });

  it('cria heading novo antes da tabela de dados quando o arquivo não tem seção', () => {
    const out = appendSection(base, beta, '### `beta`\n');
    const posHeading = out.indexOf('## `src/b.ts`');
    expect(posHeading).toBeGreaterThan(-1);
    expect(posHeading).toBeLessThan(out.indexOf('## Dados e constantes'));
  });

  it('acrescenta no fim quando não há próximo heading nem tabela', () => {
    const md = '## `src/a.ts`\n\n### `alpha`\n';
    expect(
      appendSection(md, { ...beta, file: 'src/a.ts' }, '### `beta`').endsWith('### `beta`'),
    ).toBe(true);
    expect(insertBeforeDataTable('x', 'y')).toBe('x\n\ny');
  });
});

describe('applyGenerated', () => {
  it('atualiza índice, blocos existentes e cria seções novas', () => {
    const md = `# F\n${INDEX_START}\n${INDEX_END}\n\n## \`src/a.ts\`\n\n### \`alpha\`\n\n${GENERATED_START}\nvelho\n${GENERATED_END}\n- **Faz:** x\n`;
    const out = applyGenerated(md, [alpha, beta], () => ({ usedBy: [], processes: [] }));
    expect(out).toContain('- `src/a.ts`: [`alpha`](#alpha)');
    expect(out).toContain('- **Assinatura:** `alpha(): void`');
    expect(out).toContain('## `src/b.ts`');
    expect(out).toContain('### `beta`');
    expect(out).not.toContain('velho');
  });
});

describe('removeSection / removeEmptyModules / pruneOrphanSections', () => {
  const md = `# F\n\n## \`src/a.ts\`\n\n### \`alpha\`\n\n- **Faz:** a\n\n## \`src/old.ts\`\n\n### \`gone\`\n\n- **Faz:** g\n\n### \`gone2\`\n\n- **Faz:** g2\n\n## Dados e constantes\n`;

  it('remove uma seção até o próximo heading', () => {
    const out = removeSection(md, 'gone');
    expect(out).not.toContain('### `gone`\n');
    expect(out).toContain('### `gone2`');
    expect(out).toContain('### `alpha`');
  });

  it('remove headings de módulo que ficaram vazios', () => {
    const out = removeEmptyModules('# F\n\n## `src/x.ts`\n\n## `src/a.ts`\n\n### `alpha`\n');
    expect(out).toBe('# F\n\n## `src/a.ts`\n\n### `alpha`\n');
    expect(removeEmptyModules('# F\n\n## `src/x.ts`\n')).toBe('# F\n');
  });

  it('poda seções de funções que não existem mais no código e o módulo vazio', () => {
    const out = pruneOrphanSections(md, [alpha]);
    expect(out).not.toContain('gone');
    expect(out).not.toContain('src/old.ts');
    expect(out).toContain('### `alpha`');
    expect(out).toContain('## Dados e constantes');
  });

  it('applyGenerated também poda as órfãs', () => {
    const out = applyGenerated(md, [alpha], () => ({ usedBy: [], processes: [] }));
    expect(out).not.toContain('### `gone`');
  });
});
