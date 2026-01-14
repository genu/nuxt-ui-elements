<script setup lang="ts">
  import { format, add, subtract, relative, today, now, startOf, endOf } from "#std/date"

  const currentDate = ref(format(today(), "YYYY-MM-DD"))

  const examples = computed(() => [
    {
      label: "Today",
      value: format(today(), "MMMM D, YYYY"),
    },
    {
      label: "Now",
      value: format(now(), "MMMM D, YYYY h:mm A"),
    },
    {
      label: "Tomorrow",
      value: format(add(today(), 1, "day"), "MMMM D, YYYY"),
    },
    {
      label: "Next Week",
      value: format(add(today(), 1, "week"), "MMMM D, YYYY"),
    },
    {
      label: "Last Month",
      value: format(subtract(today(), 1, "month"), "MMMM D, YYYY"),
    },
    {
      label: "Start of Month",
      value: format(startOf(today(), "month"), "MMMM D, YYYY"),
    },
    {
      label: "End of Month",
      value: format(endOf(today(), "month"), "MMMM D, YYYY"),
    },
    {
      label: "Relative (yesterday)",
      value: relative(subtract(today(), 1, "day")),
    },
    {
      label: "Relative (next week)",
      value: relative(add(today(), 1, "week")),
    },
  ])
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div v-for="example in examples" :key="example.label" class="p-3 bg-muted/50 rounded-md">
        <div class="text-sm text-muted mb-1">{{ example.label }}</div>
        <div class="font-mono text-sm">{{ example.value }}</div>
      </div>
    </div>
  </div>
</template>
