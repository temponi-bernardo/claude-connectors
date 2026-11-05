/**
 * Leitura de variáveis de ambiente, compartilhada pelos conectores (stdio e remoto). Pura.
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
