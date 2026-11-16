import { describe, expect, it } from 'vitest';
import {
  chunkDescription,
  chunkMimeType,
  chunkUri,
  isRangeAnswer,
  MAX_CHUNK_BYTES,
  planDownloadChunk,
  rangeHeaders,
  type DownloadChunk,
} from './chunks.js';

const MB = 1024 * 1024;
const pdf = { display_name: 'a.pdf', url: 'u', 'content-type': 'application/pdf' };

describe('planDownloadChunk', () => {
  it('returns the whole file when it fits in one part', () => {
    expect(planDownloadChunk(3 * MB, {})).toEqual({
      start: 0,
      end: 3 * MB,
      total: 3 * MB,
      step: 8 * MB,
      whole: true,
    });
    expect(planDownloadChunk(0, {})).toEqual({
      start: 0,
      end: 0,
      total: 0,
      step: 8 * MB,
      whole: true,
    });
  });

  it('splits a large file into parts of at most 8 MB', () => {
    expect(MAX_CHUNK_BYTES).toBe(8 * MB);
    expect(planDownloadChunk(23 * MB, {})).toEqual({
      start: 0,
      end: 8 * MB,
      total: 23 * MB,
      step: 8 * MB,
      whole: false,
    });
    expect(planDownloadChunk(23 * MB, { offset: 16 * MB })).toEqual({
      start: 16 * MB,
      end: 23 * MB,
      total: 23 * MB,
      step: 8 * MB,
      whole: false,
    });
  });

  it('honours a shorter length and caps a longer one', () => {
    expect(planDownloadChunk(10, { offset: 2, length: 3 })).toMatchObject({
      start: 2,
      end: 5,
      step: 3,
      whole: false,
    });
    expect(planDownloadChunk(20 * MB, { length: 50 * MB })).toMatchObject({ end: 8 * MB });
    expect(planDownloadChunk(10, { offset: 0, length: 10 })).toMatchObject({ whole: true });
  });

  it('refuses an offset past the end', () => {
    expect(planDownloadChunk(10, { offset: 10 })).toBe(
      'offset 10 is past the end of the file (10 bytes).',
    );
  });
});

describe('chunkDescription', () => {
  it('describes a whole file like a regular download', () => {
    const chunk: DownloadChunk = { start: 0, end: 2048, total: 2048, step: 8 * MB, whole: true };
    expect(chunkDescription(pdf, chunk)).toBe('"a.pdf" (application/pdf, 2 KB). Link: u');
  });

  it('describes a part with its byte range and the next offset', () => {
    const first: DownloadChunk = {
      start: 0,
      end: 8 * MB,
      total: 23 * MB,
      step: 8 * MB,
      whole: false,
    };
    expect(chunkDescription(pdf, first)).toBe(
      '"a.pdf" (application/pdf, 23552 KB) is sent in parts of raw bytes. This part: bytes 0–8388607 of 24117248 (part 1 of 3). Save the parts in order and join them; next part: download_file with offset=8388608. Link: u',
    );
    const last: DownloadChunk = {
      start: 16 * MB,
      end: 23 * MB,
      total: 23 * MB,
      step: 8 * MB,
      whole: false,
    };
    expect(chunkDescription(pdf, last)).toContain(
      '(part 3 of 3). Save the parts in order and join them; this is the last part.',
    );
  });
});

describe('chunkMimeType and chunkUri', () => {
  it('keep the real type and link for a whole file and mark a part as raw bytes', () => {
    const whole: DownloadChunk = { start: 0, end: 1, total: 1, step: 1, whole: true };
    const part: DownloadChunk = { start: 5, end: 9, total: 20, step: 4, whole: false };
    expect(chunkMimeType(pdf, whole)).toBe('application/pdf');
    expect(chunkMimeType({}, whole)).toBe('application/octet-stream');
    expect(chunkMimeType(pdf, part)).toBe('application/octet-stream');
    expect(chunkUri('u', whole)).toBe('u');
    expect(chunkUri('u', part)).toBe('u#bytes=5-8');
  });
});

describe('rangeHeaders and isRangeAnswer', () => {
  const part: DownloadChunk = { start: 5, end: 9, total: 20, step: 4, whole: false };

  it('asks for the byte range of a part only', () => {
    expect(rangeHeaders(part)).toEqual({ range: 'bytes=5-8' });
    expect(rangeHeaders({ ...part, start: 0, end: 20, whole: true })).toEqual({});
  });

  it('accepts only a 206 that starts at the asked byte', () => {
    const ok = new Response('x', { status: 206, headers: { 'content-range': 'bytes 5-8/20' } });
    const other = new Response('x', { status: 206, headers: { 'content-range': 'bytes 0-8/20' } });
    expect(isRangeAnswer(ok, part)).toBe(true);
    expect(isRangeAnswer(other, part)).toBe(false);
    expect(isRangeAnswer(new Response('x'), part)).toBe(false);
  });
});
