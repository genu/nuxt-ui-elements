<script setup lang="ts">
  import type { OrgChartNode, OrgChartDirection } from "#ui-elements-pro"

  const direction = ref<OrgChartDirection>("vertical")

  const directions: { label: string; value: OrgChartDirection }[] = [
    { label: "Vertical", value: "vertical" },
    { label: "Horizontal", value: "horizontal" },
    { label: "Bottom-up", value: "bottom-up" },
    { label: "Right-to-left", value: "right-to-left" },
  ]

  const nodes = shallowRef<OrgChartNode[]>([
    { id: 1, parentId: null, name: "CEO", title: "Executive" },
    { id: 2, parentId: 1, name: "Engineering", title: "Department" },
    { id: 3, parentId: 1, name: "Marketing", title: "Department" },
    { id: 4, parentId: 2, name: "Frontend", title: "Team" },
    { id: 5, parentId: 2, name: "Backend", title: "Team" },
    { id: 6, parentId: 3, name: "Growth", title: "Team" },
  ])
</script>

<template>
  <div class="w-full space-y-4">
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="d in directions"
        :key="d.value"
        :label="d.label"
        :variant="direction === d.value ? 'solid' : 'outline'"
        size="sm"
        @click="direction = d.value" />
    </div>

    <div class="overflow-x-auto">
      <UEOrgChart :nodes="nodes" :direction="direction" />
    </div>
  </div>
</template>
