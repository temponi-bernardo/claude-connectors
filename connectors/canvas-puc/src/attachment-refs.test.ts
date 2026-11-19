import { describe, expect, it } from 'vitest';
import { fakeContext } from './fixtures/fake-context.js';
import {
  attachmentCountRefusal,
  collectMessageAttachments,
  CONVERSATION_FOLDER_PATH,
  copyToConversationFolder,
  conversationFolderId,
  curlUploadCommand,
  DIRECT_UPLOAD_NEXT_STEPS,
  fetchAttachmentFile,
  LOCAL_PATH_PLACEHOLDER,
  MAX_DIRECT_UPLOAD_BYTES,
  MAX_DIRECT_UPLOAD_MB,
  needsConversationCopy,
  prepareAttachmentUpload,
  resolveFileAttachments,
  shellQuote,
} from './attachment-refs.js';

const FOLDER = [{ id: 1 }, { id: 77 }];

describe('constants', () => {
  it('state the direct upload limit and the folder path', () => {
    expect(MAX_DIRECT_UPLOAD_MB).toBe(25);
    expect(MAX_DIRECT_UPLOAD_BYTES).toBe(25 * 1024 * 1024);
    expect(CONVERSATION_FOLDER_PATH).toBe('/users/self/folders/by_path/conversation%20attachments');
    expect(DIRECT_UPLOAD_NEXT_STEPS).toContain(LOCAL_PATH_PLACEHOLDER);
  });
});

describe('attachmentCountRefusal', () => {
  it('allows up to 5 in total and refuses more', () => {
    expect(attachmentCountRefusal(3, 2)).toBeNull();
    expect(attachmentCountRefusal(3, 3)).toBe(
      'A message carries at most 5 attachments (got 6). Nothing was sent.',
    );
  });
});

describe('conversationFolderId', () => {
  it('returns the last folder of the path', async () => {
    const fake = fakeContext({ [CONVERSATION_FOLDER_PATH]: FOLDER });
    expect(await conversationFolderId(fake.ctx.client)).toBe(77);
  });

  it('explains a missing folder', async () => {
    const missing = fakeContext({ [CONVERSATION_FOLDER_PATH]: new Error('404') });
    await expect(conversationFolderId(missing.ctx.client)).rejects.toThrow(
      'use prepare_attachment_upload instead',
    );
    const empty = fakeContext({ [CONVERSATION_FOLDER_PATH]: [] });
    await expect(conversationFolderId(empty.ctx.client)).rejects.toThrow('no "conversation');
  });
});

describe('fetchAttachmentFile', () => {
  it('reads the file or says it is not accessible', async () => {
    const fake = fakeContext({ '/files/5': { id: 5 } });
    expect(await fetchAttachmentFile(fake.ctx.client, 5)).toEqual({ id: 5 });
    await expect(fetchAttachmentFile(fake.ctx.client, 6)).rejects.toThrow(
      'Canvas file 6 is not accessible',
    );
  });
});

describe('needsConversationCopy and copyToConversationFolder', () => {
  it('copies only files outside the folder, renaming on clash', async () => {
    expect(needsConversationCopy({ id: 1, folder_id: '77' }, 77)).toBe(false);
    expect(needsConversationCopy({ id: 1, folder_id: 3 }, 77)).toBe(true);
    const fake = fakeContext({ '/folders/77/copy_file': { id: 9 } });
    expect(await copyToConversationFolder(fake.ctx.client, { id: 1 }, 77)).toEqual({ id: 9 });
    expect(fake.post).toHaveBeenCalledWith('/folders/77/copy_file', {
      source_file_id: '1',
      on_duplicate: 'rename',
    });
  });
});

describe('resolveFileAttachments', () => {
  it('does nothing without ids', async () => {
    const fake = fakeContext();
    expect(await resolveFileAttachments(fake.ctx.client, undefined)).toEqual([]);
    expect(fake.get).not.toHaveBeenCalled();
  });

  it('keeps files in the folder and copies the others', async () => {
    const fake = fakeContext({
      [CONVERSATION_FOLDER_PATH]: FOLDER,
      '/files/1': { id: 1, folder_id: 77 },
      '/files/2': { id: 2, folder_id: 3 },
      '/folders/77/copy_file': { id: 20, folder_id: 77 },
    });
    const ready = await resolveFileAttachments(fake.ctx.client, [1, '2']);
    expect(ready.map((f) => f.id)).toEqual([1, 20]);
  });

  it('checks every file before copying any', async () => {
    const fake = fakeContext({
      [CONVERSATION_FOLDER_PATH]: FOLDER,
      '/files/2': { id: 2, folder_id: 3 },
    });
    await expect(resolveFileAttachments(fake.ctx.client, [2, 404])).rejects.toThrow('404');
    expect(fake.post).not.toHaveBeenCalled();
  });
});

describe('collectMessageAttachments', () => {
  it('uploads inline files and adds the referenced ones', async () => {
    const fake = fakeContext({
      [CONVERSATION_FOLDER_PATH]: FOLDER,
      '/files/1': { id: 1, folder_id: 77 },
      '/users/self/files': { upload_url: 'https://up.test/x' },
      'https://up.test/x': { id: 9 },
    });
    const all = await collectMessageAttachments(fake.ctx.client, {
      attachments: [{ file_name: 'a.txt', content: 'hi', encoding: 'text' }],
      file_ids: [1],
    });
    expect(all.map((f) => f.id)).toEqual([9, 1]);
    expect(await collectMessageAttachments(fake.ctx.client, {})).toEqual([]);
  });

  it('refuses too many before any call', async () => {
    const fake = fakeContext();
    await expect(
      collectMessageAttachments(fake.ctx.client, { file_ids: [1, 2, 3, 4, 5, 6] }),
    ).rejects.toThrow('at most 5');
    expect(fake.get).not.toHaveBeenCalled();
  });
});

describe('shellQuote and curlUploadCommand', () => {
  it('quotes single quotes safely', () => {
    expect(shellQuote("a'b; rm -rf /")).toBe(`'a'\\''b; rm -rf /'`);
  });

  it('sends the params as plain strings and the file last', () => {
    const cmd = curlUploadCommand({
      upload_url: 'https://up.test/x?a=1',
      upload_params: { token: "t'k", filename: '@etc' },
    });
    expect(cmd).toBe(
      `curl -sS -X POST 'https://up.test/x?a=1' --form-string 'token=t'\\''k' --form-string 'filename=@etc' -F 'file=@'"${LOCAL_PATH_PLACEHOLDER}"`,
    );
    expect(curlUploadCommand({ upload_url: 'u' })).toBe(
      `curl -sS -X POST 'u' -F 'file=@'"${LOCAL_PATH_PLACEHOLDER}"`,
    );
  });
});

describe('prepareAttachmentUpload', () => {
  it('asks for a slot in the conversation folder and returns the command', async () => {
    const fake = fakeContext({
      '/users/self/files': { upload_url: 'https://up.test/x', upload_params: { k: 'v' } },
    });
    const result = await prepareAttachmentUpload(fake.ctx.client, {
      file_name: ' docs.zip ',
      size: 10,
    });
    expect(fake.post).toHaveBeenCalledWith('/users/self/files', {
      name: 'docs.zip',
      size: 10,
      content_type: 'application/zip',
      parent_folder_path: 'conversation attachments',
      on_duplicate: 'rename',
    });
    expect(result).toMatchObject({ file_name: 'docs.zip', next_steps: DIRECT_UPLOAD_NEXT_STEPS });
    expect(result.curl).toContain(`--form-string 'k=v'`);
  });
});
