<script setup lang="ts">
  import type { Node, Edge } from "@vue-flow/core"

  const nodes = ref<Node[]>([
    {
      id: "1",
      type: "custom",
      position: { x: 0, y: 100 },
      data: { label: "Start", description: "Trigger event", color: "success", variant: "soft" },
    },
    {
      id: "2",
      type: "custom",
      position: { x: 300, y: 0 },
      data: { label: "Process A", description: "Validate input", color: "primary", variant: "outline" },
    },
    {
      id: "3",
      type: "custom",
      position: { x: 300, y: 200 },
      data: { label: "Process B", description: "Transform data", color: "info", variant: "outline" },
    },
    {
      id: "4",
      type: "custom",
      position: { x: 600, y: 100 },
      data: { label: "Decision", description: "Check result", color: "warning", variant: "soft" },
    },
    {
      id: "5",
      type: "custom",
      position: { x: 900, y: 0 },
      data: { label: "Success", description: "Complete", color: "success", variant: "solid" },
    },
    {
      id: "6",
      type: "custom",
      position: { x: 900, y: 200 },
      data: { label: "Error", description: "Retry or fail", color: "error", variant: "solid" },
    },
  ])

  const edges = ref<Edge[]>([
    { id: "e1-2", source: "1", target: "2", type: "smoothstep", animated: true },
    { id: "e1-3", source: "1", target: "3", type: "smoothstep", animated: true },
    { id: "e2-4", source: "2", target: "4", type: "smoothstep" },
    { id: "e3-4", source: "3", target: "4", type: "smoothstep" },
    { id: "e4-5", source: "4", target: "5", type: "smoothstep" },
    { id: "e4-6", source: "4", target: "6", type: "smoothstep" },
  ])

  // Variant showcase data
  type Color = "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"
  type Variant = "solid" | "outline" | "soft" | "subtle"

  const colors: Color[] = ["primary", "secondary", "success", "info", "warning", "error", "neutral"]
  const variants: Variant[] = ["solid", "outline", "soft", "subtle"]

  const selectedColor = ref<Color>("primary")
  const selectedVariant = ref<Variant>("outline")

  // Simple demo nodes
  const simpleNodes = ref<Node[]>([
    {
      id: "s1",
      type: "custom",
      position: { x: 0, y: 50 },
      data: { label: "Input", color: "primary", variant: "outline" },
    },
    {
      id: "s2",
      type: "custom",
      position: { x: 250, y: 50 },
      data: { label: "Process", color: "primary", variant: "outline" },
    },
    {
      id: "s3",
      type: "custom",
      position: { x: 500, y: 50 },
      data: { label: "Output", color: "primary", variant: "outline" },
    },
  ])

  const simpleEdges = ref<Edge[]>([
    { id: "se1-2", source: "s1", target: "s2", type: "smoothstep" },
    { id: "se2-3", source: "s2", target: "s3", type: "smoothstep" },
  ])

  useSeoMeta({
    title: "Flow - Nuxt Elements",
    description: "Themed vue-flow wrapper component for Nuxt UI",
  })
</script>

<template>
  <div class="p-8 space-y-8">
    <div>
      <h1 class="text-3xl font-bold mb-2">Flow</h1>
      <p class="text-muted">A single themed wrapper around vue-flow with built-in background, controls, and minimap.</p>
    </div>

    <!-- Basic Usage -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Basic Usage</h2>
      </template>

      <p class="text-sm text-muted mb-4">
        A simple flow graph with three connected nodes. Background and controls are enabled by default.
      </p>

      <UEFlow :nodes="simpleNodes" :edges="simpleEdges" :ui="{ root: 'h-[350px] rounded-lg border border-accented' }">
        <template #node-custom="{ data, selected }">
          <UEFlowHandle type="target" position="left" />
          <UEFlowNode :label="data.label" :color="data.color" :variant="data.variant" :selected="selected" />
          <UEFlowHandle type="source" position="right" />
        </template>
      </UEFlow>
    </UCard>

    <!-- Full Example -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Full Example</h2>
      </template>

      <p class="text-sm text-muted mb-4">
        A more complex flow with multiple colors, variants, and minimap enabled. Try dragging nodes and connecting handles.
      </p>

      <UEFlow
        :nodes="nodes"
        :edges="edges"
        :background="{ pattern: 'dots', gap: 20 }"
        :minimap="true"
        :ui="{ root: 'h-[500px] rounded-lg border border-accented' }">
        <template #node-custom="{ data, selected }">
          <UEFlowHandle type="target" position="left" :color="data.color" />
          <UEFlowNode
            :label="data.label"
            :color="data.color"
            :variant="data.variant"
            :selected="selected">
            {{ data.description }}
          </UEFlowNode>
          <UEFlowHandle type="source" position="right" :color="data.color" />
        </template>
      </UEFlow>
    </UCard>

    <!-- Color & Variant Showcase -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Colors & Variants</h2>
      </template>

      <div class="space-y-6">
        <div v-for="variant in variants" :key="variant">
          <h3 class="font-medium mb-3 capitalize">{{ variant }}</h3>
          <div class="flex flex-wrap gap-3">
            <UEFlowNode v-for="color in colors" :key="color" :label="color" :color="color" :variant="variant" class="capitalize" />
          </div>
        </div>
      </div>
    </UCard>

    <!-- Interactive Preview -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Interactive Preview</h2>
      </template>

      <div class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <USelectMenu
            v-model="selectedColor"
            :items="colors.map((c) => ({ label: c, value: c }))"
            value-key="value"
            placeholder="Color"
            class="w-40 capitalize" />
          <USelectMenu
            v-model="selectedVariant"
            :items="variants.map((v) => ({ label: v, value: v }))"
            value-key="value"
            placeholder="Variant"
            class="w-40 capitalize" />
        </div>

        <div class="flex items-center gap-4">
          <div class="relative">
            <UEFlowNode label="Preview Node" :color="selectedColor" :variant="selectedVariant">
              Sample content
            </UEFlowNode>
          </div>
          <div>
            <UEFlowNode label="Selected State" :color="selectedColor" :variant="selectedVariant" :selected="true">
              With ring indicator
            </UEFlowNode>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
