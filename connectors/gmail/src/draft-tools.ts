/**
 * Ferramentas MCP de rascunhos: listar, criar (novo ou como resposta), substituir, enviar e apagar.
 * Enviar é marcado como envio (destrutivo); substituir e apagar, como destrutivos; criar, como criação.
 */
import { z } from 'zod';
import { defineTool } from '../../../src/mcp/tools.js';
import type { OwnerDeps } from './context.js';
import {
  createDraft,
  deleteDraft,
  listDrafts,
  prepareDraftEmail,
  sendDraft,
  updateDraft,
  type DraftArgs,
} from './drafts.js';
import { BODY, RECIPIENTS, SUBJECT } from './send-tools.js';
import {
  CONFIRM_HINT,
  CREATE_HINTS,
  DESTRUCTIVE_HINTS,
  GMAIL_ID,
  ONE_ACCOUNT,
  READ_ONLY_HINTS,
  resolveSingleAccount,
  resolveWritableAccount,
  SEND_HINTS,
} from './tools.js';

/** Id de rascunho (de list_drafts ou create_draft). */
const DRAFT_ID = GMAIL_ID.describe('draft_id from list_drafts or create_draft.');

/** Parâmetros do conteúdo de um rascunho (criar e substituir). */
export const DRAFT_SHAPE = {
  account: ONE_ACCOUNT,
  to: RECIPIENTS.default([]).describe('Recipients; ignored when reply_to_message_id is set.'),
  cc: RECIPIENTS.default([]),
  bcc: RECIPIENTS.default([]),
  subject: SUBJECT.default(''),
  body: BODY,
  reply_to_message_id: GMAIL_ID.optional().describe(
    'Make the draft a reply to this message (recipients, subject and thread from it).',
  ),
  reply_all: z.boolean().default(false).describe('With reply_to_message_id: reply to all.'),
};

/** Parâmetros de conteúdo das ferramentas de rascunho, já validados. */
export interface DraftToolArgs {
  readonly to: string[];
  readonly cc: string[];
  readonly bcc: string[];
  readonly subject: string;
  readonly body: string;
  readonly reply_to_message_id?: string | undefined;
  readonly reply_all: boolean;
}

/** Argumentos de rascunho no formato interno, a partir dos parâmetros da ferramenta. */
export function draftArgs(args: DraftToolArgs): DraftArgs {
  return {
    to: args.to,
    cc: args.cc,
    bcc: args.bcc,
    subject: args.subject,
    body: args.body,
    replyToMessageId: args.reply_to_message_id ?? null,
    replyAll: args.reply_all,
  };
}

/** `list_drafts`: rascunhos de uma conta. */
export const listDraftsTool = defineTool({
  name: 'list_drafts',
  description: 'List drafts of one account (draft_id, recipients, subject, snippet). Read-only.',
  shape: {
    account: ONE_ACCOUNT,
    max_results: z.number().int().min(1).max(25).default(10),
  },
  annotations: READ_ONLY_HINTS,
  run: async (deps: OwnerDeps, args) =>
    listDrafts(deps, await resolveSingleAccount(deps, args.account), args.max_results),
});

/** `create_draft`: rascunho novo, ou resposta a uma mensagem na mesma conversa. */
export const createDraftTool = defineTool({
  name: 'create_draft',
  description:
    'Create a plain-text draft (nothing is sent). With reply_to_message_id it becomes a reply in that thread.',
  shape: DRAFT_SHAPE,
  annotations: CREATE_HINTS,
  run: async (deps: OwnerDeps, args) => {
    const ref = await resolveWritableAccount(deps, args.account);
    return createDraft(deps, ref, await prepareDraftEmail(deps, ref, draftArgs(args)));
  },
});

/** `update_draft`: substitui todo o conteúdo de um rascunho. */
export const updateDraftTool = defineTool({
  name: 'update_draft',
  description: `Replace the whole content of a draft (send every field again). ${CONFIRM_HINT}`,
  shape: { ...DRAFT_SHAPE, draft_id: DRAFT_ID },
  annotations: DESTRUCTIVE_HINTS,
  run: async (deps: OwnerDeps, args) => {
    const ref = await resolveWritableAccount(deps, args.account);
    const prepared = await prepareDraftEmail(deps, ref, draftArgs(args));
    return updateDraft(deps, ref, { draftId: args.draft_id, prepared });
  },
});

/** `send_draft`: envia um rascunho existente. */
export const sendDraftTool = defineTool({
  name: 'send_draft',
  description: `Send an existing draft as it is. ${CONFIRM_HINT}`,
  shape: { account: ONE_ACCOUNT, draft_id: DRAFT_ID },
  annotations: SEND_HINTS,
  run: async (deps: OwnerDeps, args) =>
    sendDraft(deps, await resolveWritableAccount(deps, args.account), args.draft_id),
});

/** `delete_draft`: apaga um rascunho (só o rascunho). */
export const deleteDraftTool = defineTool({
  name: 'delete_draft',
  description: `Delete a draft (only the draft; sent mail is not touched). ${CONFIRM_HINT}`,
  shape: { account: ONE_ACCOUNT, draft_id: DRAFT_ID },
  annotations: DESTRUCTIVE_HINTS,
  run: async (deps: OwnerDeps, args) =>
    deleteDraft(deps, await resolveWritableAccount(deps, args.account), args.draft_id),
});
