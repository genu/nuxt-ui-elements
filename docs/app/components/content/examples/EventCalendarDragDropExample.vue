<script setup lang="ts">
  import type { CalendarEvent, EventDropPayload } from "#ui-elements-pro"

  const currentDate = ref("2026-03-10")
  const lastDrop = ref("")

  const events = ref<CalendarEvent[]>([
    {
      id: 1,
      title: "Movable Meeting",
      start: "2026-03-10T10:00",
      end: "2026-03-10T11:00",
      color: "primary",
    },
    {
      id: 2,
      title: "Drag Me Too",
      start: "2026-03-11T14:00",
      end: "2026-03-11T15:30",
      color: "info",
    },
    {
      id: 3,
      title: "Fixed Event",
      start: "2026-03-12T09:00",
      end: "2026-03-12T10:00",
      color: "error",
      draggable: false,
    },
  ])

  function onEventDrop(payload: EventDropPayload) {
    lastDrop.value = `Moved "${payload.event.title}" from ${payload.oldStart.toString()} to ${payload.newStart.toString()}`
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
      @event-drop="onEventDrop" />

    <div class="p-3 bg-muted rounded-lg text-sm space-y-1">
      <p class="text-muted">Drag events to reschedule them. The red "Fixed Event" has <code>draggable: false</code>.</p>
      <p v-if="lastDrop" class="font-mono">
        <span class="text-primary">{{ lastDrop }}</span>
      </p>
    </div>
  </div>
</template>
