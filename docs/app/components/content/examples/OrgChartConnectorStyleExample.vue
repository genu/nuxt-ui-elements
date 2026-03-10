<script setup lang="ts">
  import type { OrgChartNode, OrgChartConnectorStyle } from "#ui-elements-pro"

  const connectorStyle = ref<OrgChartConnectorStyle>("right-angle")

  const styles: { label: string; value: OrgChartConnectorStyle }[] = [
    { label: "Right Angle", value: "right-angle" },
    { label: "Curved", value: "curved" },
    { label: "Straight", value: "straight" },
  ]

  const nodes = shallowRef<OrgChartNode[]>([
    { id: 1, parentId: null, name: "Root", title: "Level 0" },
    { id: 2, parentId: 1, name: "Child A", title: "Level 1" },
    { id: 3, parentId: 1, name: "Child B", title: "Level 1" },
    { id: 4, parentId: 1, name: "Child C", title: "Level 1" },
    { id: 5, parentId: 2, name: "Grandchild", title: "Level 2" },
  ])
</script>

<template>
  <div class="w-full space-y-4">
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="s in styles"
        :key="s.value"
        :label="s.label"
        :variant="connectorStyle === s.value ? 'solid' : 'outline'"
        size="sm"
        @click="connectorStyle = s.value" />
    </div>

    <div class="overflow-x-auto">
      <UEOrgChart :nodes="nodes" :connector-style="connectorStyle" />
    </div>
  </div>
</template>
