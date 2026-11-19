import { describe, expect, it } from 'vitest';
import { fakeContext } from './fixtures/fake-context.js';
import {
  MAX_UPLOAD_BYTES,
  decodeUploadContent,
  extensionRefusal,
  fileExtension,
  onlineUploadPayload,
  submitFileAssignment,
  uploadContentType,
  uploadRefusal,
  uploadSizeRefusal,
  uploadedFileFromArgs,
  uploadCanvasFile,
} from './upload.js';

describe('decodeUploadContent', () => {
  it('encodes text as UTF-8', () => {
    expect(Array.from(decodeUploadContent('é', 'text'))).toEqual([0xc3, 0xa9]);
  });

  it('decodes base64, ignoring whitespace', () => {
    expect(Array.from(decodeUploadContent('AQI D\n', 'base64'))).toEqual([1, 2, 3]);
  });

  it('rejects content that is not base64', () => {
    expect(() => decodeUploadContent('not base64!', 'base64')).toThrow(/base64/);
    expect(() => decodeUploadContent('abc', 'base64')).toThrow(/base64/);
  });
});

describe('fileExtension', () => {
  it('returns the lowercase extension, or an empty string', () => {
    expect(fileExtension('Report.TXT')).toBe('txt');
    expect(fileExtension('a.tar.gz')).toBe('gz');
    expect(fileExtension('README')).toBe('');
    expect(fileExtension('.env')).toBe('');
  });
});

describe('uploadContentType', () => {
  it('maps common extensions and falls back to octet-stream', () => {
    expect(uploadContentType('r.txt')).toBe('text/plain');
    expect(uploadContentType('r.PDF')).toBe('application/pdf');
    expect(uploadContentType('r.xyz')).toBe('application/octet-stream');
  });
});

describe('extensionRefusal', () => {
  it('accepts any extension when the list is empty or missing', () => {
    expect(extensionRefusal(undefined, 'a.txt')).toBeNull();
    expect(extensionRefusal([], 'a.exe')).toBeNull();
  });

  it('accepts a listed extension regardless of case and refuses others', () => {
    expect(extensionRefusal(['TXT', 'pdf'], 'a.txt')).toBeNull();
    expect(extensionRefusal(['pdf'], 'a.txt')).toMatch(/only accepts: pdf/);
    expect(extensionRefusal(['pdf'], 'noext')).toMatch(/no extension/);
  });
});

describe('uploadSizeRefusal', () => {
  it('refuses empty files and files above the limit', () => {
    expect(uploadSizeRefusal(0)).toMatch(/empty/);
    expect(uploadSizeRefusal(MAX_UPLOAD_BYTES + 1)).toMatch(/5 MB/);
    expect(uploadSizeRefusal(10)).toBeNull();
  });
});

describe('uploadRefusal', () => {
  const upload = { id: 1, name: 'T24', submission_types: ['online_upload'] };

  it('refuses assignments that do not accept file uploads', () => {
    const text = { id: 1, name: 'T', submission_types: ['online_text_entry'] };
    expect(uploadRefusal(text, 'a.txt', 3)).toMatch(
      /does not accept file uploads.*online_text_entry/,
    );
    expect(uploadRefusal({ id: 1 }, 'a.txt', 3)).toMatch(/does not accept/);
  });

  it('checks the extension and the size', () => {
    expect(uploadRefusal({ ...upload, allowed_extensions: ['pdf'] }, 'a.txt', 3)).toMatch(/pdf/);
    expect(uploadRefusal(upload, 'a.txt', 0)).toMatch(/empty/);
    expect(uploadRefusal(upload, 'a.txt', 3)).toBeNull();
  });
});

describe('onlineUploadPayload', () => {
  it('builds the online_upload submission with the file IDs', () => {
    expect(onlineUploadPayload([7])).toEqual({
      submission: { submission_type: 'online_upload', file_ids: [7] },
    });
  });
});

describe('uploadedFileFromArgs', () => {
  it('decodes the content and guesses the type unless given', () => {
    const file = uploadedFileFromArgs({ file_name: ' r.txt ', content: 'hi', encoding: 'text' });
    expect(file).toMatchObject({ name: 'r.txt', contentType: 'text/plain' });
    expect(Array.from(file.bytes)).toEqual([104, 105]);
    const typed = uploadedFileFromArgs({
      file_name: 'r.bin',
      content: 'AQ==',
      encoding: 'base64',
      content_type: 'image/png',
    });
    expect(typed.contentType).toBe('image/png');
  });
});

describe('submitFileAssignment', () => {
  const base = '/courses/1/assignments/2';
  const file = { name: 'r.txt', contentType: 'text/plain', bytes: new Uint8Array([104, 105]) };
  const slot = { upload_url: 'https://up.test/u', upload_params: { k: 'v' } };

  it('checks the assignment, uploads the file and submits it', async () => {
    const fake = fakeContext({
      [base]: { id: 2, name: 'T24', submission_types: ['online_upload'] },
      [`${base}/submissions/self/files`]: slot,
      'https://up.test/u': { id: 99, display_name: 'r.txt', size: 2 },
      [`${base}/submissions`]: { submitted_at: 'd', attempt: 1 },
    });
    const result = await submitFileAssignment(fake.ctx.client, base, file);
    expect(fake.post).toHaveBeenCalledWith(`${base}/submissions/self/files`, {
      name: 'r.txt',
      size: 2,
      content_type: 'text/plain',
    });
    expect(fake.upload).toHaveBeenCalledWith(slot, file);
    expect(fake.post).toHaveBeenCalledWith(`${base}/submissions`, onlineUploadPayload([99]));
    expect(result).toEqual({
      ok: true,
      submitted_at: 'd',
      attempt: 1,
      file: { id: 99, name: 'r.txt', size: 2 },
    });
  });

  it('refuses before uploading anything when the assignment does not take files', async () => {
    const fake = fakeContext({ [base]: { id: 2, name: 'T', submission_types: ['online_url'] } });
    await expect(submitFileAssignment(fake.ctx.client, base, file)).rejects.toThrow(
      /does not accept file uploads/,
    );
    expect(fake.post).not.toHaveBeenCalled();
    expect(fake.upload).not.toHaveBeenCalled();
  });
});

describe('uploadCanvasFile', () => {
  it('asks the slot with the file fields plus the extras, then uploads to it', async () => {
    const fake = fakeContext({
      '/users/self/files': { upload_url: 'https://up.test/1' },
      'https://up.test/1': { id: 4 },
    });
    const file = { name: 'a.txt', bytes: new Uint8Array([1, 2]), contentType: 'text/plain' };
    const extra = { parent_folder_path: 'conversation attachments' };
    await expect(
      uploadCanvasFile(fake.ctx.client, { path: '/users/self/files', file, extra }),
    ).resolves.toEqual({ id: 4 });
    expect(fake.post).toHaveBeenCalledWith('/users/self/files', {
      name: 'a.txt',
      size: 2,
      content_type: 'text/plain',
      parent_folder_path: 'conversation attachments',
    });
    expect(fake.upload.mock.calls[0]![1]).toBe(file);
  });
});
