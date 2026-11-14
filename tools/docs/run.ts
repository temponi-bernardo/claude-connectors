import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runAllChecks, type DocsTexts } from './checks.js';
import { loadDocsConfig } from './config.js';
import { buildInventory } from './inventory.js';
import { extractProcessCitations } from './markdown.js';
import { applyGenerated, computeGeneratedData, processesByFunction } from './render.js';
import type { DocsConfig, Inventory, Issue } from './types.js';

/** Reads a text file from the root; returns null if it does not exist. */
export function readOptional(rootDir: string, relativePath: string): string | null {
  const absolute = join(rootDir, relativePath);
  return existsSync(absolute) ? readFileSync(absolute, 'utf8') : null;
}

/** Reads the documents checked by `docs:check`. Missing required documents become empty text. */
export function readDocsTexts(rootDir: string, config: DocsConfig): DocsTexts {
  return {
    functions: readOptional(rootDir, config.functionsDoc) ?? '',
    processes: readOptional(rootDir, config.processesDoc) ?? '',
    structure: readOptional(rootDir, config.structureDoc) ?? '',
    ui: readOptional(rootDir, config.uiDoc),
  };
}

/** Formats the problem list for the terminal, one per block, with code and message. */
export function formatIssues(issues: readonly Issue[]): string {
  if (issues.length === 0) return 'docs:check ✔ docs and code are in sync.';
  const lines = issues.map((issue, index) => `${index + 1}. [${issue.code}] ${issue.message}`);
  return `docs:check ✖ ${issues.length} problem(s):\n\n${lines.join('\n\n')}`;
}

/** Executa a checagem completa e devolve os problemas encontrados. */
export async function runCheck(rootDir: string): Promise<Issue[]> {
  const config = loadDocsConfig(rootDir);
  const inventory = await buildInventory(rootDir, config);
  const docs = readDocsTexts(rootDir, config);
  return runAllChecks(inventory, docs, extractProcessCitations(docs.processes));
}

/** Computes the new FUNCTIONS.md from the inventory and the current text (pure function over texts). */
export function generateFunctionsDoc(inventory: Inventory, docs: DocsTexts): string {
  const citations = extractProcessCitations(docs.processes);
  const byProcess = processesByFunction(citations, inventory.callGraph);
  return applyGenerated(docs.functions, inventory.functions, (name) =>
    computeGeneratedData(name, inventory.references, byProcess),
  );
}

/** Rewrites FUNCTIONS.md with index, generated blocks and new sections; returns whether it changed. */
export async function runGenerate(rootDir: string): Promise<boolean> {
  const config = loadDocsConfig(rootDir);
  const inventory = await buildInventory(rootDir, config);
  const docs = readDocsTexts(rootDir, config);
  const updated = generateFunctionsDoc(inventory, docs);
  if (updated === docs.functions) return false;
  writeFileSync(join(rootDir, config.functionsDoc), updated, 'utf8');
  return true;
}
