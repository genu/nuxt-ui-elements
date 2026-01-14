---
title: Date Utilities
description: Tree-shakeable date manipulation functions built on @internationalized/date.
category: utility
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/your-username/nuxt-ui-elements/blob/main/src/runtime/utils/std/date.ts
  - label: '@internationalized/date'
    icon: i-lucide-external-link
    to: https://react-spectrum.adobe.com/internationalized/date/
---

## Overview

The date utilities provide a functional API for date manipulation, built on `@internationalized/date`. All functions are tree-shakeable and support multiple input formats.

```ts
import { add, format, today } from '#std/date'

const nextMonth = add(today(), 1, 'month')
const formatted = format(nextMonth, 'MMMM D, YYYY') // "February 15, 2024"
```

## Input Formats

All functions accept flexible input formats:

- **JavaScript Date**: `new Date()`
- **String**: `'2024-01-15'` or `'2024-01-15T14:30:00'`
- **DateValue**: `CalendarDate`, `CalendarDateTime`, or `ZonedDateTime`

```ts
import { format } from '#std/date'

// All of these work
format(new Date(), 'YYYY-MM-DD')
format('2024-01-15', 'YYYY-MM-DD')
format(today(), 'YYYY-MM-DD')
```

## Functions

### Manipulation

#### `add(input, amount, unit)`

Add time to a date.

```ts
import { add, today } from '#std/date'

add(today(), 1, 'day')    // Tomorrow
add(today(), 7, 'day')    // Next week
add(today(), 1, 'month')  // Next month
add(today(), 1, 'year')   // Next year
add(today(), 2, 'hour')   // 2 hours from now
```

**Units**: `'day'`, `'week'`, `'month'`, `'year'`, `'hour'`, `'minute'`, `'second'`

---

#### `subtract(input, amount, unit)`

Subtract time from a date.

```ts
import { subtract, today } from '#std/date'

subtract(today(), 1, 'day')   // Yesterday
subtract(today(), 7, 'day')   // Last week
subtract(today(), 1, 'month') // Last month
```

---

#### `set(input, values)`

Set specific date/time values.

```ts
import { set, today } from '#std/date'

set(today(), { day: 15 })                    // 15th of current month
set(today(), { month: 3, day: 1 })           // March 1st
set(today(), { year: 2025, month: 1, day: 1 }) // Jan 1, 2025
set(now(), { hour: 9, minute: 0 })           // 9:00 AM today
```

---

#### `startOf(input, unit, locale?)`

Get the start of a time period.

```ts
import { startOf, today } from '#std/date'

startOf(today(), 'day')   // Same day (midnight)
startOf(today(), 'week')  // Start of week (Sunday by default)
startOf(today(), 'month') // First of month
startOf(today(), 'year')  // January 1st

// Different locales have different week starts
startOf(today(), 'week', 'de-DE') // Monday in German locale
```

---

#### `endOf(input, unit, locale?)`

Get the end of a time period.

```ts
import { endOf, today } from '#std/date'

endOf(today(), 'week')  // End of week (Saturday by default)
endOf(today(), 'month') // Last day of month
endOf(today(), 'year')  // December 31st
```

---

### Formatting

#### `format(input, formatString, locale?)`

Format a date using Day.js-compatible tokens.

```ts
import { format, today } from '#std/date'

format(today(), 'YYYY-MM-DD')        // "2024-01-15"
format(today(), 'DD/MM/YYYY')        // "15/01/2024"
format(today(), 'MMMM D, YYYY')      // "January 15, 2024"
format(today(), 'MMM DD')            // "Jan 15"
format(today(), 'dddd')              // "Monday"
format(now(), 'HH:mm:ss')            // "14:30:00"
format(now(), 'h:mm A')              // "2:30 PM"

// Different locale
format(today(), 'MMMM D, YYYY', 'de-DE') // "Januar 15, 2024"
```

**Format Tokens:**

| Token | Output | Description |
|-------|--------|-------------|
| `YYYY` | 2024 | 4-digit year |
| `YY` | 24 | 2-digit year |
| `MMMM` | January | Full month name |
| `MMM` | Jan | Abbreviated month |
| `MM` | 01 | 2-digit month |
| `M` | 1 | Month number |
| `DD` | 01 | 2-digit day |
| `D` | 1 | Day of month |
| `dddd` | Monday | Full weekday name |
| `ddd` | Mon | Abbreviated weekday |
| `dd` | M | Narrow weekday |
| `HH` | 14 | 24-hour (2-digit) |
| `H` | 14 | 24-hour |
| `hh` | 02 | 12-hour (2-digit) |
| `h` | 2 | 12-hour |
| `mm` | 30 | Minutes (2-digit) |
| `ss` | 00 | Seconds (2-digit) |
| `SSS` | 000 | Milliseconds |
| `A` | PM | AM/PM |
| `a` | pm | am/pm |

