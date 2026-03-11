<script setup lang="ts">
  import type { CalendarEvent, EventResizePayload } from "#ui-elements-pro"

  const currentDate = ref("2026-03-10")
  const lastResize = ref("")

  const events = ref<CalendarEvent[]>([
    {
      id: 1,
      title: "Resize Me",
      start: "2026-03-10T09:00",
      end: "2026-03-10T10:00",
      color: "primary",
    },
    {
      id: 2,
      title: "Stretch This",
      start: "2026-03-10T13:00",
      end: "2026-03-10T14:00",
      color: "info",
    },
    {
      id: 3,
      title: "Not Resizable",
      start: "2026-03-10T16:00",
      end: "2026-03-10T17:00",
      color: "error",
      resizable: false,
    },
  ])

  function onEventResize(payload: EventResizePayload) {
    lastResize.value = `Resized "${payload.event.title}" — new end: ${payload.newEnd.toString()}`
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
      view="day"
      :day-options="{ startHour: 8, endHour: 18, slotDuration: 30 }"
      @event-resize="onEventResize" />

    <div class="p-3 bg-muted rounded-lg text-sm space-y-1">
      <p class="text-muted">Drag the bottom edge of events to resize them. The red event has <code>resizable: false</code>.</p>
      <p v-if="lastResize" class="font-mono">
        <span class="text-primary">{{ lastResize }}</span>
      </p>
    </div>
  </div>
</template>
