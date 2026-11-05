/**
 * Conversão de HTML (enunciados, avisos, páginas de LMS) em texto legível para o modelo.
 * Pura: só transforma strings.
 */

/** Substituições aplicadas em ordem: blocos removidos, quebras de linha, marcadores, tags e entidades. */
export const HTML_TEXT_REPLACEMENTS: readonly (readonly [RegExp, string])[] = [
  [/<(script|style)[\s\S]*?<\/\1>/gi, ''],
  [/<br\s*\/?>/gi, '\n'],
  [/<\/(p|div|li|h[1-6]|tr)>/gi, '\n'],
  [/<li[^>]*>/gi, '• '],
  [/<[^>]+>/g, ''],
  [/&nbsp;/g, ' '],
  [/&lt;/g, '<'],
  [/&gt;/g, '>'],
  [/&quot;/g, '"'],
  [/&#39;/g, "'"],
  [/&amp;/g, '&'],
  [/[ \t]+\n/g, '\n'],
  [/\n{3,}/g, '\n\n'],
];

/** Converte HTML em texto simples, preservando parágrafos e listas como quebras de linha. */
export function htmlToText(html: string | null | undefined): string {
  if (!html) return '';
  const text = HTML_TEXT_REPLACEMENTS.reduce(
    (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
    html,
  );
  return text.trim();
}
