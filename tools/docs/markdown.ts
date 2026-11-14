import type { FunctionSection, ProcessCitations } from './types.js';

export const GENERATED_START = '<!-- generated:start -->';
export const GENERATED_END = '<!-- generated:end -->';
export const INDEX_START = '<!-- index:start -->';
export const INDEX_END = '<!-- index:end -->';
/** Marker the generator leaves in manual fields not yet written. */
export const PLACEHOLDER = '_fill_in_';

/** Returns the first capture group of a match (empty string if the group did not match). */
export function firstGroup(match: RegExpMatchArray): string {
  return match[1] ?? '';
}

/** Removes fenced code blocks (``` or ~~~) so examples do not count as citations. */
export function stripCodeBlocks(markdown: string): string {
  return markdown.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '');
}

/** Extracts backticked names followed by parentheses, e.g. `` `slugify()` `` → `slugify`. */
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

/** Replaces the content between two markers; if they are missing, returns the text unchanged. */
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

/** Splits the markdown into `### \`name\`` sections, keeping the module (`## ...`) above each one. */
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

/** Builds a FunctionSection from a section's raw text. */
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

/** Reads PROCESSES.md: for each `## P01 — ...`, the functions cited as `` `name()` ``. */
export function extractProcessCitations(markdown: string): ProcessCitations {
  const citations = new Map<string, Set<string>>();
  for (const part of stripCodeBlocks(markdown).split(/^(?=## )/m)) {
    const heading = /^## (P\d+)\b/.exec(part);
    if (heading === null) continue;
    citations.set(firstGroup(heading), extractCalledNames(part));
  }
  return citations;
}

/** Reads STRUCTURE.md: folders documented as `` `folder/` `` (with trailing slash). */
export function extractDocumentedDirs(markdown: string): Set<string> {
  const dirs = new Set<string>();
  for (const match of stripCodeBlocks(markdown).matchAll(/`([^`\s]+\/)`/g)) {
    dirs.add(firstGroup(match));
  }
  dirs.delete('');
  return dirs;
}

/** Reads backticked names (`` `Name` ``) from a document, outside code blocks. */
export function extractBacktickedNames(markdown: string): Set<string> {
  const names = new Set<string>();
  for (const match of stripCodeBlocks(markdown).matchAll(/`([A-Za-z_$][\w$]*)`/g)) {
    names.add(firstGroup(match));
  }
  names.delete('');
  return names;
}
