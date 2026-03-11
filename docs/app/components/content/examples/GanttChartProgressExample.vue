<script setup lang="ts">
  import { today, getLocalTimeZone } from "@internationalized/date"
  import type { GanttTask } from "#ui-elements-pro"

  const currentDate = ref("2026-03-10")
  const ganttRef = ref()

  const tasks = shallowRef<GanttTask[]>([
    { id: 1, title: "Research", start: "2026-03-02", end: "2026-03-06", parentId: null, color: "success", progress: 100 },
    { id: 2, title: "Design", start: "2026-03-05", end: "2026-03-11", parentId: null, color: "primary", progress: 75 },
    { id: 3, title: "Development", start: "2026-03-09", end: "2026-03-20", parentId: null, color: "warning", progress: 30 },
    { id: 4, title: "Testing", start: "2026-03-18", end: "2026-03-25", parentId: null, color: "error", progress: 0 },
  ])

  onMounted(() => {
    ganttRef.value?.scrollToDate(today(getLocalTimeZone()))
  })
</script>

<template>
  <UEGanttChart
    ref="ganttRef"
    v-model="currentDate"
    :tasks="tasks"
    :editable="false" />
</template>
