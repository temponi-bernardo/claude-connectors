/**
 * Converts HTML (assignment prompts, announcements, LMS pages) into text the model can read.
 * Pure: only transforms strings.
 */

/** Replacements applied in order: removed blocks, line breaks, bullets, tags and entities. */
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

/** Converts HTML into plain text, keeping paragraphs and lists as line breaks. */
export function htmlToText(html: string | null | undefined): string {
  if (!html) return '';
  const text = HTML_TEXT_REPLACEMENTS.reduce(
    (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
    html,
  );
  return text.trim();
}
