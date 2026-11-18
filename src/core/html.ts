/**
 * Converts HTML (assignment prompts, announcements, LMS pages, e-mails) into text the model can read and,
 * optionally, collects its links and media. Pure: tokenizes with a real HTML parser (htmlparser2), never runs
 * scripts, never touches the network.
 */
import { Parser } from 'htmlparser2';

/** A link or media reference found in the HTML, numbered in order of first appearance. */
export interface HtmlRef {
  /** Number shown in the text as `[link N]`; repeated URLs share one number. */
  readonly n: number;
  /** Tag it came from (`a`, `iframe`, `img`, `video`, `audio`, `source`, `embed`). */
  readonly tag: string;
  /** Absolute http(s) URL. */
  readonly url: string;
  /** Visible title: link text, `title`, `alt` or the URL itself. */
  readonly title: string;
  /** The kept attributes (`HTML_KEPT_ATTRS`) the tag had. */
  readonly attrs: Readonly<Record<string, string>>;
}

/** Text and references extracted from an HTML document. */
export interface HtmlContent {
  readonly text: string;
  readonly refs: readonly HtmlRef[];
}

/** Options of `parseHtmlContent`. */
export interface HtmlParseOptions {
  /** Base for relative URLs; without it relative links are dropped. */
  readonly baseUrl?: string;
  /** Writes `title [link N]` in the text for each reference (default `false`). */
  readonly marks?: boolean;
}

/** Tags whose content never reaches the text (code, styles, metadata). */
export const HTML_SKIPPED_TAGS: ReadonlySet<string> = new Set([
  'script',
  'style',
  'noscript',
  'template',
  'head',
  'title',
]);

/** Tags whose closing ends a line. */
export const HTML_BLOCK_TAGS: ReadonlySet<string> = new Set([
  'p',
  'div',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'tr',
]);

/** Media tags and the attribute that holds their URL (`a` is handled apart, by its text). */
export const HTML_MEDIA_TAGS: Readonly<Record<string, string>> = {
  iframe: 'src',
  img: 'src',
  video: 'src',
  audio: 'src',
  source: 'src',
  embed: 'src',
};

/** Attributes kept on each reference (the rest is discarded). */
export const HTML_KEPT_ATTRS: readonly string[] = [
  'title',
  'alt',
  'data-api-endpoint',
  'data-api-returntype',
  'data-media-id',
  'data-media-type',
];

/** Cleanups applied to the collected text: trailing spaces, non-breaking spaces and blank lines. */
export const HTML_TEXT_CLEANUPS: readonly (readonly [RegExp, string])[] = [
  [/\u00a0/g, ' '],
  [/[ \t]+\n/g, '\n'],
  [/\n{3,}/g, '\n\n'],
];

/** Open `<a>` whose text is being collected. */
export interface OpenAnchor {
  readonly url: string;
  readonly attrs: Readonly<Record<string, string>>;
  readonly textStart: number;
}

/** Mutable state of one parse. */
export interface HtmlWalk {
  readonly options: HtmlParseOptions;
  readonly out: string[];
  readonly refs: HtmlRef[];
  skipDepth: number;
  anchor: OpenAnchor | null;
}

