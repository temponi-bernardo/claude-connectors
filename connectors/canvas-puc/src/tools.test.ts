import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it } from 'vitest';
import { FALLBACK_SERVER_VERSION } from '../../../src/mcp/server-version.js';
import { toToolResult, type ToolSpec } from '../../../src/mcp/tools.js';
import manifest from '../plugin/.claude-plugin/plugin.json' with { type: 'json' };
import type { CanvasContext } from './context.js';
import { fakeContext, type Routes } from './fixtures/fake-context.js';
import { CANVAS_READ_TOOLS } from './tools-read.js';
import { CANVAS_WRITE_TOOLS, submissionPayload } from './tools-write.js';
import { CANVAS_SERVER_INFO, canvasTools, createCanvasMcpServer } from './tools.js';

const ALL = [...CANVAS_READ_TOOLS, ...CANVAS_WRITE_TOOLS];

function tool(name: string): ToolSpec<CanvasContext> {
  const spec = ALL.find((t) => t.name === name);
  if (!spec) throw new Error(`unknown tool: ${name}`);
  return spec;
}

/** Runs a tool with the given routes and returns the result and the fake context. */
async function run(name: string, args: unknown, routes: Routes = {}) {
  const fake = fakeContext(routes);
  return { result: (await tool(name).run(fake.ctx, args)) as never, ...fake };
}

function toolNames(allowWrite: boolean): string[] {
  return canvasTools(allowWrite).map((t) => t.name);
}

describe('canvasTools', () => {
  it('includes write tools only when allowed and repeats no names', () => {
    expect(toolNames(false)).not.toContain('submit_text_assignment');
    expect(toolNames(true)).toContain('reply_to_discussion');
    expect(new Set(toolNames(true)).size).toBe(toolNames(true).length);
  });

  it('has no local login tools', () => {
    expect(toolNames(true)).toContain('upcoming_assignments');
    expect(toolNames(true)).not.toContain('conectar_canvas');
  });

  it('uses the English tool names, in order', () => {
    expect(toolNames(true)).toEqual([
      'whoami',
      'list_courses',
      'upcoming_assignments',
      'list_assignments',
      'get_assignment',
      'get_grades',
      'list_announcements',
      'list_modules',
      'get_page',
      'list_files',
      'read_file_text',
      'download_file',
      'list_discussions',
      'get_discussion',
      'get_calendar',
      'search',
      'submit_text_assignment',
      'reply_to_discussion',
    ]);
  });

  it('gives every tool a unique title; reads are read-only and writes are destructive', () => {
    const titles = ALL.map((t) => t.annotations.title);
    expect(new Set(titles).size).toBe(ALL.length);
    for (const spec of CANVAS_READ_TOOLS) expect(spec.annotations.readOnlyHint).toBe(true);
    for (const spec of CANVAS_WRITE_TOOLS) {
      expect(spec.annotations).toMatchObject({ readOnlyHint: false, destructiveHint: true });
    }
  });
});

describe('CANVAS_SERVER_INFO', () => {
  it('announces the version of the plugin manifest', () => {
    expect(CANVAS_SERVER_INFO.version).toBe(manifest.version);
    expect(CANVAS_SERVER_INFO.version).not.toBe(FALLBACK_SERVER_VERSION);
  });
});

describe('createCanvasMcpServer', () => {
  it('creates the MCP server with the tools registered', () => {
    const server = createCanvasMcpServer(canvasTools(false), fakeContext({}).ctx);
    expect(server).toBeInstanceOf(McpServer);
    expect(server.isConnected()).toBe(false);
  });
});

