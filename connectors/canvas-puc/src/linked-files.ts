/**
 * `list_linked_files`: every file and video a course's content points to (assignment descriptions, pages,
 * forums, announcements and module items), deduplicated by file id. Covers files the teacher embedded in a
 * prompt but hid from the Files area, which `list_files` cannot show.
 */
import type {
  CanvasAssignment,
  CanvasDiscussionTopic,
  CanvasModule,
  CanvasModuleItem,
  CanvasPage,
  Id,
} from './canvas-types.js';
import { rawToolResult, textResult, type RawToolResult } from '../../../src/mcp/tools.js';
import type { CanvasClient } from './client.js';
import type { View } from './format.js';
import { getAllOrEmpty } from './helpers.js';
import { canvasHtml, classifyCanvasRef, type CanvasLink } from './links.js';

/** Where a link was found. */
export interface LinkOrigin {
  readonly kind: 'assignment' | 'page' | 'discussion' | 'announcement' | 'module';
  readonly id: string;
  readonly title: string;
}

/** A piece of course content with HTML. */
export interface LinkSource extends LinkOrigin {
  readonly html: string | null | undefined;
}

/** A file or video referenced by the course content, with every place it appears. */
export interface LinkedFile {
  readonly type: CanvasLink['type'];
  readonly title: string;
  readonly url: string;
  readonly file_id?: string | undefined;
  readonly media_id?: string | undefined;
  readonly provider?: string | undefined;
  readonly found_in: LinkOrigin[];
}

/** Links found in one origin. */
export interface OriginLinks {
  readonly origin: LinkOrigin;
  readonly links: readonly CanvasLink[];
}

/** Says whether a link is a file or a video (what `list_linked_files` returns). */
export function isLinkedFileLink(link: CanvasLink): boolean {
  return link.type === 'file' || link.type === 'video';
}

/** Dedupe key of a linked file: the file id, the media id or, for provider videos, the URL. */
export function linkedFileKey(link: CanvasLink): string {
  if (link.file_id) return `file:${link.file_id}`;
  return link.media_id ? `media:${link.media_id}` : `url:${link.url}`;
}

/** The file/video links of a module item: a `File` item, or an external URL of a video provider. */
export function moduleItemLinks(item: CanvasModuleItem, baseUrl: string): CanvasLink[] {
  const title = item.title ?? '';
  if (item.type === 'File' && item.content_id !== undefined) {
    const fileId = String(item.content_id);
    const url = `${baseUrl}/files/${fileId}`;
    return [{ n: 0, type: 'file', title, url, file_id: fileId, followable: true }];
  }
  if (item.type !== 'ExternalUrl' || !item.external_url) return [];
  const ref = { n: 0, tag: 'a', url: item.external_url, title, attrs: {} };
  return [classifyCanvasRef(ref, baseUrl)].filter((l) => l.type === 'video');
}

/** Links of every origin: the HTML sources and the module items. */
export function originLinks(
  sources: readonly LinkSource[],
  modules: readonly CanvasModule[],
  baseUrl: string,
): OriginLinks[] {
  const fromHtml = sources.map(({ html, ...origin }) => ({
    origin,
    links: canvasHtml(html, baseUrl).links,
  }));
  const fromModules = modules.flatMap((m) =>
    (m.items ?? []).map((item) => ({
      origin: { kind: 'module' as const, id: String(m.id), title: m.name ?? '' },
      links: moduleItemLinks(item, baseUrl),
    })),
  );
  return [...fromHtml, ...fromModules];
}

/** Merges the file/video links of every origin, one entry per file (or video) with all its origins. */
export function collectLinkedFiles(groups: readonly OriginLinks[]): LinkedFile[] {
  const byKey = new Map<string, LinkedFile>();
  for (const { origin, links } of groups) {
    for (const link of links.filter(isLinkedFileLink)) {
      const key = linkedFileKey(link);
      const known = byKey.get(key);
      if (known) known.found_in.push(origin);
      else byKey.set(key, toLinkedFile(link, origin));
    }
  }
  return [...byKey.values()];
}

