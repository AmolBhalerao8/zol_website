/**
 * All mock timestamps are derived from these helpers at module load, so the
 * dataset always reads as "today" and never rots into a stale calendar date.
 */

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Fixed render-time anchor, evaluated once per server render. */
const now = Date.now();

export function minutesAgo(minutes: number): Date {
  return new Date(now - minutes * MINUTE);
}

export function hoursAgo(hours: number): Date {
  return new Date(now - hours * HOUR);
}

export function daysAgo(days: number): Date {
  return new Date(now - days * DAY);
}

/** `daysAgo`, then pinned to a specific wall-clock time that day. */
export function dayAt(days: number, hour: number, minute = 0): Date {
  const date = new Date(now - days * DAY);
  date.setHours(hour, minute, 0, 0);
  return date;
}

/** Monday of the current week, at midnight. */
export function startOfWeek(): Date {
  const date = new Date(now);
  const weekday = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - weekday);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** 0 = Monday .. 6 = Sunday, for the current render. */
export function todayIndex(): number {
  return (new Date(now).getDay() + 6) % 7;
}
