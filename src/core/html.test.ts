import { describe, expect, it } from 'vitest';
import { htmlToText } from './html.js';

describe('htmlToText', () => {
  it('devolve vazio para nulo, indefinido ou vazio', () => {
    expect(htmlToText(null)).toBe('');
    expect(htmlToText(undefined)).toBe('');
    expect(htmlToText('')).toBe('');
  });

  it('remove tags e mantém parágrafos como quebras de linha', () => {
    expect(htmlToText('<p>Olá</p><p>Mundo</p>')).toBe('Olá\nMundo');
  });

  it('converte itens de lista em marcadores', () => {
    expect(htmlToText('<ul><li>um</li><li>dois</li></ul>')).toBe('• um\n• dois');
  });

  it('remove scripts e estilos com o conteúdo', () => {
    expect(htmlToText('<style>p{}</style>a<script>alert(1)</script>b')).toBe('ab');
  });

  it('decodifica entidades sem decodificar duas vezes', () => {
    expect(htmlToText('a&nbsp;&lt;b&gt; &quot;c&quot; &#39;d&#39; &amp;lt;')).toBe(
      `a <b> "c" 'd' &lt;`,
    );
  });

  it('colapsa linhas em branco repetidas', () => {
    expect(htmlToText('a<br><br><br><br>b')).toBe('a\n\nb');
  });
});