/** First sighting of a file/video link. */
export function toLinkedFile(link: CanvasLink, origin: LinkOrigin): LinkedFile {
  return {
    type: link.type,
    title: link.title,
    url: link.url,
    file_id: link.file_id,
    media_id: link.media_id,
    provider: link.provider,
    found_in: [origin],
  };
}

/** Course content with HTML as link sources: assignments, pages (with body), forums and announcements. */
export async function fetchLinkSources(client: CanvasClient, courseId: Id): Promise<LinkSource[]> {
  const base = `/courses/${String(courseId)}`;
  const [assignments, pages, topics, news] = await Promise.all([
    getAllOrEmpty<CanvasAssignment>(client, `${base}/assignments`, {}),
    getAllOrEmpty<CanvasPage>(client, `${base}/pages`, { include: ['body'] }),
    getAllOrEmpty<CanvasDiscussionTopic>(client, `${base}/discussion_topics`, {}),
    getAllOrEmpty<CanvasDiscussionTopic>(client, `${base}/discussion_topics`, {
      only_announcements: 'true',
    }),
  ]);
  return [
    ...assignments.map((a) => linkSource('assignment', [a.id, a.name, a.description])),
    ...pages.map((p) => linkSource('page', [p.url, p.title, p.body])),
    ...topics.map((t) => linkSource('discussion', [t.id, t.title, t.message])),
    ...news.map((t) => linkSource('announcement', [t.id, t.title, t.message])),
  ];
}

/** Builds a `LinkSource` from its kind and `[id, title, html]`. */
export function linkSource(
  kind: LinkOrigin['kind'],
  [id, title, html]: readonly [Id | undefined, string | undefined, string | null | undefined],
): LinkSource {
  return { kind, id: String(id ?? ''), title: title ?? '', html };
}

/** Every file and video the course content points to, deduplicated (lookups that fail count as empty). */
export async function listLinkedFiles(client: CanvasClient, courseId: Id): Promise<LinkedFile[]> {
  const [sources, modules] = await Promise.all([
    fetchLinkSources(client, courseId),
    getAllOrEmpty<CanvasModule>(client, `/courses/${String(courseId)}/modules`, {
      include: ['items'],
    }),
  ]);
  return collectLinkedFiles(originLinks(sources, modules, client.baseUrl));
}

/** Note added to every `list_files` answer: Canvas hides some files from students, and where to find them. */
export const LIST_FILES_HINT =
  'Note: Canvas does not list hidden or locked files to students, nor files in hidden folders, and does not say how many there are. Teachers often embed such files in assignments and pages: get_assignment and get_page return them in `links`, list_linked_files (or list_files with include_linked: true) gathers them for the whole course, and download_file/read_file_text open them by file_id or url.';

/** The linked files missing from the listing, as listing rows marked `linked_only`. */
export function linkedOnlyRows(listed: readonly View[], linked: readonly LinkedFile[]): View[] {
  const ids = new Set(listed.map((row) => String(row.id)));
  return linked
    .filter((l) => l.file_id !== undefined && !ids.has(l.file_id))
    .map((l) => ({
      id: l.file_id,
      name: l.title,
      type: l.type,
      url: l.url,
      linked_only: true,
      found_in: l.found_in,
    }));
}

/** Note of `list_files` with `include_linked`: how many linked files the listing was missing. */
export function linkedOnlyNote(count: number): string {
  if (count === 0) return 'Every file linked from the course content is already in this list.';
  return `${count} file(s) linked from the course content are not in the Files list (hidden or locked for students). They are marked linked_only: true; open them with download_file or read_file_text (file_id or url).`;
}

/** `list_files` with `include_linked`: the listing plus the linked files it misses, and a note saying how many. */
export async function listFilesWithLinked(
  client: CanvasClient,
  courseId: Id,
  listed: readonly View[],
): Promise<RawToolResult> {
  const extra = linkedOnlyRows(listed, await listLinkedFiles(client, courseId));
  return rawToolResult(textResult([...listed, ...extra], [linkedOnlyNote(extra.length)]));
}
