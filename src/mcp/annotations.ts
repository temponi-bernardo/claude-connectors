/**
 * MCP tool annotations shared by every connector. Each tool must carry a `title` and say whether it is
 * read-only or, when it writes, whether it is destructive: the type makes `npm run typecheck` fail otherwise.
 */
import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';

/** Hints of a tool that changes nothing. */
interface ReadOnlyHints {
  readonly readOnlyHint: true;
  readonly destructiveHint?: false;
}

/** Hints of a tool that writes: it must say whether the change is destructive. */
interface WriteHints {
  readonly readOnlyHint: false;
  readonly destructiveHint: boolean;
}

/** Behaviour hints without the title: read-only, or writing with an explicit destructive flag. */
export type ToolHints = Omit<ToolAnnotations, 'title' | 'readOnlyHint' | 'destructiveHint'> &
  (ReadOnlyHints | WriteHints);

/** Annotations every tool must have: a human-readable `title` plus the behaviour hints. */
export type RequiredToolAnnotations = ToolHints & { readonly title: string };

/** Read-only: changes nothing. */
export const READ_ONLY_HINTS: ToolHints = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
};

/** Sends or publishes something that cannot be taken back (email, message, submission): not idempotent. */
export const SEND_HINTS: ToolHints = {
  readOnlyHint: false,
  destructiveHint: true,
  idempotentHint: false,
  openWorldHint: true,
};

/** Deletes or overwrites (trash, draft, account link): destructive, idempotent. */
export const DESTRUCTIVE_HINTS: ToolHints = {
  readOnlyHint: false,
  destructiveHint: true,
  idempotentHint: true,
  openWorldHint: true,
};

/** Reversible organization (read, archive, star, labels, restore). */
export const ORGANIZE_HINTS: ToolHints = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
};

/** Creates something new without deleting anything (draft, link). */
export const CREATE_HINTS: ToolHints = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: true,
};

/** Joins a tool title with a hint preset. */
export function toolAnnotations(title: string, hints: ToolHints): RequiredToolAnnotations {
  return { title, ...hints };
}
