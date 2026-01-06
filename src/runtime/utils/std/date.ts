/**
 * Date utilities built on @internationalized/date
 * Provides tree-shakeable functional API for date manipulation
 *
 * @example
 * import { add, format, today } from '#std/date'
 *
 * const nextMonth = add(today(), 1, 'month')
 * const formatted = format(nextMonth, 'MMMM D, YYYY') // "January 15, 2024"
 */

import type {
  CalendarDate,
  CalendarDateTime,
  DateValue,
  ZonedDateTime,
} from "@internationalized/date"
import {
  endOfWeek,
  getDayOfWeek,
  getLocalTimeZone,
  getWeeksInMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
  isToday,
  isWeekend,
  now as nowFromLib,
  parseDate,
  parseDateTime,
  parseZonedDateTime,
  startOfWeek,
  toCalendarDate,
  toCalendarDateTime,
  today as todayFromLib,
} from "@internationalized/date"

/**
 * Parse various date input formats into a DateValue
 */
function parseDateInput(input?: Date | string | DateValue): DateValue {
  // No argument - return current date
  if (!input) {
    return todayFromLib(getLocalTimeZone())
  }

  // Already a DateValue (CalendarDate, CalendarDateTime, or ZonedDateTime)
  if (typeof input === "object" && "calendar" in input) {
    return input
  }

  // Date object
  if (input instanceof Date) {
    const isoString = input.toISOString()
    // If time is midnight UTC, treat as date-only
    if (isoString.endsWith("T00:00:00.000Z")) {
      const datePart = isoString.split("T")[0]
      if (datePart) {
        return parseDate(datePart)
      }
    }
    // Otherwise parse as datetime with timezone
    return parseZonedDateTime(isoString)
  }

  // String parsing
  if (typeof input === "string") {
    // Try to detect format and parse accordingly
    if (input.includes("T") || input.includes(" ")) {
      // Has time component
      try {
        return parseZonedDateTime(input)
      } catch {
        try {
          return parseDateTime(input)
        } catch {
          // Fallback to date-only
          const datePart = input.split("T")[0]?.split(" ")[0]
          if (datePart) {
            return parseDate(datePart)
          }
        }
      }
    }
    // Date-only string (YYYY-MM-DD)
    return parseDate(input)
  }

  // Fallback to today
  return todayFromLib(getLocalTimeZone())
}

/**
 * Add time to a date
 * @param input - The date to add to
 * @param amount - The amount to add
 * @param unit - The unit of time to add
 * @returns The new date with time added
 * @example
 * add(someDate, 1, 'month')
 * add(someDate, 7, 'day')
 */
export function add(
  input: Date | string | DateValue,
  amount: number,
  unit: "day" | "week" | "month" | "year" | "hour" | "minute" | "second",
): DateValue {
  const dateValue = parseDateInput(input)
  return dateValue.add({ [unit + "s"]: amount })
}

/**
 * Subtract time from a date
 * @param input - The date to subtract from
 * @param amount - The amount to subtract
 * @param unit - The unit of time to subtract
 * @returns The new date with time subtracted
 * @example
 * subtract(someDate, 1, 'month')
 * subtract(someDate, 7, 'day')
 */
export function subtract(
  input: Date | string | DateValue,
  amount: number,
  unit: "day" | "week" | "month" | "year" | "hour" | "minute" | "second",
): DateValue {
  const dateValue = parseDateInput(input)
  return dateValue.subtract({ [unit + "s"]: amount })
}

/**
 * Set specific date/time values
 * @param input - The date to modify
 * @param values - Object containing the date/time values to set
 * @returns The new date with values set
 * @example
 * set(someDate, { day: 15, month: 3 })
 */
export function set(
  input: Date | string | DateValue,
  values: {
    year?: number
    month?: number
    day?: number
    hour?: number
    minute?: number
    second?: number
  },
): DateValue {
  let dateValue = parseDateInput(input)

  if (values.year !== undefined) dateValue = dateValue.set({ year: values.year })
  if (values.month !== undefined)
    dateValue = dateValue.set({ month: values.month })
  if (values.day !== undefined) dateValue = dateValue.set({ day: values.day })

  // For time components, ensure we have a CalendarDateTime or ZonedDateTime
  if (
    values.hour !== undefined ||
    values.minute !== undefined ||
    values.second !== undefined
  ) {
    if (!("hour" in dateValue)) {
      dateValue = toCalendarDateTime(dateValue as CalendarDate)
    }
    if (values.hour !== undefined)
      dateValue = (dateValue as CalendarDateTime | ZonedDateTime).set({
        hour: values.hour,
      })
    if (values.minute !== undefined)
      dateValue = (dateValue as CalendarDateTime | ZonedDateTime).set({
        minute: values.minute,
      })
    if (values.second !== undefined)
      dateValue = (dateValue as CalendarDateTime | ZonedDateTime).set({
        second: values.second,
      })
  }

  return dateValue
}

