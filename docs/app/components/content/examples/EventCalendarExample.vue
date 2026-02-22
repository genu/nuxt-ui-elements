<script setup lang="ts">
  import type { CalendarEvent } from "#ui-elements-pro"

  const currentDate = ref()
  const currentView = ref<"month" | "week" | "day">("month")
  const lastAction = ref("")

  const events = shallowRef<CalendarEvent[]>([
    {
      id: 1,
      title: "Team Standup",
      start: "2026-02-17T09:00",
      end: "2026-02-17T09:30",
      color: "primary",
    },
    {
      id: 2,
      title: "Sprint Planning",
      start: "2026-02-17T10:00",
      end: "2026-02-17T12:00",
      color: "info",
    },
    {
      id: 3,
      title: "Design Review",
      start: "2026-02-18T14:00",
      end: "2026-02-18T15:30",
      color: "warning",
    },
    {
      id: 4,
      title: "Company Holiday",
      start: "2026-02-16",
      color: "success",
      allDay: true,
    },
    {
      id: 5,
      title: "Conference",
      start: "2026-02-20",
      end: "2026-02-22",
      color: "secondary",
      allDay: true,
    },
    {
      id: 6,
      title: "Lunch with Client",
      start: "2026-02-19T12:00",
      end: "2026-02-19T13:30",
      color: "error",
    },
    {
      id: 7,
      title: "1:1 with Manager",
      start: "2026-02-19T16:00",
      end: "2026-02-19T16:30",
      color: "primary",
    },
    {
      id: 8,
      title: "Code Review",
      start: "2026-02-20T11:00",
      end: "2026-02-20T12:00",
      color: "info",
    },
  ])

  function onDateClick(date: any) {
    lastAction.value = `Date clicked: ${date.toString()}`
  }

  function onEventClick(event: CalendarEvent) {
    lastAction.value = `Event clicked: ${event.title}`
  }

  function onEventDrop(payload: any) {
    lastAction.value = `Dropped "${payload.event.title}" → ${payload.newStart.toString()}`
    events.value = events.value.map((e) =>
      e.id === payload.event.id ? { ...e, start: payload.newStart.toString(), end: payload.newEnd.toString() } : e,
    )
  }
</script>

<template>
  <div class="w-full space-y-4">
    <UEEventCalendar
      v-model="currentDate"
      :events="events"
      :view="currentView"
      @update:view="currentView = $event"
      @date-click="onDateClick"
      @event-click="onEventClick"
      @event-drop="onEventDrop">
      <UEEventCalendarHeader />
      <UEEventCalendarMonthView />
      <UEEventCalendarTimeGrid />
      <UEEventCalendarListView />
    </UEEventCalendar>

    <div v-if="lastAction" class="p-3 bg-muted rounded-lg font-mono text-sm">
      <span class="text-muted">Last action: </span>
      <span class="text-primary">{{ lastAction }}</span>
    </div>
  </div>
</template>
