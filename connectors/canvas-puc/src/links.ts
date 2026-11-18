/**
 * Links and media of Canvas HTML (assignment descriptions, pages, forums, announcements): classifies each
 * reference found by the HTML parser as a Canvas file, video, page etc., with the ids needed to open it.
 * Pure: never fetches anything. Only the Canvas host and the video providers in `VIDEO_PROVIDERS` are marked
 * `followable`; any other link is only reported.
 */
import { parseHtmlContent, safeHttpUrl, type HtmlRef } from '../../../src/core/html.js';

/** Kind of a link found in Canvas HTML. */
export type CanvasLinkType =
  | 'file'
  | 'video'
  | 'image'
  | 'page'
  | 'assignment'
  | 'discussion'
  | 'quiz'
  | 'module'
  | 'canvas'
  | 'external';

/** A classified link, as returned to the model in `links`. */
export interface CanvasLink {
  readonly n: number;
  readonly type: CanvasLinkType;
  readonly title: string;
  readonly url: string;
  readonly file_id?: string;
  readonly course_id?: string;
  readonly page_url?: string;
  readonly assignment_id?: string;
  readonly media_id?: string;
  readonly provider?: string;
  /** `true` only for the Canvas host and known video providers; other links are never fetched. */
  readonly followable: boolean;
}

/** Canvas HTML turned into text with `[link N]` marks and its classified links. */
export interface CanvasHtml {
  readonly text: string;
  readonly links: readonly CanvasLink[];
}

/** What a Canvas URL points to (ids only, no title). */
export interface CanvasTarget {
  readonly type: CanvasLinkType;
  readonly course_id?: string;
  readonly file_id?: string;
  readonly page_url?: string;
  readonly assignment_id?: string;
  readonly media_id?: string;
}

/** Video providers whose links are followable; `embedOnly` ones count as video only inside a player tag. */
export const VIDEO_PROVIDERS: readonly {
  readonly provider: string;
  readonly domains: readonly string[];
  readonly embedOnly: boolean;
}[] = [
  {
    provider: 'youtube',
    domains: ['youtube.com', 'youtu.be', 'youtube-nocookie.com'],
    embedOnly: false,
  },
  { provider: 'vimeo', domains: ['vimeo.com'], embedOnly: false },
  { provider: 'panopto', domains: ['panopto.com', 'panopto.eu'], embedOnly: false },
  { provider: 'microsoft_stream', domains: ['microsoftstream.com'], embedOnly: false },
  { provider: 'sharepoint', domains: ['sharepoint.com'], embedOnly: true },
  { provider: 'google_drive', domains: ['drive.google.com', 'docs.google.com'], embedOnly: true },
];

/** Tags that play media: a link found in them is a video when it points to a provider or a Canvas file. */
export const PLAYER_TAGS: ReadonlySet<string> = new Set([
  'iframe',
  'video',
  'audio',
  'source',
  'embed',
]);

