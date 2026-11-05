/**
 * Ferramentas que agem no Canvas em nome do aluno. Só são registradas com `CANVAS_ALLOW_WRITE` ligado,
 * e a descrição pede ao modelo que confirme com o usuário antes de usar.
 */
import { z } from 'zod';
import { defineTool, type ToolSpec } from '../../../src/mcp/tools.js';
import type { CanvasSubmission, Id } from './canvas-types.js';
import type { CanvasContext } from './context.js';

const id = z.union([z.string(), z.number()]);

/** Corpo de entrega para o tipo escolhido: texto (HTML aceito) ou link. */
export function submissionPayload(
  kind: 'texto' | 'url',
  content: string,
): { submission: Readonly<Record<string, string>> } {
  return kind === 'texto'
    ? { submission: { submission_type: 'online_text_entry', body: content } }
    : { submission: { submission_type: 'online_url', url: content } };
}

/** Ferramentas de escrita. */
export const CANVAS_WRITE_TOOLS: readonly ToolSpec<CanvasContext>[] = [
  defineTool({
    name: 'entregar_tarefa_texto',
    description:
      'ENVIA uma entrega de texto ou link numa tarefa. Ação real, visível ao professor: confirme com o usuário antes.',
    shape: {
      course_id: id,
      assignment_id: id,
      tipo: z.enum(['texto', 'url']),
      conteudo: z.string().min(1).describe('Texto (pode ser HTML) ou a URL'),
    },
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/assignments/${String(args.assignment_id)}/submissions`;
      const s = await client.post<CanvasSubmission>(
        path,
        submissionPayload(args.tipo, args.conteudo),
      );
      return { ok: true, enviada_em: s.submitted_at, tentativa: s.attempt };
    },
  }),
  defineTool({
    name: 'responder_discussao',
    description:
      'PUBLICA uma resposta num fórum de discussão. Ação real, visível à turma: confirme com o usuário antes.',
    shape: { course_id: id, topic_id: id, mensagem: z.string().min(1) },
    run: async ({ client }, args) => {
      const path = `/courses/${String(args.course_id)}/discussion_topics/${String(args.topic_id)}/entries`;
      const entry = await client.post<{ id: Id; created_at?: string }>(path, {
        message: args.mensagem,
      });
      return { ok: true, id: entry.id, data: entry.created_at };
    },
  }),
];
