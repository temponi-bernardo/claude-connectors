import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it } from 'vitest';
import type { ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasContext } from './context.js';
import { fakeContext, type Routes } from './fixtures/fake-context.js';
import { CANVAS_READ_TOOLS } from './tools-read.js';
import { CANVAS_WRITE_TOOLS, submissionPayload } from './tools-write.js';
import {
  CANVAS_ACCOUNT_TOOLS,
  canvasServiceTools,
  canvasTools,
  createCanvasMcpServer,
} from './tools.js';

const ALL = [...CANVAS_ACCOUNT_TOOLS, ...CANVAS_READ_TOOLS, ...CANVAS_WRITE_TOOLS];

function tool(name: string): ToolSpec<CanvasContext> {
  const spec = ALL.find((t) => t.name === name);
  if (!spec) throw new Error(`ferramenta inexistente: ${name}`);
  return spec;
}

/** Roda uma ferramenta com as rotas dadas e devolve o resultado e o contexto falso. */
async function run(name: string, args: unknown, routes: Routes = {}) {
  const fake = fakeContext(routes);
  return { result: (await tool(name).run(fake.ctx, args)) as never, ...fake };
}

function toolNames(allowWrite: boolean): string[] {
  return canvasTools(allowWrite).map((t) => t.name);
}

describe('canvasTools', () => {
  it('inclui escrita só quando permitido e não repete nomes', () => {
    expect(toolNames(false)).not.toContain('entregar_tarefa_texto');
    expect(toolNames(true)).toContain('responder_discussao');
    expect(new Set(toolNames(true)).size).toBe(toolNames(true).length);
  });
});

describe('canvasServiceTools', () => {
  it('traz leitura e escrita, sem as ferramentas de conexão', () => {
    const names = canvasServiceTools(true).map((t) => t.name);
    expect(names).toContain('proximas_entregas');
    expect(names).toContain('entregar_tarefa_texto');
    expect(names).not.toContain('conectar_canvas');
    expect(canvasServiceTools(false).map((t) => t.name)).not.toContain('entregar_tarefa_texto');
  });
});

describe('createCanvasMcpServer', () => {
  it('cria o servidor MCP com as ferramentas registradas', () => {
    const server = createCanvasMcpServer(canvasServiceTools(false), fakeContext({}).ctx);
    expect(server).toBeInstanceOf(McpServer);
    expect(server.isConnected()).toBe(false);
  });
});

describe('ferramentas de conexão', () => {
  it('conectar_canvas abre o login e confirma com o nome do perfil', async () => {
    const { result, auth } = await run(
      'conectar_canvas',
      {},
      { '/users/self/profile': { id: 1, name: 'Ana' } },
    );
    expect(auth.connect).toHaveBeenCalled();
    expect(result).toBe('Conectado ao Canvas como Ana (1 cookies salvos).');
  });

  it('desconectar_canvas apaga a sessão', async () => {
    const { result, auth } = await run('desconectar_canvas', {});
    expect(auth.disconnect).toHaveBeenCalled();
    expect(result).toContain('apagada');
  });
});

