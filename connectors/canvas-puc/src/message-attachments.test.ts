import { describe, expect, it } from 'vitest';
import { fakeContext } from './fixtures/fake-context.js';
import {
  attachmentIds,
  attachmentsRefusal,
  attachmentSummary,
  attachmentUploadError,
  ATTACHMENTS_LIMIT_TEXT,
  CONVERSATION_ATTACHMENTS_FOLDER,
  prepareAttachments,
  uploadMessageAttachment,
  uploadMessageAttachments,
} from './message-attachments.js';
import { MAX_UPLOAD_BYTES } from './upload.js';

function bytesFile(name: string, size: number) {
  return { name, bytes: new Uint8Array(size), contentType: 'application/zip' };
}

describe('attachmentsRefusal', () => {
  it('is null when every file fits and names the first empty or oversized one', () => {
    expect(
      attachmentsRefusal([bytesFile('a.zip', 1), bytesFile('b.zip', MAX_UPLOAD_BYTES)]),
    ).toBeNull();
    expect(attachmentsRefusal([bytesFile('a.zip', 0)])).toBe(
      'Attachment "a.zip": The file is empty. Nothing was sent.',
    );
    expect(
      attachmentsRefusal([bytesFile('ok.zip', 1), bytesFile('big.zip', MAX_UPLOAD_BYTES + 1)]),
    ).toContain('Attachment "big.zip": The file is 5.0 MB, above the 5 MB limit');
  });
});

describe('prepareAttachments', () => {
  it('decodes the files (none when absent) and throws on a refusal', () => {
    expect(prepareAttachments(undefined)).toEqual([]);
    const [file] = prepareAttachments([{ file_name: 'a.txt', content: 'hi', encoding: 'text' }]);
    expect(file).toMatchObject({ name: 'a.txt', contentType: 'text/plain' });
    expect(() =>
      prepareAttachments([{ file_name: 'e.txt', content: '', encoding: 'text' }]),
    ).toThrow('empty');
  });
});

describe('attachmentUploadError', () => {
  it('names the file and says nothing was sent', () => {
    expect(attachmentUploadError('a.pdf', new Error('500')).message).toBe(
      'Could not upload attachment "a.pdf" (500). Nothing was sent.',
    );
  });
});

describe('uploadMessageAttachment and uploadMessageAttachments', () => {
  it('uploads to the conversation attachments folder, in order', async () => {
    const fake = fakeContext({
      '/users/self/files': { upload_url: 'https://up.test/x' },
      'https://up.test/x': { id: 9, display_name: 'a.zip', size: 1 },
    });
    const one = await uploadMessageAttachment(fake.ctx.client, bytesFile('a.zip', 1));
    expect(one.id).toBe(9);
    expect(fake.post.mock.calls[0]![1]).toMatchObject({
      parent_folder_path: CONVERSATION_ATTACHMENTS_FOLDER,
    });
    const many = await uploadMessageAttachments(fake.ctx.client, [
      bytesFile('a.zip', 1),
      bytesFile('b.zip', 2),
    ]);
    expect(many).toHaveLength(2);
    expect(fake.post.mock.calls.slice(1).map((c) => (c[1] as { name: string }).name)).toEqual([
      'a.zip',
      'b.zip',
    ]);
  });

  it('stops at the first failure with a clear error', async () => {
    const fake = fakeContext({ '/users/self/files': new Error('Canvas answered 403') });
    await expect(
      uploadMessageAttachments(fake.ctx.client, [bytesFile('a.zip', 1), bytesFile('b.zip', 1)]),
    ).rejects.toThrow(
      'Could not upload attachment "a.zip" (Canvas answered 403). Nothing was sent.',
    );
    expect(fake.post).toHaveBeenCalledTimes(1);
  });
});

describe('attachmentIds and attachmentSummary', () => {
  it('keeps the ids that exist and summarizes id, name and size', () => {
    const files = [{ id: 1, display_name: 'a', size: 2, url: 'u' }, { display_name: 'no id' }];
    expect(attachmentIds(files)).toEqual([1]);
    expect(attachmentSummary(files)).toEqual([
      { id: 1, name: 'a', size: 2 },
      { id: undefined, name: 'no id', size: undefined },
    ]);
  });
});

describe('ATTACHMENTS_LIMIT_TEXT', () => {
  it('states the limits', () => {
    expect(ATTACHMENTS_LIMIT_TEXT).toBe('up to 5 files of at most 5 MB each');
  });
});
