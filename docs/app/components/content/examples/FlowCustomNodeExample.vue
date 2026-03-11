<script setup lang="ts">
  import type { Node, Edge } from "@vue-flow/core"

  const nodes = ref<Node[]>([
    { id: "1", type: "user", position: { x: 0, y: 0 }, data: { name: "Alice", role: "Designer", avatar: "A" } },
    { id: "2", type: "user", position: { x: 300, y: -50 }, data: { name: "Bob", role: "Developer", avatar: "B" } },
    { id: "3", type: "user", position: { x: 300, y: 100 }, data: { name: "Carol", role: "PM", avatar: "C" } },
    { id: "4", type: "user", position: { x: 600, y: 25 }, data: { name: "Dave", role: "QA", avatar: "D" } },
  ])

  const edges = ref<Edge[]>([
    { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
    { id: "e1-3", source: "1", target: "3", type: "smoothstep" },
    { id: "e2-4", source: "2", target: "4", type: "smoothstep" },
    { id: "e3-4", source: "3", target: "4", type: "smoothstep" },
  ])
</script>

<template>
  <UEFlow
    :nodes="nodes"
    :edges="edges"
    :ui="{ root: 'h-[300px] rounded-lg border border-accented' }">
    <template #node-user="{ data }">
      <UEFlowHandle type="target" position="left" />
      <div class="flex items-center gap-3 rounded-lg border border-accented bg-default px-4 py-3 shadow-sm">
        <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {{ data.avatar }}
        </div>
        <div>
          <div class="text-sm font-medium">{{ data.name }}</div>
          <div class="text-xs text-muted">{{ data.role }}</div>
        </div>
      </div>
      <UEFlowHandle type="source" position="right" />
    </template>
  </UEFlow>
</template>
