/**
 * Conversão das respostas do Canvas em objetos enxutos, com chaves em inglês, para o modelo.
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
  return {
    id: p.id,
    name: p.name,
    email: p.primary_email,
    login: p.login_id,
    time_zone: p.time_zone,
  };
}

/** Curso com a nota atual da matrícula do aluno. */
export function toCourse(c: CanvasCourse): View {
  const enrollment: CanvasEnrollment = c.enrollments?.[0] ?? {};
  return {
    id: c.id,
    name: c.name,
    code: c.course_code,
    term: c.term?.name,
    current_score: enrollment.computed_current_score ?? null,
    current_grade: enrollment.computed_current_grade ?? null,
  };
}

/** Status de entrega de um item da agenda (`null` quando o item não tem entrega). */
export function toSubmissionFlags(flags: CanvasSubmissionFlags | false | undefined): View | null {
  if (!flags) return null;
  return {
    submitted: flags.submitted,
    late: flags.late,
    missing: flags.missing,
    graded: flags.graded,
  };
}

/** Item da agenda do aluno (tarefa, quiz, evento) com link absoluto. */
export function toPlannerItem(i: CanvasPlannerItem, baseUrl: string): View {
  return {
    type: i.plannable_type,
    title: i.plannable?.title ?? i.plannable?.name,
    course: i.context_name,
    course_id: i.course_id,
    id: i.plannable_id,
    date: i.plannable_date,
    points: i.plannable?.points_possible,
    submission: toSubmissionFlags(i.submissions),
    url: i.html_url ? `${baseUrl}${i.html_url}` : undefined,
  };
}

/** Tarefa numa listagem, com status e nota da entrega do aluno. */
export function toAssignmentSummary(a: CanvasAssignment): View {
  const s: CanvasSubmission = a.submission ?? {};
  return {
    id: a.id,
    name: a.name,
    due_at: a.due_at,
    points: a.points_possible,
    submission_types: a.submission_types,
    status: s.workflow_state,
    score: s.score ?? null,
    late: s.late ?? null,
    missing: s.missing ?? null,
    url: a.html_url,
  };
}

/** Critério de rubrica com seus níveis como `points: description`. */
export function toRubricCriterion(r: CanvasRubricCriterion): View {
  const levels = (r.ratings ?? []).map((x) => `${String(x.points)}: ${String(x.description)}`);
  return { criterion: r.description, points: r.points, ratings: levels };
}

/** Anexo (arquivo enviado ou arquivo do curso) com tamanho em KB. */
export function toFileInfo(f: CanvasAttachment): View {
  return {
    id: f.id,
    name: f.display_name,
    content_type: f['content-type'],
    size_kb: Math.round((f.size ?? 0) / 1024),
    updated_at: f.updated_at,
    download: f.url,
  };
}

/** Entrega do aluno com nota, comentários do professor, rubrica e anexos. */
export function toSubmissionDetail(s: CanvasSubmission): View {
  return {
    status: s.workflow_state,
    submitted_at: s.submitted_at,
    score: s.score,
    grade: s.grade,
    late: s.late,
    comments: (s.submission_comments ?? []).map((c) => ({
      author: c.author_name,
      text: c.comment,
      date: c.created_at,
    })),
    rubric_assessment: s.rubric_assessment ?? null,
    attachments: (s.attachments ?? []).map(toFileInfo),
  };
}

/** Tarefa completa: enunciado em texto, datas, rubrica e (se houver) a entrega do aluno. */
export function toAssignmentDetail(a: CanvasAssignment, submission: CanvasSubmission | null): View {
  return {
    id: a.id,
    name: a.name,
    due_at: a.due_at,
    unlock_at: a.unlock_at,
    lock_at: a.lock_at,
    points: a.points_possible,
    submission_types: a.submission_types,
    allowed_extensions: a.allowed_extensions,
    description: htmlToText(a.description),
    rubric: (a.rubric ?? []).map(toRubricCriterion),
    submission: submission ? toSubmissionDetail(submission) : null,
    url: a.html_url,
  };
}

/** Nota de uma tarefa (vinda de `students/submissions` com `include[]=assignment`). */
export function toGradeRow(s: CanvasSubmission): View {
  return {
    assignment: s.assignment?.name,
    assignment_id: s.assignment_id,
    score: s.score,
    points_possible: s.assignment?.points_possible,
    grade: s.grade,
    status: s.workflow_state,
    due_at: s.assignment?.due_at,
  };
}

/** Resumo de notas de uma matrícula, com o nome do curso. */
export function toEnrollmentGrade(
  e: CanvasEnrollment,
  courseNames: ReadonlyMap<string, string>,
): View {
  return {
    course_id: e.course_id,
    course: courseNames.get(String(e.course_id)),
    current_score: e.grades?.current_score,
    current_grade: e.grades?.current_grade,
    final_score: e.grades?.final_score,
  };
}

/** Aviso do curso com o texto convertido e cortado. */
export function toAnnouncement(a: CanvasAnnouncement): View {
  return {
    id: a.id,
    title: a.title,
    course: a.context_code,
    author: a.author?.display_name ?? a.user_name,
    posted_at: a.posted_at,
    text: shortText(a.message),
    url: a.html_url,
  };
}

/** Item de módulo (aula, arquivo, página, tarefa). */
export function toModuleItem(i: CanvasModuleItem): View {
  return {
    id: i.id,
    type: i.type,
    title: i.title,
    content_id: i.content_id,
    page_url: i.page_url,
    external_url: i.external_url,
    completed: i.completion_requirement?.completed ?? null,
  };
}

/** Módulo com seus itens. */
export function toModule(m: CanvasModule): View {
  return { id: m.id, name: m.name, items: (m.items ?? []).map(toModuleItem) };
}

/** Fórum de discussão numa listagem. */
export function toDiscussionSummary(d: CanvasDiscussionTopic): View {
  return {
    id: d.id,
    title: d.title,
    due_at: d.assignment?.due_at ?? null,
    reply_count: d.discussion_subentry_count,
    unread_count: d.unread_count,
    last_reply_at: d.last_reply_at,
    url: d.html_url,
  };
}

/** Achata a árvore de postagens de um fórum, marcando o nível de cada resposta. */
export function flattenDiscussion(
  entries: readonly CanvasDiscussionEntry[] | undefined,
  names: ReadonlyMap<string, string>,
  depth = 0,
): { depth: number; author: string | undefined; date: string | undefined; text: string }[] {
  return (entries ?? []).flatMap((e) => [
    {
      depth,
      author: names.get(String(e.user_id)),
      date: e.created_at,
      text: htmlToText(e.message),
    },
    ...flattenDiscussion(e.replies, names, depth + 1),
  ]);
}

/** Evento do calendário com descrição em texto curto. */
export function toCalendarEvent(e: CanvasCalendarEvent): View {
  return {
    title: e.title,
    start_at: e.start_at,
    end_at: e.end_at,
    location: e.location_name,
    course: e.context_name,
    description: shortText(e.description).slice(0, 1000),
  };
}
