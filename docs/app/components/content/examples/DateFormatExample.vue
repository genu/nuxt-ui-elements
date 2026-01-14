<script setup lang="ts">
import { format, now } from '#std/date'

const formats = [
  { token: 'YYYY-MM-DD', description: 'ISO date' },
  { token: 'DD/MM/YYYY', description: 'European format' },
  { token: 'MM/DD/YYYY', description: 'US format' },
  { token: 'MMMM D, YYYY', description: 'Full month' },
  { token: 'MMM DD', description: 'Short month' },
  { token: 'dddd', description: 'Day of week' },
  { token: 'h:mm A', description: '12-hour time' },
  { token: 'HH:mm:ss', description: '24-hour time' }
]
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div
      v-for="fmt in formats"
      :key="fmt.token"
      class="p-3 bg-muted/50 rounded-md"
    >
      <div class="text-xs text-muted mb-1 font-mono">{{ fmt.token }}</div>
      <div class="font-medium">{{ format(now(), fmt.token) }}</div>
      <div class="text-xs text-muted mt-1">{{ fmt.description }}</div>
    </div>
  </div>
</template>
