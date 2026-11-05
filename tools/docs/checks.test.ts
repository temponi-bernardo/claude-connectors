import { describe, expect, it } from 'vitest';
import {
  checkConstants,
  checkFunctionsDocumented,
  checkGeneratedBlocks,
  checkManualFields,
  checkProcessCitations,
  checkSectionModules,
  checkStructure,
  checkTests,
  checkUiComponents,
  checkUniqueNames,
  runAllChecks,
} from './checks.js';
import {
  GENERATED_END,
  GENERATED_START,
  PLACEHOLDER,
  extractFunctionSections,
} from './markdown.js';
import type { FunctionInfo, FunctionSection, Inventory } from './types.js';

const alpha: FunctionInfo = { name: 'alpha', file: 'src/a.ts', signature: 'alpha(): void' };
const beta: FunctionInfo = { name: 'beta', file: 'src/b.ts', signature: 'beta(): void' };

function section(name: string, moduleHeading: string | null, manualText = ''): FunctionSection {
  return { name, moduleHeading, generatedBlock: null, manualText };
}

function inventory(overrides: Partial<Inventory> = {}): Inventory {
  return {
    functions: [alpha, beta],
    constants: [],
    references: new Map([
      ['alpha', new Set(['beta()'])],
      ['beta', new Set<string>()],
    ]),
    callGraph: new Map([
      ['alpha', new Set<string>()],
      ['beta', new Set(['alpha'])],
    ]),
    versionedDirs: ['src/'],
    testFilesText: 'alpha beta',
    uiComponents: [],
    testExceptions: [],
    ...overrides,
  };
}

function codes(issues: readonly { code: string }[]): string[] {
  return issues.map((i) => i.code);
}

describe('checkFunctionsDocumented', () => {
  it('aponta função sem doc e doc sem função', () => {
    const issues = checkFunctionsDocumented([alpha], [section('beta', null)]);
    expect(codes(issues)).toEqual(['FUNCAO_SEM_DOC', 'DOC_SEM_FUNCAO']);
    expect(issues[0]?.message).toContain('`alpha` (src/a.ts)');
  });
});

describe('checkSectionModules', () => {
  it('aponta seção sob heading errado e aceita a certa', () => {
    const issues = checkSectionModules(
      [alpha, beta],
      [section('alpha', '`src/b.ts`'), section('beta', '`src/b.ts`'), section('gama', null)],
    );
    expect(codes(issues)).toEqual(['SECAO_NO_MODULO_ERRADO']);
    const semHeading = checkSectionModules([alpha], [section('alpha', null)]);
    expect(semHeading[0]?.message).toContain('(nenhum)');
  });
});

describe('checkUniqueNames', () => {
  it('aponta nomes repetidos entre arquivos', () => {
    const dup = { ...alpha, file: 'src/z.ts' };
    expect(codes(checkUniqueNames([alpha, dup, beta]))).toEqual(['NOME_DUPLICADO']);
  });
});

describe('checkGeneratedBlocks', () => {
  it('aceita bloco igual ao calculado e rejeita diferente', () => {
    const inv = inventory();
    const ok: FunctionSection = {
      name: 'alpha',
      moduleHeading: '`src/a.ts`',
      generatedBlock:
        '- **Arquivo:** `src/a.ts`\n- **Assinatura:** `alpha(): void`\n- **Usada por:** `beta()`\n- **Processos:** P01',
      manualText: '',
    };
    const citations = new Map([['P01', new Set(['beta'])]]);
    expect(checkGeneratedBlocks(inv, [ok], citations)).toEqual([]);
    const stale = { ...ok, generatedBlock: 'qualquer coisa' };
    const issues = checkGeneratedBlocks(inv, [stale], citations);
    expect(codes(issues)).toEqual(['BLOCO_GERADO_DESATUALIZADO']);
    expect(issues[0]?.message).toContain('Esperado:');
  });
});

