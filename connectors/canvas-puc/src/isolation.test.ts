/**
 * Data isolation of the public, multi-user Canvas Worker (docs/security/isolation.md): two users served by the
 * same isolate at the same time only ever see their own Canvas data, tokens of another connector are refused,
 * write tools are per-user opt-in and errors never echo a credential. All tokens here are fake fixtures.
 */
import { randomBytes } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { READ_ONLY_HINTS, SEND_HINTS } from '../../../src/mcp/annotations.js';
import { issueTokenSet } from '../../../src/remote/tokens.js';
import { CANVAS_WRITE_GRANT } from './remote.js';
import { CANVAS_INBOX_WRITE_TOOLS } from './tools-inbox.js';
import { canvasTools } from './tools.js';
import { CANVAS_WRITE_TOOLS } from './tools-write.js';
import { handleWorkerFetch } from './worker.js';

const ORIGIN = 'https://canvas.isolation.test';
const SEAL_KEY = randomBytes(32);
const ENV = { SEAL_KEY: SEAL_KEY.toString('base64'), CANVAS_ALLOW_WRITE: 'true' };

/** Fake Canvas tokens of two users and the private data Canvas returns to each. */
const USERS = {
  alice: { canvasToken: '1111~aliceFakeTokenAAAAAAAAAAAAAAAA', name: 'Alice Private' },
  bob: { canvasToken: '2222~bobFakeTokenBBBBBBBBBBBBBBBBBB', name: 'Bob Private' },
} as const;

/** Canvas double: answers each token with its owner's profile, after a random delay to interleave requests. */
function fakeCanvas(_input: string | URL | Request, init?: RequestInit): Promise<Response> {
  const auth = new Headers(init?.headers).get('authorization') ?? '';
  const user = Object.values(USERS).find((u) => auth === `Bearer ${u.canvasToken}`);
  const delay = Math.floor(Math.random() * 15);
  const body = user
    ? JSON.stringify({ id: 1, name: user.name, primary_email: `${user.name}@x.test` })
    : '{}';
  const status = user ? 200 : 401;
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(new Response(body, { status }));
    }, delay),
  );
}

function accessTokenFor(canvasToken: string, grants: readonly string[] = [], issuer = ORIGIN) {
  const settings = { issuer, key: SEAL_KEY, redirectHosts: ['claude.ai'] };
  return issueTokenSet({ secret: canvasToken, grants }, settings, Math.floor(Date.now() / 1000))
    .access_token;
}

function mcpCall(token: string, method: string, params: unknown = {}): Request {
  return new Request(`${ORIGIN}/mcp`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
}

async function callTool(token: string, name: string): Promise<string> {
  const res = await handleWorkerFetch(mcpCall(token, 'tools/call', { name, arguments: {} }), ENV);
  return res.text();
}

async function toolNames(token: string): Promise<string[]> {
  const res = await handleWorkerFetch(mcpCall(token, 'tools/list'), ENV);
  const body = (await res.json()) as { result: { tools: { name: string }[] } };
  return body.result.tools.map((tool) => tool.name);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Canvas isolation between concurrent users in one isolate', () => {
  it('answers each user only with their own data under interleaved requests', async () => {
    vi.stubGlobal('fetch', vi.fn(fakeCanvas));
    const alice = accessTokenFor(USERS.alice.canvasToken);
    const bob = accessTokenFor(USERS.bob.canvasToken);
    const calls = Array.from({ length: 20 }, (_, i) => (i % 2 === 0 ? alice : bob));
    const answers = await Promise.all(calls.map((token) => callTool(token, 'whoami')));
    answers.forEach((text, i) => {
      const [own, other] = i % 2 === 0 ? [USERS.alice, USERS.bob] : [USERS.bob, USERS.alice];
      expect(text).toContain(own.name);
      expect(text).not.toContain(other.name);
      expect(text).not.toContain(other.canvasToken);
    });
  });

  it('refuses tokens of another connector, tampered tokens and missing tokens with 401', async () => {
    vi.stubGlobal('fetch', vi.fn(fakeCanvas));
    const foreign = accessTokenFor(USERS.alice.canvasToken, [], 'https://whatsapp.isolation.test');
    const valid = accessTokenFor(USERS.alice.canvasToken);
    const tampered = `${valid.slice(0, -4)}${valid.endsWith('AAAA') ? 'BBBB' : 'AAAA'}`;
    for (const token of [foreign, tampered, 'random-token']) {
      expect((await handleWorkerFetch(mcpCall(token, 'tools/list'), ENV)).status).toBe(401);
    }
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it('never echoes a credential in a tool error, even when Canvas returns one in the body', async () => {
    const leaky = `{"errors":"invalid Bearer ${USERS.alice.canvasToken} access_token=${USERS.alice.canvasToken}"}`;
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response(leaky, { status: 500 }))),
    );
    const text = await callTool(accessTokenFor(USERS.alice.canvasToken), 'whoami');
    expect(text).toContain('isError');
    expect(text).not.toContain(USERS.alice.canvasToken);
  });
});

describe('Canvas write tools are per-user opt-in', () => {
  it('lists the send and submit tools only for a user who ticked the write option', async () => {
    const readOnly = await toolNames(accessTokenFor(USERS.alice.canvasToken));
    const writer = await toolNames(accessTokenFor(USERS.bob.canvasToken, [CANVAS_WRITE_GRANT]));
    const writes = [...CANVAS_WRITE_TOOLS, ...CANVAS_INBOX_WRITE_TOOLS].map((tool) => tool.name);
    expect(writes).toEqual(expect.arrayContaining(['send_message', 'submit_text_assignment']));
    for (const name of writes) {
      expect(readOnly).not.toContain(name);
      expect(writer).toContain(name);
    }
  });

  it('marks every write tool as destructive and every other tool as read-only', () => {
    const writes = new Set([...CANVAS_WRITE_TOOLS, ...CANVAS_INBOX_WRITE_TOOLS]);
    for (const tool of canvasTools(true)) {
      const hints = writes.has(tool) ? SEND_HINTS : READ_ONLY_HINTS;
      expect(tool.annotations).toMatchObject({
        readOnlyHint: hints.readOnlyHint,
        destructiveHint: hints.destructiveHint,
      });
    }
  });
});
