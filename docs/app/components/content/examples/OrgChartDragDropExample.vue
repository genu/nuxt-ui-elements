<script setup lang="ts">
  import type { OrgChartNode } from "#ui-elements-pro"

  const lastDrop = ref("")

  const nodes = ref<OrgChartNode[]>([
    { id: 1, parentId: null, name: "CEO", title: "Executive" },
    { id: 2, parentId: 1, name: "Engineering", title: "Department" },
    { id: 3, parentId: 1, name: "Marketing", title: "Department" },
    { id: 4, parentId: 2, name: "Alice", title: "Engineer" },
    { id: 5, parentId: 2, name: "Bob", title: "Engineer" },
    { id: 6, parentId: 3, name: "Carol", title: "Marketer" },
  ])

  function onNodeDrop(payload: { node: OrgChartNode; oldParentId: string | number | null; newParentId: string | number }) {
    lastDrop.value = `Moved "${payload.node.name}" to new parent ID: ${payload.newParentId}`
    nodes.value = nodes.value.map((n) =>
      n.id === payload.node.id ? { ...n, parentId: payload.newParentId } : n,
    )
  }
</script>

<template>
  <div class="w-full space-y-4">
    <div class="overflow-x-auto">
      <UEOrgChart
        :nodes="nodes"
        draggable
        @node-drop="onNodeDrop" />
    </div>

    <div class="p-3 bg-muted rounded-lg text-sm space-y-1">
      <p class="text-muted">Drag nodes to rearrange the hierarchy.</p>
      <p v-if="lastDrop" class="font-mono">
        <span class="text-primary">{{ lastDrop }}</span>
      </p>
    </div>
  </div>
</template>
