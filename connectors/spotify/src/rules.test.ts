import { describe, expect, it } from 'vitest';
import type { AddedTrack } from './catalog.js';
import {
  artistIdsOf,
  findDuplicates,
  foldText,
  groupTracks,
  matchesAdded,
  matchesArtist,
  matchesFilter,
  matchesGenre,
  matchesWho,
  matchesYear,
  needsGenres,
  preferredCopy,
  songKey,
  songTitleKey,
  sortTracks,
  trackGenres,
  trackKeyValue,
} from './rules.js';

/** A liked track for rule tests. */
function t(name: string, artist: string, extra: Partial<AddedTrack> = {}): AddedTrack {
  return {
    uri: `spotify:track:${name.replace(/\W/g, '')}${extra.addedAt ?? ''}`.slice(0, 60),
    id: name,
    name,
    type: 'track',
    artists: [{ id: `id-${artist}`, name: artist }],
    album: 'A',
    releaseDate: '1999-01-01',
    durationMs: 1,
    isPlayable: true,
    isrc: null,
    isLocal: false,
    addedAt: '2024-05-01T00:00:00Z',
    ...extra,
  };
}

const GENRES = {
  'id-Chris Cornell': ['grunge', 'alternative rock'],
  'id-Bicep': ['electronica', 'uk house'],
};

describe('filters', () => {
  it('folds case, accents and spaces', () => {
    expect(foldText('  Café   Tacvba ')).toBe('cafe tacvba');
  });

  it('“only Chris Cornell + electronic” keeps those and nothing else', () => {
    const filter = { artists: ['chris cornell'], genres: ['electronic'] };
    expect(matchesFilter(t('Seasons', 'Chris Cornell'), filter, GENRES)).toBe(true);
    expect(matchesFilter(t('Glue', 'Bicep'), filter, GENRES)).toBe(true);
    expect(matchesFilter(t('Other', 'Someone'), filter, GENRES)).toBe(false);
  });

  it('narrows with years, dates added and availability', () => {
    const track = t('S', 'X', {
      releaseDate: '1994',
      addedAt: '2023-02-01T00:00:00Z',
      isPlayable: false,
    });
    expect(matchesYear(track, { yearFrom: 1990, yearTo: 1999 })).toBe(true);
    expect(matchesYear(track, { yearFrom: 2000 })).toBe(false);
    expect(matchesYear(t('S', 'X', { releaseDate: '' }), { yearFrom: 1 })).toBe(false);
    expect(matchesAdded(track, { addedAfter: '2023-01-01' })).toBe(true);
    expect(matchesAdded(track, { addedAfter: '2024-01-01' })).toBe(false);
    expect(matchesAdded(track, { addedBefore: '2023-01-01' })).toBe(false);
    expect(matchesFilter(track, { unavailableOnly: true }, {})).toBe(true);
    expect(matchesFilter(t('P', 'X'), { unavailableOnly: true }, {})).toBe(false);
  });

  it('who-part, genres and helpers', () => {
    expect(matchesWho(t('a', 'b'), {}, {})).toBe(true);
    expect(matchesArtist(t('a', 'Beyoncé'), ['beyonce'])).toBe(true);
    expect(matchesGenre(t('a', 'Bicep'), ['house'], GENRES)).toBe(true);
    expect(trackGenres(t('a', 'Nobody'), GENRES)).toEqual([]);
    expect(needsGenres({ genres: ['x'] })).toBe(true);
    expect(needsGenres({ artists: ['x'] })).toBe(false);
    expect(artistIdsOf([t('a', 'X'), t('b', 'X')])).toEqual(['id-X']);
  });
});

describe('duplicates', () => {
  it('treats remasters, editions and features as the same song, but not live or remix', () => {
    expect(songTitleKey('Black Hole Sun - Remastered 2014')).toBe('black hole sun');
    expect(songTitleKey('Black Hole Sun (Deluxe Edition)')).toBe('black hole sun');
    expect(songTitleKey('Song (feat. Someone)')).toBe('song');
    expect(songTitleKey('Song - Live at Wembley')).toBe('song - live at wembley');
    expect(songTitleKey('Song (Bicep Remix)')).toBe('song (bicep remix)');
    expect(songKey(t('Song', 'Bicep'))).toBe('bicep|song');
  });

  it('keeps the playable, earliest copy and returns the rest', () => {
    const original = t('Hunger Strike', 'Temple', {
      addedAt: '2020-01-01',
      uri: 'spotify:track:o',
    });
    const remaster = t('Hunger Strike - 2016 Remaster', 'Temple', {
      addedAt: '2019-01-01',
      uri: 'spotify:track:r',
      isPlayable: false,
    });
    const other = t('Say Hello 2 Heaven', 'Temple', { uri: 'spotify:track:s' });
    const { keep, extra } = findDuplicates([original, remaster, other]);
    expect(keep.map((x) => x.uri)).toEqual(['spotify:track:o', 'spotify:track:s']);
    expect(extra.map((x) => x.uri)).toEqual(['spotify:track:r']);
    expect(preferredCopy(original, remaster)).toBeLessThan(0);
  });

  it('keeps distinct local files and repeats of the same URI as duplicates', () => {
    const a = t('X', 'Y', { uri: 'spotify:track:same', addedAt: '1' });
    const b = t('X', 'Y', { uri: 'spotify:track:same', addedAt: '2' });
    const local = t('L', 'Y', { uri: 'spotify:local:l', isLocal: true });
    expect(findDuplicates([a, b, local]).extra).toEqual([b]);
  });
});

describe('sorting and grouping', () => {
  const tracks = [
    t('b', 'Zed', { releaseDate: '1985' }),
    t('a', 'Bicep', { releaseDate: '2017' }),
    t('c', 'Chris Cornell', { releaseDate: '' }),
  ];

  it('sorts by a key, both ways', () => {
    expect(
      sortTracks(tracks, { key: 'name', descending: false, genres: {} }).map((x) => x.name),
    ).toEqual(['a', 'b', 'c']);
    expect(sortTracks(tracks, { key: 'artist', descending: true, genres: {} })[0]?.name).toBe('b');
  });

  it('groups by decade or genre, largest first', () => {
    expect(groupTracks(tracks, 'decade', {}).map((g) => g.name)).toContain('1980s');
    expect(trackKeyValue(tracks[2]!, 'decade', {})).toBe('unknown decade');
    expect(trackKeyValue(tracks[1]!, 'genre', GENRES)).toBe('electronica');
    expect(trackKeyValue(tracks[0]!, 'genre', GENRES)).toBe('unknown genre');
    expect(trackKeyValue(tracks[2]!, 'year', {})).toBe('0000');
    const many = groupTracks([...tracks, t('d', 'Bicep')], 'artist', {});
    expect(many[0]).toMatchObject({ name: 'Bicep' });
    expect(trackKeyValue({ ...tracks[0]!, artists: [] }, 'artist', {})).toBe('Unknown artist');
    expect(['added', 'album'].map((k) => trackKeyValue(tracks[0]!, k as 'added', {}))).toEqual([
      '2024-05-01T00:00:00Z',
      'A',
    ]);
  });
});
