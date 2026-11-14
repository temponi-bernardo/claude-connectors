/**
 * Version announced by each MCP server, read from the plugin manifest (`plugin.json`) so it follows the
 * plugin release (ADR 0022) instead of a hard-coded number.
 */

/** Version announced when the manifest has none. */
export const FALLBACK_SERVER_VERSION = '0.0.0';

/** The manifest `version`, or `FALLBACK_SERVER_VERSION` when it is missing or not a non-empty string. */
export function manifestVersion(manifest: unknown): string {
  if (typeof manifest !== 'object' || manifest === null) return FALLBACK_SERVER_VERSION;
  const version = (manifest as { version?: unknown }).version;
  return typeof version === 'string' && version !== '' ? version : FALLBACK_SERVER_VERSION;
}
