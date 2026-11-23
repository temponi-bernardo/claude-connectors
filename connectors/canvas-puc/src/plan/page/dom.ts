/**
 * The only way the plan page creates content: elements whose text goes in through `textContent`. Rich text
 * is limited to `**bold**`, split after the fact into `<b>` elements — no outside text ever reaches `innerHTML`.
 */

/** New element with an optional class and text (set as `textContent`). */
export function createEl<K extends keyof HTMLElementTagNameMap>(
  doc: Document,
  tag: K,
  options: { className?: string; text?: string } = {},
): HTMLElementTagNameMap[K] {
  const el = doc.createElement(tag);
  if (options.className) el.className = options.className;
  if (options.text !== undefined) el.textContent = options.text;
  return el;
}

/** Splits `a **b** c` into plain and bold runs; an unpaired `**` stays as plain text. */
export function richTextRuns(text: string): { bold: boolean; text: string }[] {
  const parts = text.split('**');
  if (parts.length % 2 === 0) return [{ bold: false, text }];
  return parts
    .map((part, index) => ({ bold: index % 2 === 1, text: part }))
    .filter((run) => run.text.length > 0);
}

/** Appends text with `**bold**` runs to a parent, as text nodes and `<b>` elements. */
export function appendRichText(parent: HTMLElement, text: string): HTMLElement {
  const doc = parent.ownerDocument;
  for (const run of richTextRuns(text)) {
    parent.append(run.bold ? createEl(doc, 'b', { text: run.text }) : doc.createTextNode(run.text));
  }
  return parent;
}

/** Element with rich text content. */
export function createRichEl<K extends keyof HTMLElementTagNameMap>(
  doc: Document,
  tag: K,
  text: string,
): HTMLElementTagNameMap[K] {
  const el = createEl(doc, tag);
  appendRichText(el, text);
  return el;
}

/** Element found by id; throws naming the id when the template lacks it. */
export function requireEl(doc: Document, id: string): HTMLElement {
  const el = doc.getElementById(id);
  if (!el) throw new Error(`The plan template has no #${id}: rebuild it with npm run build.`);
  return el;
}