/** Resolves a URL from the HTML to an absolute http(s) URL, or `null` (javascript:, data:, mailto: etc.). */
export function safeHttpUrl(raw: string | undefined, baseUrl?: string): string | null {
  const cleaned = (raw ?? '').replace(/\p{Cc}/gu, '').trim();
  if (!cleaned) return null;
  try {
    const url = new URL(cleaned, baseUrl);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

/** Only the attributes listed in `HTML_KEPT_ATTRS`, trimmed. */
export function keptHtmlAttrs(attrs: Readonly<Record<string, string>>): Record<string, string> {
  return Object.fromEntries(
    HTML_KEPT_ATTRS.filter((k) => attrs[k]?.trim()).map((k) => [k, String(attrs[k]).trim()]),
  );
}

/** Registers a reference (reusing the number of a repeated URL) and returns its number. */
export function addHtmlRef(walk: HtmlWalk, ref: Omit<HtmlRef, 'n'>): number {
  const known = walk.refs.find((r) => r.url === ref.url);
  if (known) return known.n;
  const n = walk.refs.length + 1;
  walk.refs.push({ n, ...ref });
  return n;
}

/** Writes ` [link N]` (or `title [link N]` for media) in the text, when marks are on. */
export function markHtmlRef(walk: HtmlWalk, n: number, title?: string): void {
  if (!walk.options.marks) return;
  walk.out.push(title ? ` ${title} [link ${n}]` : ` [link ${n}]`);
}

/** Starts collecting the text of an `<a>` with a valid `href`. */
export function openHtmlAnchor(walk: HtmlWalk, attrs: Readonly<Record<string, string>>): void {
  const url = safeHttpUrl(attrs.href, walk.options.baseUrl);
  if (url) walk.anchor = { url, attrs: keptHtmlAttrs(attrs), textStart: walk.out.length };
}

/** Closes the open `<a>`: registers it with its text (or `title`/URL) and marks it. */
export function closeHtmlAnchor(walk: HtmlWalk): void {
  const a = walk.anchor;
  if (!a) return;
  walk.anchor = null;
  const text = walk.out.slice(a.textStart).join('').replace(/\s+/g, ' ').trim();
  const title = text !== '' ? text : (a.attrs.title ?? a.url);
  markHtmlRef(walk, addHtmlRef(walk, { tag: 'a', url: a.url, title, attrs: a.attrs }));
}

/** Registers a media tag (iframe, img, video...) with its URL and writes `title [link N]`. */
export function addHtmlMedia(
  walk: HtmlWalk,
  tag: string,
  attrs: Readonly<Record<string, string>>,
): void {
  const url = safeHttpUrl(attrs[HTML_MEDIA_TAGS[tag] ?? 'src'], walk.options.baseUrl);
  if (!url) return;
  const kept = keptHtmlAttrs(attrs);
  const title = kept.title ?? kept.alt ?? tag;
  markHtmlRef(walk, addHtmlRef(walk, { tag, url, title, attrs: kept }), title);
}

/** Handles an opening tag: skipped blocks, line breaks, bullets, links and media. */
export function openHtmlTag(
  walk: HtmlWalk,
  name: string,
  attrs: Readonly<Record<string, string>>,
): void {
  if (HTML_SKIPPED_TAGS.has(name)) walk.skipDepth += 1;
  if (walk.skipDepth > 0) return;
  if (name === 'br') walk.out.push('\n');
  else if (name === 'li') walk.out.push('• ');
  else if (name === 'a') openHtmlAnchor(walk, attrs);
  else if (name in HTML_MEDIA_TAGS) addHtmlMedia(walk, name, attrs);
}

/** Handles a closing tag: ends skipped blocks, links and block lines. */
export function closeHtmlTag(walk: HtmlWalk, name: string): void {
  if (HTML_SKIPPED_TAGS.has(name)) {
    walk.skipDepth = Math.max(0, walk.skipDepth - 1);
    return;
  }
  if (walk.skipDepth > 0) return;
  if (name === 'a') closeHtmlAnchor(walk);
  else if (HTML_BLOCK_TAGS.has(name)) walk.out.push('\n');
}

/** Applies `HTML_TEXT_CLEANUPS` and trims the ends. */
export function tidyHtmlText(raw: string): string {
  return HTML_TEXT_CLEANUPS.reduce((acc, [re, to]) => acc.replace(re, to), raw).trim();
}

/** Parses HTML into readable text and the list of its links and media (`[link N]` marks when asked). */
export function parseHtmlContent(
  html: string | null | undefined,
  options: HtmlParseOptions = {},
): HtmlContent {
  if (!html) return { text: '', refs: [] };
  const walk: HtmlWalk = { options, out: [], refs: [], skipDepth: 0, anchor: null };
  const parser = new Parser(
    {
      onopentag: (name, attrs) => {
        openHtmlTag(walk, name, attrs);
      },
      onclosetag: (name) => {
        closeHtmlTag(walk, name);
      },
      ontext: (text) => {
        if (walk.skipDepth === 0) walk.out.push(text);
      },
    },
    { decodeEntities: true, lowerCaseTags: true, lowerCaseAttributeNames: true },
  );
  parser.end(html);
  closeHtmlAnchor(walk);
  return { text: tidyHtmlText(walk.out.join('')), refs: walk.refs };
}

/** Converts HTML into plain text, keeping paragraphs and lists as line breaks (no link marks). */
export function htmlToText(html: string | null | undefined): string {
  return parseHtmlContent(html).text;
}
