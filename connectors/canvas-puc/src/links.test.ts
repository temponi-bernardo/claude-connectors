import { describe, expect, it } from 'vitest';
import type { HtmlRef } from '../../../src/core/html.js';
import {
  EXTERNAL_LINK_HTML,
  FIXTURE_CANVAS_URL as BASE,
  IMAGE_HTML,
  MEDIA_OBJECT_HTML,
  NO_LINK_HTML,
  REVIEW_ASSIGNMENT_HTML,
  YOUTUBE_IFRAME_HTML,
} from './fixtures/canvas-html.js';
import {
  canvasHtml,
  canvasRefTarget,
  canvasTargetOf,
  classifyCanvasRef,
  hostMatches,
  isCanvasUrl,
  redactVerifier,
  videoProviderOf,
} from './links.js';

function ref(over: Partial<HtmlRef>): HtmlRef {
  return { n: 1, tag: 'a', url: `${BASE}/x`, title: 't', attrs: {}, ...over };
}

describe('canvasHtml with real Canvas HTML', () => {
  it('finds the review PDF and the video of assignment 1408627, without theme CSS/JS', () => {
    const out = canvasHtml(REVIEW_ASSIGNMENT_HTML, BASE);
    expect(out.text).toBe(
      'Atividade não pontuada.\n\nRevisão para a prova. [link 1]\n\nQuestões de 10 a 13 em vídeo:\n\n Reprodutor de vídeo para 2026-11-15 14-33-55.mov [link 2]',
    );
    expect(out.links).toEqual([
      {
        n: 1,
        type: 'file',
        title: 'Revisão para a prova.',
        url: 'https://pucminas.instructure.com/courses/294409/files/18832665?verifier=00000000-fake-0000-0000-000000000001&wrap=1',
        course_id: '294409',
        file_id: '18832665',
        followable: true,
      },
      {
        n: 2,
        type: 'video',
        title: 'Reprodutor de vídeo para 2026-11-15 14-33-55.mov',
        url: 'https://pucminas.instructure.com/media_attachments_iframe/19034621?embedded=true&type=video&verifier=00000000-fake-0000-0000-000000000002',
        file_id: '19034621',
        media_id: 'm-5KAzPmXPof31N5c25n2iTU99kNZhBLNW',
        followable: true,
      },
    ]);
  });

  it('classifies a YouTube iframe as a followable video', () => {
    expect(canvasHtml(YOUTUBE_IFRAME_HTML, BASE).links).toEqual([
      {
        n: 1,
        type: 'video',
        title: 'YouTube video player',
        url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        provider: 'youtube',
        followable: true,
      },
    ]);
  });

  it('classifies Canvas media objects (link and iframe) as videos with their media id', () => {
    const links = canvasHtml(MEDIA_OBJECT_HTML, BASE).links;
    expect(links.map((l) => [l.type, l.media_id, l.title])).toEqual([
      ['video', 'm-abc123', 'this is a media comment'],
      ['video', 'm-def456', 'Aula 3'],
    ]);
  });

  it('classifies an inline course image as an image with its file id', () => {
    const out = canvasHtml(IMAGE_HTML, BASE);
    expect(out.text).toBe('Diagrama de Amdahl [link 1]');
    expect(out.links[0]).toMatchObject({ type: 'image', file_id: '1234567', course_id: '294409' });
  });

  it('reports external links without making them followable, and classifies Drive and pages', () => {
    const links = canvasHtml(EXTERNAL_LINK_HTML, BASE).links;
    expect(links.map((l) => [l.type, l.followable, l.page_url ?? l.url])).toEqual([
      ['external', false, 'https://example.org/openmp.pdf'],
      ['external', false, 'https://drive.google.com/file/d/1AbC/view'],
      ['page', true, 'plano-de-ensino'],
    ]);
  });

  it('keeps a description without links as plain text with no links', () => {
    expect(canvasHtml(NO_LINK_HTML, BASE)).toEqual({
      text: 'Atividade não pontuada.\n\n• Leia o capítulo 2.\n• Faça os exercícios.',
      links: [],
    });
  });

  it('returns empty text and links for a missing description', () => {
    expect(canvasHtml(null, BASE)).toEqual({ text: '', links: [] });
  });
});

