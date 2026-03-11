<script setup lang="ts">
  type Color = "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"
  type Variant = "solid" | "outline" | "soft" | "subtle"

  const colors: Color[] = ["primary", "secondary", "success", "info", "warning", "error", "neutral"]
  const variants: Variant[] = ["solid", "outline", "soft", "subtle"]
</script>

<template>
  <div class="space-y-6">
    <div v-for="variant in variants" :key="variant">
      <p class="text-sm font-medium mb-3 capitalize text-muted">{{ variant }}</p>
      <div class="flex flex-wrap gap-3">
        <UEFlowNode
          v-for="color in colors"
          :key="color"
          :label="color"
          :color="color"
          :variant="variant"
          class="capitalize" />
      </div>
    </div>
  </div>
</template>
