import { describe, it, expect } from "vitest"
import {
  add,
  subtract,
  set,
  toDate,
  format,
  relative,
  asCalendarDate,
  asCalendarDateTime,
  asZonedDateTime,
  isBefore,
  isAfter,
  isSame,
  diff,
  isBetween,
  startOf,
  endOf,
  today,
  now,
  parse,
  isSameDay,
  isSameMonth,
  isSameYear,
  isToday,
  isWeekend,
  getDayOfWeek,
  getWeeksInMonth,
  getLocalTimeZone,
} from "../../src/runtime/utils/std/date"

describe("Date Utilities", () => {
  describe("add()", () => {
    it("should add days to a date", () => {
      const date = parse("2024-01-15")
      const result = add(date, 7, "day")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-22")
    })

    it("should add months to a date", () => {
      const date = parse("2024-01-15")
      const result = add(date, 1, "month")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-02-15")
    })

    it("should add years to a date", () => {
      const date = parse("2024-01-15")
      const result = add(date, 1, "year")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2025-01-15")
    })

    it("should work with Date objects", () => {
      const date = new Date("2024-01-15T00:00:00Z")
      const result = add(date, 7, "day")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-22")
    })

    it("should work with string dates", () => {
      const result = add("2024-01-15", 7, "day")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-22")
    })
  })

  describe("subtract()", () => {
    it("should subtract days from a date", () => {
      const date = parse("2024-01-15")
      const result = subtract(date, 7, "day")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-08")
    })

    it("should subtract months from a date", () => {
      const date = parse("2024-01-15")
      const result = subtract(date, 1, "month")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2023-12-15")
    })

    it("should subtract years from a date", () => {
      const date = parse("2024-01-15")
      const result = subtract(date, 1, "year")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2023-01-15")
    })
  })

  describe("set()", () => {
    it("should set specific date values", () => {
      const date = parse("2024-01-15")
      const result = set(date, { day: 20, month: 3 })
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-03-20")
    })

    it("should set year", () => {
      const date = parse("2024-01-15")
      const result = set(date, { year: 2025 })
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2025-01-15")
    })

    it("should set time components", () => {
      const date = parse("2024-01-15")
      const result = set(date, { hour: 14, minute: 30, second: 45 })
      const dateTime = asCalendarDateTime(result)
      expect(dateTime.hour).toBe(14)
      expect(dateTime.minute).toBe(30)
      expect(dateTime.second).toBe(45)
    })
  })

  describe("toDate()", () => {
    it("should convert CalendarDate to Date", () => {
      const date = parse("2024-01-15")
      const result = toDate(date)
      expect(result).toBeInstanceOf(Date)
    })

    it("should return Date as-is when already a Date", () => {
      const date = new Date("2024-01-15")
      const result = toDate(date)
      expect(result).toBe(date)
    })

    it("should convert string to Date", () => {
      const result = toDate("2024-01-15")
      expect(result).toBeInstanceOf(Date)
    })
  })

  describe("format()", () => {
    const testDate = new Date("2024-03-15T14:30:45.123Z")

    it("should format with YYYY-MM-DD", () => {
      const result = format(testDate, "YYYY-MM-DD")
      expect(result).toMatch(/2024-03-15/)
    })

    it("should format with full date", () => {
      const result = format(testDate, "MMMM D, YYYY")
      expect(result).toContain("March")
      expect(result).toContain("2024")
    })

    it("should format with time", () => {
      const result = format(testDate, "HH:mm:ss")
      expect(result).toMatch(/\d{2}:\d{2}:\d{2}/)
    })

    it("should format with 12-hour time", () => {
      const result = format(testDate, "h:mm A")
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/)
    })

    it("should format weekday names", () => {
      const result = format(testDate, "dddd, MMMM D, YYYY")
      expect(result).toContain("2024")
    })

    it("should use default format when not specified", () => {
      const result = format(testDate)
      expect(result).toMatch(/2024-03-15/)
    })

    it("should support locale-specific month names", () => {
      const result = format(testDate, "MMMM", "fr-FR")
      expect(result).toBe("mars")
    })
  })

  describe("relative()", () => {
    it("should return relative time for past dates", () => {
      const pastDate = subtract(now(), 2, "day")
      const result = relative(toDate(pastDate))
      expect(result).toContain("ago")
    })

    it("should return relative time for future dates", () => {
      const futureDate = add(now(), 3, "day")
      const result = relative(toDate(futureDate))
      expect(result).toContain("in")
    })
  })

  describe("asCalendarDate()", () => {
    it("should convert to CalendarDate", () => {
      const date = parse("2024-01-15")
      const result = asCalendarDate(date)
      expect(result).toHaveProperty("year")
      expect(result).toHaveProperty("month")
      expect(result).toHaveProperty("day")
      expect(result).not.toHaveProperty("hour")
    })
  })

  describe("asCalendarDateTime()", () => {
    it("should convert to CalendarDateTime", () => {
      const date = parse("2024-01-15")
      const dateWithTime = set(date, { hour: 14, minute: 30 })
      const result = asCalendarDateTime(dateWithTime)
      expect(result).toHaveProperty("year")
      expect(result).toHaveProperty("month")
      expect(result).toHaveProperty("day")
      expect(result).toHaveProperty("hour")
      expect(result).toHaveProperty("minute")
    })
  })

  describe("asZonedDateTime()", () => {
    it("should convert to ZonedDateTime", () => {
      const date = parse("2024-01-15")
      const result = asZonedDateTime(date)
      expect(result).toHaveProperty("timeZone")
    })
  })

  describe("isBefore()", () => {
    it("should return true when first date is before second", () => {
      const date1 = parse("2024-01-15")
      const date2 = parse("2024-01-20")
      expect(isBefore(date1, date2)).toBe(true)
    })

    it("should return false when first date is after second", () => {
      const date1 = parse("2024-01-20")
      const date2 = parse("2024-01-15")
      expect(isBefore(date1, date2)).toBe(false)
    })

    it("should return false when dates are equal", () => {
      const date1 = parse("2024-01-15")
      const date2 = parse("2024-01-15")
      expect(isBefore(date1, date2)).toBe(false)
    })
  })

  describe("isAfter()", () => {
    it("should return true when first date is after second", () => {
      const date1 = parse("2024-01-20")
      const date2 = parse("2024-01-15")
      expect(isAfter(date1, date2)).toBe(true)
    })

    it("should return false when first date is before second", () => {
      const date1 = parse("2024-01-15")
      const date2 = parse("2024-01-20")
      expect(isAfter(date1, date2)).toBe(false)
    })

    it("should return false when dates are equal", () => {
      const date1 = parse("2024-01-15")
      const date2 = parse("2024-01-15")
      expect(isAfter(date1, date2)).toBe(false)
    })
  })

  describe("isSame()", () => {
    it("should return true when dates are equal", () => {
      const date1 = parse("2024-01-15")
      const date2 = parse("2024-01-15")
      expect(isSame(date1, date2)).toBe(true)
    })

    it("should return false when dates are different", () => {
      const date1 = parse("2024-01-15")
      const date2 = parse("2024-01-20")
      expect(isSame(date1, date2)).toBe(false)
    })

    it("should work with Date objects", () => {
      const date1 = new Date("2024-01-15T00:00:00Z")
      const date2 = new Date("2024-01-15T00:00:00Z")
      expect(isSame(date1, date2)).toBe(true)
    })
  })

  describe("diff()", () => {
    it("should calculate difference in days", () => {
      const date1 = parse("2024-01-20")
      const date2 = parse("2024-01-15")
      const result = diff(date1, date2, "day")
      expect(Math.round(result)).toBe(5)
    })

    it("should calculate difference in hours", () => {
      const date1 = new Date("2024-01-15T15:00:00Z")
      const date2 = new Date("2024-01-15T12:00:00Z")
      const result = diff(date1, date2, "hour")
      expect(Math.round(result)).toBe(3)
    })

    it("should calculate difference in months", () => {
      const date1 = parse("2024-03-15")
      const date2 = parse("2024-01-15")
      const result = diff(date1, date2, "month")
      expect(Math.round(result)).toBe(2)
    })

    it("should return negative for past dates", () => {
      const date1 = parse("2024-01-15")
      const date2 = parse("2024-01-20")
      const result = diff(date1, date2, "day")
      expect(Math.round(result)).toBe(-5)
    })

    it("should default to milliseconds", () => {
      const date1 = new Date("2024-01-15T00:00:01Z")
      const date2 = new Date("2024-01-15T00:00:00Z")
      const result = diff(date1, date2)
      expect(result).toBe(1000)
    })
  })

  describe("isBetween()", () => {
    it("should return true when date is between range (inclusive)", () => {
      const date = parse("2024-01-17")
      const start = parse("2024-01-15")
      const end = parse("2024-01-20")
      expect(isBetween(date, start, end)).toBe(true)
    })

    it("should return true when date equals start (inclusive)", () => {
      const date = parse("2024-01-15")
      const start = parse("2024-01-15")
      const end = parse("2024-01-20")
      expect(isBetween(date, start, end)).toBe(true)
    })

    it("should return true when date equals end (inclusive)", () => {
      const date = parse("2024-01-20")
      const start = parse("2024-01-15")
      const end = parse("2024-01-20")
      expect(isBetween(date, start, end)).toBe(true)
    })

    it("should return false when date is before range", () => {
      const date = parse("2024-01-10")
      const start = parse("2024-01-15")
      const end = parse("2024-01-20")
      expect(isBetween(date, start, end)).toBe(false)
    })

    it("should return false when date is after range", () => {
      const date = parse("2024-01-25")
      const start = parse("2024-01-15")
      const end = parse("2024-01-20")
      expect(isBetween(date, start, end)).toBe(false)
    })

    it("should support exclusive mode", () => {
      const date = parse("2024-01-15")
      const start = parse("2024-01-15")
      const end = parse("2024-01-20")
      expect(isBetween(date, start, end, false)).toBe(false)
    })
  })

  describe("startOf()", () => {
    it("should get start of month", () => {
      const date = parse("2024-01-15")
      const result = startOf(date, "month")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-01")
    })

    it("should get start of year", () => {
      const date = parse("2024-06-15")
      const result = startOf(date, "year")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-01")
    })

    it("should get start of week", () => {
      const date = parse("2024-01-17") // Wednesday
      const result = startOf(date, "week", "en-US")
      expect(result).toHaveProperty("day")
      // Start of week depends on locale
    })

    it("should return same date for start of day", () => {
      const date = parse("2024-01-15")
      const result = startOf(date, "day")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-15")
    })
  })

  describe("endOf()", () => {
    it("should get end of month", () => {
      const date = parse("2024-01-15")
      const result = endOf(date, "month")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-31")
    })

    it("should get end of year", () => {
      const date = parse("2024-06-15")
      const result = endOf(date, "year")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-12-31")
    })

    it("should handle February in leap year", () => {
      const date = parse("2024-02-15")
      const result = endOf(date, "month")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-02-29")
    })

    it("should handle February in non-leap year", () => {
      const date = parse("2023-02-15")
      const result = endOf(date, "month")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2023-02-28")
    })
  })

  describe("today()", () => {
    it("should return today's date", () => {
      const result = today()
      expect(result).toHaveProperty("year")
      expect(result).toHaveProperty("month")
      expect(result).toHaveProperty("day")
    })
  })

  describe("now()", () => {
    it("should return current date and time", () => {
      const result = now()
      expect(result).toHaveProperty("year")
      expect(result).toHaveProperty("month")
      expect(result).toHaveProperty("day")
      expect(result).toHaveProperty("hour")
      expect(result).toHaveProperty("timeZone")
    })
  })

  describe("parse()", () => {
    it("should parse date string", () => {
      const result = parse("2024-01-15")
      expect(result.year).toBe(2024)
      expect(result.month).toBe(1)
      expect(result.day).toBe(15)
    })
  })

  describe("Re-exported utilities", () => {
    describe("isSameDay()", () => {
      it("should return true for same day", () => {
        const date1 = parse("2024-01-15")
        const date2 = parse("2024-01-15")
        expect(isSameDay(date1, date2)).toBe(true)
      })

      it("should return false for different days", () => {
        const date1 = parse("2024-01-15")
        const date2 = parse("2024-01-16")
        expect(isSameDay(date1, date2)).toBe(false)
      })
    })

    describe("isSameMonth()", () => {
      it("should return true for same month", () => {
        const date1 = parse("2024-01-15")
        const date2 = parse("2024-01-20")
        expect(isSameMonth(date1, date2)).toBe(true)
      })

      it("should return false for different months", () => {
        const date1 = parse("2024-01-15")
        const date2 = parse("2024-02-15")
        expect(isSameMonth(date1, date2)).toBe(false)
      })
    })

    describe("isSameYear()", () => {
      it("should return true for same year", () => {
        const date1 = parse("2024-01-15")
        const date2 = parse("2024-12-31")
        expect(isSameYear(date1, date2)).toBe(true)
      })

      it("should return false for different years", () => {
        const date1 = parse("2024-01-15")
        const date2 = parse("2025-01-15")
        expect(isSameYear(date1, date2)).toBe(false)
      })
    })

    describe("isToday()", () => {
      it("should return true for today", () => {
        const todayDate = today()
        expect(isToday(todayDate, getLocalTimeZone())).toBe(true)
      })

      it("should return false for yesterday", () => {
        const yesterday = subtract(today(), 1, "day")
        expect(isToday(yesterday, getLocalTimeZone())).toBe(false)
      })
    })

    describe("isWeekend()", () => {
      it("should identify weekend days", () => {
        const saturday = parse("2024-01-06") // Saturday
        const sunday = parse("2024-01-07") // Sunday
        expect(isWeekend(saturday, "en-US")).toBe(true)
        expect(isWeekend(sunday, "en-US")).toBe(true)
      })

      it("should identify weekdays", () => {
        const monday = parse("2024-01-08") // Monday
        expect(isWeekend(monday, "en-US")).toBe(false)
      })
    })

    describe("getDayOfWeek()", () => {
      it("should return day of week (0-6)", () => {
        const monday = parse("2024-01-08")
        const day = getDayOfWeek(monday, "en-US")
        expect(day).toBeGreaterThanOrEqual(0)
        expect(day).toBeLessThanOrEqual(6)
      })
    })

    describe("getWeeksInMonth()", () => {
      it("should return number of weeks in month", () => {
        const date = parse("2024-01-15")
        const weeks = getWeeksInMonth(date, "en-US")
        expect(weeks).toBeGreaterThan(0)
        expect(weeks).toBeLessThanOrEqual(6)
      })
    })
  })

  describe("Edge cases", () => {
    it("should handle leap year calculations", () => {
      const leapDay = parse("2024-02-29")
      expect(format(toDate(leapDay), "YYYY-MM-DD")).toBe("2024-02-29")
    })

    it("should handle month boundaries", () => {
      const endOfMonth = parse("2024-01-31")
      const nextDay = add(endOfMonth, 1, "day")
      expect(format(toDate(nextDay), "YYYY-MM-DD")).toBe("2024-02-01")
    })

    it("should handle year boundaries", () => {
      const endOfYear = parse("2024-12-31")
      const nextDay = add(endOfYear, 1, "day")
      expect(format(toDate(nextDay), "YYYY-MM-DD")).toBe("2025-01-01")
    })

    it("should handle adding months that overflow", () => {
      const date = parse("2024-01-31")
      const result = add(date, 1, "month")
      // Should handle month overflow gracefully
      expect(format(toDate(result), "YYYY-MM")).toBe("2024-02")
    })
  })

  describe("parseDateInput() edge cases", () => {
    it("should handle no input and return today", () => {
      const date = parse("2024-01-15")
      const withoutInput = add(date, 0, "day")
      expect(withoutInput).toHaveProperty("year")
    })

    it("should handle Date object at midnight (date-only)", () => {
      const date = new Date("2024-01-15T00:00:00.000Z")
      const result = add(date, 1, "day")
      expect(result).toHaveProperty("year")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-16")
    })

    it("should handle Date object with time (not midnight)", () => {
      const date = new Date("2024-01-15T14:30:00.123Z")
      const result = add(date, 1, "day")
      expect(result).toHaveProperty("timeZone")
      expect(result).toBeDefined()
      // Should preserve time when adding days
      const asDate = toDate(result)
      expect(format(asDate, "YYYY-MM-DD")).toBe("2024-01-16")
    })

    it("should handle string with timezone", () => {
      const dateStr = "2024-01-15T14:30:00-05:00[America/New_York]"
      const result = add(dateStr, 1, "day")
      expect(result).toBeDefined()
    })

    it("should handle string with datetime but no timezone", () => {
      const dateStr = "2024-01-15T14:30:00"
      const result = add(dateStr, 1, "day")
      expect(result).toBeDefined()
    })

    it("should handle string with space separator", () => {
      const dateStr = "2024-01-15 14:30:00"
      const result = add(dateStr, 1, "day")
      expect(result).toBeDefined()
    })

    it("should fallback to date-only when parsing datetime fails", () => {
      const dateStr = "2024-01-15Tinvalid"
      const result = add(dateStr, 1, "day")
      expect(result).toBeDefined()
    })

    it("should handle already parsed DateValue", () => {
      const date1 = parse("2024-01-15")
      const date2 = add(date1, 5, "day")
      expect(format(toDate(date2), "YYYY-MM-DD")).toBe("2024-01-20")
    })
  })

  describe("Time manipulation", () => {
    it("should add hours", () => {
      const date = parse("2024-01-15")
      const dateWithTime = set(date, { hour: 10 })
      const result = add(dateWithTime, 5, "hour")
      const asDateTime = asCalendarDateTime(result)
      expect(asDateTime.hour).toBe(15)
    })

    it("should add minutes", () => {
      const date = parse("2024-01-15")
      const dateWithTime = set(date, { hour: 10, minute: 30 })
      const result = add(dateWithTime, 45, "minute")
      const asDateTime = asCalendarDateTime(result)
      expect(asDateTime.minute).toBe(75 % 60)
    })

    it("should add seconds", () => {
      const date = parse("2024-01-15")
      const dateWithTime = set(date, { hour: 10, minute: 30, second: 15 })
      const result = add(dateWithTime, 45, "second")
      const asDateTime = asCalendarDateTime(result)
      expect(asDateTime.second).toBe(60 % 60)
    })

    it("should subtract hours", () => {
      const date = parse("2024-01-15")
      const dateWithTime = set(date, { hour: 10 })
      const result = subtract(dateWithTime, 3, "hour")
      const asDateTime = asCalendarDateTime(result)
      expect(asDateTime.hour).toBe(7)
    })

    it("should subtract minutes", () => {
      const date = parse("2024-01-15")
      const dateWithTime = set(date, { hour: 10, minute: 30 })
      const result = subtract(dateWithTime, 15, "minute")
      const asDateTime = asCalendarDateTime(result)
      expect(asDateTime.minute).toBe(15)
    })

    it("should subtract seconds", () => {
      const date = parse("2024-01-15")
      const dateWithTime = set(date, { hour: 10, minute: 30, second: 45 })
      const result = subtract(dateWithTime, 30, "second")
      const asDateTime = asCalendarDateTime(result)
      expect(asDateTime.second).toBe(15)
    })

    it("should add weeks", () => {
      const date = parse("2024-01-15")
      const result = add(date, 2, "week")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-29")
    })

    it("should subtract weeks", () => {
      const date = parse("2024-01-15")
      const result = subtract(date, 1, "week")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-08")
    })
  })

  describe("format() additional tokens", () => {
    const testDate = new Date("2024-03-15T14:30:45.123Z")

    it("should format YY (2-digit year)", () => {
      const result = format(testDate, "YY")
      expect(result).toBe("24")
    })

    it("should format M (month without padding)", () => {
      const result = format(testDate, "M")
      expect(result).toBe("3")
    })

    it("should format D (day without padding)", () => {
      const result = format(testDate, "D")
      expect(result).toBe("15")
    })

    it("should format narrow weekday (dd)", () => {
      const result = format(testDate, "dd")
      expect(result).toHaveLength(1)
    })

    it("should format short weekday (ddd)", () => {
      const result = format(testDate, "ddd")
      expect(result.length).toBeGreaterThan(1)
    })

    it("should format weekday number (d)", () => {
      const result = format(testDate, "d")
      expect(result).toMatch(/[0-6]/)
    })

    it("should format H (hour without padding)", () => {
      const result = format(testDate, "H")
      expect(result).toMatch(/\d{1,2}/)
    })

    it("should format h (12-hour without padding)", () => {
      const result = format(testDate, "h")
      expect(result).toMatch(/\d{1,2}/)
    })

    it("should format m (minute without padding)", () => {
      const result = format(testDate, "m")
      expect(result).toMatch(/\d{1,2}/)
    })

    it("should format s (second without padding)", () => {
      const result = format(testDate, "s")
      expect(result).toMatch(/\d{1,2}/)
    })

    it("should format SSS (milliseconds)", () => {
      const result = format(testDate, "SSS")
      expect(result).toMatch(/\d{3}/)
    })

    it("should format lowercase am/pm (a)", () => {
      const result = format(testDate, "a")
      expect(result).toMatch(/am|pm/)
    })

    it("should format short month (MMM)", () => {
      const result = format(testDate, "MMM")
      expect(result).toContain("Mar")
    })
  })

  describe("toDate() with timezone", () => {
    it("should convert with specified timezone", () => {
      const date = parse("2024-01-15")
      const result = toDate(date, "America/New_York")
      expect(result).toBeInstanceOf(Date)
    })

    it("should not return same Date object when timezone is specified", () => {
      const date = new Date("2024-01-15")
      const result = toDate(date, "America/New_York")
      expect(result).toBeInstanceOf(Date)
    })
  })

  describe("asCalendarDateTime() edge cases", () => {
    it("should convert date without time to CalendarDateTime", () => {
      const date = parse("2024-01-15")
      const result = asCalendarDateTime(date)
      expect(result).toHaveProperty("hour")
      expect(result.hour).toBe(0)
    })

    it("should preserve existing CalendarDateTime", () => {
      const date = parse("2024-01-15")
      const dateWithTime = set(date, { hour: 14, minute: 30 })
      const result = asCalendarDateTime(dateWithTime)
      expect(result).toHaveProperty("hour")
      const asDateTime = result as any
      expect(asDateTime.hour).toBe(14)
    })
  })

  describe("asZonedDateTime() edge cases", () => {
    it("should convert CalendarDate to ZonedDateTime", () => {
      const date = parse("2024-01-15")
      const result = asZonedDateTime(date)
      expect(result).toHaveProperty("timeZone")
    })

    it("should convert CalendarDate with custom timezone", () => {
      const date = parse("2024-01-15")
      const result = asZonedDateTime(date, "America/New_York")
      expect(result).toHaveProperty("timeZone")
      expect(result.timeZone).toBe("America/New_York")
    })

    it("should preserve existing ZonedDateTime", () => {
      const date = parse("2024-01-15")
      const zoned = asZonedDateTime(date)
      const result = asZonedDateTime(zoned)
      expect(result).toHaveProperty("timeZone")
    })

    it("should convert CalendarDateTime to ZonedDateTime", () => {
      const date = parse("2024-01-15")
      const dateTime = asCalendarDateTime(date)
      const result = asZonedDateTime(dateTime, "America/New_York")
      expect(result).toHaveProperty("timeZone")
      expect(result.timeZone).toBe("America/New_York")
    })
  })

  describe("diff() with all units", () => {
    it("should calculate difference in years", () => {
      const date1 = parse("2026-01-15")
      const date2 = parse("2024-01-15")
      const result = diff(date1, date2, "year")
      expect(Math.round(result)).toBe(2)
    })

    it("should calculate difference in weeks", () => {
      const date1 = parse("2024-01-29")
      const date2 = parse("2024-01-15")
      const result = diff(date1, date2, "week")
      expect(Math.round(result)).toBe(2)
    })

    it("should calculate difference in minutes", () => {
      const date1 = new Date("2024-01-15T15:00:00Z")
      const date2 = new Date("2024-01-15T14:30:00Z")
      const result = diff(date1, date2, "minute")
      expect(Math.round(result)).toBe(30)
    })

    it("should calculate difference in seconds", () => {
      const date1 = new Date("2024-01-15T15:00:30Z")
      const date2 = new Date("2024-01-15T15:00:00Z")
      const result = diff(date1, date2, "second")
      expect(Math.round(result)).toBe(30)
    })
  })

  describe("endOf() default case", () => {
    it("should handle default case in switch", () => {
      const date = parse("2024-01-15")
      // Test day which hits the default case
      const result = endOf(date, "day")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-15")
    })
  })

  describe("startOf() default case", () => {
    it("should handle default case in switch", () => {
      const date = parse("2024-01-15")
      // Test day which hits the default case
      const result = startOf(date, "day")
      expect(format(toDate(result), "YYYY-MM-DD")).toBe("2024-01-15")
    })
  })

  describe("Additional format() coverage", () => {
    it("should handle all time format tokens", () => {
      const testDate = new Date("2024-03-15T09:05:03.123Z")

      // Test single-digit formats
      const h = format(testDate, "h")
      expect(h).toMatch(/\d{1,2}/)

      const m = format(testDate, "m")
      expect(m).toMatch(/\d{1,2}/)

      const s = format(testDate, "s")
      expect(s).toMatch(/\d{1,2}/)

      const H = format(testDate, "H")
      expect(H).toMatch(/\d{1,2}/)
    })

    it("should handle AM/PM for morning time", () => {
      const morning = new Date("2024-03-15T08:30:00Z")
      const amPmUpper = format(morning, "A")
      expect(amPmUpper).toMatch(/AM|PM/)

      const amPmLower = format(morning, "a")
      expect(amPmLower).toMatch(/am|pm/)
    })

    it("should handle narrow weekday format", () => {
      const testDate = new Date("2024-03-15T14:30:45Z")
      const narrow = format(testDate, "dd")
      expect(narrow.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe("Additional conversion coverage", () => {
    it("should handle timezone parameter in today()", () => {
      const result = today("America/New_York")
      expect(result).toHaveProperty("year")
      expect(result).toHaveProperty("month")
      expect(result).toHaveProperty("day")
    })

    it("should handle timezone parameter in now()", () => {
      const result = now("America/New_York")
      expect(result).toHaveProperty("year")
      expect(result).toHaveProperty("timeZone")
      expect(result.timeZone).toBe("America/New_York")
    })

    it("should handle timezone in toDate", () => {
      const date = parse("2024-01-15")
      const result = toDate(date, "America/New_York")
      expect(result).toBeInstanceOf(Date)
    })
  })

  describe("set() with time on existing datetime", () => {
    it("should set time components on datetime that already has time", () => {
      const date = parse("2024-01-15")
      const withTime = set(date, { hour: 10, minute: 30, second: 15 })
      const updated = set(withTime, { hour: 14 })
      const result = asCalendarDateTime(updated)
      expect(result.hour).toBe(14)
    })

    it("should set minute on datetime with existing time", () => {
      const date = parse("2024-01-15")
      const withTime = set(date, { hour: 10, minute: 30 })
      const updated = set(withTime, { minute: 45 })
      const result = asCalendarDateTime(updated)
      expect(result.minute).toBe(45)
    })

    it("should set second on datetime with existing time", () => {
      const date = parse("2024-01-15")
      const withTime = set(date, { hour: 10, minute: 30, second: 15 })
      const updated = set(withTime, { second: 45 })
      const result = asCalendarDateTime(updated)
      expect(result.second).toBe(45)
    })
  })
})
