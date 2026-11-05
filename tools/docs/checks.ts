import {
  PLACEHOLDER,
  firstGroup,
  extractBacktickedNames,
  extractDocumentedDirs,
  extractFunctionSections,
} from './markdown.js';
import {
  MANUAL_FIELDS,
  computeGeneratedData,
  processesByFunction,
  renderGeneratedBlock,
} from './render.js';
import type { FunctionInfo, FunctionSection, Inventory, Issue, ProcessCitations } from './types.js';

/** Textos dos documentos lidos do disco. */
export interface DocsTexts {
  readonly functions: string;
  readonly processes: string;
  readonly structure: string;
  readonly ui: string | null;
}

/** Função no código sem seção no FUNCTIONS.md, e seção sem função no código. */
export function checkFunctionsDocumented(
  functions: readonly FunctionInfo[],
  sections: readonly FunctionSection[],
): Issue[] {
  const documented = new Set(sections.map((s) => s.name));
  const inCode = new Map(functions.map((f) => [f.name, f.file]));
  const issues: Issue[] = [];
  for (const fn of functions) {
    if (!documented.has(fn.name)) {
      issues.push({
        code: 'FUNCAO_SEM_DOC',
        message: `\`${fn.name}\` (${fn.file}) não tem seção em FUNCTIONS.md. Rode \`npm run docs:generate\` e preencha os campos.`,
      });
    }
  }
  for (const section of sections) {
    if (!inCode.has(section.name)) {
      issues.push({
        code: 'DOC_SEM_FUNCAO',
        message: `FUNCTIONS.md documenta \`${section.name}\`, que não existe no código. Remova a seção.`,
      });
    }
  }
  return issues;
}

/** Seção que está sob o heading `## arquivo` errado. */
export function checkSectionModules(
  functions: readonly FunctionInfo[],
  sections: readonly FunctionSection[],
): Issue[] {
  const fileOf = new Map(functions.map((f) => [f.name, f.file]));
  const issues: Issue[] = [];
  for (const section of sections) {
    const file = fileOf.get(section.name);
    if (file === undefined) continue;
    const expected = `\`${file}\``;
    if (section.moduleHeading !== expected) {
      issues.push({
        code: 'SECAO_NO_MODULO_ERRADO',
        message: `\`${section.name}\` está sob "## ${section.moduleHeading ?? '(nenhum)'}" mas pertence a "## ${expected}".`,
      });
    }
  }
  return issues;
}

/** Dois arquivos definem o mesmo nome de função. */
export function checkUniqueNames(functions: readonly FunctionInfo[]): Issue[] {
  const files = new Map<string, string[]>();
  for (const fn of functions) files.set(fn.name, [...(files.get(fn.name) ?? []), fn.file]);
  return [...files.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([name, list]) => ({
      code: 'NOME_DUPLICADO',
      message: `\`${name}\` está definida em mais de um arquivo: ${list.join(', ')}. Nomes de função são únicos no repositório.`,
    }));
}

/** Bloco gerado (Arquivo, Assinatura, Usada por, Processos) diferente do calculado a partir do código. */
export function checkGeneratedBlocks(
  inventory: Inventory,
  sections: readonly FunctionSection[],
  citations: ProcessCitations,
): Issue[] {
  const byProcess = processesByFunction(citations, inventory.callGraph);
  const sectionOf = new Map(sections.map((s) => [s.name, s]));
  const issues: Issue[] = [];
  for (const fn of inventory.functions) {
    const section = sectionOf.get(fn.name);
    if (section === undefined) continue;
    const expected = renderGeneratedBlock(
      fn,
      computeGeneratedData(fn.name, inventory.references, byProcess),
    );
    if (section.generatedBlock !== expected) {
      issues.push({
        code: 'BLOCO_GERADO_DESATUALIZADO',
        message: `Bloco gerado de \`${fn.name}\` difere do código. Esperado:\n${expected}\nEncontrado:\n${section.generatedBlock ?? '(sem bloco gerado)'}\nRode \`npm run docs:generate\`.`,
      });
    }
  }
  return issues;
}

/** Campos manuais faltando ou ainda com o marcador `_preencher_`. */
export function checkManualFields(sections: readonly FunctionSection[]): Issue[] {
  const issues: Issue[] = [];
  for (const section of sections) {
    for (const field of MANUAL_FIELDS) {
      const line = new RegExp(`^- \\*\\*${field}:\\*\\* (.+)$`, 'm').exec(section.manualText);
      if (line === null) {
        issues.push({
          code: 'CAMPO_MANUAL_FALTANDO',
          message: `\`${section.name}\`: falta o campo **${field}** em FUNCTIONS.md.`,
        });
      } else if (firstGroup(line).includes(PLACEHOLDER)) {
        issues.push({
          code: 'CAMPO_MANUAL_VAZIO',
          message: `\`${section.name}\`: o campo **${field}** ainda está como ${PLACEHOLDER}.`,
        });
      }
    }
  }
  return issues;
}