describe('checkManualFields', () => {
  it('aponta campo faltando e campo com marcador', () => {
    const text = `- **Faz:** ${PLACEHOLDER}\n- **Entrada:** x\n- **Saída:** y\n- **Efeitos:** z`;
    const issues = checkManualFields([section('alpha', null, text)]);
    expect(codes(issues)).toEqual(['CAMPO_MANUAL_VAZIO', 'CAMPO_MANUAL_FALTANDO']);
    expect(issues[1]?.message).toContain('**Erros**');
  });
});

describe('checkProcessCitations', () => {
  it('aponta função citada que não existe', () => {
    const issues = checkProcessCitations(
      [alpha],
      new Map([['P01', new Set(['alpha', 'fantasma'])]]),
    );
    expect(codes(issues)).toEqual(['PROCESSO_CITA_FUNCAO_INEXISTENTE']);
    expect(issues[0]?.message).toContain('P01');
  });
});

describe('checkStructure', () => {
  it('aponta pasta versionada ausente', () => {
    const issues = checkStructure(['src/', 'docs/adr/'], '| `src/` |');
    expect(codes(issues)).toEqual(['PASTA_SEM_DOC']);
    expect(issues[0]?.message).toContain('docs/adr/');
  });
});

describe('checkUiComponents', () => {
  it('ignora projeto sem UI, exige UI.md e aponta componente faltando', () => {
    expect(checkUiComponents([], null)).toEqual([]);
    expect(codes(checkUiComponents(['Button'], null))).toEqual(['UI_DOC_FALTANDO']);
    expect(codes(checkUiComponents(['Button', 'Card'], '`Button`'))).toEqual([
      'COMPONENTE_SEM_DOC',
    ]);
  });
});

describe('checkTests', () => {
  it('aponta função sem teste, respeita exceções e aponta exceção obsoleta', () => {
    const inv = inventory({
      testFilesText: 'describe("alpha")',
      testExceptions: [
        { name: 'beta', reason: 'r', manualTest: 'm' },
        { name: 'velha', reason: 'r', manualTest: 'm' },
      ],
    });
    expect(codes(checkTests(inv))).toEqual(['EXCECAO_DE_TESTE_OBSOLETA']);
    expect(codes(checkTests(inventory({ testFilesText: '' })))).toEqual([
      'FUNCAO_SEM_TESTE',
      'FUNCAO_SEM_TESTE',
    ]);
  });
});

describe('checkConstants', () => {
  it('procura a constante só na tabela de dados', () => {
    const inv = inventory({ constants: [{ name: 'LIMIT', file: 'src/a.ts' }] });
    expect(codes(checkConstants(inv, '`LIMIT` fora da tabela\n## Dados e constantes\n'))).toEqual([
      'CONSTANTE_SEM_DOC',
    ]);
    expect(checkConstants(inv, '## Dados e constantes\n| `LIMIT` |')).toEqual([]);
    expect(codes(checkConstants(inv, 'sem tabela'))).toEqual(['CONSTANTE_SEM_DOC']);
  });
});

describe('runAllChecks', () => {
  it('passa com documentação consistente', () => {
    const functions = [
      '# F',
      '## `src/a.ts`',
      '### `alpha`',
      GENERATED_START,
      '- **Arquivo:** `src/a.ts`',
      '- **Assinatura:** `alpha(): void`',
      '- **Usada por:** `beta()`',
      '- **Processos:** P01',
      GENERATED_END,
      '- **Faz:** a\n- **Entrada:** b\n- **Saída:** c\n- **Efeitos:** d\n- **Erros:** e',
      '## `src/b.ts`',
      '### `beta`',
      GENERATED_START,
      '- **Arquivo:** `src/b.ts`',
      '- **Assinatura:** `beta(): void`',
      '- **Usada por:** —',
      '- **Processos:** P01',
      GENERATED_END,
      '- **Faz:** a\n- **Entrada:** b\n- **Saída:** c\n- **Efeitos:** d\n- **Erros:** e',
      '## Dados e constantes',
    ].join('\n');
    const docs = { functions, processes: '## P01 — X\n`beta()`', structure: '`src/`', ui: null };
    const citations = new Map([['P01', new Set(['beta'])]]);
    expect(extractFunctionSections(functions)).toHaveLength(2);
    expect(runAllChecks(inventory(), docs, citations)).toEqual([]);
  });
});
