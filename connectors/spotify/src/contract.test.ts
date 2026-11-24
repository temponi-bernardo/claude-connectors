/**
 * Tool contract of the Spotify connector: the public catalog (`GET /tools`, read by the post-deploy smoke test)
 * must equal `tool-contract.json`, and no description may mention a tool that is not registered.
 */
import { describe, expect, it } from 'vitest';
import { catalogContract } from '../../../src/mcp/fixtures/catalog.js';
import {
  readToolContract,
  toolContractDiff,
  toolContractOf,
  unregisteredToolMentions,
} from '../../../src/mcp/tool-contract.js';
import contract from '../tool-contract.json' with { type: 'json' };
import { SPOTIFY_TOOLS } from './tool-list.js';
import { handleSpotifyDefault, type SpotifyWorkerEnv } from './worker.js';

/** Spotify API terms and arguments that look like tool names. */
const SPOTIFY_API_TERMS = [
  'next_offset',
  'plan_id',
  'added_after',
  'sort_by',
  'max_items',
  'include_empty',
  'only_mine',
  'with_genres',
  'include_releases',
  'unavailable_only',
  'short_term',
  'medium_term',
  'long_term',
  'playlist_id',
  'playlist_ids',
  'device_id',
  'image_base64',
  'range_start',
  'insert_before',
  'range_length',
  'offset_position',
  'context_uri',
  'position_ms',
  'volume_percent',
  'year_from',
  'year_to',
  'added_before',
  'min_group_size',
  'backup_id',
  'genre_artists_pending',
  'requests_per_call',
];

const EXPECTED = readToolContract(contract);

describe('Spotify tool contract', () => {
  it('the registry and the public catalog list exactly the contract', async () => {
    expect(toolContractDiff(EXPECTED, toolContractOf(SPOTIFY_TOOLS))).toEqual([]);
    const listed = await catalogContract((request) =>
      handleSpotifyDefault(request, {} as SpotifyWorkerEnv),
    );
    expect(toolContractDiff(EXPECTED, listed)).toEqual([]);
  });

  it('no description mentions a tool that is not registered', () => {
    expect(unregisteredToolMentions(SPOTIFY_TOOLS, SPOTIFY_API_TERMS)).toEqual([]);
  });

  it('every tool has a unique name, a title and the destructive ones say so', () => {
    const names = SPOTIFY_TOOLS.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of [
      'apply_plan',
      'disconnect',
      'remove_from_library',
      'remove_playlist_items',
      'delete_backup',
    ]) {
      expect(SPOTIFY_TOOLS.find((t) => t.name === name)?.annotations.destructiveHint).toBe(true);
    }
  });
});
