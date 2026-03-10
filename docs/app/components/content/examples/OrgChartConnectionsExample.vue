<script setup lang="ts">
  import type { OrgChartNode, OrgChartConnection } from "#ui-elements-pro"

  const nodes = shallowRef<OrgChartNode[]>([
    { id: 1, parentId: null, name: "CEO", title: "Executive" },
    { id: 2, parentId: 1, name: "Engineering", title: "Department" },
    { id: 3, parentId: 1, name: "Design", title: "Department" },
    { id: 4, parentId: 1, name: "Marketing", title: "Department" },
    { id: 5, parentId: 2, name: "Alice", title: "Engineer" },
    { id: 6, parentId: 3, name: "Bob", title: "Designer" },
    { id: 7, parentId: 4, name: "Carol", title: "Marketer" },
  ])

  const connections = shallowRef<OrgChartConnection[]>([
    { id: "c1", fromId: 5, toId: 6, label: "Collaborates", style: "dashed", color: "info" },
    { id: "c2", fromId: 6, toId: 7, label: "Reports to", style: "dotted", color: "warning" },
  ])
</script>

<template>
  <div class="w-full overflow-x-auto">
    <UEOrgChart :nodes="nodes" :connections="connections" />
  </div>
</template>