/**
 * Convert to native JavaScript Date object
 * @param input - The date to convert
 * @param timeZone - Optional timezone (defaults to local timezone)
 * @returns JavaScript Date object
 * @example
 * toDate(someDate)
 */
export function toDate(input: Date | string | DateValue, timeZone?: string): Date {
  // Optimization: if already a Date object, return as-is (unless timezone conversion needed)
  if (input instanceof Date && !timeZone) {
    return input
  }

  const dateValue = parseDateInput(input)
  const tz = timeZone ?? getLocalTimeZone()
  return toCalendarDate(dateValue).toDate(tz)
}

/**
 * Format the date using Day.js-compatible format tokens
 *
 * Supports all standard Day.js tokens: YYYY, MM, DD, HH, mm, ss, etc.
 * For a complete list of format tokens, see: https://day.js.org/docs/en/display/format
 *
 * @param input - The date to format
 * @param formatString - Format string using Day.js tokens (default: 'YYYY-MM-DD')
 * @param locale - Locale for month/weekday names (default: 'en-US')
 * @returns Formatted date string
 * @example
 * format(someDate, 'YYYY-MM-DD')
 * format(someDate, 'DD/MM/YYYY HH:mm:ss')
 * format(someDate, 'MMMM D, YYYY')
 * format(someDate, 'MMM DD, YYYY h:mm A')
 */
export function format(
  input: Date | string | DateValue,
  formatString = "YYYY-MM-DD",
  locale = "en-US",
): string {
  const jsDate = toDate(input)

  // Helper to pad numbers
  const pad = (num: number, length = 2): string =>
    String(num).padStart(length, "0")

  // Helper to get locale-specific names
  const getMonthName = (monthIndex: number, short = false): string => {
    const date = new Date(2000, monthIndex, 1)
    return new Intl.DateTimeFormat(locale, {
      month: short ? "short" : "long",
    }).format(date)
  }

  // Cache format map (constant, no need to recreate)
  const formatMap = {
    short: "short",
    long: "long",
    narrow: "narrow",
  } as const

  const getWeekdayName = (dayIndex: number, format: "short" | "long" | "narrow"): string => {
    // dayIndex is 0-6 where 0 is Sunday
    const date = new Date(2000, 0, 2 + dayIndex) // Jan 2, 2000 was a Sunday
    return new Intl.DateTimeFormat(locale, {
      weekday: formatMap[format],
    }).format(date)
  }

  // Extract date/time components
  const year = jsDate.getFullYear()
  const month = jsDate.getMonth() + 1 // 1-12
  const day = jsDate.getDate()
  const weekday = jsDate.getDay() // 0-6 (Sunday = 0)
  const hour24 = jsDate.getHours()
  const hour12 = hour24 % 12 || 12
  const minute = jsDate.getMinutes()
  const second = jsDate.getSeconds()
  const millisecond = jsDate.getMilliseconds()
  const isPM = hour24 >= 12

  // Token replacement map
  const tokens: Record<string, string> = {
    // Year
    YYYY: String(year),
    YY: String(year).slice(-2),

    // Month
    MMMM: getMonthName(month - 1, false),
    MMM: getMonthName(month - 1, true),
    MM: pad(month),
    M: String(month),

    // Day
    DD: pad(day),
    D: String(day),

    // Day of week
    dddd: getWeekdayName(weekday, "long"),
    ddd: getWeekdayName(weekday, "short"),
    dd: getWeekdayName(weekday, "narrow"),
    d: String(weekday),

    // Hour (24-hour)
    HH: pad(hour24),
    H: String(hour24),

    // Hour (12-hour)
    hh: pad(hour12),
    h: String(hour12),

    // Minute
    mm: pad(minute),
    m: String(minute),

    // Second
    ss: pad(second),
    s: String(second),

    // Millisecond
    SSS: pad(millisecond, 3),

    // AM/PM
    A: isPM ? "PM" : "AM",
    a: isPM ? "pm" : "am",
  }

  // Replace tokens in format string
  // Create a regex that matches all tokens at once, longest first
  const tokenPattern = Object.keys(tokens)
    .sort((a, b) => b.length - a.length)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")

  const regex = new RegExp(tokenPattern, "g")
  const result = formatString.replace(regex, (match) => tokens[match]!)

  return result
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 months")
 * @param input - The date to compare against now
 * @param locale - Locale for the relative time format (default: 'en-US')
 * @returns Relative time string
 * @example
 * relative(someDate) // "2 days ago"
 * relative(futureDate) // "in 3 months"
 */
export function relative(
  input: Date | string | DateValue,
  locale = "en-US",
): string {
  const nowMs = new Date().getTime()
  const targetMs = toDate(input).getTime()
  const diffMs = targetMs - nowMs
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHour / 24)
  const diffWeek = Math.round(diffDay / 7)
  const diffMonth = Math.round(diffDay / 30)
  const diffYear = Math.round(diffDay / 365)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, "second")
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute")
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour")
  if (Math.abs(diffDay) < 7) return rtf.format(diffDay, "day")
  if (Math.abs(diffWeek) < 4) return rtf.format(diffWeek, "week")
  if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, "month")
  return rtf.format(diffYear, "year")
}

