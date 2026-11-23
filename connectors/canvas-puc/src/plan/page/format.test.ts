import { describe, expect, it } from 'vitest';
import { formatDayMonth, formatStamp, saoPauloParts, saoPauloToday, weekdayOf } from './format.js';

describe('formatDayMonth', () => {
  it('shows DD/MM', () => {
    expect(formatDayMonth('2026-11-03')).toBe('03/11');
  });
});

describe('weekdayOf', () => {
  it.each([
    ['2026-11-23', 'seg'],
    ['2026-11-28', 'sáb'],
    ['2026-11-29', 'dom'],
  ])('%s is %s', (date, weekday) => {
    expect(weekdayOf(date)).toBe(weekday);
  });
});

describe('saoPauloParts and formatStamp', () => {
  it('converts the instant to São Paulo time', () => {
    expect(saoPauloParts(new Date('2026-11-23T10:05:00Z')).hour).toBe('07');
    expect(formatStamp('2026-11-23T10:05:00Z')).toBe('23/11/2026, 07h05');
  });
});

describe('saoPauloToday', () => {
  it('is still the previous day late at night in UTC terms', () => {
    expect(saoPauloToday(new Date('2026-11-24T02:30:00Z'))).toBe('2026-11-23');
  });
});