describe('ferramentas de leitura', () => {
  it('quem_sou_eu traduz o perfil', async () => {
    const { result } = await run(
      'quem_sou_eu',
      {},
      { '/users/self/profile': { id: 1, name: 'Ana' } },
    );
    expect(result).toMatchObject({ id: 1, nome: 'Ana' });
  });

  it('listar_cursos filtra ativos por padrão e ignora cursos sem nome', async () => {
    const { result, getAll } = await run(
      'listar_cursos',
      {},
      { '/courses': [{ id: 1, name: 'A' }, { id: 2 }] },
    );
    expect(result).toHaveLength(1);
    expect(getAll.mock.calls[0]![1]).toMatchObject({ enrollment_state: 'active' });
    const all = await run('listar_cursos', { incluir_concluidos: true }, { '/courses': [] });
    expect(all.getAll.mock.calls[0]![1]).toMatchObject({ enrollment_state: undefined });
  });

  it('proximas_entregas usa a janela de dias a partir de agora', async () => {
    const { result, getAll } = await run(
      'proximas_entregas',
      { dias: 7 },
      { '/planner/items': [{ html_url: '/x' }] },
    );
    expect(getAll.mock.calls[0]![1]).toEqual({
      start_date: '2026-11-05T12:00:00.000Z',
      end_date: '2026-11-12T12:00:00.000Z',
    });
    expect(result).toEqual([expect.objectContaining({ url: 'https://x.test/x' })]);
    const padrao = await run('proximas_entregas', {}, { '/planner/items': [] });
    expect(padrao.getAll.mock.calls[0]![1]).toMatchObject({ end_date: '2026-11-19T12:00:00.000Z' });
  });

  it('listar_tarefas traduz o filtro para bucket', async () => {
    const routes = { '/courses/1/assignments': [{ id: 9, name: 'T' }] };
    const { result, getAll } = await run(
      'listar_tarefas',
      { course_id: 1, filtro: 'atrasadas' },
      routes,
    );
    expect(getAll.mock.calls[0]![1]).toMatchObject({ bucket: 'overdue' });
    expect(result).toEqual([expect.objectContaining({ id: 9 })]);
    expect(
      (await run('listar_tarefas', { course_id: 1 }, routes)).getAll.mock.calls[0]![1],
    ).toMatchObject({ bucket: undefined });
  });

  it('ver_tarefa junta tarefa e entrega', async () => {
    const { result } = await run(
      'ver_tarefa',
      { course_id: 1, assignment_id: 2 },
      {
        '/courses/1/assignments/2': { id: 2, description: '<p>X</p>' },
        '/courses/1/assignments/2/submissions/self': { score: 5 },
      },
    );
    expect(result).toMatchObject({ enunciado: 'X', entrega: { nota: 5 } });
  });

  it('notas sem curso resume as matrículas com o nome do curso', async () => {
    const { result } = await run(
      'notas',
      {},
      {
        '/users/self/enrollments': [{ course_id: 1, grades: { current_score: 90 } }],
        '/courses': [{ id: 1, name: 'Grafos' }],
      },
    );
    expect(result).toEqual([expect.objectContaining({ curso: 'Grafos', nota_atual: 90 })]);
  });

  it('notas com curso lista as tarefas corrigidas', async () => {
    const { result } = await run(
      'notas',
      { course_id: 1 },
      {
        '/courses/1/students/submissions': [
          { score: 7, assignment: { id: 1, name: 'T' } },
          { score: 1 },
        ],
      },
    );
    expect(result).toEqual([expect.objectContaining({ tarefa: 'T', nota: 7 })]);
  });

  it('avisos busca nos cursos ativos ou no curso dado', async () => {
    const todos = await run(
      'avisos',
      {},
      { '/courses': [{ id: 1 }], '/announcements': [{ id: 5, message: 'oi' }] },
    );
    expect(todos.getAll.mock.calls[1]![1]).toMatchObject({
      context_codes: ['course_1'],
      start_date: '2026-10-06T12:00:00.000Z',
    });
    expect(todos.result).toEqual([expect.objectContaining({ texto: 'oi' })]);
    const um = await run('avisos', { course_id: 3, dias: 1 }, { '/announcements': [] });
    expect(um.getAll.mock.calls[0]![1]).toMatchObject({ context_codes: ['course_3'] });
    expect((await run('avisos', {}, { '/courses': [] })).result).toEqual([]);
  });

  it('modulos, discussoes e arquivos traduzem as listas', async () => {
    expect(
      (await run('modulos', { course_id: 1 }, { '/courses/1/modules': [{ id: 1, name: 'M' }] }))
        .result,
    ).toEqual([expect.objectContaining({ nome: 'M' })]);
    expect(
      (await run('discussoes', { course_id: 1 }, { '/courses/1/discussion_topics': [{ id: 1 }] }))
        .result,
    ).toHaveLength(1);
    const files = await run(
      'arquivos',
      { course_id: 1, busca: 'pdf' },
      { '/courses/1/files': [{ id: 1, size: 1024 }] },
    );
    expect(files.getAll.mock.calls[0]![1]).toMatchObject({ search_term: 'pdf' });
    expect(files.result).toEqual([expect.objectContaining({ tamanho_kb: 1 })]);
  });

  it('ver_pagina codifica o page_url e converte o corpo', async () => {
    const { result } = await run(
      'ver_pagina',
      { course_id: 1, page_url: 'a b' },
      { '/courses/1/pages/a%20b': { title: 'P', body: '<p>c</p>' } },
    );
    expect(result).toMatchObject({ titulo: 'P', conteudo: 'c' });
  });

  it('ler_arquivo_texto lê texto, converte HTML e devolve link para binários', async () => {
    const txt = await run(
      'ler_arquivo_texto',
      { file_id: 1 },
      {
        '/files/1': { display_name: 'a.md', url: 'u', 'content-type': 'text/markdown' },
        u: 'conteúdo',
      },
    );
    expect(txt.result).toBe('# a.md\n\nconteúdo');
    const html = await run(
      'ler_arquivo_texto',
      { file_id: 2 },
      {
        '/files/2': { display_name: 'a.html', url: 'h', 'content-type': 'text/html' },
        h: '<p>x</p>',
      },
    );
    expect(html.result).toBe('# a.html\n\nx');
    const pdf = await run(
      'ler_arquivo_texto',
      { file_id: 3 },
      { '/files/3': { display_name: 'a.pdf', url: 'p', 'content-type': 'application/pdf' } },
    );
    expect(pdf.result).toBe('"a.pdf" é application/pdf; baixe pelo link: p');
    const vazio = await run('ler_arquivo_texto', { file_id: 4 }, { '/files/4': {} });
    expect(vazio.result).toContain('baixe pelo link');
  });

  it('ver_discussao achata as postagens e tolera falha na view', async () => {
    const base = '/courses/1/discussion_topics/2';
    const ok = await run(
      'ver_discussao',
      { course_id: 1, topic_id: 2 },
      {
        [base]: { id: 2, title: 'F', message: '<p>e</p>' },
        [`${base}/view`]: {
          participants: [{ id: 1, display_name: 'Ana' }],
          view: [{ user_id: 1, message: 'oi' }],
        },
      },
    );
    expect(ok.result).toMatchObject({
      titulo: 'F',
      enunciado: 'e',
      postagens: [{ autor: 'Ana', texto: 'oi' }],
    });
    const semView = await run(
      'ver_discussao',
      { course_id: 1, topic_id: 2 },
      { [base]: { id: 2 }, [`${base}/view`]: new Error('x') },
    );
    expect(semView.result).toMatchObject({ postagens: [] });
  });

  it('calendario usa hoje e +30 dias por padrão', async () => {
    const { getAll } = await run(
      'calendario',
      {},
      { '/courses': [{ id: 1 }], '/calendar_events': [{ title: 'E' }] },
    );
    expect(getAll.mock.calls[1]![1]).toMatchObject({
      start_date: '2026-11-05',
      end_date: '2026-12-05',
      context_codes: ['user_self', 'course_1'],
    });
    const datas = await run(
      'calendario',
      { inicio: '2026-01-01', fim: '2026-02-01' },
      { '/courses': [], '/calendar_events': [] },
    );
    expect(datas.getAll.mock.calls[1]![1]).toMatchObject({
      start_date: '2026-01-01',
      end_date: '2026-02-01',
    });
  });

  it('buscar junta as buscas e tolera falhas parciais', async () => {
    const { result } = await run(
      'buscar',
      { course_id: 1, termo: 'grafo' },
      {
        '/courses/1/assignments': [{ id: 1, name: 'Grafo' }],
        '/courses/1/pages': new Error('sem páginas'),
        '/courses/1/files': [],
        '/courses/1/modules': [{ id: 1, name: 'M', items: [{ id: 2, title: 'grafos' }] }],
      },
    );
    expect(result).toMatchObject({
      tarefas: [{ id: 1 }],
      paginas: [],
      itens_de_modulo: [{ titulo: 'grafos' }],
    });
  });
});

