<script setup lang="ts">
  import type { Node, Edge } from "@vue-flow/core"

  const nodes = ref<Node[]>([
    { id: "1", type: "custom", position: { x: 0, y: 100 }, data: { label: "Start", color: "success", variant: "soft" } },
    { id: "2", type: "custom", position: { x: 280, y: 0 }, data: { label: "Validate", color: "primary", variant: "outline" } },
    { id: "3", type: "custom", position: { x: 280, y: 200 }, data: { label: "Transform", color: "info", variant: "outline" } },
    { id: "4", type: "custom", position: { x: 560, y: 100 }, data: { label: "Decision", color: "warning", variant: "soft" } },
    { id: "5", type: "custom", position: { x: 840, y: 0 }, data: { label: "Success", color: "success", variant: "solid" } },
    { id: "6", type: "custom", position: { x: 840, y: 200 }, data: { label: "Error", color: "error", variant: "solid" } },
  ])

  const edges = ref<Edge[]>([
    { id: "e1-2", source: "1", target: "2", type: "smoothstep", animated: true },
    { id: "e1-3", source: "1", target: "3", type: "smoothstep", animated: true },
    { id: "e2-4", source: "2", target: "4", type: "smoothstep" },
    { id: "e3-4", source: "3", target: "4", type: "smoothstep" },
    { id: "e4-5", source: "4", target: "5", type: "smoothstep" },
    { id: "e4-6", source: "4", target: "6", type: "smoothstep" },
  ])
</script>

<template>
  <UEFlow
    :nodes="nodes"
    :edges="edges"
    :background="{ pattern: 'dots', gap: 20 }"
    :minimap="true"
    :ui="{ root: 'h-[400px] rounded-lg border border-accented' }">
    <template #node-custom="{ data, selected }">
      <UEFlowHandle type="target" position="left" :color="data.color" />
      <UEFlowNode :label="data.label" :color="data.color" :variant="data.variant" :selected="selected" />
      <UEFlowHandle type="source" position="right" :color="data.color" />
    </template>
  </UEFlow>
</template>
