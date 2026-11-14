/**
 * Leitura de variáveis de ambiente, compartilhada pelos conectores. Pura.
 */

/** Variáveis de ambiente (subconjunto de `process.env`). */
export type EnvVars = Readonly<Record<string, string | undefined>>;

/** Lê uma variável: vazia ou com placeholder não resolvido (`${...}`) conta como ausente. */
export function envValue(env: EnvVars, key: string): string | null {
  const value = env[key]?.trim();
  if (!value || value.startsWith('${')) return null;
  return value;
}

/** Interpreta uma opção liga/desliga: `1`, `true`, `sim` e `yes` ligam; o resto desliga. */
export function parseFlag(value: string | null): boolean {
  return ['1', 'true', 'sim', 'yes'].includes((value ?? '').toLowerCase());
}

/** Converte o ambiente de um Worker (variáveis, secrets e bindings) em variáveis de texto. */
export function toEnvVars(env: Readonly<Record<string, unknown>>): EnvVars {
  return Object.fromEntries(
    Object.entries(env).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
}
