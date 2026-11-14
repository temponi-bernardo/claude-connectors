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

/** Dependências com só a conta do dono vinculada. */
function linkedDeps(routes: FakeRoute[], calls: RecordedCall[] = []) {
  return linkedTestDeps(routes, calls, [OWNER.account.email]);
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
    expect(gmailHttpError(404, 'dono').message).toBe(
      'Conta "dono": não encontrado (id errado ou de outra conta).',
    );
    expect(gmailHttpError(500, 'dono').message).toMatch(/HTTP 500/);
    expect(gmailHttpError(403, 'dono').message).toMatch(/link_account/);
  });

  it('acrescenta o detalhe do Gmail quando houver', () => {
    expect(gmailHttpError(400, 'dono', 'Invalid To header').message).toBe(
      'Conta "dono": o Gmail recusou o pedido (confira ids, busca e destinatários): Invalid To header.',
    );
  });
});

describe('gmailErrorDetail', () => {
  it('lê error.message do JSON, limita o tamanho e ignora corpo inválido', async () => {
    const json = Response.json({ error: { message: 'Invalid To header' } }, { status: 400 });
    expect(await gmailErrorDetail(json)).toBe('Invalid To header');
    const long = Response.json({ error: { message: 'x'.repeat(500) } }, { status: 400 });
    expect(await gmailErrorDetail(long)).toHaveLength(200);
    expect(await gmailErrorDetail(new Response('não é json', { status: 500 }))).toBeNull();
    expect(await gmailErrorDetail(Response.json({ error: 'x' }))).toBeNull();
  });
});

describe('readGmailJson', () => {
  it('resposta vazia (204) vira objeto vazio', async () => {
    expect(await readGmailJson(new Response(null, { status: 204 }))).toEqual({});
    expect(await readGmailJson(Response.json({ a: 1 }))).toEqual({ a: 1 });
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

  it('sendGmailRequest usa o token dado', async () => {
    const calls: RecordedCall[] = [];
    const deps = testDeps(fakeFetch([gmailRoute({ a: {} })], calls));
    expect((await sendGmailRequest(deps, { url: gmailUrl('a') }, 'tok')).status).toBe(200);
    expect((calls[0]?.init?.headers as Record<string, string>).authorization).toBe('Bearer tok');
    expect(calls[0]?.init?.method).toBe('GET');
  });
});

describe('gmailCall e gmailWrite', () => {
  it('envia método e corpo JSON', async () => {
    const writes: GmailWrite[] = [];
    const deps = await linkedDeps([gmailWriteRoute(writes, () => ({ id: 'x' }))]);
    const request = { url: gmailUrl('messages/send'), method: 'POST' as const, body: { raw: 'r' } };
    expect(await gmailCall(deps, OWNER, request)).toEqual({ id: 'x' });
    expect(writes).toEqual([{ method: 'POST', path: 'messages/send', body: { raw: 'r' } }]);
  });

  it('erro de escrita traz o detalhe do Gmail', async () => {
    function refuse(url: URL): Response | undefined {
      if (url.hostname !== 'gmail.googleapis.com') return undefined;
      return Response.json({ error: { message: 'Invalid To header' } }, { status: 400 });
    }
    const deps = await linkedDeps([refuse]);
    const request = { url: gmailUrl('messages/send'), method: 'POST' as const, body: {} };
    await expect(gmailWrite(deps, OWNER, request)).rejects.toThrow(/Invalid To header/);
  });

  it('gmailWrite recusa conta vinculada só para leitura, sem chamar o Gmail', async () => {
    const calls: RecordedCall[] = [];
    const deps = await linkedDeps([], calls);
    const old = { ...OWNER, account: { ...OWNER.account, scope: READONLY_SCOPE } };
    const request = { url: gmailUrl('messages/send'), method: 'POST' as const, body: {} };
    await expect(gmailWrite(deps, old, request)).rejects.toThrow(/só para leitura/);
    expect(calls).toHaveLength(0);
  });
});
