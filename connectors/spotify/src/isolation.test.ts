/**
 * Data isolation of the multi-user Spotify Worker (docs/security/isolation.md): users served by the same isolate
 * at the same time — each with their own app — only ever reach their own tokens, library, plans and backups.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearSpotifyTokenCache, getSpotifyAccessToken } from './access-token.js';
import { saveBackup } from './backups.js';
import {
  fakeSpotify,
  testOwnerDeps,
  TEST_ACCOUNT,
  type SpotifyCallRecord,
} from './fixtures/fake-spotify.js';
import {
  Browser,
  multiUserSpotify,
  signIn,
  toolText,
  workerEnv,
} from './fixtures/worker-harness.js';
import { createPlan, requirePlan } from './plans.js';

beforeEach(() => {
  clearSpotifyTokenCache();
  vi.stubGlobal('fetch', multiUserSpotify());
});

afterEach(() => vi.unstubAllGlobals());

describe('Spotify isolation between concurrent users in one isolate', () => {
  it('each user only lists their own liked songs, under interleaved calls', async () => {
    const env = workerEnv();
    const ana = await signIn(new Browser(env), 'ana');
    const bia = await signIn(new Browser(env), 'bia');
    const tokens = Array.from({ length: 12 }, (_, i) => (i % 2 === 0 ? ana : bia));
    const answers = await Promise.all(
      tokens.map((token) => toolText(new Browser(env), token, ['list_liked_tracks', {}])),
    );
    answers.forEach((text, i) => {
      const [own, other] = i % 2 === 0 ? ['ana', 'bia'] : ['bia', 'ana'];
      expect(text).toContain(`spotify:track:${own}1`);
      expect(text).not.toContain(`spotify:track:${other}`);
    });
  });

  it('a user cannot apply, read or delete another user’s plan or backup', async () => {
    const env = workerEnv();
    const ana = await signIn(new Browser(env), 'ana');
    const bia = await signIn(new Browser(env), 'bia');
    const preview = JSON.parse(
      await toolText(new Browser(env), ana, [
        'preview_library_change',
        { action: 'remove', uris: ['spotify:track:x'] },
      ]),
    ) as { plan_id: string };
    expect(
      await toolText(new Browser(env), bia, ['apply_plan', { plan_id: preview.plan_id }]),
    ).toContain('does not exist or expired');
    const backup = JSON.parse(await toolText(new Browser(env), ana, ['create_backup', {}])) as {
      backup: { id: string };
    };
    expect(
      await toolText(new Browser(env), bia, ['export_backup', { backup_id: backup.backup.id }]),
    ).toContain('does not exist');
    expect(
      await toolText(new Browser(env), bia, ['delete_backup', { backup_id: backup.backup.id }]),
    ).toContain('"deleted":false');
    expect(await toolText(new Browser(env), ana, ['list_backups', {}])).toContain(backup.backup.id);
  });

  it('disconnect erases only the caller’s data', async () => {
    const env = workerEnv();
    const ana = await signIn(new Browser(env), 'ana');
    const bia = await signIn(new Browser(env), 'bia');
    await toolText(new Browser(env), bia, ['create_backup', {}]);
    const erased = JSON.parse(
      await toolText(new Browser(env), ana, ['disconnect', { confirm: true }]),
    ) as { erased_records: number; revoked_claude_grants: number };
    expect(erased.erased_records).toBeGreaterThan(0);
    expect(erased.revoked_claude_grants).toBeGreaterThan(0);
    expect(await toolText(new Browser(env), bia, ['list_backups', {}])).toContain('"liked":2');
    expect(await toolText(new Browser(env), bia, ['connection_status', {}])).toContain(
      '"spotify_user":"bia"',
    );
  });
});

describe('Spotify storage and token cache are keyed by user', () => {
  it('never serves user A’s cached access token to user B', async () => {
    const calls: SpotifyCallRecord[] = [];
    const fetch = fakeSpotify([], calls);
    const alice = await testOwnerDeps(fetch, {
      owner: 'spotify_alice',
      account: { ...TEST_ACCOUNT, refreshToken: 'r-alice' },
    });
    const bob = await testOwnerDeps(fetch, {
      owner: 'spotify_bob',
      kv: alice.kv,
      account: { ...TEST_ACCOUNT, refreshToken: 'r-bob' },
    });
    expect(await getSpotifyAccessToken(alice)).toBe('at-r-alice');
    expect(await getSpotifyAccessToken(bob)).toBe('at-r-bob');
    expect(await getSpotifyAccessToken(alice)).toBe('at-r-alice');
  });

  it('plans and backups saved by one user are invisible to another sharing the KV', async () => {
    const alice = await testOwnerDeps(fakeSpotify([]), { owner: 'spotify_alice' });
    const bob = await testOwnerDeps(fakeSpotify([]), { owner: 'spotify_bob', kv: alice.kv });
    const plan = await createPlan(alice, { title: 't', steps: [], before: null });
    await saveBackup(alice, { label: 'a' });
    await expect(requirePlan(bob, plan.id)).rejects.toThrow();
    const keys = [...alice.kv.entries.keys()].join(' ');
    expect(keys).not.toContain('alice');
  });
});
