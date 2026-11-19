/**
 * Tools that depend on a flag or a permission stay listed when they are off: the description says why and each
 * call answers how to turn them on, instead of the tool silently disappearing (a hidden tool that other tools
 * mention leaves the model unable to tell "missing" from "not allowed").
 */
import { rawToolResult, type ToolSpec } from './tools.js';

/** Marker appended to the description of a tool that is listed but switched off on this connection. */
export const UNAVAILABLE_TOOL_NOTE = 'UNAVAILABLE on this connection:';

/** Error text of a call to a switched-off tool: names the tool and how to turn it on. */
export function unavailableToolMessage(name: string, reason: string): string {
  return `${name} is unavailable on this connection: ${reason}`;
}

/**
 * Same tool, still listed, whose every call answers an error result with the reason (it never runs nor calls the
 * service). The reason is the server's own text, so it is returned as is: a sealed link in it must stay usable.
 */
export function disabledToolSpec<C>(spec: ToolSpec<C>, reason: string): ToolSpec<C> {
  const text = unavailableToolMessage(spec.name, reason);
  return {
    ...spec,
    description: `${spec.description} ${UNAVAILABLE_TOOL_NOTE} ${reason}`,
    run: () => Promise.resolve(rawToolResult({ isError: true, content: [{ type: 'text', text }] })),
  };
}

/** Keeps the tools as they are when `reason` is null; otherwise switches each one off with that reason. */
export function gateToolSpecs<C>(
  specs: readonly ToolSpec<C>[],
  reason: string | null,
): ToolSpec<C>[] {
  return reason === null ? [...specs] : specs.map((spec) => disabledToolSpec(spec, reason));
}

/** Throws on any use of the list-only context. */
export function refuseListOnlyUse(): never {
  throw new Error('This server only lists its tools; it cannot run them.');
}

/** Context of a server that only lists its tools (public catalog): any use of it throws; fits any context type. */
export function listOnlyContext(): never {
  return new Proxy({}, { get: refuseListOnlyUse }) as never;
}