/** Função citada em PROCESSES.md que não existe no código. */
export function checkProcessCitations(
  functions: readonly FunctionInfo[],
  citations: ProcessCitations,
): Issue[] {
  const known = new Set(functions.map((f) => f.name));
  const issues: Issue[] = [];
  for (const [processId, cited] of citations) {
    for (const name of cited) {
      if (!known.has(name)) {
        issues.push({
          code: 'PROCESSO_CITA_FUNCAO_INEXISTENTE',
          message: `${processId} em PROCESSES.md cita \`${name}()\`, que não existe no código.`,
        });
      }
    }
  }
  return issues;
}

/** Pasta versionada que não aparece em STRUCTURE.md. */
export function checkStructure(
  versionedDirs: readonly string[],
  structureMarkdown: string,
): Issue[] {
  const documented = extractDocumentedDirs(structureMarkdown);
  return versionedDirs
    .filter((dir) => !documented.has(dir))
    .map((dir) => ({
      code: 'PASTA_SEM_DOC',
      message: `A pasta \`${dir}\` está versionada mas não aparece em STRUCTURE.md. Adicione uma linha na tabela.`,
    }));
}

/** Componente de UI que não aparece em UI.md. */
export function checkUiComponents(
  components: readonly string[],
  uiMarkdown: string | null,
): Issue[] {
  if (components.length === 0) return [];
  if (uiMarkdown === null) {
    return [
      { code: 'UI_DOC_FALTANDO', message: 'Há componentes de UI mas docs/UI.md não existe.' },
    ];
  }
  const documented = extractBacktickedNames(uiMarkdown);
  return components
    .filter((name) => !documented.has(name))
    .map((name) => ({
      code: 'COMPONENTE_SEM_DOC',
      message: `O componente \`${name}\` não aparece em UI.md.`,
    }));
}

/** Função sem teste: o nome não aparece em nenhum arquivo de teste e não está na lista de exceções. */
export function checkTests(inventory: Inventory): Issue[] {
  const excepted = new Set(inventory.testExceptions.map((e) => e.name));
  const known = new Set(inventory.functions.map((f) => f.name));
  const issues: Issue[] = inventory.functions
    .filter(
      (fn) =>
        !excepted.has(fn.name) && !new RegExp(`\\b${fn.name}\\b`).test(inventory.testFilesText),
    )
    .map((fn) => ({
      code: 'FUNCAO_SEM_TESTE',
      message: `\`${fn.name}\` (${fn.file}) não aparece em nenhum arquivo de teste. Escreva o teste ou registre a exceção em src/test-exceptions.ts.`,
    }));
  for (const exception of inventory.testExceptions) {
    if (!known.has(exception.name)) {
      issues.push({
        code: 'EXCECAO_DE_TESTE_OBSOLETA',
        message: `src/test-exceptions.ts lista \`${exception.name}\`, que não existe no código. Remova a entrada.`,
      });
    }
  }
  return issues;
}

/** Constante exportada que não aparece na tabela "Dados e constantes" do FUNCTIONS.md. */
export function checkConstants(inventory: Inventory, functionsMarkdown: string): Issue[] {
  const tableStart = functionsMarkdown.indexOf('## Dados e constantes');
  const table = tableStart === -1 ? '' : functionsMarkdown.slice(tableStart);
  const documented = extractBacktickedNames(table);
  return inventory.constants
    .filter((c) => !documented.has(c.name))
    .map((c) => ({
      code: 'CONSTANTE_SEM_DOC',
      message: `A constante \`${c.name}\` (${c.file}) não aparece na tabela "Dados e constantes" de FUNCTIONS.md.`,
    }));
}

/** Roda todas as checagens puras sobre o inventário e os textos dos documentos. */
export function runAllChecks(
  inventory: Inventory,
  docs: DocsTexts,
  citations: ProcessCitations,
): Issue[] {
  const sections = extractFunctionSections(docs.functions);
  return [
    ...checkFunctionsDocumented(inventory.functions, sections),
    ...checkSectionModules(inventory.functions, sections),
    ...checkUniqueNames(inventory.functions),
    ...checkGeneratedBlocks(inventory, sections, citations),
    ...checkManualFields(sections),
    ...checkProcessCitations(inventory.functions, citations),
    ...checkStructure(inventory.versionedDirs, docs.structure),
    ...checkUiComponents(inventory.uiComponents, docs.ui),
    ...checkTests(inventory),
    ...checkConstants(inventory, docs.functions),
  ];
}
