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

/** Campos manuais de cada função, na ordem fixa do modelo (docs/DOCUMENTATION.md). */
export const MANUAL_FIELDS = ['Faz', 'Entrada', 'Saída', 'Efeitos', 'Erros'] as const;

/** Formata uma lista para o markdown: itens em crase separados por vírgula, ou `—` se vazia. */
export function formatList(items: readonly string[]): string {
  if (items.length === 0) return '—';
  return items.map((item) => `\`${item}\``).join(', ');
}

/** Renderiza o conteúdo do bloco gerado de uma função (sem os marcadores). */
export function renderGeneratedBlock(info: FunctionInfo, data: GeneratedData): string {
  return [
    `- **Arquivo:** \`${info.file}\``,
    `- **Assinatura:** \`${info.signature}\``,
    `- **Usada por:** ${formatList(data.usedBy)}`,
    `- **Processos:** ${data.processes.length === 0 ? '—' : data.processes.join(', ')}`,
  ].join('\n');
}

/** Renderiza uma seção nova completa, com os campos manuais marcados para preencher. */
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

/** Renderiza o índice por módulo: um item por arquivo com links para suas funções. */
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

/** Calcula, para uma função, os dados gerados a partir do índice de referências e dos processos. */
export function computeGeneratedData(
  name: string,
  references: ReferenceIndex,
  processesByFunction: ReadonlyMap<string, ReadonlySet<string>>,
): GeneratedData {
  const usedBy = [...(references.get(name) ?? [])].sort((a, b) => a.localeCompare(b));
  const processes = [...(processesByFunction.get(name) ?? [])].sort((a, b) => a.localeCompare(b));
  return { usedBy, processes };
}

/** Fecho transitivo: funções citadas mais tudo o que elas chamam, direta ou indiretamente. */
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

/** Inverte as citações: função → processos em que aparece (direta ou indiretamente). */
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

/** Substitui o bloco gerado de uma seção existente pelo conteúdo novo. */
export function replaceSectionBlock(markdown: string, name: string, block: string): string {
  const pattern = new RegExp(
    `(### \`${name}\`[\\s\\S]*?${GENERATED_START})[\\s\\S]*?(${GENERATED_END})`,
  );
  return markdown.replace(pattern, `$1\n${block}\n$2`);
}

/** Acrescenta uma seção nova sob o heading `## arquivo` correspondente, criando o heading se faltar. */
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

/** Insere texto antes da seção "## Dados e constantes" (ou no fim, se ela não existir). */
export function insertBeforeDataTable(markdown: string, text: string): string {
  const marker = '\n## Dados e constantes';
  const index = markdown.indexOf(marker);
  if (index === -1) return `${markdown.trimEnd()}\n\n${text}`;
  return `${markdown.slice(0, index).trimEnd()}\n\n${text}${markdown.slice(index)}`;
}

/** Remove a seção `### \`nome\`` inteira, até o próximo heading `##`/`###` ou o fim do texto. */
export function removeSection(markdown: string, name: string): string {
  return markdown.replace(new RegExp(`\\n### \`${name}\`[\\s\\S]*?(?=\\n##+ |$)`), '');
}

/** Remove headings de módulo (`## \`arquivo\``) que não têm mais nenhuma seção abaixo. */
export function removeEmptyModules(markdown: string): string {
  return markdown.replace(/\n## `[^`]+`\n\s*(?=\n## |$)/g, '').replace(/\n*$/, '\n');
}

/** Remove as seções de funções que não existem mais no código e os módulos que ficaram vazios. */
export function pruneOrphanSections(markdown: string, functions: readonly FunctionInfo[]): string {
  const inCode = new Set(functions.map((f) => f.name));
  const orphans = extractFunctionSections(markdown).filter((s) => !inCode.has(s.name));
  const pruned = orphans.reduce((text, section) => removeSection(text, section.name), markdown);
  return orphans.length === 0 ? markdown : removeEmptyModules(pruned);
}

/** Aplica o gerador ao FUNCTIONS.md: poda órfãs, índice, blocos gerados e seções novas. */
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
