/**
 * Finds a Canvas file from a `file_id` and/or a Canvas link, even when the file is hidden from `list_files`
 * (teachers embed hidden files in assignment descriptions): tries the course endpoint, the global one and,
 * when the link carries one, the `verifier`, and says which endpoint failed and why.
 */
import type { CanvasAttachment, Id } from './canvas-types.js';
import { canvasErrorStatus, type CanvasApiError, type CanvasClient } from './client.js';
import { canvasTargetOf, isCanvasUrl } from './links.js';

/** File arguments of `download_file` and `read_file_text`. */
export interface FileRefArgs {
  readonly file_id?: Id | undefined;
  readonly url?: string | undefined;
  readonly course_id?: Id | undefined;
}

/** A file to look up: its id, the course when known and the link's `verifier` when there is one. */
export interface CanvasFileRef {
  readonly fileId: string;
  readonly courseId?: string | undefined;
  readonly verifier?: string | undefined;
}

/** One API call of the lookup; `label` is what the error shows (never the verifier). */
export interface FileLookup {
  readonly path: string;
  readonly params: Readonly<Record<string, string>>;
  readonly label: string;
}

/** A lookup that failed and its HTTP status (`null` for a network or unknown error). */
export interface FileLookupFailure {
  readonly label: string;
  readonly status: number | null;
}

/** Reads the file id, course and verifier of a Canvas file link; throws for other hosts or non-file links. */
export function fileRefFromUrl(raw: string, baseUrl: string): CanvasFileRef {
  let url: URL;
  try {
    url = new URL(raw, baseUrl);
  } catch {
    throw new Error(
      'The url is not a valid link. Pass the url from the `links` of get_assignment or get_page.',
    );
  }
  if (!isCanvasUrl(url, baseUrl)) {
    throw new Error(
      `Only links of ${baseUrl} can be opened as files; other links are only reported.`,
    );
  }
  const target = canvasTargetOf(url.pathname);
  if (!target?.file_id) {
    throw new Error(
      'The url does not point to a Canvas file (expected /files/<id> or /courses/<id>/files/<id>).',
    );
  }
  const verifier = url.searchParams.get('verifier') ?? undefined;
  return { fileId: target.file_id, courseId: target.course_id, verifier };
}

/** Builds the file reference from `file_id`, `url` or both (they must agree); `course_id` fills the course. */
export function fileRefFromArgs(args: FileRefArgs, baseUrl: string): CanvasFileRef {
  const courseId = args.course_id === undefined ? undefined : String(args.course_id);
  if (args.url !== undefined) {
    const ref = fileRefFromUrl(args.url, baseUrl);
    if (args.file_id !== undefined && String(args.file_id) !== ref.fileId) {
      throw new Error(
        `file_id ${String(args.file_id)} does not match the file of the url (${ref.fileId}).`,
      );
    }
    return { ...ref, courseId: courseId ?? ref.courseId };
  }
  if (args.file_id === undefined) {
    throw new Error(
      'Pass file_id or url (a Canvas file link from the `links` of get_assignment or get_page).',
    );
  }
  return { fileId: String(args.file_id), courseId };
}

/** The lookups to try, in order: course files, global files and, with a verifier, global files with it. */
export function fileLookupPlan(ref: CanvasFileRef): FileLookup[] {
  const id = ref.fileId;
  const plan: FileLookup[] = [];
  if (ref.courseId) {
    const path = `/courses/${ref.courseId}/files/${id}`;
    plan.push({ path, params: {}, label: `GET /api/v1${path}` });
  }
  plan.push({ path: `/files/${id}`, params: {}, label: `GET /api/v1/files/${id}` });
  if (ref.verifier) {
    const label = `GET /api/v1/files/${id}?verifier=[hidden]`;
    plan.push({ path: `/files/${id}`, params: { verifier: ref.verifier }, label });
  }
  return plan;
}

/** Plain explanation of why Canvas refused a file lookup. */
export function fileAccessReason(status: number | null): string {
  if (status === 401)
    return 'not authorized: the file is hidden, locked or in a folder students cannot open';
  if (status === 403)
    return 'forbidden: the file is locked (date or module requirement) or restricted';
  if (status === 404)
    return 'not found: the file was deleted, the id is wrong or it belongs to another course';
  return status === null ? 'request failed before Canvas answered' : `Canvas answered ${status}`;
}

/** Error text listing every endpoint tried, its status and the reason. */
export function fileAccessError(
  ref: CanvasFileRef,
  failures: readonly FileLookupFailure[],
): string {
  const lines = failures.map(
    (f) => `- ${f.label} → ${f.status ?? 'error'} (${fileAccessReason(f.status)})`,
  );
  const hint = ref.verifier
    ? ''
    : '\nIf the file came from a link in an assignment or page, pass that full url: its verifier may open it.';
  return `Could not open Canvas file ${ref.fileId}:\n${lines.join('\n')}${hint}`;
}

/** Looks the file up through `fileLookupPlan` until one works; a rejected token stops at once. */
export async function resolveCanvasFile(
  client: CanvasClient,
  args: FileRefArgs,
): Promise<CanvasAttachment> {
  const ref = fileRefFromArgs(args, client.baseUrl);
  const failures: FileLookupFailure[] = [];
  for (const lookup of fileLookupPlan(ref)) {
    try {
      return await client.get<CanvasAttachment>(lookup.path, lookup.params);
    } catch (error) {
      if ((error as Partial<CanvasApiError>).tokenRejected) throw error;
      failures.push({ label: lookup.label, status: canvasErrorStatus(error) });
    }
  }
  throw new Error(fileAccessError(ref, failures));
}
