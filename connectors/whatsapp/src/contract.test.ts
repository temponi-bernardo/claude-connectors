/**
 * Tool contract of the WhatsApp connector: the public catalog (`GET /tools`, read by the post-deploy smoke test)
 * must equal `tool-contract.json` with sending on or off, and no description may mention an unregistered tool.
 */
import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { catalogContract } from '../../../src/mcp/fixtures/catalog.js';
import {
  readToolContract,
  toolContractDiff,
  unregisteredToolMentions,
} from '../../../src/mcp/tool-contract.js';
import { createRemoteHandler } from '../../../src/remote/handler.js';
import contract from '../tool-contract.json' with { type: 'json' };
import { readWhatsAppSettings } from './config.js';
import { whatsappTools } from './tools.js';
import { whatsappRemoteConnector } from './worker.js';

/** Response fields (bridge pagination, access page address) that look like tool names. */
const WHATSAPP_API_TERMS = ['next_cursor', 'next_before', 'manage_at'];

const EXPECTED = readToolContract(contract);
const ISSUER = 'https://wa.test';

function settings(send: boolean) {
  return readWhatsAppSettings({
    ALLOWED_EMAILS: 'owner@example.dev',
    GITHUB_CLIENT_ID: 'c',
    GITHUB_CLIENT_SECRET: 's',
    ENABLE_SEND: send ? 'true' : 'false',
  });
}

describe('WhatsApp tool contract', () => {
  it('the public catalog lists exactly the contract, sending on or off', async () => {
    for (const send of [true, false]) {
      const connector = whatsappRemoteConnector(
        settings(send),
        () => Promise.reject(new Error('no bridge')),
        ISSUER,
      );
      const oauth = { issuer: ISSUER, key: randomBytes(32), redirectHosts: ['claude.ai'] };
      const handle = createRemoteHandler({ settings: oauth, connector, now: () => 1 });
      expect(toolContractDiff(EXPECTED, await catalogContract(handle, ISSUER))).toEqual([]);
    }
  });

  it('no description mentions a tool that is not registered, sending on or off', () => {
    for (const send of [true, false])
      expect(unregisteredToolMentions(whatsappTools(settings(send)), WHATSAPP_API_TERMS)).toEqual(
        [],
      );
  });
});
