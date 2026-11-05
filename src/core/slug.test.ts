import { describe, expect, it } from 'vitest';
import { MAX_SLUG_LENGTH, removeDiacritics, slugify } from './slug.js';

describe('removeDiacritics', () => {
  it('remove acentos mantendo as letras', () => {
    expect(removeDiacritics('ação é João')).toBe('acao e Joao');
  });

  it('não altera texto sem acentos', () => {
    expect(removeDiacritics('abc 123')).toBe('abc 123');
  });
});

describe('slugify', () => {
  it('gera slug minúsculo separado por hífen', () => {
    expect(slugify('Olá, Mundo! 2026')).toBe('ola-mundo-2026');
  });

  it('remove hífens nas pontas', () => {
    expect(slugify('  --Título--  ')).toBe('titulo');
  });

  it('limita o tamanho sem terminar em hífen', () => {
    const long = Array.from({ length: 40 }, () => 'ab').join(' ');
    const slug = slugify(long);
    expect(slug.length).toBeLessThanOrEqual(MAX_SLUG_LENGTH);
    expect(slug.endsWith('-')).toBe(false);
  });

  it('retorna vazio para entrada sem caracteres válidos', () => {
    expect(slugify('!!!')).toBe('');
  });
});
