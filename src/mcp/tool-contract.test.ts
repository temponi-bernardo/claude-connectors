import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  contractEntryAsListed,
  readToolContract,
  snakeCaseWords,
  toolContractDiff,
  toolContractOf,
  toolsFromListResponse,
  toolTexts,
  unregisteredToolMentions,
} from './tool-contract.js';

const read = { name: 'b_tool', readOnly: true };
const write = { name: 'a_tool', readOnly: false };

describe('toolContractOf', () => {
  it('sorts by name and treats a missing readOnlyHint as a write', () => {
    expect(
      toolContractOf([{ name: 'b_tool', annotations: { readOnlyHint: true } }, { name: 'a_tool' }]),
    ).toEqual([write, read]);
  });
});

describe('contractEntryAsListed', () => {
  it('turns an entry back into the tools/list shape', () => {
    expect(contractEntryAsListed(read)).toEqual({
      name: 'b_tool',
      annotations: { readOnlyHint: true },
    });
  });
});

describe('readToolContract', () => {
  it('reads and sorts a valid contract', () => {
    expect(readToolContract({ tools: [read, write] })).toEqual([write, read]);
  });

  it('throws on a malformed contract', () => {
    for (const bad of [
      null,
      {},
      { tools: [{ name: 1, readOnly: true }] },
      { tools: [{ name: 'x' }] },
    ])
      expect(() => readToolContract(bad)).toThrow('Invalid tool contract');
  });
});

describe('toolsFromListResponse', () => {
  it('returns the tools of a tools/list result and throws on an error answer', () => {
    expect(toolsFromListResponse({ result: { tools: [{ name: 'x' }] } })).toEqual([{ name: 'x' }]);
    expect(() => toolsFromListResponse({ error: { code: -1 } })).toThrow('did not return tools');
    expect(() => toolsFromListResponse(null)).toThrow('did not return tools');
  });
});

describe('toolContractDiff', () => {
  it('is empty when equal and lists missing, unexpected and read-only differences', () => {
    expect(toolContractDiff([read, write], [write, read])).toEqual([]);
    expect(
      toolContractDiff(
        [read, write],
        [
          { name: 'b_tool', readOnly: false },
          { name: 'c', readOnly: true },
        ],
      ),
    ).toEqual([
      'b_tool: readOnly is false, expected true',
      'missing tool: a_tool',
      'unexpected tool: c',
    ]);
  });
});

describe('snakeCaseWords', () => {
  it('finds distinct snake_case words only', () => {
    expect(
      snakeCaseWords('Use send_message, then send_message or get_x2. Plain words, Mixed_Case.'),
    ).toEqual(['send_message', 'get_x2']);
  });
});

describe('toolTexts', () => {
  it('returns the description and the argument descriptions', () => {
    const tool = {
      name: 't',
      description: 'D',
      shape: { a: z.string().describe('see list_x'), b: z.number() },
    };
    expect(toolTexts(tool)).toEqual(['D', 'see list_x', '']);
  });
});

describe('unregisteredToolMentions', () => {
  const finder = {
    name: 'find_recipients',
    description: 'Returns the id send_message needs; pass course_id; accepts online_upload.',
    shape: { course_id: z.string().describe('see list_courses') },
  };

  it('reports a mention of a tool that is not registered (the original bug)', () => {
    expect(unregisteredToolMentions([finder], ['online_upload'])).toEqual([
      'find_recipients → send_message',
      'find_recipients → list_courses',
    ]);
  });

  it('is empty when every mention is a registered tool, an argument or an ignored term', () => {
    const others = ['send_message', 'list_courses'].map((name) => ({
      name,
      description: '',
      shape: {},
    }));
    expect(unregisteredToolMentions([finder, ...others], ['online_upload'])).toEqual([]);
  });
});
