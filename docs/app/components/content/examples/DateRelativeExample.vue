<script setup lang="ts">
import { relative, subtract, add, today } from '#std/date'

const examples = computed(() => [
  { label: 'Yesterday', value: relative(subtract(today(), 1, 'day')) },
  { label: '3 days ago', value: relative(subtract(today(), 3, 'day')) },
  { label: 'Last week', value: relative(subtract(today(), 1, 'week')) },
  { label: 'Last month', value: relative(subtract(today(), 1, 'month')) },
  { label: 'Tomorrow', value: relative(add(today(), 1, 'day')) },
  { label: 'Next week', value: relative(add(today(), 1, 'week')) }
])
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
    <div
      v-for="example in examples"
      :key="example.label"
      class="p-3 bg-muted/50 rounded-md text-center"
    >
      <div class="text-xs text-muted mb-1">{{ example.label }}</div>
      <div class="font-medium">{{ example.value }}</div>
    </div>
  </div>
</template>
