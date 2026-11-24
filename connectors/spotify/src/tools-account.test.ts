import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import { saveBackup } from './backups.js';
import { fakeSpotify, testOwnerDeps } from './fixtures/fake-spotify.js';
import {
  connectionStatusTool,
  disconnectTool,
  revokeClaudeGrants,
  SPOTIFY_APPS_PAGE,
} from './tools-account.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

describe('account tools', () => {
  it('connection_status shows the account, the masked app and the expiry', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    const status = (await connectionStatusTool.run(deps, {})) as Record<string, unknown>;
    expect(status).toMatchObject({
      spotify_user: 'owner-user',
      app_client_id: 'aaaa…',
      requests_per_call: 40,
    });
    expect(JSON.stringify(status)).not.toContain('b'.repeat(32));
    expect(String(status.reconnect_before)).toMatch(/^\d{4}-/);
  });

  it('disconnect requires confirm: true and erases everything, revoking grants', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    await saveBackup(deps, { label: 'x' });
    await expect(disconnectTool.run(deps, {})).rejects.toThrow();
    const revoked: string[] = [];
    const pages = [{ items: [{ id: 'g1' }], cursor: 'c' }, { items: [{ id: 'g2' }] }];
    const oauth = {
      listUserGrants: () => Promise.resolve(pages.shift() ?? { items: [] }),
      revokeGrant: (id: string) => {
        revoked.push(id);
        return Promise.resolve();
      },
    };
    const out = await disconnectTool.run({ ...deps, oauth: oauth as never }, { confirm: true });
    expect(out).toMatchObject({ erased_records: 3, revoked_claude_grants: 2 });
    expect((out as { next: string }).next).toContain(SPOTIFY_APPS_PAGE);
    expect(revoked).toEqual(['g1', 'g2']);
    expect(deps.kv.entries.size).toBe(0);
    await expect(connectionStatusTool.run(deps, {})).rejects.toThrow('No Spotify account');
  });

  it('revokeClaudeGrants does nothing without OAuth helpers', async () => {
    expect(await revokeClaudeGrants(await testOwnerDeps(fakeSpotify([])))).toBe(0);
  });
});