/** Canvas URL paths and what they point to; the groups are, in order, the fields named in `keys`. */
export const CANVAS_PATH_PATTERNS: readonly {
  readonly re: RegExp;
  readonly type: CanvasLinkType;
  readonly keys: readonly (keyof CanvasTarget)[];
}[] = [
  {
    re: /^\/(?:api\/v1\/)?courses\/(\d+)\/files\/(\d+)/,
    type: 'file',
    keys: ['course_id', 'file_id'],
  },
  { re: /^\/(?:api\/v1\/)?(?:users\/\d+\/)?files\/(\d+)/, type: 'file', keys: ['file_id'] },
  { re: /^\/media_attachments(?:_iframe)?\/(\d+)/, type: 'video', keys: ['file_id'] },
  { re: /^\/(?:api\/v1\/)?media_objects(?:_iframe)?\/([\w-]+)/, type: 'video', keys: ['media_id'] },
  {
    re: /^\/(?:api\/v1\/)?courses\/(\d+)\/pages\/([^/?#]+)/,
    type: 'page',
    keys: ['course_id', 'page_url'],
  },
  {
    re: /^\/(?:api\/v1\/)?courses\/(\d+)\/assignments\/(\d+)/,
    type: 'assignment',
    keys: ['course_id', 'assignment_id'],
  },
  {
    re: /^\/(?:api\/v1\/)?courses\/(\d+)\/discussion_topics\/\d+/,
    type: 'discussion',
    keys: ['course_id'],
  },
  { re: /^\/(?:api\/v1\/)?courses\/(\d+)\/quizzes\/\d+/, type: 'quiz', keys: ['course_id'] },
  { re: /^\/(?:api\/v1\/)?courses\/(\d+)\/modules/, type: 'module', keys: ['course_id'] },
];

/** Says whether `host` is `domain` or one of its subdomains. */
export function hostMatches(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

/** Says whether the URL is on the connector's Canvas (same host as `baseUrl`). */
export function isCanvasUrl(url: URL, baseUrl: string): boolean {
  return url.host === new URL(baseUrl).host;
}

/** Video provider of a URL (`youtube`, `vimeo`...), or `null`; `embedOnly` ones need a player tag. */
export function videoProviderOf(url: URL, tag: string): string | null {
  const found = VIDEO_PROVIDERS.find((p) => p.domains.some((d) => hostMatches(url.hostname, d)));
  if (!found || (found.embedOnly && !PLAYER_TAGS.has(tag))) return null;
  return found.provider;
}

/** What a Canvas path points to, from `CANVAS_PATH_PATTERNS`, or `null` for any other Canvas path. */
export function canvasTargetOf(pathname: string): CanvasTarget | null {
  for (const { re, type, keys } of CANVAS_PATH_PATTERNS) {
    const m = re.exec(pathname);
    if (!m) continue;
    const ids = keys.map((k, i) => [k, decodeURIComponent(m[i + 1] ?? '')] as const);
    return { type, ...Object.fromEntries(ids) };
  }
  return null;
}

/** Target of a Canvas reference: the `data-api-endpoint` the editor adds wins over the `href`. */
export function canvasRefTarget(ref: HtmlRef, baseUrl: string): CanvasTarget {
  const endpoint = safeHttpUrl(ref.attrs['data-api-endpoint'], baseUrl);
  const fromEndpoint =
    endpoint && isCanvasUrl(new URL(endpoint), baseUrl)
      ? canvasTargetOf(new URL(endpoint).pathname)
      : null;
  const target = fromEndpoint ?? canvasTargetOf(new URL(ref.url).pathname) ?? { type: 'canvas' };
  if (target.type !== 'file') return target;
  if (ref.tag === 'img') return { ...target, type: 'image' };
  return PLAYER_TAGS.has(ref.tag) ? { ...target, type: 'video' } : target;
}

/** Classifies one reference: Canvas target, video provider, image or external link. */
export function classifyCanvasRef(ref: HtmlRef, baseUrl: string): CanvasLink {
  const head = { n: ref.n, title: ref.title, url: ref.url };
  const url = new URL(ref.url);
  if (isCanvasUrl(url, baseUrl)) {
    const mediaId = ref.attrs['data-media-id'];
    const media = mediaId ? { media_id: mediaId } : {};
    return { ...head, ...media, ...canvasRefTarget(ref, baseUrl), followable: true };
  }
  const provider = videoProviderOf(url, ref.tag);
  if (provider) return { ...head, type: 'video', provider, followable: true };
  return { ...head, type: ref.tag === 'img' ? 'image' : 'external', followable: false };
}

/** Converts Canvas HTML into text with `title [link N]` marks and the list of classified links. */
export function canvasHtml(html: string | null | undefined, baseUrl: string): CanvasHtml {
  const { text, refs } = parseHtmlContent(html, { baseUrl, marks: true });
  return { text, links: refs.map((r) => classifyCanvasRef(r, baseUrl)) };
}

/** Hides the `verifier` (a capability that opens the file without login) of URLs inside a text, for errors and logs. */
export function redactVerifier(text: string): string {
  return text.replace(/([?&]verifier=)[^&#\s"']+/gi, '$1[hidden]');
}
