/**
 * Lógica pura de exemplo do esqueleto: transforma um título em um slug de URL.
 * Serve como modelo de função pura, pequena e testada (docs/CODING-STANDARDS.md).
 */

/** Tamanho máximo de um slug gerado. */
export const MAX_SLUG_LENGTH = 80;

/** Remove acentos e marcas diacríticas de um texto. */
export function removeDiacritics(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Converte um título livre em slug: minúsculo, sem acentos, palavras separadas por hífen. */
export function slugify(title: string): string {
  const plain = removeDiacritics(title).toLowerCase();
  const slug = plain.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug.slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '');
}