/**
 * Convert to CalendarDate (date without time)
 * @param input - The date to convert
 * @returns CalendarDate object
 * @example
 * asCalendarDate(someDate)
 */
export function asCalendarDate(input: Date | string | DateValue): CalendarDate {
  const dateValue = parseDateInput(input)
  return toCalendarDate(dateValue)
}

/**
 * Convert to CalendarDateTime (date with time, no timezone)
 * @param input - The date to convert
 * @returns CalendarDateTime object
 * @example
 * asCalendarDateTime(someDate)
 */
export function asCalendarDateTime(
  input: Date | string | DateValue,
): CalendarDateTime {
  const dateValue = parseDateInput(input)
  if ("hour" in dateValue) return dateValue as CalendarDateTime
  return toCalendarDateTime(dateValue as CalendarDate)
}

/**
 * Convert to ZonedDateTime (date with time and timezone)
 * @param input - The date to convert
 * @param timeZone - Optional timezone (defaults to local timezone)
 * @returns ZonedDateTime object
 * @example
 * asZonedDateTime(someDate, 'America/New_York')
 */
export function asZonedDateTime(
  input: Date | string | DateValue,
  timeZone?: string,
): ZonedDateTime {
  const dateValue = parseDateInput(input)
  const tz = timeZone ?? getLocalTimeZone()
  if ("timeZone" in dateValue) return dateValue as ZonedDateTime

  // Convert to CalendarDateTime first if needed
  const dateTime =
    "hour" in dateValue
      ? (dateValue as CalendarDateTime)
      : toCalendarDateTime(dateValue as CalendarDate)

  // Create ZonedDateTime manually
  return parseZonedDateTime(`${dateTime.toString()}[${tz}]`)
}

/**
 * Check if this date is before another date
 * @param input - The first date
 * @param other - The date to compare against
 * @returns True if input is before other
 * @example
 * isBefore(date1, date2)
 */
export function isBefore(
  input: Date | string | DateValue,
  other: DateValue | Date | string,
): boolean {
  const dateValue = parseDateInput(input)
  const otherValue = parseDateInput(other)
  return dateValue.compare(otherValue) < 0
}

/**
 * Check if this date is after another date
 * @param input - The first date
 * @param other - The date to compare against
 * @returns True if input is after other
 * @example
 * isAfter(date1, date2)
 */
export function isAfter(
  input: Date | string | DateValue,
  other: DateValue | Date | string,
): boolean {
  const dateValue = parseDateInput(input)
  const otherValue = parseDateInput(other)
  return dateValue.compare(otherValue) > 0
}

/**
 * Check if this date is the same as another date
 * @param input - The first date
 * @param other - The date to compare against
 * @returns True if dates are equal
 * @example
 * isSame(date1, date2)
 */
export function isSame(
  input: Date | string | DateValue,
  other: DateValue | Date | string,
): boolean {
  const dateValue = parseDateInput(input)
  const otherValue = parseDateInput(other)
  return dateValue.compare(otherValue) === 0
}

/**
 * Calculate the difference between two dates
 * @param input - The first date
 * @param other - The second date to subtract
 * @param unit - The unit to return the difference in (default: 'millisecond')
 * @returns The difference between the two dates in the specified unit
 * @example
 * diff(date1, date2, 'days') // returns number of days between dates
 * diff(date1, date2, 'hours') // returns number of hours between dates
 */
