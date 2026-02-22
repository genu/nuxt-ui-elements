---
title: EventCalendar
description: A full-featured calendar with month, week, and day views, drag-and-drop, and keyboard navigation.
category: component
navigation:
  badge:
    label: Pro
    color: primary
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/genu/nuxt-ui-elements-pro/blob/main/src/runtime/components/EventCalendar.vue
---

## Overview

`EventCalendar` is a composable calendar system with three view modes (month, week, day), drag-and-drop event management, and full keyboard navigation. It's built as a set of coordinated sub-components that communicate via provide/inject.

**Component hierarchy:**

```
UEEventCalendar          (root — state, context provider)
├── UEEventCalendarHeader       (navigation, view switcher)
├── UEEventCalendarMonthView    (month grid)
└── UEEventCalendarTimeGrid     (week/day time grid)
```

## Demo

Try switching between month, week, and day views. You can drag events to move them.

:component-example{name="EventCalendarExample"}

## Usage

### Basic Calendar

```vue
<script setup>
const date = ref(new Date())
const view = ref<'month' | 'week' | 'day'>('month')

const events = ref([
  {
    id: 1,
    title: 'Team Meeting',
    start: '2025-03-15T10:00',
    end: '2025-03-15T11:00',
    color: 'primary'
  },
  {
    id: 2,
    title: 'Launch Day',
    start: '2025-03-20',
    allDay: true,
    color: 'success'
  }
])
</script>

<template>
  <UEEventCalendar
    v-model="date"
    v-model:view="view"
    :events="events"
  >
    <UEEventCalendarHeader />
    <UEEventCalendarMonthView v-if="view === 'month'" />
    <UEEventCalendarTimeGrid v-else />
  </UEEventCalendar>
</template>
```

### Handling Events

```vue
<script setup>
import type { CalendarEvent, EventDropPayload } from 'nuxt-ui-elements-pro'

function onDateClick(date: CalendarDate) {
  console.log('Date clicked:', date.toString())
}

function onEventClick(event: CalendarEvent) {
  console.log('Event clicked:', event.title)
}

function onEventDrop(payload: EventDropPayload) {
  // Update event in your data source
  const event = events.value.find(e => e.id === payload.event.id)
  if (event) {
    event.start = payload.newStart
    event.end = payload.newEnd
  }
}
</script>

<template>
  <UEEventCalendar
    v-model="date"
    :events="events"
    @date-click="onDateClick"
    @event-click="onEventClick"
    @event-drop="onEventDrop"
  >
    <UEEventCalendarHeader />
    <UEEventCalendarMonthView />
  </UEEventCalendar>
</template>
```

### Localization

The calendar supports localization via the `locale` prop and configurable week start day:

```vue
<template>
  <UEEventCalendar
    v-model="date"
    :events="events"
    locale="fr-FR"
    :week-starts-on="1"
  >
    <UEEventCalendarHeader />
    <UEEventCalendarMonthView />
  </UEEventCalendar>
</template>
```

### View-Specific Options

Each view mode has its own configuration options:

```vue
<template>
  <UEEventCalendar
    v-model="date"
    :events="events"
    :month-options="{ maxEvents: 4, fixedWeeks: true }"
    :week-options="{ startHour: 8, endHour: 20, slotDuration: 30 }"
    :day-options="{ startHour: 6, endHour: 23, slotDuration: 15 }"
  >
    <!-- ... -->
  </UEEventCalendar>
</template>
```

### Disabling Drag-and-Drop

Set `editable` to `false` to disable all drag-and-drop functionality:

```vue
<template>
  <UEEventCalendar
    v-model="date"
    :events="events"
    :editable="false"
  >
    <!-- ... -->
  </UEEventCalendar>
</template>
```

You can also disable drag on individual events:

```ts
const events = [
  { id: 1, title: 'Fixed Event', start: '2025-03-15', draggable: false },
  { id: 2, title: 'Movable Event', start: '2025-03-16' } // draggable by default
]
```

## CalendarEvent Interface

Events passed to the calendar must follow the `CalendarEvent` interface:

```ts
interface CalendarEvent {
  /** Unique identifier */
  id: string | number
  /** Display title */
  title: string
  /** Start date/time — accepts Date, ISO string, or @internationalized/date DateValue */
  start: Date | string | DateValue
  /** End date/time. Defaults to same as start */
  end?: Date | string | DateValue
  /** Nuxt UI theme color name (e.g., 'primary', 'success', 'error') */
  color?: string
  /** Whether this is an all-day event */
  allDay?: boolean
  /** Whether this event can be dragged. Defaults to true */
  draggable?: boolean
}
```

