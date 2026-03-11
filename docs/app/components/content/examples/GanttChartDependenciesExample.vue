<script setup lang="ts">
  import { today, getLocalTimeZone } from "@internationalized/date"
  import type { GanttTask, GanttDependency } from "#ui-elements-pro"

  const currentDate = ref("2026-03-10")
  const ganttRef = ref()

  const tasks = shallowRef<GanttTask[]>([
    { id: 1, title: "Design", start: "2026-03-02", end: "2026-03-06", parentId: null, color: "primary" },
    { id: 2, title: "Development", start: "2026-03-09", end: "2026-03-18", parentId: null, color: "success" },
    { id: 3, title: "Testing", start: "2026-03-19", end: "2026-03-23", parentId: null, color: "warning" },
    { id: 4, title: "Deployment", start: "2026-03-24", end: "2026-03-24", parentId: null, milestone: true, color: "error" },
  ])

  const dependencies = shallowRef<GanttDependency[]>([
    { id: 1, fromId: 1, toId: 2, type: "finish-to-start" },
    { id: 2, fromId: 2, toId: 3, type: "finish-to-start" },
    { id: 3, fromId: 3, toId: 4, type: "finish-to-start" },
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
    :dependencies="dependencies" />
</template>
