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

/** Function in the code with no section in FUNCTIONS.md, and section with no function in the code. */
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
        code: 'FUNCTION_UNDOCUMENTED',
        message: `\`${fn.name}\` (${fn.file}) has no section in FUNCTIONS.md. Run \`npm run docs:generate\` and fill in the fields.`,
      });
    }
  }
  for (const section of sections) {
    if (!inCode.has(section.name)) {
      issues.push({
        code: 'DOC_WITHOUT_FUNCTION',
        message: `FUNCTIONS.md documents \`${section.name}\`, which does not exist in the code. Remove the section.`,
      });
    }
  }
  return issues;
}

/** Section under the wrong `## file` heading. */
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
        code: 'SECTION_IN_WRONG_MODULE',
        message: `\`${section.name}\` is under "## ${section.moduleHeading ?? '(none)'}" but belongs to "## ${expected}".`,
      });
    }
  }
  return issues;
}

/** Two files define the same function name. */
export function checkUniqueNames(functions: readonly FunctionInfo[]): Issue[] {
  const files = new Map<string, string[]>();
  for (const fn of functions) files.set(fn.name, [...(files.get(fn.name) ?? []), fn.file]);
  return [...files.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([name, list]) => ({
      code: 'DUPLICATE_NAME',
      message: `\`${name}\` is defined in more than one file: ${list.join(', ')}. Function names are unique in the repository.`,
    }));
}

/** Generated block (File, Signature, Used by, Processes) differs from the one computed from the code. */
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
        code: 'GENERATED_BLOCK_OUTDATED',
        message: `Generated block of \`${fn.name}\` differs from the code. Expected:\n${expected}\nFound:\n${section.generatedBlock ?? '(no generated block)'}\nRun \`npm run docs:generate\`.`,
      });
    }
  }
  return issues;
}

/** Campos manuais faltando ou ainda com o marcador `_fill_in_`. */
export function checkManualFields(sections: readonly FunctionSection[]): Issue[] {
  const issues: Issue[] = [];
  for (const section of sections) {
    for (const field of MANUAL_FIELDS) {
      const line = new RegExp(`^- \\*\\*${field}:\\*\\* (.+)$`, 'm').exec(section.manualText);
      if (line === null) {
        issues.push({
          code: 'MANUAL_FIELD_MISSING',
          message: `\`${section.name}\`: the **${field}** field is missing in FUNCTIONS.md.`,
        });
      } else if (firstGroup(line).includes(PLACEHOLDER)) {
        issues.push({
          code: 'MANUAL_FIELD_UNFILLED',
          message: `\`${section.name}\`: the **${field}** field is still ${PLACEHOLDER}.`,
        });
      }
    }
  }
  return issues;
}

/** Function cited in PROCESSES.md that does not exist in the code. */
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
          code: 'PROCESS_CITES_UNKNOWN_FUNCTION',
          message: `${processId} in PROCESSES.md cites \`${name}()\`, which does not exist in the code.`,
        });
      }
    }
  }
  return issues;
}

/** Versioned folder missing from STRUCTURE.md. */
export function checkStructure(
  versionedDirs: readonly string[],
  structureMarkdown: string,
): Issue[] {
  const documented = extractDocumentedDirs(structureMarkdown);
  return versionedDirs
    .filter((dir) => !documented.has(dir))
    .map((dir) => ({
      code: 'DIR_UNDOCUMENTED',
      message: `The directory \`${dir}\` is versioned but does not appear in STRUCTURE.md. Add a row to the table.`,
    }));
}

/** UI component missing from UI.md. */
export function checkUiComponents(
  components: readonly string[],
  uiMarkdown: string | null,
): Issue[] {
  if (components.length === 0) return [];
  if (uiMarkdown === null) {
    return [
      { code: 'UI_DOC_MISSING', message: 'There are UI components but docs/UI.md does not exist.' },
    ];
  }
  const documented = extractBacktickedNames(uiMarkdown);
  return components
    .filter((name) => !documented.has(name))
    .map((name) => ({
      code: 'COMPONENT_UNDOCUMENTED',
      message: `The component \`${name}\` does not appear in UI.md.`,
    }));
}

/** Untested function: its name appears in no test file and is not in the exceptions list. */
export function checkTests(inventory: Inventory): Issue[] {
  const excepted = new Set(inventory.testExceptions.map((e) => e.name));
  const known = new Set(inventory.functions.map((f) => f.name));
  const issues: Issue[] = inventory.functions
    .filter(
      (fn) =>
        !excepted.has(fn.name) && !new RegExp(`\\b${fn.name}\\b`).test(inventory.testFilesText),
    )
    .map((fn) => ({
      code: 'FUNCTION_UNTESTED',
      message: `\`${fn.name}\` (${fn.file}) does not appear in any test file. Write the test or register the exception in src/test-exceptions.ts.`,
    }));
  for (const exception of inventory.testExceptions) {
    if (!known.has(exception.name)) {
      issues.push({
        code: 'STALE_TEST_EXCEPTION',
        message: `src/test-exceptions.ts lists \`${exception.name}\`, which does not exist in the code. Remove the entry.`,
      });
    }
  }
  return issues;
}

/** Exported constant missing from the "Data and constants" table in FUNCTIONS.md. */
export function checkConstants(inventory: Inventory, functionsMarkdown: string): Issue[] {
  const tableStart = functionsMarkdown.indexOf('## Data and constants');
  const table = tableStart === -1 ? '' : functionsMarkdown.slice(tableStart);
  const documented = extractBacktickedNames(table);
  return inventory.constants
    .filter((c) => !documented.has(c.name))
    .map((c) => ({
      code: 'CONSTANT_UNDOCUMENTED',
      message: `The constant \`${c.name}\` (${c.file}) does not appear in the "Data and constants" table of FUNCTIONS.md.`,
    }));
}

/** Runs every pure check over the inventory and the document texts. */
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
