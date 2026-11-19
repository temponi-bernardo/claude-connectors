import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it } from 'vitest';
import { FALLBACK_SERVER_VERSION } from '../../../src/mcp/server-version.js';
import { toToolResult, type ToolSpec } from '../../../src/mcp/tools.js';
import manifest from '../plugin/.claude-plugin/plugin.json' with { type: 'json' };
import type { CanvasContext } from './context.js';
import { fakeContext, type Routes } from './fixtures/fake-context.js';
import { CANVAS_INBOX_READ_TOOLS, CANVAS_INBOX_WRITE_TOOLS } from './tools-inbox.js';
import { CANVAS_READ_TOOLS } from './tools-read.js';
import { CANVAS_WRITE_TOOLS, submissionPayload } from './tools-write.js';
import { CANVAS_SERVER_INFO, canvasTools, createCanvasMcpServer } from './tools.js';

const READS = [...CANVAS_READ_TOOLS, ...CANVAS_INBOX_READ_TOOLS];
const WRITES = [...CANVAS_WRITE_TOOLS, ...CANVAS_INBOX_WRITE_TOOLS];
const ALL = [...READS, ...WRITES];

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

function toolNames(block: string | null): string[] {
  return canvasTools(block).map((t) => t.name);
}

describe('canvasTools', () => {
  it('lists the write tools whether writing is on or off and repeats no names', () => {
    expect(toolNames('off for a test')).toEqual(toolNames(null));
    expect(toolNames(null)).toContain('send_message');
    expect(new Set(toolNames(null)).size).toBe(toolNames(null).length);
  });

  it('makes each write tool refuse with the reason, without calling Canvas, when writing is off', async () => {
    const fake = fakeContext({});
    const off = canvasTools('reconnect to allow it');
    for (const spec of off.filter((t) => !t.annotations.readOnlyHint)) {
      expect(spec.description).toContain('UNAVAILABLE on this connection: reconnect to allow it');
      const result = toToolResult(await spec.run(fake.ctx, {}));
      expect(result.isError).toBe(true);
      expect(JSON.stringify(result.content)).toContain(`${spec.name} is unavailable`);
    }
    expect(fake.post).not.toHaveBeenCalled();
    expect(fake.upload).not.toHaveBeenCalled();
  });

  it('has no local login tools', () => {
    expect(toolNames(null)).toContain('upcoming_assignments');
    expect(toolNames(null)).not.toContain('conectar_canvas');
  });

  it('uses the English tool names, in order', () => {
    expect(toolNames(null)).toEqual([
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
      'list_linked_files',
      'read_file_text',
      'download_file',
      'list_discussions',
      'get_discussion',
      'get_calendar',
      'search',
      'find_recipients',
      'list_conversations',
      'get_conversation',
      'submit_text_assignment',
      'submit_file_assignment',
      'reply_to_discussion',
      'send_message',
      'reply_message',
      'prepare_attachment_upload',
    ]);
  });

  it('gives every tool a unique title; reads are read-only and writes are destructive', () => {
    const titles = ALL.map((t) => t.annotations.title);
    expect(new Set(titles).size).toBe(ALL.length);
    for (const spec of READS) expect(spec.annotations.readOnlyHint).toBe(true);
    for (const spec of WRITES) {
      const destructive = spec.name !== 'prepare_attachment_upload';
      expect(spec.annotations).toMatchObject({ readOnlyHint: false, destructiveHint: destructive });
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
    const server = createCanvasMcpServer(canvasTools(null), fakeContext({}).ctx);
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
    expect(all.result).toEqual([expect.objectContaining({ text: 'hi', links: [] })]);
    expect(all.result[0]).not.toHaveProperty('message_html');
    const raw = await run(
      'list_announcements',
      { course_id: 1, raw_html: true },
      { '/announcements': [{ id: 5, message: '<b>hi</b>' }] },
    );
    expect(raw.result).toEqual([expect.objectContaining({ message_html: '<b>hi</b>' })]);
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
    const listed = toToolResult(files.result).content;
    expect(JSON.parse((listed[0] as { text: string }).text)).toEqual([
      expect.objectContaining({ size_kb: 1 }),
    ]);
    expect((listed[1] as { text: string }).text).toContain('list_linked_files');
  });

  it('list_files with include_linked adds the files only the course content links to', async () => {
    const routes = {
      '/courses/1/files': [{ id: 1 }],
      '/courses/1/assignments': [{ id: 2, description: '<a href="/courses/1/files/9">hidden</a>' }],
      '/courses/1/pages': [],
      '/courses/1/discussion_topics': [],
      '/courses/1/modules': [],
    };
    const { result } = await run('list_files', { course_id: 1, include_linked: true }, routes);
    const content = toToolResult(result).content;
    expect((content[0] as { text: string }).text).toContain('"linked_only": true');
    expect((content[1] as { text: string }).text).toContain('1 file(s)');
  });

  it('list_linked_files returns the files and videos linked from the course', async () => {
    const routes = {
      '/courses/1/assignments': [
        { id: 2, name: 'A', description: '<iframe src="https://youtu.be/x"></iframe>' },
      ],
      '/courses/1/pages': [],
      '/courses/1/discussion_topics': [],
      '/courses/1/modules': [],
    };
    const { result } = await run('list_linked_files', { course_id: 1 }, routes);
    expect(result).toEqual([
      expect.objectContaining({
        type: 'video',
        provider: 'youtube',
        found_in: [expect.anything()],
      }),
    ]);
  });

  it('get_page encodes the page_url and converts the body', async () => {
    const { result } = await run(
      'get_page',
      { course_id: 1, page_url: 'a b' },
      { '/courses/1/pages/a%20b': { title: 'P', body: '<p>c</p>' } },
    );
    expect(result).toMatchObject({ title: 'P', body: 'c', links: [] });
    expect(result).not.toHaveProperty('body_html');
  });

  it('get_page returns the links of the body and the raw HTML when asked', async () => {
    const body = '<p><a href="/courses/1/files/3/download">slides</a></p>';
    const { result } = await run(
      'get_page',
      { course_id: 1, page_url: 'p', raw_html: true },
      { '/courses/1/pages/p': { title: 'P', body } },
    );
    expect(result).toMatchObject({
      body: 'slides [link 1]',
      links: [{ type: 'file', file_id: '3', course_id: '1' }],
      body_html: body,
    });
  });

  it('get_assignment returns the embedded file and video of the description', async () => {
    const description =
      '<p><a href="/courses/1/files/5?verifier=v" data-api-endpoint="https://x.test/api/v1/courses/1/files/5">Revisão</a></p><iframe title="Vídeo" src="/media_attachments_iframe/6?type=video"></iframe>';
    const routes = {
      '/courses/1/assignments/2': { id: 2, description },
      '/courses/1/assignments/2/submissions/self': new Error('none'),
    };
    const plain = await run('get_assignment', { course_id: 1, assignment_id: 2 }, routes);
    expect(plain.result).toMatchObject({
      description: 'Revisão [link 1]\n Vídeo [link 2]',
      links: [
        { n: 1, type: 'file', file_id: '5' },
        { n: 2, type: 'video', file_id: '6' },
      ],
    });
    expect(plain.result).not.toHaveProperty('description_html');
    const raw = await run(
      'get_assignment',
      { course_id: 1, assignment_id: 2, raw_html: true },
      routes,
    );
    expect(raw.result).toMatchObject({ description_html: description });
  });

  it('download_file and read_file_text accept a Canvas file url and use its course and verifier', async () => {
    const url = 'https://x.test/courses/1/files/5?verifier=v';
    const file = { display_name: 'a.md', url: 'u', 'content-type': 'text/markdown', size: 1 };
    const read = await run('read_file_text', { url }, { '/courses/1/files/5': file, u: 'hi' });
    expect(read.result).toBe('# a.md\n\nhi');
    const down = await run(
      'download_file',
      { url },
      { '/courses/1/files/5': new Error('403'), '/files/5': file, u: new Response('x') },
    );
    expect(down.get.mock.calls.map((c) => c[0])).toEqual(['/courses/1/files/5', '/files/5']);
    expect(toToolResult(down.result).content).toHaveLength(2);
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
      links: [],
      posts: [{ author: 'Ana', text: 'hi' }],
    });
    expect(ok.result).not.toHaveProperty('description_html');
    const raw = await run(
      'get_discussion',
      { course_id: 1, topic_id: 2, raw_html: true },
      { [base]: { id: 2, message: '<p>e</p>' }, [`${base}/view`]: {} },
    );
    expect(raw.result).toMatchObject({ description_html: '<p>e</p>' });
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

  it('submit_file_assignment uploads the text file and submits it', async () => {
    const base = '/courses/1/assignments/2';
    const { result, upload } = await run(
      'submit_file_assignment',
      { course_id: 1, assignment_id: 2, file_name: 'r.txt', content: 'hi' },
      {
        [base]: { id: 2, submission_types: ['online_upload'], allowed_extensions: ['txt'] },
        [`${base}/submissions/self/files`]: { upload_url: 'https://up.test/u' },
        'https://up.test/u': { id: 5, display_name: 'r.txt', size: 2 },
        [`${base}/submissions`]: { submitted_at: 'd', attempt: 1 },
      },
    );
    expect(upload.mock.calls[0]![1]).toMatchObject({ name: 'r.txt', contentType: 'text/plain' });
    expect(result).toMatchObject({ ok: true, file: { id: 5 } });
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
