import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  expiredWriteAccessPage,
  hasStoredWriteOptIn,
  memoryWriteAccessStore,
  openWriteTicket,
  renderWriteAccessPage,
  showWriteAccess,
  submitWriteAccess,
  tokenFingerprint,
  writeAccessKey,
  writeAccessUrl,
  WRITE_TICKET_TTL_SECONDS,
  type WriteAccessDeps,
  type WriteAccessStore,
} from './write-access.js';

const TOKEN = '1111~fakeCanvasTokenAAAAAAAAAAAAAAAA';

function deps(now = 1_800_000_000, issuer = 'https://canvas.test'): WriteAccessDeps {
  const oauth = { issuer, key: KEY, redirectHosts: [] };
  return { oauth, store: memoryWriteAccessStore(), now: () => now };
}
const KEY = randomBytes(32);

function writeAccessPost(url: string, action: string): Request {
  return new Request('https://canvas.test/write-access', {
    method: 'POST',
    body: new URLSearchParams({ t: ticketOf(url), action }),
  });
}

function ticketOf(url: string): string {
  return new URL(url).searchParams.get('t') ?? '';
}

describe('tokenFingerprint and writeAccessKey', () => {
  it('hashes the token (never stores it) and namespaces the key', () => {
    const fp = tokenFingerprint(TOKEN);
    expect(fp).toMatch(/^[0-9a-f]{64}$/);
    expect(fp).not.toContain('fakeCanvas');
    expect(tokenFingerprint(TOKEN)).toBe(fp);
    expect(writeAccessKey(fp)).toBe(`write:${fp}`);
  });
});

describe('hasStoredWriteOptIn', () => {
  it('is true only for a stored "on" and false when the store fails', async () => {
    const store = memoryWriteAccessStore();
    await expect(hasStoredWriteOptIn(store, TOKEN)).resolves.toBe(false);
    await store.put(writeAccessKey(tokenFingerprint(TOKEN)), 'on');
    await expect(hasStoredWriteOptIn(store, TOKEN)).resolves.toBe(true);
    const broken = {
      get: () => Promise.reject(new Error('kv down')),
    } as unknown as WriteAccessStore;
    await expect(hasStoredWriteOptIn(broken, TOKEN)).resolves.toBe(false);
  });
});

describe('writeAccessUrl and openWriteTicket', () => {
  it('links to the page with a sealed ticket that opens to the fingerprint, not the token', () => {
    const d = deps();
    const url = writeAccessUrl(d, TOKEN);
    expect(url).toMatch(/^https:\/\/canvas\.test\/write-access\?t=/);
    expect(url).not.toContain(TOKEN);
    expect(openWriteTicket(d, ticketOf(url))).toBe(tokenFingerprint(TOKEN));
  });

  it('refuses an expired ticket, one for another server and a forged one', () => {
    const url = writeAccessUrl(deps(), TOKEN);
    expect(
      openWriteTicket(deps(1_800_000_000 + WRITE_TICKET_TTL_SECONDS + 1), ticketOf(url)),
    ).toBeNull();
    expect(openWriteTicket(deps(1_800_000_000, 'https://other.test'), ticketOf(url))).toBeNull();
    expect(openWriteTicket(deps(), 'forged')).toBeNull();
  });
});

describe('renderWriteAccessPage', () => {
  it('shows the state, the opposite action and escapes the ticket', () => {
    const off = renderWriteAccessPage('t"<', false);
    expect(off).toContain('Writing is <strong>off</strong>');
    expect(off).toContain('name="action" value="on"');
    expect(off).toContain('t&quot;&lt;');
    const on = renderWriteAccessPage('t', true);
    expect(on).toContain('Turn writing off');
    expect(on).toContain('Go back to Claude');
  });
});

describe('expiredWriteAccessPage', () => {
  it('answers 400 explaining how to get a new link', async () => {
    const res = expiredWriteAccessPage();
    expect(res.status).toBe(400);
    expect(await res.text()).toContain('new link');
  });
});

describe('showWriteAccess and submitWriteAccess', () => {
  it('turns writing on and off for the ticket token only', async () => {
    const d = deps();
    const url = writeAccessUrl(d, TOKEN);
    const shown = await showWriteAccess(d, new Request(url));
    expect(shown.headers.get('content-security-policy')).toContain("frame-ancestors 'none'");
    expect(await shown.text()).toContain('<strong>off</strong>');
    await submitWriteAccess(d, writeAccessPost(url, 'on'));
    await expect(hasStoredWriteOptIn(d.store, TOKEN)).resolves.toBe(true);
    await expect(hasStoredWriteOptIn(d.store, 'other-token')).resolves.toBe(false);
    expect(await (await showWriteAccess(d, new Request(url))).text()).toContain(
      '<strong>on</strong>',
    );
    await submitWriteAccess(d, writeAccessPost(url, 'off'));
    await expect(hasStoredWriteOptIn(d.store, TOKEN)).resolves.toBe(false);
  });

  it('refuses a missing or forged ticket without touching the store', async () => {
    const d = deps();
    expect((await showWriteAccess(d, new Request('https://canvas.test/write-access'))).status).toBe(
      400,
    );
    const forged = new Request('https://canvas.test/write-access', {
      method: 'POST',
      body: new URLSearchParams({ t: 'x', action: 'on' }),
    });
    expect((await submitWriteAccess(d, forged)).status).toBe(400);
  });
});

describe('memoryWriteAccessStore', () => {
  it('keeps, reads and deletes values', async () => {
    const store = memoryWriteAccessStore();
    await store.put('k', 'on');
    await expect(store.get('k')).resolves.toBe('on');
    await store.delete('k');
    await expect(store.get('k')).resolves.toBeNull();
  });
});
