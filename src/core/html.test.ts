import { describe, expect, it } from 'vitest';
import { htmlToText } from './html.js';

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
