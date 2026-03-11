<script setup lang="ts">
  import type { CalendarEvent, SelectPayload } from "#ui-elements-pro"

  const currentDate = ref("2026-03-10")
  const lastSelection = ref("")

  const events = shallowRef<CalendarEvent[]>([
    {
      id: 1,
      title: "Existing Event",
      start: "2026-03-10T10:00",
      end: "2026-03-10T11:00",
      color: "primary",
    },
  ])

  function onSelect(payload: SelectPayload) {
    if (payload.allDay) {
      lastSelection.value = `Selected: ${payload.start.toString()} → ${payload.end.toString()} (all day)`
    } else {
      lastSelection.value = `Selected: ${payload.start.toString()} → ${payload.end.toString()}`
    }
  }
</script>

<template>
  <div class="w-full space-y-4">
    <UEEventCalendar
      v-model="currentDate"
      :events="events"
      view="week"
      :week-options="{ startHour: 8, endHour: 18, slotDuration: 30 }"
      @select="onSelect" />

    <div class="p-3 bg-muted rounded-lg text-sm space-y-1">
      <p class="text-muted">Click and drag on empty time slots to select a range — useful for creating new events.</p>
      <p v-if="lastSelection" class="font-mono">
        <span class="text-primary">{{ lastSelection }}</span>
      </p>
    </div>
  </div>
</template>
