<script setup lang="ts">
  import type { Node, Edge } from "@vue-flow/core"

  const pattern = ref<"dots" | "lines">("dots")

  const nodes = ref<Node[]>([
    { id: "1", type: "custom", position: { x: 50, y: 50 }, data: { label: "Node A" } },
    { id: "2", type: "custom", position: { x: 300, y: 50 }, data: { label: "Node B" } },
  ])

  const edges = ref<Edge[]>([
    { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
  ])
</script>

<template>
  <div class="space-y-3">
    <div class="flex gap-2">
      <UButton :variant="pattern === 'dots' ? 'solid' : 'outline'" size="sm" @click="pattern = 'dots'">Dots</UButton>
      <UButton :variant="pattern === 'lines' ? 'solid' : 'outline'" size="sm" @click="pattern = 'lines'">Lines</UButton>
    </div>

    <UEFlow
      :nodes="nodes"
      :edges="edges"
      :background="{ pattern, gap: 20 }"
      :controls="false"
      :ui="{ root: 'h-[250px] rounded-lg border border-accented' }">
      <template #node-custom="{ data }">
        <UEFlowHandle type="target" position="left" />
        <UEFlowNode :label="data.label" variant="outline" />
        <UEFlowHandle type="source" position="right" />
      </template>
    </UEFlow>
  </div>
</template>
