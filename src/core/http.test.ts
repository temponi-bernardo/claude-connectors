import { describe, expect, it } from 'vitest';
import { buildUrl, parseNextLink } from './http.js';

describe('buildUrl', () => {
  it('joins the base and a relative path', () => {
    expect(buildUrl('https://x.test/api/v1', '/courses').href).toBe(
      'https://x.test/api/v1/courses',
    );
  });

  it('uses an absolute URL as is', () => {
    expect(buildUrl('https://x.test', 'https://y.test/a?page=2').href).toBe(
      'https://y.test/a?page=2',
    );
  });

  it('serializes lists with brackets and omits nulls', () => {
    const url = buildUrl('https://x.test', '/a', {
      include: ['term', 7],
      per_page: 100,
      skip: null,
      no: undefined,
      ok: true,
    });
    expect(url.search).toBe('?include%5B%5D=term&include%5B%5D=7&per_page=100&ok=true');
  });
});

describe('parseNextLink', () => {
  it('returns the rel=next URL', () => {
    const header =
      '<https://x.test/a?page=1>; rel="current", <https://x.test/a?page=2>; rel="next"';
    expect(parseNextLink(header)).toBe('https://x.test/a?page=2');
  });

  it('returns null without a header or without rel=next', () => {
    expect(parseNextLink(null)).toBeNull();
    expect(parseNextLink('<https://x.test/a>; rel="last"')).toBeNull();
  });
});
