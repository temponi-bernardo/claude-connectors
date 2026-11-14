import { describe, expect, it } from 'vitest';
import { GMAIL_TOOLS } from './tool-list.js';

describe('GMAIL_TOOLS', () => {
  it('tem as 23 ferramentas, sem exclusão definitiva', () => {
    expect(GMAIL_TOOLS.map((t) => t.name)).toEqual([
      'list_accounts',
      'link_account',
      'unlink_account',
      'search_threads',
      'get_thread',
      'get_message',
      'list_labels',
      'get_attachment_text',
      'list_drafts',
      'send_email',
      'reply_email',
      'reply_all_email',
      'forward_email',
      'create_draft',
      'update_draft',
      'send_draft',
      'delete_draft',
      'mark_read',
      'archive',
      'star',
      'update_labels',
      'trash',
      'untrash',
    ]);
  });

  it('toda ferramenta tem anotações MCP; só as de leitura são readOnly', () => {
    const readOnly = GMAIL_TOOLS.filter((t) => t.annotations?.readOnlyHint).map((t) => t.name);
    expect(readOnly).toEqual([
      'list_accounts',
      'search_threads',
      'get_thread',
      'get_message',
      'list_labels',
      'get_attachment_text',
      'list_drafts',
    ]);
    for (const tool of GMAIL_TOOLS) expect(tool.annotations).toBeDefined();
  });
});
