import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  fakeFetch,
  gmailRoute,
  gmailWriteRoute,
  linkedTestDeps,
  READONLY_SCOPE,
  TEST_REFS,
  testDeps,
  type FakeRoute,
  type GmailWrite,
  type RecordedCall,
} from './fixtures/fake-google.js';
import {
  gmailCall,
  gmailErrorDetail,
  gmailGet,
  gmailHttpError,
  gmailUrl,
  gmailWrite,
  readGmailJson,
  sendGmailRequest,
} from './gmail-api.js';

const OWNER = TEST_REFS[0]!;

/** Dependencies with only the owner account linked. */
function linkedDeps(routes: FakeRoute[], calls: RecordedCall[] = []) {
  return linkedTestDeps(routes, calls, [OWNER.account.email]);
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('gmailUrl', () => {
  it('omits empties and repeats list parameters', () => {
    const url = gmailUrl('threads/t1', {
      format: 'metadata',
      metadataHeaders: ['From', 'Subject'],
      maxResults: 5,
      pageToken: null,
      q: '',
      x: undefined,
    });
    expect(url).toBe(
      'https://gmail.googleapis.com/gmail/v1/users/me/threads/t1?format=metadata&metadataHeaders=From&metadataHeaders=Subject&maxResults=5',
    );
    expect(gmailUrl('labels')).toBe('https://gmail.googleapis.com/gmail/v1/users/me/labels');
  });
});

describe('gmailHttpError', () => {
  it('translates known and generic statuses', () => {
    expect(gmailHttpError(404, 'owner').message).toBe(
      'Account "owner": not found (wrong id or from another account).',
    );
    expect(gmailHttpError(500, 'owner').message).toMatch(/HTTP 500/);
    expect(gmailHttpError(403, 'owner').message).toMatch(/link_account/);
  });

  it('appends the Gmail detail when present', () => {
    expect(gmailHttpError(400, 'owner', 'Invalid To header').message).toBe(
      'Account "owner": Gmail rejected the request (check ids, query and recipients): Invalid To header.',
    );
  });
});

describe('gmailErrorDetail', () => {
  it('reads error.message from the JSON, caps the length and ignores an invalid body', async () => {
    const json = Response.json({ error: { message: 'Invalid To header' } }, { status: 400 });
    expect(await gmailErrorDetail(json)).toBe('Invalid To header');
    const long = Response.json({ error: { message: 'x'.repeat(500) } }, { status: 400 });
    expect(await gmailErrorDetail(long)).toHaveLength(200);
    expect(await gmailErrorDetail(new Response('not json', { status: 500 }))).toBeNull();
    expect(await gmailErrorDetail(Response.json({ error: 'x' }))).toBeNull();
  });
});

describe('readGmailJson', () => {
  it('an empty response (204) becomes an empty object', async () => {
    expect(await readGmailJson(new Response(null, { status: 204 }))).toEqual({});
    expect(await readGmailJson(Response.json({ a: 1 }))).toEqual({ a: 1 });
  });
});

describe('gmailGet', () => {
  it('sends token, accept and User-Agent', async () => {
    const calls: RecordedCall[] = [];
    const deps = await linkedDeps([gmailRoute({ labels: { labels: [] } })], calls);
    expect(await gmailGet(deps, OWNER, gmailUrl('labels'))).toEqual({ labels: [] });
    const headers = calls[1]?.init?.headers as Record<string, string>;
    expect(headers.authorization).toBe('Bearer access-r-owner');
    expect(headers['user-agent']).toMatch(/claude-connectors-gmail/);
  });

  it('after a 401 refreshes the token and retries once', async () => {
    let first = true;
    function flaky(url: URL): Response | undefined {
      if (url.hostname !== 'gmail.googleapis.com') return undefined;
      if (first) {
        first = false;
        return new Response('', { status: 401 });
      }
      return Response.json({ ok: true });
    }
    const calls: RecordedCall[] = [];
    const deps = await linkedDeps([flaky], calls);
    expect(await gmailGet(deps, OWNER, gmailUrl('profile'))).toEqual({ ok: true });
    expect(calls.filter((c) => c.url.includes('oauth2.googleapis.com'))).toHaveLength(2);
  });

  it('an HTTP failure becomes an actionable error', async () => {
    const deps = await linkedDeps([gmailRoute({})]);
    await expect(gmailGet(deps, OWNER, gmailUrl('messages/zz'))).rejects.toThrow(/not found/);
  });

  it('sendGmailRequest uses the given token', async () => {
    const calls: RecordedCall[] = [];
    const deps = testDeps(fakeFetch([gmailRoute({ a: {} })], calls));
    expect((await sendGmailRequest(deps, { url: gmailUrl('a') }, 'tok')).status).toBe(200);
    expect((calls[0]?.init?.headers as Record<string, string>).authorization).toBe('Bearer tok');
    expect(calls[0]?.init?.method).toBe('GET');
  });
});

describe('gmailCall and gmailWrite', () => {
  it('sends method and JSON body', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedDeps([gmailWriteRoute(writes, () => ({ id: 'x' }))]);
    const request = { url: gmailUrl('messages/send'), method: 'POST' as const, body: { raw: 'r' } };
    expect(await gmailCall(deps, OWNER, request)).toEqual({ id: 'x' });
    expect(writes).toEqual([{ method: 'POST', path: 'messages/send', body: { raw: 'r' } }]);
  });

  it('a write error carries the Gmail detail', async () => {
    function refuse(url: URL): Response | undefined {
      if (url.hostname !== 'gmail.googleapis.com') return undefined;
      return Response.json({ error: { message: 'Invalid To header' } }, { status: 400 });
    }
    const deps = await linkedDeps([refuse]);
    const request = { url: gmailUrl('messages/send'), method: 'POST' as const, body: {} };
    await expect(gmailWrite(deps, OWNER, request)).rejects.toThrow(/Invalid To header/);
  });

  it('gmailWrite refuses a read-only linked account without calling Gmail', async () => {
    const calls: RecordedCall[] = [];
    const deps = await linkedDeps([], calls);
    const old = { ...OWNER, account: { ...OWNER.account, scope: READONLY_SCOPE } };
    const request = { url: gmailUrl('messages/send'), method: 'POST' as const, body: {} };
    await expect(gmailWrite(deps, old, request)).rejects.toThrow(/read-only/);
    expect(calls).toHaveLength(0);
  });
});
