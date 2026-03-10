<script setup lang="ts">
  import type { CalendarEvent } from "#ui-elements-pro"

  const currentDate = ref("2026-03-10")
  const locale = ref("en-US")
  const weekStartsOn = ref<0 | 1>(0)

  const locales = [
    { label: "English (US)", value: "en-US", weekStart: 0 as const },
    { label: "French", value: "fr-FR", weekStart: 1 as const },
    { label: "German", value: "de-DE", weekStart: 1 as const },
    { label: "Japanese", value: "ja-JP", weekStart: 0 as const },
    { label: "Arabic", value: "ar-SA", weekStart: 6 as const },
  ]

  const events = shallowRef<CalendarEvent[]>([
    {
      id: 1,
      title: "International Meeting",
      start: "2026-03-10T10:00",
      end: "2026-03-10T11:30",
      color: "primary",
    },
    {
      id: 2,
      title: "Holiday",
      start: "2026-03-13",
      color: "success",
      allDay: true,
    },
  ])

  function setLocale(l: (typeof locales)[number]) {
    locale.value = l.value
    weekStartsOn.value = l.weekStart as 0 | 1
  }
</script>

<template>
  <div class="w-full space-y-4">
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="l in locales"
        :key="l.value"
        :label="l.label"
        :variant="locale === l.value ? 'solid' : 'outline'"
        size="sm"
        @click="setLocale(l)" />
    </div>

    <UEEventCalendar
      v-model="currentDate"
      :events="events"
      :locale="locale"
      :week-starts-on="weekStartsOn"
      :editable="false" />
  </div>
</template>