### Date Formats

The `start` and `end` fields accept multiple formats:

| Format | Example | Result |
| --- | --- | --- |
| ISO date string | `'2025-03-15'` | All-day event |
| ISO datetime string | `'2025-03-15T10:00'` | Timed event |
| JavaScript Date | `new Date(2025, 2, 15)` | All-day event |
| Date with time | `new Date(2025, 2, 15, 10, 0)` | Timed event |
| `@internationalized/date` | `new CalendarDate(2025, 3, 15)` | All-day event |

## API

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | HTML element or component to render as root |
| `events` | `CalendarEvent[]` | `[]` | Array of events to display |
| `modelValue` | `Date \| string \| DateValue` | `today()` | Displayed date (supports `v-model`) |
| `view` | `'month' \| 'week' \| 'day'` | `'month'` | Calendar view mode (supports `v-model:view`) |
| `locale` | `string` | `'en-US'` | Locale for day/month names |
| `weekStartsOn` | `0 \| 1` | `0` | Week start day (0 = Sunday, 1 = Monday) |
| `editable` | `boolean` | `true` | Enable drag-and-drop globally |
| `color` | `string` | `'primary'` | Theme color for calendar chrome |
| `monthOptions` | `MonthViewOptions` | - | Month view configuration |
| `weekOptions` | `WeekViewOptions` | - | Week view configuration |
| `dayOptions` | `DayViewOptions` | - | Day view configuration |
| `ui` | `object` | - | Custom classes for component slots |

### MonthViewOptions

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `maxEvents` | `number` | `3` | Max event chips per cell before "+N more" |
| `fixedWeeks` | `boolean` | `true` | Always show 6 rows for consistent height |

### WeekViewOptions

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `startHour` | `number` | `7` | First visible hour (0-23) |
| `endHour` | `number` | `22` | Last visible hour (0-23) |
| `slotDuration` | `15 \| 30 \| 60` | `30` | Minutes per time slot row |

### DayViewOptions

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `startHour` | `number` | `7` | First visible hour (0-23) |
| `endHour` | `number` | `22` | Last visible hour (0-23) |
| `slotDuration` | `15 \| 30 \| 60` | `30` | Minutes per time slot row |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `CalendarDate` | Fired when the displayed date changes |
| `update:view` | `'month' \| 'week' \| 'day'` | Fired when the view mode changes |
| `dateClick` | `CalendarDate` | Fired when a date cell is clicked |
| `eventClick` | `CalendarEvent` | Fired when an event chip is clicked |
| `eventDrop` | `EventDropPayload` | Fired after a drag-and-drop operation |

### EventDropPayload

```ts
interface EventDropPayload {
  event: CalendarEvent       // The original event object
  oldStart: CalendarDate | CalendarDateTime
  oldEnd: CalendarDate | CalendarDateTime
  newStart: CalendarDate | CalendarDateTime
  newEnd: CalendarDate | CalendarDateTime
}
```

### Slots

The root `UEEventCalendar` component exposes a default slot with the full `EventCalendarContext`:

```vue
<UEEventCalendar v-model="date" :events="events">
  <template #default="ctx">
    <!-- Access ctx.displayDate, ctx.monthWeeks, ctx.goToNext(), etc. -->
  </template>
</UEEventCalendar>
```

## Sub-Components

### EventCalendarHeader

Navigation controls and view switcher. Uses the calendar context automatically.

```vue
<UEEventCalendarHeader />
```

### EventCalendarMonthView

Month grid with day cells, event chips, and overflow indicators. Use when `view === 'month'`.

```vue
<UEEventCalendarMonthView />
```

### EventCalendarTimeGrid

Time-based grid for week and day views. Renders time slots, all-day event rows, and positioned timed events with overlap handling. Use when `view === 'week'` or `view === 'day'`.

```vue
<UEEventCalendarTimeGrid />
```

## Keyboard Navigation

| Key | Action |
| --- | --- |
| `ArrowRight` | Move focus to next day |
| `ArrowLeft` | Move focus to previous day |
| `ArrowDown` | Move focus to next week |
| `ArrowUp` | Move focus to previous week |
| `Home` | Move focus to start of week |
| `End` | Move focus to end of week |
| `Enter` / `Space` | Select focused date |

## Accessibility

The calendar includes comprehensive accessibility support:

- ARIA labels on all interactive elements (dates, events, navigation)
- Keyboard navigation with roving focus
- Screen reader announcements for date and event information
- Proper role attributes for grid structure
