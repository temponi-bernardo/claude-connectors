/**
 * Ferramentas de leitura do Canvas (perfil, cursos, agenda, tarefas, notas, avisos, conteúdo, fóruns).
 */
import { z } from 'zod';
import { htmlToText } from '../../../src/core/html.js';
import { defineTool, type ToolSpec } from '../../../src/mcp/tools.js';
import type {
  CanvasAnnouncement,
  CanvasAssignment,
  CanvasAttachment,
  CanvasCalendarEvent,
  CanvasCourse,
  CanvasDiscussionTopic,
  CanvasDiscussionView,
  CanvasEnrollment,
  CanvasModule,
  CanvasPage,
  CanvasPlannerItem,
  CanvasProfile,
  CanvasSubmission,
} from './canvas-types.js';
import type { CanvasContext } from './context.js';
import * as f from './format.js';
import * as h from './helpers.js';

const id = z.union([z.string(), z.number()]);
const courseId = id.describe('ID do curso (veja listar_cursos)');

/** Ferramentas de leitura, na ordem em que aparecem para o modelo. */
export const CANVAS_READ_TOOLS: readonly ToolSpec<CanvasContext>[] = [
  defineTool({
    name: 'quem_sou_eu',
    description: 'Mostra o perfil do usuário autenticado no Canvas (útil para testar a conexão).',
    shape: {},
    run: async ({ client }) => f.toProfile(await client.get<CanvasProfile>('/users/self/profile')),
  }),
  defineTool({
    name: 'listar_cursos',
    description: 'Lista os cursos/disciplinas do aluno com a nota atual. Por padrão só os ativos.',
    shape: { incluir_concluidos: z.boolean().optional().describe('Incluir cursos já encerrados') },
    run: async ({ client }, args) => {
      const state = args.incluir_concluidos ? undefined : 'active';
      const params = { include: ['term', 'total_scores'], enrollment_state: state };
      const courses = await client.getAll<CanvasCourse>('/courses', params);
      return courses.filter((c) => c.name).map(f.toCourse);
    },
  }),
  defineTool({
    name: 'proximas_entregas',
    description:
      'O que vence nos próximos dias em todos os cursos: tarefas, quizzes e eventos (agenda do aluno).',
    shape: {
      dias: z.number().int().min(1).max(120).optional().describe('Janela em dias (padrão 14)'),
    },
    run: async ({ client, now }, args) => {
      const params = {
        start_date: now().toISOString(),
        end_date: h.isoDaysFrom(now(), args.dias ?? 14),
      };
      const items = await client.getAll<CanvasPlannerItem>('/planner/items', params);
      return items.map((i) => f.toPlannerItem(i, client.baseUrl));
    },
  }),
  defineTool({
    name: 'listar_tarefas',
    description: 'Lista as tarefas de um curso com prazo, status da entrega e nota.',
    shape: {
      course_id: courseId,
      filtro: z.enum(['todas', 'futuras', 'passadas', 'sem_entrega', 'atrasadas']).optional(),
    },
    run: async ({ client }, args) => {
      const params = {
        include: ['submission'],
        order_by: 'due_at',
        bucket: h.ASSIGNMENT_BUCKETS[args.filtro ?? 'todas'],
      };
      const list = await client.getAll<CanvasAssignment>(
        `/courses/${String(args.course_id)}/assignments`,
        params,
      );
      return list.map(f.toAssignmentSummary);
    },
  }),
  defineTool({
    name: 'ver_tarefa',
    description:
      'Detalhes de uma tarefa: enunciado em texto, rubrica, prazos e a entrega/feedback do aluno.',
    shape: { course_id: courseId, assignment_id: id },
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/assignments/${String(args.assignment_id)}`;
      const [assignment, submission] = await Promise.all([
        client.get<CanvasAssignment>(path),
        h.fetchOwnSubmission(client, args.course_id, args.assignment_id),
      ]);
      return f.toAssignmentDetail(assignment, submission);
    },
  }),
  defineTool({
    name: 'notas',
    description:
      'Notas do aluno. Sem course_id: resumo de todos os cursos ativos. Com course_id: nota de cada tarefa.',
    shape: { course_id: courseId.optional() },
    run: async ({ client }, args) => {
      if (args.course_id === undefined) {
        const params = { type: ['StudentEnrollment'], state: ['active'] };
        const [enrollments, courses] = await Promise.all([
          client.getAll<CanvasEnrollment>('/users/self/enrollments', params),
          h.activeCourses(client),
        ]);
        return enrollments.map((e) => f.toEnrollmentGrade(e, h.courseNameMap(courses)));
      }
      const path = `/courses/${String(args.course_id)}/students/submissions`;
      const subs = await client.getAll<CanvasSubmission>(path, {
        student_ids: ['self'],
        include: ['assignment'],
      });
      return subs.filter((s) => s.assignment).map(f.toGradeRow);
    },
  }),
  defineTool({
    name: 'avisos',
    description: 'Avisos (announcements) recentes de um curso ou de todos os cursos ativos.',
    shape: {
      course_id: courseId.optional().describe('Se omitido, busca em todos os cursos ativos'),
      dias: z.number().int().min(1).max(365).optional().describe('Dias para trás (padrão 30)'),
    },
    run: async ({ client, now }, args) => {
      const ids =
        args.course_id !== undefined
          ? [args.course_id]
          : (await h.activeCourses(client)).map((c) => c.id);
      if (ids.length === 0) return [];
      const params = {
        context_codes: h.courseContextCodes(ids),
        start_date: h.isoDaysFrom(now(), -(args.dias ?? 30)),
        end_date: now().toISOString(),
      };
      return (await client.getAll<CanvasAnnouncement>('/announcements', params)).map(
        f.toAnnouncement,
      );
    },
  }),
  defineTool({
    name: 'modulos',
    description: 'Módulos de um curso e os itens de cada um (aulas, arquivos, páginas, tarefas).',
    shape: { course_id: courseId },
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/modules`;
      return (await client.getAll<CanvasModule>(path, { include: ['items'] })).map(f.toModule);
    },
  }),
  defineTool({
    name: 'ver_pagina',
    description:
      "Lê uma página do curso como texto. Use o page_url de `modulos`, ou 'front_page' para a inicial.",
    shape: { course_id: courseId, page_url: z.string() },
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/pages/${encodeURIComponent(args.page_url)}`;
      const p = await client.get<CanvasPage>(path);
      return {
        titulo: p.title,
        atualizada_em: p.updated_at,
        conteudo: htmlToText(p.body),
        url: p.html_url,
      };
    },
  }),
  defineTool({
    name: 'arquivos',
    description:
      'Arquivos de um curso (PDFs, slides etc.) com link de download, do mais recente ao mais antigo.',
    shape: {
      course_id: courseId,
      busca: z.string().min(2).optional().describe('Parte do nome do arquivo'),
    },
    run: async ({ client }, args) => {
      const params = { search_term: args.busca, sort: 'updated_at', order: 'desc' };
      const files = await client.getAll<CanvasAttachment>(
        `/courses/${String(args.course_id)}/files`,
        params,
      );
      return files.map(f.toFileInfo);
    },
  }),
  defineTool({
    name: 'ler_arquivo_texto',
    description:
      'Lê um arquivo de texto do curso (txt, md, csv, código, html). Para PDF/slides, devolve o link.',
    shape: { file_id: id },
    run: async ({ client }, args) => {
      const file = await client.get<CanvasAttachment>(`/files/${String(args.file_id)}`);
      const type = file['content-type'] ?? '';
      const name = file.display_name ?? '';
      if (!h.isTextFile(type, name) || !file.url)
        return `"${name}" é ${type}; baixe pelo link: ${String(file.url)}`;
      const text = await client.fetchText(file.url);
      return `# ${name}\n\n${type.includes('html') ? htmlToText(text) : text}`.slice(0, 100_000);
    },
  }),
  defineTool({
    name: 'discussoes',
    description: 'Lista os fóruns de discussão de um curso.',
    shape: { course_id: courseId },
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/discussion_topics`;
      return (await client.getAll<CanvasDiscussionTopic>(path)).map(f.toDiscussionSummary);
    },
  }),
  defineTool({
    name: 'ver_discussao',
    description:
      'Lê um fórum de discussão: enunciado e todas as postagens, com o nível de cada resposta.',
    shape: { course_id: courseId, topic_id: id },
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/discussion_topics/${String(args.topic_id)}`;
      const [topic, view] = await Promise.all([
        client.get<CanvasDiscussionTopic>(path),
        client.get<CanvasDiscussionView>(`${path}/view`).catch((): CanvasDiscussionView => ({})),
      ]);
      const postagens = f.flattenDiscussion(view.view, h.participantNames(view));
      return { titulo: topic.title, enunciado: htmlToText(topic.message), postagens };
    },
  }),
  defineTool({
    name: 'calendario',
    description:
      'Eventos do calendário (aulas, provas marcadas) num intervalo de datas, de todos os cursos ativos.',
    shape: {
      inicio: z.string().optional().describe('Data inicial AAAA-MM-DD (padrão hoje)'),
      fim: z.string().optional().describe('Data final AAAA-MM-DD (padrão +30 dias)'),
    },
    run: async ({ client, now }, args) => {
      const ids = (await h.activeCourses(client)).map((c) => c.id);
      const params = {
        type: 'event',
        start_date: args.inicio ?? h.dateOnly(now().toISOString()),
        end_date: args.fim ?? h.dateOnly(h.isoDaysFrom(now(), 30)),
        context_codes: ['user_self', ...h.courseContextCodes(ids)].slice(0, 10),
      };
      return (await client.getAll<CanvasCalendarEvent>('/calendar_events', params)).map(
        f.toCalendarEvent,
      );
    },
  }),
  defineTool({
    name: 'buscar',
    description:
      'Busca um termo nos nomes de tarefas, páginas, arquivos e itens de módulo de um curso.',
    shape: { course_id: courseId, termo: z.string().min(2) },
    run: async ({ client }, args) => {
      const base = `/courses/${String(args.course_id)}`;
      const search = { search_term: args.termo };
      const [tarefas, paginas, arquivos, modulos] = await Promise.all([
        h.getAllOrEmpty<CanvasAssignment>(client, `${base}/assignments`, search),
        h.getAllOrEmpty<CanvasPage>(client, `${base}/pages`, search),
        h.getAllOrEmpty<CanvasAttachment>(client, `${base}/files`, search),
        h.getAllOrEmpty<CanvasModule>(client, `${base}/modules`, { include: ['items'] }),
      ]);
      return {
        tarefas: tarefas.map((a) => ({ id: a.id, nome: a.name, prazo: a.due_at })),
        paginas: paginas.map((p) => ({ page_url: p.url, titulo: p.title })),
        arquivos: arquivos.map(f.toFileInfo),
        itens_de_modulo: h.matchModuleItems(modulos, args.termo),
      };
    },
  }),
];
