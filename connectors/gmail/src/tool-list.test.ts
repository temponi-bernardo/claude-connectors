import { describe, expect, it } from 'vitest';
import { GMAIL_TOOLS } from './tool-list.js';

describe('GMAIL_TOOLS', () => {
  it('has the 23 tools, with no permanent deletion', () => {
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

  it('every tool has a unique title; only the read tools are readOnly', () => {
    const readOnly = GMAIL_TOOLS.filter((t) => t.annotations.readOnlyHint).map((t) => t.name);
    expect(readOnly).toEqual([
      'list_accounts',
      'search_threads',
      'get_thread',
      'get_message',
      'list_labels',
      'get_attachment_text',
      'list_drafts',
    ]);
    const titles = GMAIL_TOOLS.map((t) => t.annotations.title);
    expect(new Set(titles).size).toBe(GMAIL_TOOLS.length);
    for (const title of titles) expect(title).toMatch(/^[A-Z][a-z]/);
  });
});
