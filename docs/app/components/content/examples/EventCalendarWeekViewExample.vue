<script setup lang="ts">
  import type { CalendarEvent } from "#ui-elements-pro"

  const currentDate = ref("2026-03-10")

  const events = shallowRef<CalendarEvent[]>([
    {
      id: 1,
      title: "Morning Standup",
      start: "2026-03-10T09:00",
      end: "2026-03-10T09:30",
      color: "primary",
    },
    {
      id: 2,
      title: "Design Review",
      start: "2026-03-10T10:00",
      end: "2026-03-10T11:30",
      color: "info",
    },
    {
      id: 3,
      title: "Lunch Break",
      start: "2026-03-10T12:00",
      end: "2026-03-10T13:00",
      color: "warning",
    },
    {
      id: 4,
      title: "Sprint Retro",
      start: "2026-03-11T14:00",
      end: "2026-03-11T15:00",
      color: "secondary",
    },
    {
      id: 5,
      title: "Client Call",
      start: "2026-03-12T11:00",
      end: "2026-03-12T12:00",
      color: "error",
    },
    {
      id: 6,
      title: "Team Offsite",
      start: "2026-03-09",
      end: "2026-03-11",
      color: "success",
      allDay: true,
    },
  ])
</script>

<template>
  <div class="w-full">
    <UEEventCalendar
      v-model="currentDate"
      :events="events"
      view="week"
      :week-options="{ startHour: 8, endHour: 18, slotDuration: 30 }" />
  </div>
</template>
