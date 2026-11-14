import { beforeEach, describe, expect, it } from 'vitest';
import { clearAccessTokenCache } from './access-token.js';
import {
  fakeFetch,
  gmailRoute,
  linkedTestDeps,
  TEST_ACCOUNTS,
  testDeps,
  type FakeRoute,
  type RecordedCall,
} from './fixtures/fake-google.js';
import { gmailGet, gmailHttpError, gmailUrl, sendGmailGet } from './gmail-api.js';

const OWNER = TEST_ACCOUNTS[0]!;

/** Dependências com só a conta do dono vinculada. */
function linkedDeps(routes: FakeRoute[], calls: RecordedCall[] = []) {
  return linkedTestDeps(routes, calls, [OWNER]);
}

beforeEach(() => {
  clearAccessTokenCache();
});

describe('gmailUrl', () => {
  it('omite vazios e repete parâmetros de lista', () => {
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
  it('traduz status conhecidos e genéricos', () => {
    expect(gmailHttpError(404, OWNER).message).toBe(
      'Conta "dono": não encontrado (id errado ou de outra conta).',
    );
    expect(gmailHttpError(500, OWNER).message).toMatch(/HTTP 500/);
  });
});

describe('gmailGet', () => {
  it('envia token, accept e User-Agent', async () => {
    const calls: RecordedCall[] = [];
    const deps = await linkedDeps([gmailRoute({ labels: { labels: [] } })], calls);
    expect(await gmailGet(deps, OWNER, gmailUrl('labels'))).toEqual({ labels: [] });
    const headers = calls[1]?.init?.headers as Record<string, string>;
    expect(headers.authorization).toBe('Bearer access-r-dono');
    expect(headers['user-agent']).toMatch(/claude-connectors-gmail/);
  });

  it('depois de 401 renova o token e tenta de novo uma vez', async () => {
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

  it('falha HTTP vira erro acionável', async () => {
    const deps = await linkedDeps([gmailRoute({})]);
    await expect(gmailGet(deps, OWNER, gmailUrl('messages/zz'))).rejects.toThrow(/não encontrado/);
  });

  it('sendGmailGet usa o token dado', async () => {
    const calls: RecordedCall[] = [];
    const deps = testDeps(fakeFetch([gmailRoute({ a: {} })], calls));
    expect((await sendGmailGet(deps, gmailUrl('a'), 'tok')).status).toBe(200);
    expect((calls[0]?.init?.headers as Record<string, string>).authorization).toBe('Bearer tok');
  });
});
