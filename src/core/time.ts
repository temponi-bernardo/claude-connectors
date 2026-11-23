/**
 * Pure time-zone math with `Intl` (no libraries): offsets and the start of a local day.
 */

const MINUTE_MS = 60_000;

/** Offset of `timeZone` from UTC at `instant`, in minutes (São Paulo → -180); throws `RangeError` on an unknown zone. */
export function zoneOffsetMinutes(instant: Date, timeZone: string): number {
  const label = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(instant)
    .find((part) => part.type === 'timeZoneName')?.value;
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(label ?? '');
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === '-' ? -minutes : minutes;
}

/** 00:00 of the calendar day that contains `instant` in `timeZone`, as an instant. */
export function startOfDayIn(instant: Date, timeZone: string): Date {
  const local = new Date(instant.getTime() + zoneOffsetMinutes(instant, timeZone) * MINUTE_MS);
  const midnight = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const guess = new Date(midnight - zoneOffsetMinutes(instant, timeZone) * MINUTE_MS);
  return new Date(midnight - zoneOffsetMinutes(guess, timeZone) * MINUTE_MS);
}
