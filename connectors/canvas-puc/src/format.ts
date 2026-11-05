/**
 * Conversão das respostas do Canvas em objetos enxutos, com chaves em português, para o modelo.
 * Tudo puro: recebe o JSON da API e devolve só os campos úteis.
 */
import { htmlToText } from '../../../src/core/html.js';
import type {
  CanvasAnnouncement,
  CanvasAssignment,
  CanvasAttachment,
  CanvasCalendarEvent,
  CanvasCourse,
  CanvasDiscussionEntry,
  CanvasDiscussionTopic,
  CanvasEnrollment,
  CanvasModule,
  CanvasModuleItem,
  CanvasPlannerItem,
  CanvasProfile,
  CanvasRubricCriterion,
  CanvasSubmission,
  CanvasSubmissionFlags,
} from './canvas-types.js';

/** Objeto de visualização devolvido ao modelo (serializado como JSON). */
export type View = Readonly<Record<string, unknown>>;

/** Tamanho máximo de textos longos (avisos, descrições) devolvidos ao modelo. */
export const MAX_TEXT_LENGTH = 3000;

/** Converte HTML em texto e corta em `MAX_TEXT_LENGTH`. */
export function shortText(html: string | null | undefined): string {
  return htmlToText(html).slice(0, MAX_TEXT_LENGTH);
}

/** Perfil do usuário autenticado. */
export function toProfile(p: CanvasProfile): View {
  return { id: p.id, nome: p.name, email: p.primary_email, login: p.login_id, fuso: p.time_zone };
}

/** Curso com a nota atual da matrícula do aluno. */
export function toCourse(c: CanvasCourse): View {
  const enrollment: CanvasEnrollment = c.enrollments?.[0] ?? {};
  return {
    id: c.id,
    nome: c.name,
    codigo: c.course_code,
    periodo: c.term?.name,
    nota_atual: enrollment.computed_current_score ?? null,
    conceito_atual: enrollment.computed_current_grade ?? null,
  };
}

/** Status de entrega de um item da agenda (`null` quando o item não tem entrega). */
export function toSubmissionFlags(flags: CanvasSubmissionFlags | false | undefined): View | null {
  if (!flags) return null;
  return {
    entregue: flags.submitted,
    atrasado: flags.late,
    faltando: flags.missing,
    corrigido: flags.graded,
  };
}

/** Item da agenda do aluno (tarefa, quiz, evento) com link absoluto. */
export function toPlannerItem(i: CanvasPlannerItem, baseUrl: string): View {
  return {
    tipo: i.plannable_type,
    titulo: i.plannable?.title ?? i.plannable?.name,
    curso: i.context_name,
    course_id: i.course_id,
    id: i.plannable_id,
    data: i.plannable_date,
    pontos: i.plannable?.points_possible,
    entrega: toSubmissionFlags(i.submissions),
    url: i.html_url ? `${baseUrl}${i.html_url}` : undefined,
  };
}

/** Tarefa numa listagem, com status e nota da entrega do aluno. */
export function toAssignmentSummary(a: CanvasAssignment): View {
  const s: CanvasSubmission = a.submission ?? {};
  return {
    id: a.id,
    nome: a.name,
    prazo: a.due_at,
    pontos: a.points_possible,
    tipos_entrega: a.submission_types,
    status: s.workflow_state,
    nota: s.score ?? null,
    atrasada: s.late ?? null,
    faltando: s.missing ?? null,
    url: a.html_url,
  };
}

/** Critério de rubrica com seus níveis como `pontos: descrição`. */
export function toRubricCriterion(r: CanvasRubricCriterion): View {
  const levels = (r.ratings ?? []).map((x) => `${String(x.points)}: ${String(x.description)}`);
  return { criterio: r.description, pontos: r.points, niveis: levels };
}

/** Anexo (arquivo enviado ou arquivo do curso) com tamanho em KB. */
export function toFileInfo(f: CanvasAttachment): View {
  return {
    id: f.id,
    nome: f.display_name,
    tipo: f['content-type'],
    tamanho_kb: Math.round((f.size ?? 0) / 1024),
    atualizado_em: f.updated_at,
    download: f.url,
  };
}

