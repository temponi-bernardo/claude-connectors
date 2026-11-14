/**
 * Lista das ferramentas do conector Gmail, na ordem em que aparecem para o Claude: contas, leitura, envio,
 * rascunhos e organização da caixa.
 */
import type { ToolSpec } from '../../../src/mcp/tools.js';
import type { OwnerDeps } from './context.js';
import {
  createDraftTool,
  deleteDraftTool,
  listDraftsTool,
  sendDraftTool,
  updateDraftTool,
} from './draft-tools.js';
import {
  archiveTool,
  markReadTool,
  starTool,
  trashTool,
  untrashTool,
  updateLabelsTool,
} from './mailbox-tools.js';
import {
  forwardEmailTool,
  replyAllEmailTool,
  replyEmailTool,
  sendEmailTool,
} from './send-tools.js';
import {
  getAttachmentTextTool,
  getMessageTool,
  getThreadTool,
  linkAccountTool,
  listAccountsTool,
  listLabelsTool,
  searchThreadsTool,
  unlinkAccountTool,
} from './tools.js';

/** Todas as ferramentas do conector Gmail, na ordem em que aparecem para o Claude. */
export const GMAIL_TOOLS: readonly ToolSpec<OwnerDeps>[] = [
  listAccountsTool,
  linkAccountTool,
  unlinkAccountTool,
  searchThreadsTool,
  getThreadTool,
  getMessageTool,
  listLabelsTool,
  getAttachmentTextTool,
  listDraftsTool,
  sendEmailTool,
  replyEmailTool,
  replyAllEmailTool,
  forwardEmailTool,
  createDraftTool,
  updateDraftTool,
  sendDraftTool,
  deleteDraftTool,
  markReadTool,
  archiveTool,
  starTool,
  updateLabelsTool,
  trashTool,
  untrashTool,
];