describe('read tools', () => {
  it('whoami maps the profile', async () => {
    const { result } = await run('whoami', {}, { '/users/self/profile': { id: 1, name: 'Ana' } });
    expect(result).toMatchObject({ id: 1, name: 'Ana' });
  });

  it('list_courses filters active ones by default and skips courses without a name', async () => {
    const { result, getAll } = await run(
      'list_courses',
      {},
      { '/courses': [{ id: 1, name: 'A' }, { id: 2 }] },
    );
    expect(result).toHaveLength(1);
    expect(getAll.mock.calls[0]![1]).toMatchObject({ enrollment_state: 'active' });
    const all = await run('list_courses', { include_completed: true }, { '/courses': [] });
    expect(all.getAll.mock.calls[0]![1]).toMatchObject({ enrollment_state: undefined });
  });

  it('upcoming_assignments uses the day window starting now', async () => {
    const { result, getAll } = await run(
      'upcoming_assignments',
      { days: 7 },
      { '/planner/items': [{ html_url: '/x' }] },
    );
    expect(getAll.mock.calls[0]![1]).toEqual({
      start_date: '2026-11-05T12:00:00.000Z',
      end_date: '2026-11-12T12:00:00.000Z',
    });
    expect(result).toEqual([expect.objectContaining({ url: 'https://x.test/x' })]);
    const byDefault = await run('upcoming_assignments', {}, { '/planner/items': [] });
    expect(byDefault.getAll.mock.calls[0]![1]).toMatchObject({
      end_date: '2026-11-19T12:00:00.000Z',
    });
  });

  it('list_assignments maps the filter to a bucket', async () => {
    const routes = { '/courses/1/assignments': [{ id: 9, name: 'T' }] };
    const { result, getAll } = await run(
      'list_assignments',
      { course_id: 1, filter: 'overdue' },
      routes,
    );
    expect(getAll.mock.calls[0]![1]).toMatchObject({ bucket: 'overdue' });
    expect(result).toEqual([expect.objectContaining({ id: 9 })]);
    expect(
      (await run('list_assignments', { course_id: 1 }, routes)).getAll.mock.calls[0]![1],
    ).toMatchObject({ bucket: undefined });
  });

  it('get_assignment combines the assignment and the submission', async () => {
    const { result } = await run(
      'get_assignment',
      { course_id: 1, assignment_id: 2 },
      {
        '/courses/1/assignments/2': { id: 2, description: '<p>X</p>' },
        '/courses/1/assignments/2/submissions/self': { score: 5 },
      },
    );
    expect(result).toMatchObject({ description: 'X', submission: { score: 5 } });
  });

  it('get_grades without a course summarizes the enrollments with the course name', async () => {
    const { result } = await run(
      'get_grades',
      {},
      {
        '/users/self/enrollments': [{ course_id: 1, grades: { current_score: 90 } }],
        '/courses': [{ id: 1, name: 'Graphs' }],
      },
    );
    expect(result).toEqual([expect.objectContaining({ course: 'Graphs', current_score: 90 })]);
  });

  it('get_grades with a course lists the graded assignments', async () => {
    const { result } = await run(
      'get_grades',
      { course_id: 1 },
      {
        '/courses/1/students/submissions': [
          { score: 7, assignment: { id: 1, name: 'T' } },
          { score: 1 },
        ],
      },
    );
    expect(result).toEqual([expect.objectContaining({ assignment: 'T', score: 7 })]);
  });

  it('list_announcements searches the active courses or the given course', async () => {
    const all = await run(
      'list_announcements',
      {},
      { '/courses': [{ id: 1 }], '/announcements': [{ id: 5, message: 'hi' }] },
    );
    expect(all.getAll.mock.calls[1]![1]).toMatchObject({
      context_codes: ['course_1'],
      start_date: '2026-10-06T12:00:00.000Z',
    });
    expect(all.result).toEqual([expect.objectContaining({ text: 'hi' })]);
    const one = await run(
      'list_announcements',
      { course_id: 3, days: 1 },
      { '/announcements': [] },
    );
    expect(one.getAll.mock.calls[0]![1]).toMatchObject({ context_codes: ['course_3'] });
    expect((await run('list_announcements', {}, { '/courses': [] })).result).toEqual([]);
  });

  it('list_modules, list_discussions and list_files map the lists', async () => {
    expect(
      (
        await run(
          'list_modules',
          { course_id: 1 },
          { '/courses/1/modules': [{ id: 1, name: 'M' }] },
        )
      ).result,
    ).toEqual([expect.objectContaining({ name: 'M' })]);
    expect(
      (
        await run(
          'list_discussions',
          { course_id: 1 },
          { '/courses/1/discussion_topics': [{ id: 1 }] },
        )
      ).result,
    ).toHaveLength(1);
    const files = await run(
      'list_files',
      { course_id: 1, search: 'pdf' },
      { '/courses/1/files': [{ id: 1, size: 1024 }] },
    );
    expect(files.getAll.mock.calls[0]![1]).toMatchObject({ search_term: 'pdf' });
    expect(files.result).toEqual([expect.objectContaining({ size_kb: 1 })]);
  });

  it('get_page encodes the page_url and converts the body', async () => {
    const { result } = await run(
      'get_page',
      { course_id: 1, page_url: 'a b' },
      { '/courses/1/pages/a%20b': { title: 'P', body: '<p>c</p>' } },
    );
    expect(result).toMatchObject({ title: 'P', body: 'c' });
  });

  it('read_file_text reads text, converts HTML and returns the link for binaries', async () => {
    const txt = await run(
      'read_file_text',
      { file_id: 1 },
      {
        '/files/1': { display_name: 'a.md', url: 'u', 'content-type': 'text/markdown' },
        u: 'content',
      },
    );
    expect(txt.result).toBe('# a.md\n\ncontent');
    const pdf = await run(
      'read_file_text',
      { file_id: 3 },
      { '/files/3': { display_name: 'a.pdf', url: 'p', 'content-type': 'application/pdf' } },
    );
    expect(pdf.result).toBe(
      '"a.pdf" is application/pdf; use `download_file` to bring its content or download it from the link: p',
    );
  });

  it('download_file brings the content or explains why it did not download', async () => {
    const ok = await run(
      'download_file',
      { file_id: 5 },
      {
        '/files/5': { display_name: 'a.pdf', url: 'p', 'content-type': 'application/pdf', size: 3 },
        p: new Response(new Uint8Array([1, 2, 3])),
      },
    );
    expect(toToolResult(ok.result).content[1]).toMatchObject({ type: 'resource' });
    const noLink = await run('download_file', { file_id: 6 }, { '/files/6': {} });
    expect(noLink.result).toContain('has no download link');
  });

  it('get_discussion flattens the posts and tolerates a failing view', async () => {
    const base = '/courses/1/discussion_topics/2';
    const ok = await run(
      'get_discussion',
      { course_id: 1, topic_id: 2 },
      {
        [base]: { id: 2, title: 'F', message: '<p>e</p>' },
        [`${base}/view`]: {
          participants: [{ id: 1, display_name: 'Ana' }],
          view: [{ user_id: 1, message: 'hi' }],
        },
      },
    );
    expect(ok.result).toMatchObject({
      title: 'F',
      description: 'e',
      posts: [{ author: 'Ana', text: 'hi' }],
    });
    const noView = await run(
      'get_discussion',
      { course_id: 1, topic_id: 2 },
      { [base]: { id: 2 }, [`${base}/view`]: new Error('x') },
    );
    expect(noView.result).toMatchObject({ posts: [] });
  });

  it('get_calendar uses today and +30 days by default', async () => {
    const { getAll } = await run(
      'get_calendar',
      {},
      { '/courses': [{ id: 1 }], '/calendar_events': [{ title: 'E' }] },
    );
    expect(getAll.mock.calls[1]![1]).toMatchObject({
      start_date: '2026-11-05',
      end_date: '2026-12-05',
      context_codes: ['user_self', 'course_1'],
    });
    const dates = await run(
      'get_calendar',
      { start_date: '2026-01-01', end_date: '2026-02-01' },
      { '/courses': [], '/calendar_events': [] },
    );
    expect(dates.getAll.mock.calls[1]![1]).toMatchObject({
      start_date: '2026-01-01',
      end_date: '2026-02-01',
    });
  });

  it('search combines the lookups and tolerates partial failures', async () => {
    const { result } = await run(
      'search',
      { course_id: 1, term: 'graph' },
      {
        '/courses/1/assignments': [{ id: 1, name: 'Graph' }],
        '/courses/1/pages': new Error('no pages'),
        '/courses/1/files': [],
        '/courses/1/modules': [{ id: 1, name: 'M', items: [{ id: 2, title: 'graphs' }] }],
      },
    );
    expect(result).toMatchObject({
      assignments: [{ id: 1 }],
      pages: [],
      module_items: [{ title: 'graphs' }],
    });
  });
});

