/** Pure text formatting of the plan page (pt-BR, America/Sao_Paulo). */

/** Time zone of every date and time the plan shows. */
export const PLAN_TIME_ZONE = 'America/Sao_Paulo';

/** Short weekday names in pt-BR, Sunday first. */
export const WEEKDAYS_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const;

/** "DD/MM" of a YYYY-MM-DD date. */
export function formatDayMonth(isoDate: string): string {
  return `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}`;
}

/** Short pt-BR weekday of a YYYY-MM-DD date ("seg"). */
export function weekdayOf(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const index = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1)).getUTCDay();
  return WEEKDAYS_PT[index] ?? '';
}

/** Parts of an instant in São Paulo time, keyed by part type (year, month, day, hour, minute). */
export function saoPauloParts(instant: Date): Record<string, string> {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: PLAN_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(instant);
  return Object.fromEntries(parts.map((p) => [p.type, p.value]));
}

/** "DD/MM/AAAA, HHhMM" of an ISO instant, in São Paulo time ("23/11/2026, 07h00"). */
export function formatStamp(isoInstant: string): string {
  const p = saoPauloParts(new Date(isoInstant));
  return `${p.day ?? ''}/${p.month ?? ''}/${p.year ?? ''}, ${p.hour ?? ''}h${p.minute ?? ''}`;
}

/** Today's date (YYYY-MM-DD) in São Paulo. */
export function saoPauloToday(now: Date): string {
  const p = saoPauloParts(now);
  return `${p.year ?? ''}-${p.month ?? ''}-${p.day ?? ''}`;
}