describe('ferramentas de escrita', () => {
  it('submissionPayload monta texto ou link', () => {
    expect(submissionPayload('texto', 'a')).toEqual({
      submission: { submission_type: 'online_text_entry', body: 'a' },
    });
    expect(submissionPayload('url', 'u')).toEqual({
      submission: { submission_type: 'online_url', url: 'u' },
    });
  });

  it('entregar_tarefa_texto envia a entrega', async () => {
    const path = '/courses/1/assignments/2/submissions';
    const { result, post } = await run(
      'entregar_tarefa_texto',
      { course_id: 1, assignment_id: 2, tipo: 'url', conteudo: 'u' },
      { [path]: { submitted_at: 'd', attempt: 1 } },
    );
    expect(post).toHaveBeenCalledWith(path, submissionPayload('url', 'u'));
    expect(result).toEqual({ ok: true, enviada_em: 'd', tentativa: 1 });
  });

  it('responder_discussao publica a mensagem', async () => {
    const path = '/courses/1/discussion_topics/2/entries';
    const { result, post } = await run(
      'responder_discussao',
      { course_id: 1, topic_id: 2, mensagem: 'oi' },
      { [path]: { id: 9, created_at: 'd' } },
    );
    expect(post).toHaveBeenCalledWith(path, { message: 'oi' });
    expect(result).toEqual({ ok: true, id: 9, data: 'd' });
  });

  it('recusa argumentos inválidos', async () => {
    await expect(
      run('responder_discussao', { course_id: 1, topic_id: 2, mensagem: '' }),
    ).rejects.toThrow();
  });
});
