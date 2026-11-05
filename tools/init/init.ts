import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { slugify } from '../../src/core/slug.js';

/** Valores que substituem os marcadores `{{...}}` do template. */
export interface InitValues {
  readonly name: string;
  readonly description: string;
  readonly owner: string;
}

/** Arquivos do template que contêm marcadores a substituir. */
export const TEMPLATE_FILES: readonly string[] = [
  'README.md',
  'CLAUDE.md',
  'LICENSE',
  'docs/PRODUCT.md',
  '.github/CODEOWNERS',
  'release-please-config.json',
];

/** Manifestos npm cujo nome (e descrição, se houver) o init troca editando o JSON. */
export const PACKAGE_FILES: readonly string[] = ['package.json', 'package-lock.json'];

/** Histórico do template que não pertence ao projeto novo: a seção "Não lançado" é esvaziada. */
export const CHANGELOG_FILE = 'CHANGELOG.md';

/** Converte `--chave valor ...` em um mapa; falha em argumento fora do formato. */
export function parseKeyValueArgs(args: readonly string[]): Map<string, string> {
  const values = new Map<string, string>();
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index] ?? '';
    if (!key.startsWith('--')) {
      throw new Error(`Argumento inesperado: "${key}". Use --name, --description e --owner.`);
    }
    values.set(key.slice(2), args[index + 1] ?? '');
  }
  return values;
}

/** Devolve o valor obrigatório de uma chave; falha se estiver ausente ou vazio. */
export function requireArg(values: ReadonlyMap<string, string>, key: string): string {
  const value = values.get(key) ?? '';
  if (value === '') throw new Error(`Falta o argumento --${key}.`);
  return value;
}

/** Lê `--name`, `--description` e `--owner` dos argumentos e normaliza o nome como slug. */
export function parseInitArgs(args: readonly string[]): InitValues {
  const values = parseKeyValueArgs(args);
  return {
    name: slugify(requireArg(values, 'name')),
    description: requireArg(values, 'description'),
    owner: requireArg(values, 'owner'),
  };
}

/** Substitui todos os marcadores `{{NOME}}` de um texto pelos valores informados. */
export function replacePlaceholders(text: string, values: InitValues): string {
  const map: Record<string, string> = {
    PROJECT_NAME: values.name,
    PROJECT_DESCRIPTION: values.description,
    GITHUB_OWNER: values.owner,
    YEAR: String(new Date().getFullYear()),
  };
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (whole, key: string) => map[key] ?? whole);
}

/** Troca nome (raiz e pacote "" do lock) e descrição (se existir) em um manifesto npm. */
export function applyPackageValues(text: string, values: InitValues): string {
  const pkg = JSON.parse(text) as Record<string, unknown>;
  pkg.name = values.name;
  if ('description' in pkg) pkg.description = values.description;
  const root = (pkg.packages as Record<string, Record<string, unknown>> | undefined)?.[''];
  if (root !== undefined) root.name = values.name;
  return `${JSON.stringify(pkg, null, 2)}\n`;
}

/** Esvazia a seção "## [Não lançado]" do CHANGELOG, mantendo o heading e as versões seguintes. */
export function resetChangelog(text: string): string {
  return text.replace(/(## \[Não lançado\]\n)[\s\S]*?(?=\n## |$)/, '$1');
}

/** Reescreve um arquivo com `transform`; devolve true se o conteúdo mudou (false se não existe). */
export function rewriteFile(
  rootDir: string,
  relativePath: string,
  transform: (text: string) => string,
): boolean {
  const absolute = join(rootDir, relativePath);
  let original: string;
  try {
    original = readFileSync(absolute, 'utf8');
  } catch {
    return false;
  }
  const updated = transform(original);
  if (updated === original) return false;
  writeFileSync(absolute, updated, 'utf8');
  return true;
}

/** Aplica a substituição de marcadores em um arquivo; devolve true se o conteúdo mudou. */
export function initFile(rootDir: string, relativePath: string, values: InitValues): boolean {
  return rewriteFile(rootDir, relativePath, (text) => replacePlaceholders(text, values));
}

/** Inicializa um projeto a partir do template: marcadores, nome do pacote e CHANGELOG limpo. */
export function initProject(rootDir: string, values: InitValues): string[] {
  const placeholders = TEMPLATE_FILES.filter((file) => initFile(rootDir, file, values));
  const packages = PACKAGE_FILES.filter((file) =>
    rewriteFile(rootDir, file, (text) => applyPackageValues(text, values)),
  );
  const changelog = rewriteFile(rootDir, CHANGELOG_FILE, resetChangelog) ? [CHANGELOG_FILE] : [];
  return [...placeholders, ...packages, ...changelog];
}
