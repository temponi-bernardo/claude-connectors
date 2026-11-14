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
  it('flags a function without docs and docs without a function', () => {
    const issues = checkFunctionsDocumented([alpha], [section('beta', null)]);
    expect(codes(issues)).toEqual(['FUNCTION_UNDOCUMENTED', 'DOC_WITHOUT_FUNCTION']);
    expect(issues[0]?.message).toContain('`alpha` (src/a.ts)');
  });
});

describe('checkSectionModules', () => {
  it('flags a section under the wrong heading and accepts the right one', () => {
    const issues = checkSectionModules(
      [alpha, beta],
      [section('alpha', '`src/b.ts`'), section('beta', '`src/b.ts`'), section('gamma', null)],
    );
    expect(codes(issues)).toEqual(['SECTION_IN_WRONG_MODULE']);
    const noHeading = checkSectionModules([alpha], [section('alpha', null)]);
    expect(noHeading[0]?.message).toContain('(none)');
  });
});

describe('checkUniqueNames', () => {
  it('flags names repeated across files', () => {
    const dup = { ...alpha, file: 'src/z.ts' };
    expect(codes(checkUniqueNames([alpha, dup, beta]))).toEqual(['DUPLICATE_NAME']);
  });
});

describe('checkGeneratedBlocks', () => {
  it('accepts a block equal to the computed one and rejects a different one', () => {
    const inv = inventory();
    const ok: FunctionSection = {
      name: 'alpha',
      moduleHeading: '`src/a.ts`',
      generatedBlock:
        '- **File:** `src/a.ts`\n- **Signature:** `alpha(): void`\n- **Used by:** `beta()`\n- **Processes:** P01',
      manualText: '',
    };
    const citations = new Map([['P01', new Set(['beta'])]]);
    expect(checkGeneratedBlocks(inv, [ok], citations)).toEqual([]);
    const stale = { ...ok, generatedBlock: 'anything' };
    const issues = checkGeneratedBlocks(inv, [stale], citations);
    expect(codes(issues)).toEqual(['GENERATED_BLOCK_OUTDATED']);
    expect(issues[0]?.message).toContain('Expected:');
  });
});

describe('checkManualFields', () => {
  it('flags a missing field and a field with the placeholder', () => {
    const text = `- **Does:** ${PLACEHOLDER}\n- **Input:** x\n- **Output:** y\n- **Effects:** z`;
    const issues = checkManualFields([section('alpha', null, text)]);
    expect(codes(issues)).toEqual(['MANUAL_FIELD_UNFILLED', 'MANUAL_FIELD_MISSING']);
    expect(issues[1]?.message).toContain('**Errors**');
  });
});

describe('checkProcessCitations', () => {
  it('flags a cited function that does not exist', () => {
    const issues = checkProcessCitations([alpha], new Map([['P01', new Set(['alpha', 'ghost'])]]));
    expect(codes(issues)).toEqual(['PROCESS_CITES_UNKNOWN_FUNCTION']);
    expect(issues[0]?.message).toContain('P01');
  });
});

describe('checkStructure', () => {
  it('flags a missing versioned directory', () => {
    const issues = checkStructure(['src/', 'docs/adr/'], '| `src/` |');
    expect(codes(issues)).toEqual(['DIR_UNDOCUMENTED']);
    expect(issues[0]?.message).toContain('docs/adr/');
  });
});

describe('checkUiComponents', () => {
  it('ignores a project without UI, requires UI.md and flags a missing component', () => {
    expect(checkUiComponents([], null)).toEqual([]);
    expect(codes(checkUiComponents(['Button'], null))).toEqual(['UI_DOC_MISSING']);
    expect(codes(checkUiComponents(['Button', 'Card'], '`Button`'))).toEqual([
      'COMPONENT_UNDOCUMENTED',
    ]);
  });
});

describe('checkTests', () => {
  it('flags an untested function, honors exceptions and flags a stale exception', () => {
    const inv = inventory({
      testFilesText: 'describe("alpha")',
      testExceptions: [
        { name: 'beta', reason: 'r', manualTest: 'm' },
        { name: 'old', reason: 'r', manualTest: 'm' },
      ],
    });
    expect(codes(checkTests(inv))).toEqual(['STALE_TEST_EXCEPTION']);
    expect(codes(checkTests(inventory({ testFilesText: '' })))).toEqual([
      'FUNCTION_UNTESTED',
      'FUNCTION_UNTESTED',
    ]);
  });
});

describe('checkConstants', () => {
  it('looks for the constant only in the data table', () => {
    const inv = inventory({ constants: [{ name: 'LIMIT', file: 'src/a.ts' }] });
    expect(
      codes(checkConstants(inv, '`LIMIT` outside the table\n## Data and constants\n')),
    ).toEqual(['CONSTANT_UNDOCUMENTED']);
    expect(checkConstants(inv, '## Data and constants\n| `LIMIT` |')).toEqual([]);
    expect(codes(checkConstants(inv, 'no table'))).toEqual(['CONSTANT_UNDOCUMENTED']);
  });
});

describe('runAllChecks', () => {
  it('passes with consistent documentation', () => {
    const functions = [
      '# F',
      '## `src/a.ts`',
      '### `alpha`',
      GENERATED_START,
      '- **File:** `src/a.ts`',
      '- **Signature:** `alpha(): void`',
      '- **Used by:** `beta()`',
      '- **Processes:** P01',
      GENERATED_END,
      '- **Does:** a\n- **Input:** b\n- **Output:** c\n- **Effects:** d\n- **Errors:** e',
      '## `src/b.ts`',
      '### `beta`',
      GENERATED_START,
      '- **File:** `src/b.ts`',
      '- **Signature:** `beta(): void`',
      '- **Used by:** —',
      '- **Processes:** P01',
      GENERATED_END,
      '- **Does:** a\n- **Input:** b\n- **Output:** c\n- **Effects:** d\n- **Errors:** e',
      '## Data and constants',
    ].join('\n');
    const docs = { functions, processes: '## P01 — X\n`beta()`', structure: '`src/`', ui: null };
    const citations = new Map([['P01', new Set(['beta'])]]);
    expect(extractFunctionSections(functions)).toHaveLength(2);
    expect(runAllChecks(inventory(), docs, citations)).toEqual([]);
  });
});
