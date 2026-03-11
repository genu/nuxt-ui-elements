<script setup lang="ts">
  import { today, getLocalTimeZone } from "@internationalized/date"
  import type { GanttTask, GanttZoomLevel } from "#ui-elements-pro"

  const currentDate = ref("2026-03-10")
  const zoomLevel = ref<GanttZoomLevel>("week")
  const ganttRef = ref()

  const tasks = shallowRef<GanttTask[]>([
    { id: 1, title: "Sprint 1", start: "2026-03-02", end: "2026-03-13", parentId: null, color: "primary" },
    { id: 2, title: "Design", start: "2026-03-02", end: "2026-03-06", parentId: 1, color: "info" },
    { id: 3, title: "Implement", start: "2026-03-09", end: "2026-03-13", parentId: 1, color: "success" },
    { id: 4, title: "Sprint 2", start: "2026-03-16", end: "2026-03-27", parentId: null, color: "primary" },
    { id: 5, title: "Iterate", start: "2026-03-16", end: "2026-03-20", parentId: 4, color: "warning" },
    { id: 6, title: "Ship", start: "2026-03-23", end: "2026-03-27", parentId: 4, color: "success" },
  ])

  onMounted(() => {
    ganttRef.value?.scrollToDate(today(getLocalTimeZone()))
  })
</script>

<template>
  <UEGanttChart
    ref="ganttRef"
    v-model="currentDate"
    v-model:zoom-level="zoomLevel"
    :tasks="tasks" />
</template>
