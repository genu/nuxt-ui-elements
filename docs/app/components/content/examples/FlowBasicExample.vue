<script setup lang="ts">
  import type { Node, Edge } from "@vue-flow/core"

  const nodes = ref<Node[]>([
    { id: "1", type: "custom", position: { x: 0, y: 50 }, data: { label: "Input", color: "primary" } },
    { id: "2", type: "custom", position: { x: 250, y: 50 }, data: { label: "Process", color: "primary" } },
    { id: "3", type: "custom", position: { x: 500, y: 50 }, data: { label: "Output", color: "primary" } },
  ])

  const edges = ref<Edge[]>([
    { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
    { id: "e2-3", source: "2", target: "3", type: "smoothstep" },
  ])
</script>

<template>
  <UEFlow :nodes="nodes" :edges="edges" :ui="{ root: 'h-[300px] rounded-lg border border-accented' }">
    <template #node-custom="{ data }">
      <UEFlowHandle type="target" position="left" />
      <UEFlowNode :label="data.label" :color="data.color" variant="outline" />
      <UEFlowHandle type="source" position="right" />
    </template>
  </UEFlow>
</template>
