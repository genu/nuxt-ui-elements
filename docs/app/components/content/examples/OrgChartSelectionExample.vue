<script setup lang="ts">
  import type { OrgChartNode } from "#ui-elements-pro"

  const selected = ref<(string | number)[]>([])
  const lastEvent = ref("")

  const nodes = shallowRef<OrgChartNode[]>([
    { id: 1, parentId: null, name: "Sarah Chen", title: "CEO" },
    { id: 2, parentId: 1, name: "James Wilson", title: "CTO" },
    { id: 3, parentId: 1, name: "Maria Garcia", title: "CFO" },
    { id: 4, parentId: 2, name: "Alex Turner", title: "Lead Engineer" },
    { id: 5, parentId: 2, name: "Priya Patel", title: "Lead Designer" },
    { id: 6, parentId: 3, name: "Tom Baker", title: "Controller" },
  ])

  function onNodeSelect(payload: { node: OrgChartNode; selected: boolean }) {
    lastEvent.value = `${payload.selected ? "Selected" : "Deselected"}: ${payload.node.name}`
  }
</script>

<template>
  <div class="w-full space-y-4">
    <div class="overflow-x-auto">
      <UEOrgChart
        v-model:selected="selected"
        :nodes="nodes"
        selection-mode="multiple"
        @node-select="onNodeSelect" />
    </div>

    <div class="p-3 bg-muted rounded-lg text-sm space-y-1">
      <p class="text-muted">Click nodes to select them. Using <code>selection-mode="multiple"</code>.</p>
      <p v-if="selected.length" class="font-mono">
        <span class="text-primary">Selected IDs: {{ selected.join(", ") }}</span>
      </p>
      <p v-if="lastEvent" class="font-mono">
        <span class="text-dimmed">{{ lastEvent }}</span>
      </p>
    </div>
  </div>
</template>
