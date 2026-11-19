import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { SEND_HINTS, toolAnnotations } from './annotations.js';
import {
  disabledToolSpec,
  gateToolSpecs,
  listOnlyContext,
  refuseListOnlyUse,
  UNAVAILABLE_TOOL_NOTE,
  unavailableToolMessage,
} from './tool-gate.js';
import { defineTool, runToolSafely, toToolResult } from './tools.js';

const send = vi.fn(() => Promise.resolve('sent'));
const SEND = defineTool({
  name: 'send_thing',
  description: 'SENDS a thing.',
  shape: { text: z.string() },
  annotations: toolAnnotations('Send thing', SEND_HINTS),
  run: send,
});

describe('unavailableToolMessage', () => {
  it('names the tool and the reason', () => {
    expect(unavailableToolMessage('send_thing', 'turn it on')).toBe(
      'send_thing is unavailable on this connection: turn it on',
    );
  });
});

describe('disabledToolSpec', () => {
  it('keeps name, schema and annotations, says why in the description and refuses every call', async () => {
    const off = disabledToolSpec(SEND, 'open https://x.test/on?t=' + 'a'.repeat(120));
    expect(off.name).toBe('send_thing');
    expect(off.annotations).toBe(SEND.annotations);
    expect(off.shape).toBe(SEND.shape);
    expect(off.description).toContain(`SENDS a thing. ${UNAVAILABLE_TOOL_NOTE} open`);
    const result = await runToolSafely(off, {}, { text: 'x' });
    expect(result.isError).toBe(true);
    expect(JSON.stringify(result.content)).toContain('a'.repeat(120));
    expect(send).not.toHaveBeenCalled();
  });
});

describe('gateToolSpecs', () => {
  it('passes the tools through when there is no reason', async () => {
    const [on] = gateToolSpecs([SEND], null);
    expect(toToolResult(await on!.run({}, { text: 'x' }))).toMatchObject({
      content: [{ text: 'sent' }],
    });
  });

  it('switches every tool off with the reason', () => {
    const tools = gateToolSpecs([SEND, SEND], 'off');
    expect(tools.map((t) => t.description.endsWith(`${UNAVAILABLE_TOOL_NOTE} off`))).toEqual([
      true,
      true,
    ]);
  });
});

describe('listOnlyContext', () => {
  it('throws on any use', () => {
    const ctx: { client: unknown } = listOnlyContext();
    expect(() => ctx.client).toThrow('only lists its tools');
    expect(() => refuseListOnlyUse()).toThrow('cannot run them');
  });
});
