import type { FunctionSection, ProcessCitations } from './types.js';

export const GENERATED_START = '<!-- gerado:inicio -->';
export const GENERATED_END = '<!-- gerado:fim -->';
export const INDEX_START = '<!-- indice:inicio -->';
export const INDEX_END = '<!-- indice:fim -->';
/** Marcador que o gerador deixa nos campos manuais ainda não escritos. */
export const PLACEHOLDER = '_preencher_';

/** Devolve o primeiro grupo de captura de um match (string vazia se o grupo não casou). */
export function firstGroup(match: RegExpMatchArray): string {
  return match[1] ?? '';
}

/** Remove blocos de código cercados (``` ou ~~~) para que exemplos não contem como citações. */
export function stripCodeBlocks(markdown: string): string {
  return markdown.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '');
}

/** Extrai nomes em crase seguidos de parênteses, ex.: `` `slugify()` `` → `slugify`. */
export function extractCalledNames(text: string): Set<string> {
  const names = new Set<string>();
  for (const match of stripCodeBlocks(text).matchAll(/`([A-Za-z_$][\w$]*)\(\)`/g)) {
    names.add(firstGroup(match));
  }
  names.delete('');
  return names;
}

/** Extrai o texto entre dois marcadores (null se algum faltar). */
export function sliceBetween(text: string, start: string, end: string): string | null {
  const from = text.indexOf(start);
  const to = text.indexOf(end, from + start.length);
  if (from === -1 || to === -1) return null;
  return text.slice(from + start.length, to).trim();
}

/** Substitui o conteúdo entre dois marcadores; se não existirem, devolve o texto intacto. */
export function replaceBetween(
  text: string,
  markers: readonly [string, string],
  content: string,
): string {
  const [start, end] = markers;
  const from = text.indexOf(start);
  const to = text.indexOf(end, from + start.length);
  if (from === -1 || to === -1) return text;
  return `${text.slice(0, from + start.length)}\n${content}\n${text.slice(to)}`;
}

/** Divide o markdown em seções `### \`nome\``, guardando o módulo (`## ...`) acima de cada uma. */
export function extractFunctionSections(markdown: string): FunctionSection[] {
  const sections: FunctionSection[] = [];
  let moduleHeading: string | null = null;
  const parts = stripCodeBlocks(markdown).split(/^(?=##+ )/m);
  for (const part of parts) {
    const h2 = /^## (.+)$/m.exec(part);
    if (h2 !== null) moduleHeading = firstGroup(h2).trim();
    const h3 = /^### `([^`]+)`/.exec(part);
    if (h3 === null) continue;
    sections.push(buildSection(firstGroup(h3), moduleHeading, part));
  }
  return sections;
}

/** Monta uma FunctionSection a partir do texto bruto de uma seção. */
export function buildSection(
  name: string,
  moduleHeading: string | null,
  raw: string,
): FunctionSection {
  const generatedBlock = sliceBetween(raw, GENERATED_START, GENERATED_END);
  const manualText = raw
    .replace(new RegExp(`${GENERATED_START}[\\s\\S]*?${GENERATED_END}`), '')
    .replace(/^### `[^`]+`\s*/, '')
    .trim();
  return { name, moduleHeading, generatedBlock, manualText };
}

/** Lê PROCESSES.md: para cada `## P01 — ...`, as funções citadas como `` `nome()` ``. */
export function extractProcessCitations(markdown: string): ProcessCitations {
  const citations = new Map<string, Set<string>>();
  for (const part of stripCodeBlocks(markdown).split(/^(?=## )/m)) {
    const heading = /^## (P\d+)\b/.exec(part);
    if (heading === null) continue;
    citations.set(firstGroup(heading), extractCalledNames(part));
  }
  return citations;
}

/** Lê STRUCTURE.md: pastas documentadas como `` `pasta/` `` (com barra final). */
export function extractDocumentedDirs(markdown: string): Set<string> {
  const dirs = new Set<string>();
  for (const match of stripCodeBlocks(markdown).matchAll(/`([^`\s]+\/)`/g)) {
    dirs.add(firstGroup(match));
  }
  dirs.delete('');
  return dirs;
}

/** Lê nomes em crase (`` `Nome` ``) de um documento, fora de blocos de código. */
export function extractBacktickedNames(markdown: string): Set<string> {
  const names = new Set<string>();
  for (const match of stripCodeBlocks(markdown).matchAll(/`([A-Za-z_$][\w$]*)`/g)) {
    names.add(firstGroup(match));
  }
  names.delete('');
  return names;
}
