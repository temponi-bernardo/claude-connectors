/**
 * Tool contract of the Gmail connector: the public catalog (`GET /tools`, read by the post-deploy smoke test)
 * must equal `tool-contract.json`, and no description may mention a tool that is not registered.
 */
import { describe, expect, it } from 'vitest';
import { catalogContract } from '../../../src/mcp/fixtures/catalog.js';
import {
  readToolContract,
  toolContractDiff,
  toolContractOf,
  unregisteredToolMentions,
} from '../../../src/mcp/tool-contract.js';
import contract from '../tool-contract.json' with { type: 'json' };
import { GMAIL_TOOLS } from './tool-list.js';
import { handleDefaultRequest, type GmailWorkerEnv } from './worker.js';

/** Gmail API terms and arguments of other tools that look like tool names. */
const GMAIL_API_TERMS = ['write_access', 'newer_than', 'next_page_token'];

const EXPECTED = readToolContract(contract);

describe('Gmail tool contract', () => {
  it('the registry and the public catalog list exactly the contract', async () => {
    expect(toolContractDiff(EXPECTED, toolContractOf(GMAIL_TOOLS))).toEqual([]);
    const env = {} as GmailWorkerEnv;
    const listed = await catalogContract((request) => handleDefaultRequest(request, env));
    expect(toolContractDiff(EXPECTED, listed)).toEqual([]);
  });

  it('no description mentions a tool that is not registered', () => {
    expect(unregisteredToolMentions(GMAIL_TOOLS, GMAIL_API_TERMS)).toEqual([]);
  });
});