---

#### `relative(input, locale?)`

Get a human-readable relative time string.

```ts
import { relative, subtract, add, today } from '#std/date'

relative(subtract(today(), 1, 'day'))   // "yesterday"
relative(subtract(today(), 2, 'day'))   // "2 days ago"
relative(add(today(), 1, 'week'))       // "in 7 days"
relative(subtract(today(), 1, 'month')) // "last month"

// Different locale
relative(subtract(today(), 1, 'day'), 'es-ES') // "ayer"
```

---

### Comparison

#### `isBefore(input, other)`

Check if a date is before another.

```ts
import { isBefore, today, subtract } from '#std/date'

isBefore(subtract(today(), 1, 'day'), today()) // true
isBefore(today(), subtract(today(), 1, 'day')) // false
```

---

#### `isAfter(input, other)`

Check if a date is after another.

```ts
import { isAfter, today, add } from '#std/date'

isAfter(add(today(), 1, 'day'), today()) // true
```

---

#### `isSame(input, other)`

Check if two dates are equal.

```ts
import { isSame, today } from '#std/date'

isSame(today(), today()) // true
```

---

#### `isBetween(input, start, end, inclusive?)`

Check if a date is within a range.

```ts
import { isBetween, today, subtract, add } from '#std/date'

const start = subtract(today(), 7, 'day')
const end = add(today(), 7, 'day')

isBetween(today(), start, end)        // true (inclusive)
isBetween(today(), start, end, false) // true (exclusive)
isBetween(start, start, end)          // true (inclusive)
isBetween(start, start, end, false)   // false (exclusive)
```

---

#### `diff(input, other, unit?)`

Calculate the difference between two dates.

```ts
import { diff, today, subtract } from '#std/date'

const lastWeek = subtract(today(), 7, 'day')

diff(today(), lastWeek, 'day')    // 7
diff(today(), lastWeek, 'week')   // 1
diff(today(), lastWeek, 'hour')   // 168
```

---

### Conversion

#### `toDate(input, timeZone?)`

Convert to a JavaScript Date object.

```ts
import { toDate, today } from '#std/date'

const jsDate = toDate(today()) // JavaScript Date
toDate(today(), 'America/New_York') // In specific timezone
```

---

#### `asCalendarDate(input)`

Convert to CalendarDate (date without time).

```ts
import { asCalendarDate } from '#std/date'

const calDate = asCalendarDate(new Date())
```

---

#### `asCalendarDateTime(input)`

Convert to CalendarDateTime (date with time, no timezone).

```ts
import { asCalendarDateTime } from '#std/date'

const calDateTime = asCalendarDateTime(new Date())
```

---

#### `asZonedDateTime(input, timeZone?)`

Convert to ZonedDateTime (date with time and timezone).

```ts
import { asZonedDateTime } from '#std/date'

const zonedDT = asZonedDateTime(new Date(), 'America/New_York')
```

---

### Current Date/Time

#### `today(timeZone?)`

Get today's date.

```ts
import { today } from '#std/date'

today()                    // Today in local timezone
today('America/New_York')  // Today in New York
```

---

#### `now(timeZone?)`

Get the current date and time.

```ts
import { now } from '#std/date'

now()                   // Current datetime in local timezone
now('Europe/London')    // Current datetime in London
```

---

#### `parse(dateString)`

Parse a date string.

```ts
import { parse } from '#std/date'

const date = parse('2024-01-15') // CalendarDate
```

---

### Re-exported Utilities

These utilities are re-exported from `@internationalized/date`:

```ts
import {
  isSameDay,      // Check if same day
  isSameMonth,    // Check if same month
  isSameYear,     // Check if same year
  isToday,        // Check if today
  isWeekend,      // Check if weekend
  getDayOfWeek,   // Get day of week (0-6)
  getWeeksInMonth, // Get weeks in a month
  getLocalTimeZone // Get browser's timezone
} from '#std/date'
```

## Types

The following types are exported for TypeScript users:

```ts
import type {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  DateValue
} from '#std/date'
```
