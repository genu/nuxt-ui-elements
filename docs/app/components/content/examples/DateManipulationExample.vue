<script setup lang="ts">
  import { format, add, subtract, startOf, endOf, today } from "#std/date"

  const examples = computed(() => [
    {
      operation: 'add(today(), 1, "week")',
      label: "Next week",
      value: format(add(today(), 1, "week"), "MMMM D, YYYY"),
    },
    {
      operation: 'subtract(today(), 1, "month")',
      label: "Last month",
      value: format(subtract(today(), 1, "month"), "MMMM D, YYYY"),
    },
    {
      operation: 'startOf(today(), "month")',
      label: "Start of month",
      value: format(startOf(today(), "month"), "MMMM D, YYYY"),
    },
    {
      operation: 'endOf(today(), "month")',
      label: "End of month",
      value: format(endOf(today(), "month"), "MMMM D, YYYY"),
    },
  ])
</script>

<template>
  <div class="space-y-3">
    <div v-for="example in examples" :key="example.label" class="flex items-center justify-between p-3 bg-muted/50 rounded-md">
      <div>
        <code class="text-xs text-muted">{{ example.operation }}</code>
        <div class="text-sm mt-1">{{ example.label }}</div>
      </div>
      <div class="font-mono text-sm">{{ example.value }}</div>
    </div>
  </div>
</template>
