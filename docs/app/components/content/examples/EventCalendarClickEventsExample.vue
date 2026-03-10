<script setup lang="ts">
  import type { CalendarEvent } from "#ui-elements-pro"

  const currentDate = ref("2026-03-10")
  const log = ref<string[]>([])

  const events = shallowRef<CalendarEvent[]>([
    {
      id: 1,
      title: "Team Meeting",
      start: "2026-03-10T10:00",
      end: "2026-03-10T11:00",
      color: "primary",
    },
    {
      id: 2,
      title: "Product Launch",
      start: "2026-03-12",
      color: "success",
      allDay: true,
    },
    {
      id: 3,
      title: "Code Review",
      start: "2026-03-11T14:00",
      end: "2026-03-11T15:00",
      color: "warning",
    },
  ])

  function onDateClick(date: any) {
    log.value = [`Date clicked: ${date.toString()}`, ...log.value].slice(0, 5)
  }

  function onEventClick(event: CalendarEvent) {
    log.value = [`Event clicked: "${event.title}"`, ...log.value].slice(0, 5)
  }
</script>

<template>
  <div class="w-full space-y-4">
    <UEEventCalendar
      v-model="currentDate"
      :events="events"
      :editable="false"
      @date-click="onDateClick"
      @event-click="onEventClick" />

    <div class="p-3 bg-muted rounded-lg text-sm">
      <p class="text-muted mb-2">Click on dates or events to see the log:</p>
      <div v-if="log.length" class="font-mono space-y-1">
        <p v-for="(entry, i) in log" :key="i" :class="i === 0 ? 'text-primary' : 'text-dimmed'">
          {{ entry }}
        </p>
      </div>
      <p v-else class="text-dimmed italic">No interactions yet</p>
    </div>
  </div>
</template>
