import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CALL_BUDGET,
  isSpotifyAppCredential,
  parseCallBudget,
  readSpotifySettings,
  SPOTIFY_SCOPES,
} from './config.js';

const KEY = Buffer.alloc(32, 1).toString('base64');

describe('Spotify settings', () => {
  it('reads the seal key and the default budget', () => {
    const settings = readSpotifySettings({ TOKEN_ENC_KEY: KEY });
    expect(settings.tokenKey.length).toBe(32);
    expect(settings.callBudget).toBe(DEFAULT_CALL_BUDGET);
  });

  it('requires TOKEN_ENC_KEY', () => {
    expect(() => readSpotifySettings({})).toThrow('TOKEN_ENC_KEY');
  });

  it('parseCallBudget accepts 5..900 and refuses the rest', () => {
    expect(parseCallBudget('400')).toBe(400);
    expect(parseCallBudget(null)).toBe(DEFAULT_CALL_BUDGET);
    for (const bad of ['4', '901', '1.5', 'x'])
      expect(() => parseCallBudget(bad)).toThrow('SPOTIFY_CALL_BUDGET');
  });

  it('isSpotifyAppCredential wants 32 hex characters', () => {
    expect(isSpotifyAppCredential('0123456789abcdef0123456789ABCDEF')).toBe(true);
    expect(isSpotifyAppCredential('short')).toBe(false);
    expect(isSpotifyAppCredential('g'.repeat(32))).toBe(false);
  });

  it('asks only for library, playlist, follow, history and playback scopes', () => {
    expect(SPOTIFY_SCOPES).not.toContain('user-read-email');
    expect(SPOTIFY_SCOPES).not.toContain('user-read-private');
    expect(SPOTIFY_SCOPES).toContain('user-library-modify');
  });
});
