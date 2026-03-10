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

## Week View

The week view displays a time grid with events positioned by time. Configure visible hours and slot duration with `weekOptions`.

:component-example{name="EventCalendarWeekViewExample"}

## Drag and Drop

Events can be dragged to reschedule them. Set `draggable: false` on individual events to lock them in place, or disable globally with `:editable="false"`.

:component-example{name="EventCalendarDragDropExample"}

## Resize

In day and week views, drag the bottom edge of timed events to change their duration. Set `resizable: false` on individual events to prevent resizing.

:component-example{name="EventCalendarResizeExample"}

## Click Events

Listen to `@date-click` and `@event-click` to respond to user interactions. This example disables editing to show click-only mode.

:component-example{name="EventCalendarClickEventsExample"}

## Date Selection

Click and drag on empty time slots to select a date range. The `@select` event fires with the start, end, and whether it's an all-day selection — useful for creating new events.

:component-example{name="EventCalendarSelectExample"}

## Localization

The calendar supports localization via the `locale` prop and configurable week start day with `weekStartsOn`.

:component-example{name="EventCalendarLocaleExample"}

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
  /** Whether this event can be resized. Defaults to true */
  resizable?: boolean
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
| `eventResize` | `EventResizePayload` | Fired after a resize operation |
| `select` | `SelectPayload` | Fired after a click or drag date range selection |

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
