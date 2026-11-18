import { describe, expect, it } from 'vitest';
import { toToolResult } from '../../../src/mcp/tools.js';
import { fakeContext } from './fixtures/fake-context.js';
import { REVIEW_ASSIGNMENT_HTML, YOUTUBE_IFRAME_HTML } from './fixtures/canvas-html.js';
import {
  collectLinkedFiles,
  fetchLinkSources,
  isLinkedFileLink,
  linkedFileKey,
  linkedOnlyNote,
  linkedOnlyRows,
  linkSource,
  listFilesWithLinked,
  listLinkedFiles,
  moduleItemLinks,
  originLinks,
  toLinkedFile,
  type LinkOrigin,
} from './linked-files.js';
import type { CanvasLink } from './links.js';

const BASE = 'https://x.test';
const REVIEW = REVIEW_ASSIGNMENT_HTML.replaceAll('https://pucminas.instructure.com', BASE);
const ORIGIN: LinkOrigin = { kind: 'assignment', id: '1', title: 'A' };

function link(over: Partial<CanvasLink>): CanvasLink {
  return { n: 1, type: 'file', title: 't', url: 'u', followable: true, ...over };
}

const COURSE_ROUTES = {
  '/courses/1/assignments': [{ id: 1408627, name: 'Revisão', description: REVIEW }],
  '/courses/1/pages': [{ url: 'p', title: 'P', body: REVIEW + YOUTUBE_IFRAME_HTML }],
  '/courses/1/discussion_topics': [{ id: 3, title: 'D', message: null }],
  '/courses/1/modules': [
    { id: 4, name: 'M', items: [{ id: 5, type: 'File', title: 'slides.pdf', content_id: 77 }] },
  ],
};

describe('isLinkedFileLink and linkedFileKey', () => {
  it('keeps files and videos and dedupes by file, media or url', () => {
    expect(isLinkedFileLink(link({ type: 'video' }))).toBe(true);
    expect(isLinkedFileLink(link({ type: 'image' }))).toBe(false);
    expect(linkedFileKey(link({ file_id: '1' }))).toBe('file:1');
    expect(linkedFileKey(link({ media_id: 'm-1' }))).toBe('media:m-1');
    expect(linkedFileKey(link({ url: 'https://y' }))).toBe('url:https://y');
  });
});

describe('moduleItemLinks', () => {
  it('turns File items into files and video URLs into videos, ignoring the rest', () => {
    expect(moduleItemLinks({ id: 1, type: 'File', title: 'a', content_id: 9 }, BASE)).toEqual([
      link({ n: 0, title: 'a', url: `${BASE}/files/9`, file_id: '9' }),
    ]);
    const yt = { id: 2, type: 'ExternalUrl', title: 'v', external_url: 'https://youtu.be/x' };
    expect(moduleItemLinks(yt, BASE)[0]).toMatchObject({ type: 'video', provider: 'youtube' });
    const site = { id: 3, type: 'ExternalUrl', external_url: 'https://e.test' };
    expect(moduleItemLinks(site, BASE)).toEqual([]);
    expect(moduleItemLinks({ id: 4, type: 'Page' }, BASE)).toEqual([]);
    expect(moduleItemLinks({ id: 5, type: 'ExternalUrl' }, BASE)).toEqual([]);
  });
});

describe('collectLinkedFiles and toLinkedFile', () => {
  it('merges repeated files and lists every origin', () => {
    const other: LinkOrigin = { kind: 'page', id: 'p', title: 'P' };
    const files = collectLinkedFiles([
      { origin: ORIGIN, links: [link({ file_id: '1' }), link({ type: 'image', file_id: '2' })] },
      { origin: other, links: [link({ file_id: '1', title: 'again' })] },
    ]);
    expect(files).toEqual([
      { ...toLinkedFile(link({ file_id: '1' }), ORIGIN), found_in: [ORIGIN, other] },
    ]);
  });
});

describe('originLinks and linkSource', () => {
  it('reads links from HTML sources and module items', () => {
    const groups = originLinks(
      [linkSource('assignment', [1, undefined, REVIEW])],
      [{ id: 4, items: [{ id: 5, type: 'File', content_id: 77 }] }, { id: 6 }],
      BASE,
    );
    expect(groups.map((g) => [g.origin.kind, g.origin.title, g.links.length])).toEqual([
      ['assignment', '', 2],
      ['module', '', 1],
    ]);
    expect(linkSource('page', [undefined, undefined, null])).toEqual({
      kind: 'page',
      id: '',
      title: '',
      html: null,
    });
  });
});

describe('fetchLinkSources and listLinkedFiles', () => {
  it('asks pages with their body and announcements apart, tolerating failures', async () => {
    const fake = fakeContext({ ...COURSE_ROUTES, '/courses/1/pages': new Error('x') });
    const sources = await fetchLinkSources(fake.ctx.client, 1);
    expect(sources.map((s) => s.kind)).toEqual(['assignment', 'discussion', 'announcement']);
    expect(fake.getAll.mock.calls[1]).toEqual(['/courses/1/pages', { include: ['body'] }]);
    expect(fake.getAll.mock.calls[3]![1]).toEqual({ only_announcements: 'true' });
  });

  it('returns the review PDF, its video, the YouTube video and the module file, once each', async () => {
    const files = await listLinkedFiles(fakeContext(COURSE_ROUTES).ctx.client, 1);
    expect(files.map((f) => [f.type, f.file_id ?? f.provider, f.found_in.length])).toEqual([
      ['file', '18832665', 2],
      ['video', '19034621', 2],
      ['video', 'youtube', 1],
      ['file', '77', 1],
    ]);
  });
});

describe('linkedOnlyRows, linkedOnlyNote and listFilesWithLinked', () => {
  it('adds only linked files missing from the listing', () => {
    const linked = [
      toLinkedFile(link({ file_id: '1' }), ORIGIN),
      toLinkedFile(link({ file_id: '2', title: 'hidden.pdf' }), ORIGIN),
      toLinkedFile(link({ type: 'video', url: 'https://youtu.be/x' }), ORIGIN),
    ];
    expect(linkedOnlyRows([{ id: 1 }], linked)).toEqual([
      {
        id: '2',
        name: 'hidden.pdf',
        type: 'file',
        url: 'u',
        linked_only: true,
        found_in: [ORIGIN],
      },
    ]);
  });

  it('says how many linked files were missing', () => {
    expect(linkedOnlyNote(0)).toContain('already in this list');
    expect(linkedOnlyNote(2)).toContain('2 file(s)');
  });

  it('returns the listing plus the hidden files and the note', async () => {
    const result = toToolResult(
      await listFilesWithLinked(fakeContext(COURSE_ROUTES).ctx.client, 1, [{ id: 77 }]),
    );
    const rows = JSON.parse((result.content[0] as { text: string }).text) as { id: unknown }[];
    expect(rows.map((r) => r.id)).toEqual([77, '18832665', '19034621']);
    expect((result.content[1] as { text: string }).text).toContain('2 file(s)');
  });
});
