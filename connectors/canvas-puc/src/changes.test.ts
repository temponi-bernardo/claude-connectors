import { describe, expect, it } from 'vitest';
import { toToolResult } from '../../../src/mcp/tools.js';
import {
  announcementStamps,
  assignmentStamps,
  changedSinceArg,
  checkedAtNote,
  conversationStamps,
  keepChanged,
  latestStamp,
  topicStamps,
  withCheckedAt,
} from './changes.js';

describe('latestStamp', () => {
  it('returns the latest valid timestamp in milliseconds', () => {
    expect(latestStamp(['2026-01-01T00:00:00Z', null, '2026-03-01T00:00:00Z', undefined])).toBe(
      Date.parse('2026-03-01T00:00:00Z'),
    );
  });

  it('returns NaN when no timestamp is valid', () => {
    expect(latestStamp([null, undefined, 'not a date'])).toBeNaN();
  });
});

function stampOf(item: { at: string | null }): (string | null)[] {
  return [item.at];
}

describe('keepChanged', () => {
  const items = [
    { id: 1, at: '2026-05-01T10:00:00Z' },
    { id: 2, at: '2026-05-03T10:00:00Z' },
    { id: 3, at: null },
  ];

  it('returns every item when there is no cursor', () => {
    expect(keepChanged(items, undefined, stampOf)).toBe(items);
  });

  it('keeps items changed at or after the cursor and items with no date (conservative)', () => {
    expect(keepChanged(items, '2026-05-03T10:00:00Z', stampOf).map((i) => i.id)).toEqual([2, 3]);
  });
});

describe('stamp readers', () => {
  it('assignment: own update, submission and grading dates', () => {
    expect(
      assignmentStamps({
        id: 1,
        updated_at: 'a',
        submission: { submitted_at: 'b', graded_at: 'c' },
      }),
    ).toEqual(['a', 'b', 'c']);
    expect(assignmentStamps({ id: 1 })).toEqual([undefined, undefined, undefined]);
  });

  it('announcement, topic and conversation dates', () => {
    expect(announcementStamps({ id: 1, posted_at: 'p' })).toEqual(['p']);
    expect(topicStamps({ id: 1, posted_at: 'p', last_reply_at: 'r' })).toEqual(['p', 'r']);
    expect(conversationStamps({ id: 1, last_message_at: 'm' })).toEqual(['m']);
  });
});

describe('changedSinceArg', () => {
  it('accepts an ISO timestamp with offset and rejects free text', () => {
    expect(changedSinceArg.parse('2026-05-03T10:00:00-03:00')).toBe('2026-05-03T10:00:00-03:00');
    expect(changedSinceArg.parse(undefined)).toBeUndefined();
    expect(() => changedSinceArg.parse('yesterday')).toThrow();
  });
});

describe('withCheckedAt', () => {
  it('returns the data plus a checked_at note with the cursor for the next call', () => {
    const now = new Date('2026-05-03T10:00:00.000Z');
    const result = toToolResult(withCheckedAt([{ id: 1 }], now));
    expect(result.content).toEqual([
      { type: 'text', text: '[{"id":1}]' },
      { type: 'text', text: checkedAtNote(now) },
    ]);
    expect(checkedAtNote(now)).toContain('checked_at=2026-05-03T10:00:00.000Z');
  });
});
