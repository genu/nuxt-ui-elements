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
        expect(isToday(todayDate)).toBe(true)
      })

      it("should return false for yesterday", () => {
        const yesterday = subtract(today(), 1, "day")
        expect(isToday(yesterday)).toBe(false)
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
})
