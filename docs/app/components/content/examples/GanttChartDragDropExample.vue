<script setup lang="ts">
  import { today, getLocalTimeZone } from "@internationalized/date"
  import type { GanttTask, GanttTaskDropPayload } from "#ui-elements-pro"

  const currentDate = ref("2026-03-10")
  const ganttRef = ref()

  const tasks = ref<GanttTask[]>([
    { id: 1, title: "Task A", start: "2026-03-09", end: "2026-03-11", parentId: null, color: "primary" },
    { id: 2, title: "Task B", start: "2026-03-12", end: "2026-03-14", parentId: null, color: "success" },
    { id: 3, title: "Fixed Task", start: "2026-03-16", end: "2026-03-18", parentId: null, color: "error", draggable: false },
  ])

  function onTaskDrop(payload: GanttTaskDropPayload) {
    const task = tasks.value.find(t => t.id === payload.task.id)
    if (task) {
      task.start = payload.newStart.toString()
      task.end = payload.newEnd.toString()
    }
  }

  onMounted(() => {
    ganttRef.value?.scrollToDate(today(getLocalTimeZone()))
  })
</script>

<template>
  <UEGanttChart
    ref="ganttRef"
    v-model="currentDate"
    :tasks="tasks"
    zoom-level="week"
    @task-drop="onTaskDrop" />
</template>
