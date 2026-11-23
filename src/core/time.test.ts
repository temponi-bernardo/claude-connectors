import { describe, expect, it } from 'vitest';
import { startOfDayIn, zoneOffsetMinutes } from './time.js';

const SP = 'America/Sao_Paulo';

describe('zoneOffsetMinutes', () => {
  it('reads the offset of a zone at an instant', () => {
    expect(zoneOffsetMinutes(new Date('2026-11-23T12:00:00Z'), SP)).toBe(-180);
    expect(zoneOffsetMinutes(new Date('2026-07-01T12:00:00Z'), 'Asia/Kolkata')).toBe(330);
  });

  it('reads zero for UTC', () => {
    expect(zoneOffsetMinutes(new Date('2026-11-23T12:00:00Z'), 'UTC')).toBe(0);
  });

  it('follows daylight saving time', () => {
    expect(zoneOffsetMinutes(new Date('2026-07-01T12:00:00Z'), 'America/New_York')).toBe(-240);
    expect(zoneOffsetMinutes(new Date('2026-12-01T12:00:00Z'), 'America/New_York')).toBe(-300);
  });

  it('rejects an unknown time zone', () => {
    expect(() => zoneOffsetMinutes(new Date(), 'Mars/Olympus')).toThrow(RangeError);
  });
});

describe('startOfDayIn', () => {
  it('returns 00:00 of the local day as an instant', () => {
    const start = startOfDayIn(new Date('2026-11-23T14:30:00Z'), SP);
    expect(start.toISOString()).toBe('2026-11-23T03:00:00.000Z');
  });

  it('uses the local date, not the UTC one, late at night', () => {
    // 23:30 on the 22nd in São Paulo is already the 23rd in UTC.
    const start = startOfDayIn(new Date('2026-11-23T02:30:00Z'), SP);
    expect(start.toISOString()).toBe('2026-11-22T03:00:00.000Z');
  });

  it('keeps an instant that is already midnight', () => {
    const midnight = new Date('2026-11-23T03:00:00Z');
    expect(startOfDayIn(midnight, SP).toISOString()).toBe(midnight.toISOString());
  });

  it('handles zones ahead of UTC and the day daylight saving time starts', () => {
    expect(startOfDayIn(new Date('2026-07-01T00:10:00Z'), 'Asia/Kolkata').toISOString()).toBe(
      '2026-06-30T18:30:00.000Z',
    );
    expect(startOfDayIn(new Date('2026-03-08T15:00:00Z'), 'America/New_York').toISOString()).toBe(
      '2026-03-08T05:00:00.000Z',
    );
  });
});
