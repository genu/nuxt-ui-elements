<script setup lang="ts">
  import type { OrgChartNode } from "#ui-elements-pro"

  const nodes = shallowRef<OrgChartNode[]>([
    { id: 1, parentId: null, name: "Sarah Chen", title: "CEO", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, parentId: 1, name: "James Wilson", title: "CTO", avatar: "https://i.pravatar.cc/150?u=james" },
    { id: 3, parentId: 1, name: "Maria Garcia", title: "CFO", avatar: "https://i.pravatar.cc/150?u=maria" },
    { id: 4, parentId: 1, name: "David Kim", title: "COO", avatar: "https://i.pravatar.cc/150?u=david" },
    { id: 5, parentId: 2, name: "Alex Turner", title: "Lead Engineer", avatar: "https://i.pravatar.cc/150?u=alex" },
    { id: 6, parentId: 2, name: "Priya Patel", title: "Lead Designer", avatar: "https://i.pravatar.cc/150?u=priya" },
    { id: 7, parentId: 3, name: "Tom Baker", title: "Controller", avatar: "https://i.pravatar.cc/150?u=tom" },
    { id: 8, parentId: 4, name: "Lisa Wang", title: "VP Operations", avatar: "https://i.pravatar.cc/150?u=lisa" },
  ])
</script>

<template>
  <div class="w-full overflow-x-auto">
    <UEOrgChart :nodes="nodes" />
  </div>
</template>