describe('hostMatches', () => {
  it.each([
    ['youtube.com', 'youtube.com', true],
    ['www.youtube.com', 'youtube.com', true],
    ['evilyoutube.com', 'youtube.com', false],
  ])('%s vs %s → %s', (host, domain, expected) => {
    expect(hostMatches(host, domain)).toBe(expected);
  });
});

describe('isCanvasUrl', () => {
  it('accepts only the host of the base URL', () => {
    expect(isCanvasUrl(new URL(`${BASE}/files/1`), BASE)).toBe(true);
    expect(isCanvasUrl(new URL('https://pucminas.instructure.com.evil.test/files/1'), BASE)).toBe(
      false,
    );
  });
});

describe('videoProviderOf', () => {
  it.each([
    ['https://youtu.be/x', 'a', 'youtube'],
    ['https://player.vimeo.com/video/1', 'iframe', 'vimeo'],
    ['https://pucminas.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=1', 'a', 'panopto'],
    ['https://web.microsoftstream.com/video/1', 'a', 'microsoft_stream'],
    ['https://pucmg.sharepoint.com/:v:/s/x', 'iframe', 'sharepoint'],
    ['https://pucmg.sharepoint.com/doc.docx', 'a', null],
    ['https://drive.google.com/file/d/1/preview', 'iframe', 'google_drive'],
    ['https://example.org', 'iframe', null],
  ])('%s in <%s> → %s', (url, tag, expected) => {
    expect(videoProviderOf(new URL(url), tag)).toBe(expected);
  });
});

describe('canvasTargetOf', () => {
  it.each([
    ['/courses/1/files/2/download', { type: 'file', course_id: '1', file_id: '2' }],
    ['/files/3/preview', { type: 'file', file_id: '3' }],
    ['/users/9/files/4', { type: 'file', file_id: '4' }],
    ['/api/v1/files/5', { type: 'file', file_id: '5' }],
    ['/media_attachments_iframe/6', { type: 'video', file_id: '6' }],
    ['/media_objects/m-1', { type: 'video', media_id: 'm-1' }],
    ['/courses/1/pages/a%20b', { type: 'page', course_id: '1', page_url: 'a b' }],
    ['/courses/1/assignments/7', { type: 'assignment', course_id: '1', assignment_id: '7' }],
    ['/courses/1/discussion_topics/8', { type: 'discussion', course_id: '1' }],
    ['/courses/1/quizzes/9', { type: 'quiz', course_id: '1' }],
    ['/courses/1/modules/items/10', { type: 'module', course_id: '1' }],
    ['/profile/settings', null],
  ])('%s', (path, expected) => {
    expect(canvasTargetOf(path)).toEqual(expected);
  });
});

describe('canvasRefTarget', () => {
  it('prefers the data-api-endpoint over the href', () => {
    const r = ref({
      url: `${BASE}/courses/1/files/2/download?verifier=v`,
      attrs: { 'data-api-endpoint': `${BASE}/api/v1/courses/1/files/22` },
    });
    expect(canvasRefTarget(r, BASE)).toEqual({ type: 'file', course_id: '1', file_id: '22' });
  });

  it('ignores a data-api-endpoint on another host', () => {
    const r = ref({
      url: `${BASE}/files/2`,
      attrs: { 'data-api-endpoint': 'https://evil.test/api/v1/files/9' },
    });
    expect(canvasRefTarget(r, BASE)).toEqual({ type: 'file', file_id: '2' });
  });

  it('turns a file played in a player tag into a video and any other path into canvas', () => {
    expect(canvasRefTarget(ref({ tag: 'video', url: `${BASE}/files/2` }), BASE).type).toBe('video');
    expect(canvasRefTarget(ref({ url: `${BASE}/calendar` }), BASE)).toEqual({ type: 'canvas' });
  });
});

describe('classifyCanvasRef', () => {
  it('reports an external image as a non-followable image', () => {
    expect(classifyCanvasRef(ref({ tag: 'img', url: 'https://cdn.test/a.png' }), BASE)).toEqual({
      n: 1,
      type: 'image',
      title: 't',
      url: 'https://cdn.test/a.png',
      followable: false,
    });
  });
});

describe('redactVerifier', () => {
  it('hides every verifier and keeps the rest of the URL', () => {
    expect(
      redactVerifier('a https://c.test/files/1?verifier=abc-1&wrap=1 and /x?a=1&VERIFIER=zz'),
    ).toBe('a https://c.test/files/1?verifier=[hidden]&wrap=1 and /x?a=1&VERIFIER=[hidden]');
  });
});