/** Entrega do aluno com nota, comentários do professor, rubrica e anexos. */
export function toSubmissionDetail(s: CanvasSubmission): View {
  return {
    status: s.workflow_state,
    enviada_em: s.submitted_at,
    nota: s.score,
    conceito: s.grade,
    atrasada: s.late,
    comentarios: (s.submission_comments ?? []).map((c) => ({
      autor: c.author_name,
      texto: c.comment,
      data: c.created_at,
    })),
    avaliacao_rubrica: s.rubric_assessment ?? null,
    anexos: (s.attachments ?? []).map(toFileInfo),
  };
}

/** Tarefa completa: enunciado em texto, datas, rubrica e (se houver) a entrega do aluno. */
export function toAssignmentDetail(a: CanvasAssignment, submission: CanvasSubmission | null): View {
  return {
    id: a.id,
    nome: a.name,
    prazo: a.due_at,
    disponivel_de: a.unlock_at,
    disponivel_ate: a.lock_at,
    pontos: a.points_possible,
    tipos_entrega: a.submission_types,
    extensoes_permitidas: a.allowed_extensions,
    enunciado: htmlToText(a.description),
    rubrica: (a.rubric ?? []).map(toRubricCriterion),
    entrega: submission ? toSubmissionDetail(submission) : null,
    url: a.html_url,
  };
}

/** Nota de uma tarefa (vinda de `students/submissions` com `include[]=assignment`). */
export function toGradeRow(s: CanvasSubmission): View {
  return {
    tarefa: s.assignment?.name,
    assignment_id: s.assignment_id,
    nota: s.score,
    de: s.assignment?.points_possible,
    conceito: s.grade,
    status: s.workflow_state,
    prazo: s.assignment?.due_at,
  };
}

/** Resumo de notas de uma matrícula, com o nome do curso. */
export function toEnrollmentGrade(
  e: CanvasEnrollment,
  courseNames: ReadonlyMap<string, string>,
): View {
  return {
    course_id: e.course_id,
    curso: courseNames.get(String(e.course_id)),
    nota_atual: e.grades?.current_score,
    conceito_atual: e.grades?.current_grade,
    nota_final: e.grades?.final_score,
  };
}

/** Aviso do curso com o texto convertido e cortado. */
export function toAnnouncement(a: CanvasAnnouncement): View {
  return {
    id: a.id,
    titulo: a.title,
    curso: a.context_code,
    autor: a.author?.display_name ?? a.user_name,
    data: a.posted_at,
    texto: shortText(a.message),
    url: a.html_url,
  };
}

/** Item de módulo (aula, arquivo, página, tarefa). */
export function toModuleItem(i: CanvasModuleItem): View {
  return {
    id: i.id,
    tipo: i.type,
    titulo: i.title,
    content_id: i.content_id,
    page_url: i.page_url,
    url_externa: i.external_url,
    concluido: i.completion_requirement?.completed ?? null,
  };
}

/** Módulo com seus itens. */
export function toModule(m: CanvasModule): View {
  return { id: m.id, nome: m.name, itens: (m.items ?? []).map(toModuleItem) };
}

/** Fórum de discussão numa listagem. */
export function toDiscussionSummary(d: CanvasDiscussionTopic): View {
  return {
    id: d.id,
    titulo: d.title,
    prazo: d.assignment?.due_at ?? null,
    respostas: d.discussion_subentry_count,
    nao_lidas: d.unread_count,
    ultima_resposta: d.last_reply_at,
    url: d.html_url,
  };
}

/** Achata a árvore de postagens de um fórum, marcando o nível de cada resposta. */
export function flattenDiscussion(
  entries: readonly CanvasDiscussionEntry[] | undefined,
  names: ReadonlyMap<string, string>,
  depth = 0,
): { nivel: number; autor: string | undefined; data: string | undefined; texto: string }[] {
  return (entries ?? []).flatMap((e) => [
    {
      nivel: depth,
      autor: names.get(String(e.user_id)),
      data: e.created_at,
      texto: htmlToText(e.message),
    },
    ...flattenDiscussion(e.replies, names, depth + 1),
  ]);
}

/** Evento do calendário com descrição em texto curto. */
export function toCalendarEvent(e: CanvasCalendarEvent): View {
  return {
    titulo: e.title,
    inicio: e.start_at,
    fim: e.end_at,
    local: e.location_name,
    curso: e.context_name,
    descricao: shortText(e.description).slice(0, 1000),
  };
}