export function diff(
  input: Date | string | DateValue,
  other: Date | string | DateValue,
  unit: "year" | "month" | "week" | "day" | "hour" | "minute" | "second" | "millisecond" = "millisecond",
): number {
  const date1Ms = toDate(input).getTime()
  const date2Ms = toDate(other).getTime()
  const diffMs = date1Ms - date2Ms

  switch (unit) {
    case "year":
      return diffMs / (1000 * 60 * 60 * 24 * 365.25)
    case "month":
      return diffMs / (1000 * 60 * 60 * 24 * 30.44) // Average month length
    case "week":
      return diffMs / (1000 * 60 * 60 * 24 * 7)
    case "day":
      return diffMs / (1000 * 60 * 60 * 24)
    case "hour":
      return diffMs / (1000 * 60 * 60)
    case "minute":
      return diffMs / (1000 * 60)
    case "second":
      return diffMs / 1000
    case "millisecond":
      return diffMs
    default:
      return diffMs
  }
}

/**
 * Check if a date is between two other dates
 * @param input - The date to check
 * @param start - The start date of the range
 * @param end - The end date of the range
 * @param inclusive - Whether to include the start and end dates (default: true)
 * @returns True if the date is within the range
 * @example
 * isBetween(date, startDate, endDate) // true if date is between start and end (inclusive)
 * isBetween(date, startDate, endDate, false) // exclusive check
 */
export function isBetween(
  input: Date | string | DateValue,
  start: Date | string | DateValue,
  end: Date | string | DateValue,
  inclusive = true,
): boolean {
  const dateValue = parseDateInput(input)
  const startValue = parseDateInput(start)
  const endValue = parseDateInput(end)

  if (inclusive) {
    return (
      dateValue.compare(startValue) >= 0 && dateValue.compare(endValue) <= 0
    )
  } else {
    return (
      dateValue.compare(startValue) > 0 && dateValue.compare(endValue) < 0
    )
  }
}

/**
 * Start of a time period
 * @param input - The date to get the start of
 * @param unit - The time period unit
 * @param locale - Locale for week start calculation (default: 'en-US')
 * @returns The start of the specified time period
 * @example
 * startOf(someDate, 'month')
 * startOf(someDate, 'week', 'en-US')
 */
export function startOf(
  input: Date | string | DateValue,
  unit: "day" | "week" | "month" | "year",
  locale = "en-US",
): CalendarDate {
  const dateValue = parseDateInput(input)
  const calDate = toCalendarDate(dateValue)

  switch (unit) {
    case "day":
      return calDate
    case "week":
      return startOfWeek(calDate, locale)
    case "month":
      return calDate.set({ day: 1 })
    case "year":
      return calDate.set({ month: 1, day: 1 })
    default:
      return calDate
  }
}

/**
 * End of a time period
 * @param input - The date to get the end of
 * @param unit - The time period unit
 * @param locale - Locale for week end calculation (default: 'en-US')
 * @returns The end of the specified time period
 * @example
 * endOf(someDate, 'month')
 * endOf(someDate, 'week', 'en-US')
 */
export function endOf(
  input: Date | string | DateValue,
  unit: "day" | "week" | "month" | "year",
  locale = "en-US",
): CalendarDate {
  const dateValue = parseDateInput(input)
  const calDate = toCalendarDate(dateValue)

  switch (unit) {
    case "day":
      return calDate
    case "week":
      return endOfWeek(calDate, locale)
    case "month": {
      // Get the last day of the month
      const nextMonth = calDate.add({ months: 1 }).set({ day: 1 })
      return nextMonth.subtract({ days: 1 })
    }
    case "year":
      return calDate.set({ month: 12, day: 31 })
    default:
      return calDate
  }
}

/**
 * Get today's date
 * @param timeZone - Optional timezone (defaults to local timezone)
 * @returns Today's date as a CalendarDate
 * @example
 * today()
 */
export function today(timeZone?: string): CalendarDate {
  const tz = timeZone ?? getLocalTimeZone()
  return todayFromLib(tz)
}

/**
 * Get current date and time
 * @param timeZone - Optional timezone (defaults to local timezone)
 * @returns Current date and time as a ZonedDateTime
 * @example
 * now()
 */
export function now(timeZone?: string): ZonedDateTime {
  const tz = timeZone ?? getLocalTimeZone()
  return nowFromLib(tz)
}

/**
 * Parse a date string
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Parsed CalendarDate
 * @example
 * parse('2024-01-15')
 */
export function parse(dateString: string): CalendarDate {
  return parseDate(dateString)
}

/**
 * Re-export useful utilities from @internationalized/date
 * that complement (not duplicate) the main API
 */
export {
  // Comparison utilities (complement isBefore/isAfter/isSame)
  isSameDay,
  isSameMonth,
  isSameYear,

  // Convenience checks
  isToday,
  isWeekend,

  // Utility queries
  getDayOfWeek,
  getWeeksInMonth,
  getLocalTimeZone,
}

export type {
  CalendarDate,
  CalendarDateTime,
  DateValue,
  ZonedDateTime,
}
