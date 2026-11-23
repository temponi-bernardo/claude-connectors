/**
 * Tool contract of the Canvas connector: what `GET /tools` (the same `tools/list` the post-deploy smoke test
 * reads) and each user's `/mcp` list must equal `tool-contract.json`, writing on or off, and no description
 * may mention a tool that is not registered.
 */
import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { catalogContract } from '../../../src/mcp/fixtures/catalog.js';
import {
  readToolContract,
  toolContractDiff,
  toolContractOf,
  unregisteredToolMentions,
} from '../../../src/mcp/tool-contract.js';
import contract from '../tool-contract.json' with { type: 'json' };
import { canvasTools } from './tools.js';
import { handleWorkerFetch } from './worker.js';
import { memoryWriteAccessStore } from './write-access.js';

/** Canvas API terms that look like tool names but are field values. */
const CANVAS_API_TERMS = ['front_page', 'online_upload', 'allowed_extensions', 'peer_review'];

const EXPECTED = readToolContract(contract);
const ENV = {
  SEAL_KEY: randomBytes(32).toString('base64'),
  CANVAS_ALLOW_WRITE: 'true',
  CANVAS_KV: memoryWriteAccessStore(),
};

describe('Canvas tool contract', () => {
  it('the public catalog lists exactly the contract', async () => {
    const listed = await catalogContract((request) => handleWorkerFetch(request, ENV));
    expect(toolContractDiff(EXPECTED, listed)).toEqual([]);
  });

  it('every user gets the same tools, writing on, off for them or off on the server', () => {
    for (const block of [null, 'read-only connection', 'server flag off']) {
      const listed = toolContractOf(canvasTools(block));
      expect(toolContractDiff(EXPECTED, listed)).toEqual([]);
    }
  });

  it('no description mentions a tool that is not registered, writing on or off', () => {
    for (const block of [null, 'off'])
      expect(unregisteredToolMentions(canvasTools(block), CANVAS_API_TERMS)).toEqual([]);
  });
});
