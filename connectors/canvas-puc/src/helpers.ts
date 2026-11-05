/**
 * Funções de apoio das ferramentas do Canvas: datas, filtros e buscas compostas.
 */
import type { CanvasClient } from './client.js';
import type {
  CanvasCourse,
  CanvasDiscussionView,
  CanvasModule,
  CanvasSubmission,
  Id,
} from './canvas-types.js';

/** Filtros de `listar_tarefas` → `bucket` da API do Canvas (`todas` não filtra). */
export const ASSIGNMENT_BUCKETS: Readonly<Record<string, string | undefined>> = {
  todas: undefined,
  futuras: 'upcoming',
  passadas: 'past',
  sem_entrega: 'unsubmitted',
  atrasadas: 'overdue',
};

/** Data/hora ISO `days` dias depois (ou antes, se negativo) de `now`. */
export function isoDaysFrom(now: Date, days: number): string {
  return new Date(now.getTime() + days * 86_400_000).toISOString();
}

/** Parte `AAAA-MM-DD` de uma data ISO. */
export function dateOnly(iso: string): string {
  return iso.slice(0, 10);
}

/** Códigos de contexto (`course_<id>`) usados por avisos e calendário. */
export function courseContextCodes(ids: readonly Id[]): string[] {
  return ids.map((id) => `course_${String(id)}`);
}

/** Mapa id → nome dos cursos, para enriquecer outras listagens. */
export function courseNameMap(courses: readonly CanvasCourse[]): Map<string, string> {
  return new Map(courses.map((c) => [String(c.id), c.name ?? '']));
}

/** Mapa id → nome dos participantes de um fórum. */
export function participantNames(view: CanvasDiscussionView): Map<string, string> {
  return new Map((view.participants ?? []).map((p) => [String(p.id), p.display_name ?? '']));
}

/** Decide se um arquivo pode ser lido como texto, pelo tipo MIME ou pela extensão. */
export function isTextFile(contentType: string, name: string): boolean {
  return (
    /^text\/|json|xml|javascript|csv/.test(contentType) ||
    /\.(txt|md|csv|py|js|ts|java|c|cpp|h|html?)$/i.test(name)
  );
}

/** Item de módulo encontrado por `matchModuleItems`. */
export interface ModuleMatch {
  readonly modulo: string | undefined;
  readonly titulo: string | undefined;
  readonly tipo: string | undefined;
}

/** Itens de módulo cujo título contém o termo (sem diferenciar maiúsculas). */
export function matchModuleItems(modules: readonly CanvasModule[], term: string): ModuleMatch[] {
  const q = term.toLowerCase();
  return modules.flatMap((m) =>
    (m.items ?? [])
      .filter((i) => i.title?.toLowerCase().includes(q))
      .map((i) => ({ modulo: m.name, titulo: i.title, tipo: i.type })),
  );
}

/** Cursos ativos do aluno. */
export function activeCourses(client: CanvasClient): Promise<CanvasCourse[]> {
  return client.getAll<CanvasCourse>('/courses', { enrollment_state: 'active' });
}

/** Entrega do próprio aluno numa tarefa, com comentários e rubrica; `null` se não houver acesso. */
export async function fetchOwnSubmission(
  client: CanvasClient,
  courseId: Id,
  assignmentId: Id,
): Promise<CanvasSubmission | null> {
  const path = `/courses/${String(courseId)}/assignments/${String(assignmentId)}/submissions/self`;
  try {
    return await client.get<CanvasSubmission>(path, {
      include: ['submission_comments', 'rubric_assessment'],
    });
  } catch {
    return null;
  }
}

/** Busca em paralelo; uma busca que falha vira lista vazia em vez de derrubar as outras. */
export function getAllOrEmpty<T>(
  client: CanvasClient,
  path: string,
  params: Record<string, string | readonly string[]>,
): Promise<T[]> {
  return client.getAll<T>(path, params).catch(() => []);
}
