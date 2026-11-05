import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runAllChecks, type DocsTexts } from './checks.js';
import { loadDocsConfig } from './config.js';
import { buildInventory } from './inventory.js';
import { extractProcessCitations } from './markdown.js';
import { applyGenerated, computeGeneratedData, processesByFunction } from './render.js';
import type { DocsConfig, Inventory, Issue } from './types.js';

/** Lê um arquivo de texto da raiz; devolve null se não existir. */
export function readOptional(rootDir: string, relativePath: string): string | null {
  const absolute = join(rootDir, relativePath);
  return existsSync(absolute) ? readFileSync(absolute, 'utf8') : null;
}

/** Lê os documentos conferidos pelo `docs:check`. Documentos obrigatórios ausentes viram texto vazio. */
export function readDocsTexts(rootDir: string, config: DocsConfig): DocsTexts {
  return {
    functions: readOptional(rootDir, config.functionsDoc) ?? '',
    processes: readOptional(rootDir, config.processesDoc) ?? '',
    structure: readOptional(rootDir, config.structureDoc) ?? '',
    ui: readOptional(rootDir, config.uiDoc),
  };
}

/** Formata a lista de problemas para o terminal, um por bloco, com código e mensagem. */
export function formatIssues(issues: readonly Issue[]): string {
  if (issues.length === 0) return 'docs:check ✔ documentação e código em dia.';
  const lines = issues.map((issue, index) => `${index + 1}. [${issue.code}] ${issue.message}`);
  return `docs:check ✖ ${issues.length} problema(s):\n\n${lines.join('\n\n')}`;
}

/** Executa a checagem completa e devolve os problemas encontrados. */
export async function runCheck(rootDir: string): Promise<Issue[]> {
  const config = loadDocsConfig(rootDir);
  const inventory = await buildInventory(rootDir, config);
  const docs = readDocsTexts(rootDir, config);
  return runAllChecks(inventory, docs, extractProcessCitations(docs.processes));
}

/** Calcula o novo FUNCTIONS.md a partir do inventário e do texto atual (função pura sobre textos). */
export function generateFunctionsDoc(inventory: Inventory, docs: DocsTexts): string {
  const citations = extractProcessCitations(docs.processes);
  const byProcess = processesByFunction(citations, inventory.callGraph);
  return applyGenerated(docs.functions, inventory.functions, (name) =>
    computeGeneratedData(name, inventory.references, byProcess),
  );
}

/** Regrava o FUNCTIONS.md com índice, blocos gerados e seções novas; devolve se houve mudança. */
export async function runGenerate(rootDir: string): Promise<boolean> {
  const config = loadDocsConfig(rootDir);
  const inventory = await buildInventory(rootDir, config);
  const docs = readDocsTexts(rootDir, config);
  const updated = generateFunctionsDoc(inventory, docs);
  if (updated === docs.functions) return false;
  writeFileSync(join(rootDir, config.functionsDoc), updated, 'utf8');
  return true;
}
