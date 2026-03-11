<script setup lang="ts">
  import type { OrgChartNode } from "#ui-elements-pro"

  const searchQuery = ref("")

  const nodes = shallowRef<OrgChartNode[]>([
    { id: 1, parentId: null, name: "Sarah Chen", title: "CEO" },
    { id: 2, parentId: 1, name: "James Wilson", title: "CTO" },
    { id: 3, parentId: 1, name: "Maria Garcia", title: "CFO" },
    { id: 4, parentId: 2, name: "Alex Turner", title: "Lead Engineer" },
    { id: 5, parentId: 2, name: "Priya Patel", title: "Lead Designer" },
    { id: 6, parentId: 3, name: "Tom Baker", title: "Controller" },
    { id: 7, parentId: 4, name: "Sam Johnson", title: "Frontend Developer" },
    { id: 8, parentId: 4, name: "Nina Williams", title: "Backend Developer" },
  ])
</script>

<template>
  <div class="w-full space-y-4">
    <UInput v-model="searchQuery" placeholder="Search nodes..." icon="i-lucide-search" class="max-w-xs" />

    <div class="overflow-x-auto">
      <UEOrgChart :nodes="nodes" :search-query="searchQuery" />
    </div>
  </div>
</template>
