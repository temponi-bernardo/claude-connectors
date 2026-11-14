/**
 * Environment variable reading, shared by the connectors. Pure.
 */

/** Environment variables (a subset of `process.env`). */
export type EnvVars = Readonly<Record<string, string | undefined>>;

/** Reads a variable: empty or holding an unresolved placeholder (`${...}`) counts as missing. */
export function envValue(env: EnvVars, key: string): string | null {
  const value = env[key]?.trim();
  if (!value || value.startsWith('${')) return null;
  return value;
}

/** Parses an on/off option: `1`, `true`, `sim` (Portuguese "yes") and `yes` turn it on; anything else off. */
export function parseFlag(value: string | null): boolean {
  return ['1', 'true', 'sim', 'yes'].includes((value ?? '').toLowerCase());
}

/** Converts a Worker environment (variables, secrets and bindings) into text variables. */
export function toEnvVars(env: Readonly<Record<string, unknown>>): EnvVars {
  return Object.fromEntries(
    Object.entries(env).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );
}