describe('write tools', () => {
  it('submissionPayload builds a text or link entry', () => {
    expect(submissionPayload('text', 'a')).toEqual({
      submission: { submission_type: 'online_text_entry', body: 'a' },
    });
    expect(submissionPayload('url', 'u')).toEqual({
      submission: { submission_type: 'online_url', url: 'u' },
    });
  });

  it('submit_text_assignment sends the submission', async () => {
    const path = '/courses/1/assignments/2/submissions';
    const { result, post } = await run(
      'submit_text_assignment',
      { course_id: 1, assignment_id: 2, type: 'url', content: 'u' },
      { [path]: { submitted_at: 'd', attempt: 1 } },
    );
    expect(post).toHaveBeenCalledWith(path, submissionPayload('url', 'u'));
    expect(result).toEqual({ ok: true, submitted_at: 'd', attempt: 1 });
  });

  it('reply_to_discussion posts the message', async () => {
    const path = '/courses/1/discussion_topics/2/entries';
    const { result, post } = await run(
      'reply_to_discussion',
      { course_id: 1, topic_id: 2, message: 'hi' },
      { [path]: { id: 9, created_at: 'd' } },
    );
    expect(post).toHaveBeenCalledWith(path, { message: 'hi' });
    expect(result).toEqual({ ok: true, id: 9, created_at: 'd' });
  });

  it('rejects invalid arguments', async () => {
    await expect(
      run('reply_to_discussion', { course_id: 1, topic_id: 2, message: '' }),
    ).rejects.toThrow();
  });
});
