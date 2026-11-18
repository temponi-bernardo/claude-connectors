import { describe, expect, it } from 'vitest';
import {
  addHtmlMedia,
  addHtmlRef,
  closeHtmlAnchor,
  closeHtmlTag,
  htmlToText,
  keptHtmlAttrs,
  markHtmlRef,
  openHtmlAnchor,
  openHtmlTag,
  parseHtmlContent,
  safeHttpUrl,
  tidyHtmlText,
  type HtmlWalk,
} from './html.js';

describe('htmlToText', () => {
  it('returns empty for null, undefined or empty', () => {
    expect(htmlToText(null)).toBe('');
    expect(htmlToText(undefined)).toBe('');
    expect(htmlToText('')).toBe('');
  });

  it('strips tags and keeps paragraphs as line breaks', () => {
    expect(htmlToText('<p>Olá</p><p>Mundo</p>')).toBe('Olá\nMundo');
  });

  it('turns list items into bullets', () => {
    expect(htmlToText('<ul><li>one</li><li>two</li></ul>')).toBe('• one\n• two');
  });

  it('removes scripts and styles with their content', () => {
    expect(htmlToText('<style>p{}</style>a<script>alert(1)</script>b')).toBe('ab');
  });

  it('decodes entities without decoding twice', () => {
    expect(htmlToText('a&nbsp;&lt;b&gt; &quot;c&quot; &#39;d&#39; &amp;lt;')).toBe(
      `a <b> "c" 'd' &lt;`,
    );
  });

  it('collapses repeated blank lines', () => {
    expect(htmlToText('a<br><br><br><br>b')).toBe('a\n\nb');
  });
});

describe('parseHtmlContent', () => {
  const base = 'https://canvas.test';

  it('returns no text and no refs for empty input', () => {
    expect(parseHtmlContent(undefined)).toEqual({ text: '', refs: [] });
  });

  it('marks each link as "title [link N]" and keeps its kept attributes', () => {
    const html =
      '<p>See <a href="/courses/1/files/2?verifier=v" data-api-endpoint="https://canvas.test/api/v1/courses/1/files/2" onclick="x()">the slides</a>.</p>';
    const out = parseHtmlContent(html, { baseUrl: base, marks: true });
    expect(out.text).toBe('See the slides [link 1].');
    expect(out.refs).toEqual([
      {
        n: 1,
        tag: 'a',
        url: 'https://canvas.test/courses/1/files/2?verifier=v',
        title: 'the slides',
        attrs: { 'data-api-endpoint': 'https://canvas.test/api/v1/courses/1/files/2' },
      },
    ]);
  });

  it('writes the title of media tags and reuses the number of a repeated URL', () => {
    const html =
      '<iframe title="Video" src="https://www.youtube.com/embed/abc"></iframe><img alt="diagram" src="/img.png"><a href="https://www.youtube.com/embed/abc">again</a>';
    const out = parseHtmlContent(html, { baseUrl: base, marks: true });
    expect(out.text).toBe('Video [link 1] diagram [link 2]again [link 1]');
    expect(out.refs.map((r) => [r.n, r.tag, r.title])).toEqual([
      [1, 'iframe', 'Video'],
      [2, 'img', 'diagram'],
    ]);
  });

  it('falls back to the tag name or URL when there is no title', () => {
    const out = parseHtmlContent(
      '<video src="https://v.test/a.mp4"></video><a href="https://e.test/x"></a>',
      {
        marks: true,
      },
    );
    expect(out.refs.map((r) => r.title)).toEqual(['video', 'https://e.test/x']);
  });

  it('drops unsafe and relative URLs without a base, and never marks without marks', () => {
    const html =
      '<a href="javascript:alert(1)">bad</a><img src="data:image/png;base64,AA"><a href="/rel">rel</a><a href="mailto:a@b.c">mail</a>';
    const out = parseHtmlContent(html);
    expect(out.refs).toEqual([]);
    expect(out.text).toBe('badrelmail');
  });

  it('ignores links inside scripts and closes an anchor left open', () => {
    const out = parseHtmlContent(
      '<script><a href="https://x.test">no</a></script><a href="https://y.test">open',
      { marks: true },
    );
    expect(out.refs.map((r) => r.url)).toEqual(['https://y.test/']);
    expect(out.text).toBe('open [link 1]');
  });
});

describe('safeHttpUrl', () => {
  it.each([
    ['https://a.test/x', undefined, 'https://a.test/x'],
    [' /x\n', 'https://a.test', 'https://a.test/x'],
    ['java\tscript:alert(1)', 'https://a.test', null],
    ['ftp://a.test', undefined, null],
    ['http://[bad', undefined, null],
    [undefined, undefined, null],
  ])('%s → %s', (raw, base, expected) => {
    expect(safeHttpUrl(raw, base)).toBe(expected);
  });
});

describe('html walk helpers', () => {
  function walk(marks = true): HtmlWalk {
    return { options: { marks }, out: [], refs: [], skipDepth: 0, anchor: null };
  }

  it('keptHtmlAttrs keeps only the listed, non-empty attributes', () => {
    expect(keptHtmlAttrs({ title: ' T ', alt: ' ', style: 'x' })).toEqual({ title: 'T' });
  });

  it('addHtmlRef numbers new URLs and reuses known ones', () => {
    const w = walk();
    expect(addHtmlRef(w, { tag: 'a', url: 'u1', title: 't', attrs: {} })).toBe(1);
    expect(addHtmlRef(w, { tag: 'img', url: 'u2', title: 't', attrs: {} })).toBe(2);
    expect(addHtmlRef(w, { tag: 'a', url: 'u1', title: 'x', attrs: {} })).toBe(1);
  });

  it('markHtmlRef writes nothing when marks are off', () => {
    const w = walk(false);
    markHtmlRef(w, 1, 'T');
    expect(w.out).toEqual([]);
  });

  it('openHtmlAnchor ignores anchors without a valid href and closeHtmlAnchor without one open', () => {
    const w = walk();
    openHtmlAnchor(w, {});
    closeHtmlAnchor(w);
    expect(w.anchor).toBeNull();
    expect(w.refs).toEqual([]);
  });

  it('addHtmlMedia skips media without a URL', () => {
    const w = walk();
    addHtmlMedia(w, 'img', { alt: 'x' });
    expect(w.refs).toEqual([]);
  });

  it('openHtmlTag and closeHtmlTag handle skipped blocks, breaks and bullets', () => {
    const w = walk();
    openHtmlTag(w, 'style', {});
    openHtmlTag(w, 'br', {});
    closeHtmlTag(w, 'p');
    closeHtmlTag(w, 'style');
    closeHtmlTag(w, 'style');
    openHtmlTag(w, 'li', {});
    closeHtmlTag(w, 'li');
    expect(w.skipDepth).toBe(0);
    expect(w.out).toEqual(['• ', '\n']);
  });

  it('tidyHtmlText removes non-breaking spaces, trailing spaces and extra blank lines', () => {
    expect(tidyHtmlText('\u00a0a  \n\n\n\nb ')).toBe('a\n\nb');
  });
});
