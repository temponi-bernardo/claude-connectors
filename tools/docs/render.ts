import {
  GENERATED_END,
  GENERATED_START,
  INDEX_END,
  INDEX_START,
  PLACEHOLDER,
  extractFunctionSections,
  replaceBetween,
} from './markdown.js';
import type {
  CallGraph,
  FunctionInfo,
  GeneratedData,
  ProcessCitations,
  ReferenceIndex,
} from './types.js';

/** Manual fields of each function, in the template's fixed order (docs/DOCUMENTATION.md). */
export const MANUAL_FIELDS = ['Does', 'Input', 'Output', 'Effects', 'Errors'] as const;

/** Formats a list for markdown: backticked items separated by commas, or `—` if empty. */
export function formatList(items: readonly string[]): string {
  if (items.length === 0) return '—';
  return items.map((item) => `\`${item}\``).join(', ');
}

/** Renders the content of a function's generated block (without the markers). */
export function renderGeneratedBlock(info: FunctionInfo, data: GeneratedData): string {
  return [
    `- **File:** \`${info.file}\``,
    `- **Signature:** \`${info.signature}\``,
    `- **Used by:** ${formatList(data.usedBy)}`,
    `- **Processes:** ${data.processes.length === 0 ? '—' : data.processes.join(', ')}`,
  ].join('\n');
}

/** Renders a complete new section, with the manual fields marked to fill in. */
export function renderNewSection(info: FunctionInfo, data: GeneratedData): string {
  const manual = MANUAL_FIELDS.map((field) => `- **${field}:** ${PLACEHOLDER}`).join('\n');
  return [
    `### \`${info.name}\``,
    '',
    GENERATED_START,
    renderGeneratedBlock(info, data),
    GENERATED_END,
    manual,
    '',
  ].join('\n');
}

/** Renders the per-module index: one item per file with links to its functions. */
export function renderModuleIndex(functions: readonly FunctionInfo[]): string {
  const byFile = new Map<string, string[]>();
  for (const fn of functions) {
    byFile.set(fn.file, [...(byFile.get(fn.file) ?? []), fn.name]);
  }
  return [...byFile.entries()]
    .map(
      ([file, names]) =>
        `- \`${file}\`: ${names.map((n) => `[\`${n}\`](#${n.toLowerCase()})`).join(', ')}`,
    )
    .join('\n');
}

/** Computes a function's generated data from the reference index and the processes. */
export function computeGeneratedData(
  name: string,
  references: ReferenceIndex,
  processesByFunction: ReadonlyMap<string, ReadonlySet<string>>,
): GeneratedData {
  const usedBy = [...(references.get(name) ?? [])].sort((a, b) => a.localeCompare(b));
  const processes = [...(processesByFunction.get(name) ?? [])].sort((a, b) => a.localeCompare(b));
  return { usedBy, processes };
}

/** Transitive closure: cited functions plus everything they call, directly or indirectly. */
export function closureOf(graph: CallGraph, roots: ReadonlySet<string>): Set<string> {
  const seen = new Set<string>();
  const stack = [...roots];
  while (stack.length > 0) {
    const current = stack.pop() ?? '';
    if (seen.has(current)) continue;
    seen.add(current);
    stack.push(...(graph.get(current) ?? []));
  }
  return seen;
}

/** Inverts the citations: function → processes it appears in (directly or indirectly). */
export function processesByFunction(
  citations: ProcessCitations,
  graph: CallGraph,
): Map<string, Set<string>> {
  const result = new Map<string, Set<string>>();
  for (const [processId, cited] of citations) {
    for (const fn of closureOf(graph, cited)) {
      result.set(fn, new Set([...(result.get(fn) ?? []), processId]));
    }
  }
  return result;
}

/** Replaces the generated block of an existing section with the new content. */
export function replaceSectionBlock(markdown: string, name: string, block: string): string {
  const pattern = new RegExp(
    `(### \`${name}\`[\\s\\S]*?${GENERATED_START})[\\s\\S]*?(${GENERATED_END})`,
  );
  return markdown.replace(pattern, `$1\n${block}\n$2`);
}

/** Appends a new section under the matching `## file` heading, creating the heading if missing. */
export function appendSection(markdown: string, info: FunctionInfo, section: string): string {
  const heading = `## \`${info.file}\``;
  const headingIndex = markdown.indexOf(heading);
  if (headingIndex === -1) {
    return insertBeforeDataTable(markdown, `${heading}\n\n${section}\n`);
  }
  const nextHeading = markdown.indexOf('\n## ', headingIndex + heading.length);
  if (nextHeading === -1) return `${markdown.trimEnd()}\n\n${section}`;
  return `${markdown.slice(0, nextHeading).trimEnd()}\n\n${section}\n${markdown.slice(nextHeading)}`;
}

/** Inserts text before the "## Data and constants" section (or at the end if it does not exist). */
export function insertBeforeDataTable(markdown: string, text: string): string {
  const marker = '\n## Data and constants';
  const index = markdown.indexOf(marker);
  if (index === -1) return `${markdown.trimEnd()}\n\n${text}`;
  return `${markdown.slice(0, index).trimEnd()}\n\n${text}${markdown.slice(index)}`;
}

/** Removes the whole `### \`name\`` section, up to the next `##`/`###` heading or the end of the text. */
export function removeSection(markdown: string, name: string): string {
  return markdown.replace(new RegExp(`\\n### \`${name}\`[\\s\\S]*?(?=\\n##+ |$)`), '');
}

/** Removes module headings (`## \`file\``) that no longer have any section below them. */
export function removeEmptyModules(markdown: string): string {
  return markdown.replace(/\n## `[^`]+`\n\s*(?=\n## |$)/g, '').replace(/\n*$/, '\n');
}

/** Removes sections of functions no longer in the code and modules left empty. */
export function pruneOrphanSections(markdown: string, functions: readonly FunctionInfo[]): string {
  const inCode = new Set(functions.map((f) => f.name));
  const orphans = extractFunctionSections(markdown).filter((s) => !inCode.has(s.name));
  const pruned = orphans.reduce((text, section) => removeSection(text, section.name), markdown);
  return orphans.length === 0 ? markdown : removeEmptyModules(pruned);
}

/** Applies the generator to FUNCTIONS.md: prunes orphans, index, generated blocks and new sections. */
export function applyGenerated(
  markdown: string,
  functions: readonly FunctionInfo[],
  dataOf: (name: string) => GeneratedData,
): string {
  const pruned = pruneOrphanSections(markdown, functions);
  const existing = new Set(extractFunctionSections(pruned).map((s) => s.name));
  let result = replaceBetween(pruned, [INDEX_START, INDEX_END], renderModuleIndex(functions));
  for (const info of functions) {
    const data = dataOf(info.name);
    result = existing.has(info.name)
      ? replaceSectionBlock(result, info.name, renderGeneratedBlock(info, data))
      : appendSection(result, info, renderNewSection(info, data));
  }
  return result;
}
