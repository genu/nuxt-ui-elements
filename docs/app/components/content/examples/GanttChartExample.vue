<script setup lang="ts">
  import { today, getLocalTimeZone } from "@internationalized/date"
  import type { GanttTask } from "#ui-elements-pro"

  const currentDate = ref("2026-03-10")
  const ganttRef = ref()

  const tasks = shallowRef<GanttTask[]>([
    { id: 1, title: "Project Planning", start: "2026-03-02", end: "2026-03-06", parentId: null, color: "primary" },
    { id: 2, title: "Research", start: "2026-03-02", end: "2026-03-04", parentId: 1, color: "info" },
    { id: 3, title: "Requirements", start: "2026-03-04", end: "2026-03-06", parentId: 1, color: "info" },
    { id: 4, title: "Development", start: "2026-03-09", end: "2026-03-20", parentId: null, color: "success" },
    { id: 5, title: "Frontend", start: "2026-03-09", end: "2026-03-14", parentId: 4, color: "success" },
    { id: 6, title: "Backend", start: "2026-03-11", end: "2026-03-18", parentId: 4, color: "success" },
    { id: 7, title: "Testing", start: "2026-03-18", end: "2026-03-20", parentId: 4, color: "warning" },
    { id: 8, title: "Launch", start: "2026-03-23", end: "2026-03-23", parentId: null, milestone: true, color: "error" },
  ])

  onMounted(() => {
    ganttRef.value?.scrollToDate(today(getLocalTimeZone()))
  })
</script>

<template>
  <UEGanttChart ref="ganttRef" v-model="currentDate" :tasks="tasks" />
</template>
