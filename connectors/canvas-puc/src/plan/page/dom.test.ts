// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { appendRichText, createEl, createRichEl, requireEl, richTextRuns } from './dom.js';

describe('createEl', () => {
  it('sets the class and the text as text', () => {
    const el = createEl(document, 'p', { className: 'x', text: '<b>hi</b>' });
    expect(el.className).toBe('x');
    expect(el.innerHTML).toBe('&lt;b&gt;hi&lt;/b&gt;');
  });
});

describe('richTextRuns', () => {
  it('splits bold runs', () => {
    expect(richTextRuns('a **b** c')).toEqual([
      { bold: false, text: 'a ' },
      { bold: true, text: 'b' },
      { bold: false, text: ' c' },
    ]);
  });
  it('keeps an unpaired marker as plain text', () => {
    expect(richTextRuns('a ** b')).toEqual([{ bold: false, text: 'a ** b' }]);
  });
});

describe('appendRichText and createRichEl', () => {
  it('never turns markup into elements', () => {
    const el = createRichEl(document, 'p', '**<img src=x onerror=alert(1)>** ok');
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('b')?.textContent).toBe('<img src=x onerror=alert(1)>');
  });
  it('appends to an existing element', () => {
    const el = appendRichText(document.createElement('div'), 'x');
    expect(el.textContent).toBe('x');
  });
});

describe('requireEl', () => {
  it('throws naming the missing id', () => {
    document.body.innerHTML = '<p id="here"></p>';
    expect(requireEl(document, 'here').id).toBe('here');
    expect(() => requireEl(document, 'gone')).toThrow(/#gone/);
  });
});
