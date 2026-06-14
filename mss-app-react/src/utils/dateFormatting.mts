import { DateTime } from 'luxon';

/**
 * Hybrid date formatting utility
 * Uses native Intl.DateTimeFormat for simple formatting (no timezone dependencies)
 * Falls back to Luxon only for timezone-dependent operations
 * This reduces bundle size by ~40-50KB compared to using Luxon for all formatting
 */

const longDateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

/**
 * Parse a date string, handling ISO date format specially to avoid UTC offset issues
 * ISO date strings (YYYY-MM-DD) are parsed as local dates, not UTC
 */
const parseDate = (date: Date | string): Date => {
  if (typeof date === 'string') {
    // If it's an ISO date string (YYYY-MM-DD), parse as local date to avoid UTC offset
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(date);
  }
  return date;
};

/**
 * Format a date to long format: "April 19, 2026"
 * Uses cached native Intl.DateTimeFormat (no Luxon)
 */
export const formatDateLong = (date: Date | string): string => {
  const d = parseDate(date);
  return longDateFormatter.format(d);
};

/**
 * Format a date to full weekday format: "Friday, April 19, 2026"
 * Uses cached native Intl.DateTimeFormat (no Luxon)
 */
export const formatWeekday = (date: Date | string): string => {
  const d = parseDate(date);
  return weekdayFormatter.format(d);
};

/**
 * Format a time in 12-hour format: "2:30 PM"
 * Uses cached native Intl.DateTimeFormat for basic formatting, but applies timezone logic
 * REQUIRES LUXON for timezone conversion to check if it's midnight ET
 */
export const formatTime = (timeWithOffset: string): string => {
  const dt = DateTime.fromISO(timeWithOffset);
  const easternTime = dt.setZone('America/New_York');
  if (easternTime.toFormat('t') === '12:00 AM') return 'TBA';

  const localTime = dt.toLocal();
  const d = localTime.toJSDate();
  return timeFormatter.format(d);
};

/**
 * Format game date/time with day name and date: { day: "Friday", date: "04/19" }
 * Handles timezone logic: uses Eastern time if midnight ET, otherwise local
 * REQUIRES LUXON for accurate timezone handling
 */
export const formatGameDateTime = (isoString: string) => {
  const dt = DateTime.fromISO(isoString);
  const eastern = dt.setZone('America/New_York');
  const isMidnight = eastern.toFormat('t') === '12:00 AM';
  const timeSource = isMidnight ? eastern : dt.toLocal();

  return { day: timeSource.toFormat('cccc'), date: timeSource.toFormat('LL/dd') };
};

/**
 * Get ISO date string for a time, handling Eastern timezone
 * Returns the Eastern date if it's midnight ET, otherwise local date
 * REQUIRES LUXON for accurate timezone conversion
 */
export const getDateForGame = (isoString: string): string => {
  const dt = DateTime.fromISO(isoString);
  const eastern = dt.setZone('America/New_York');
  return (eastern.toFormat('t') === '12:00 AM' ? eastern.toISODate() : dt.toLocal().toISODate()) ?? '';
};

/**
 * Parse ISO date string to native Date
 */
export const parseISO = (isoString: string): Date => {
  return new Date(isoString);
};

/**
 * Convert Date or ISO string to ISO date format: "2026-04-19"
 */
export const toISODate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * Convert Date or ISO string to ISO format with timezone offset
 */
export const toISO = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
};

/**
 * Get the current date in Eastern timezone as ISO date
 * REQUIRES LUXON for timezone accuracy
 */
export const getTodayEastern = (): string => {
  return DateTime.now().setZone('America/New_York').toISODate() ?? '';
};

/**
 * Convert ISO string to Eastern timezone and format as ISO
 * REQUIRES LUXON for accurate timezone conversion
 */
export const toEasternISO = (isoString: string): string => {
  return DateTime.fromISO(isoString).setZone('America/New_York').toISO() ?? '';
};
