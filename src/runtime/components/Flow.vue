<script lang="ts">
  import type { AppConfig } from "@nuxt/schema"
  import theme from "#build/ui-elements/flow"
  import type { ComponentConfig } from "../types"
  import type { Node, Edge, ConnectionMode } from "@vue-flow/core"
  import type { FlowBackgroundProps } from "./flow/FlowBackground.vue"
  import type { FlowControlsProps } from "./flow/FlowControls.vue"
  import type { FlowMiniMapProps } from "./flow/FlowMiniMap.vue"

  type Flow = ComponentConfig<typeof theme, AppConfig, "flow">

  export interface FlowProps {
    /** Array of node objects */
    nodes?: Node[]
    /** Array of edge objects */
    edges?: Edge[]
    /** Map of custom node type components */
    nodeTypes?: Record<string, any>
    /** Map of custom edge type components */
    edgeTypes?: Record<string, any>
    /** Fit view on initialization */
    fitViewOnInit?: boolean
    /** Minimum zoom level */
    minZoom?: number
    /** Maximum zoom level */
    maxZoom?: number
    /** Whether nodes are draggable */
    nodesDraggable?: boolean
    /** Whether nodes are connectable */
    nodesConnectable?: boolean
    /** Whether elements are selectable */
    elementsSelectable?: boolean
    /** Connection mode */
    connectionMode?: ConnectionMode
    /** Default edge options */
    defaultEdgeOptions?: Record<string, any>
    /** Show background (true for defaults, or pass config object) */
    background?: boolean | Omit<FlowBackgroundProps, "ui">
    /** Show controls (true for defaults, or pass config object) */
    controls?: boolean | Omit<FlowControlsProps, "ui">
    /** Show minimap (true for defaults, or pass config object) */
    minimap?: boolean | Omit<FlowMiniMapProps, "ui">
    /** Theme slot overrides */
    ui?: Flow["slots"]
  }

  export interface FlowEmits {
    "update:nodes": [nodes: Node[]]
    "update:edges": [edges: Edge[]]
    nodeClick: [event: any]
    edgeClick: [event: any]
    paneClick: [event: any]
    connect: [params: any]
  }

  export type { FlowBackgroundProps, FlowControlsProps, FlowMiniMapProps }
  export type { FlowNodeProps } from "./FlowNode.vue"
  export type { FlowHandleProps } from "./FlowHandle.vue"
</script>

<script lang="ts" setup>
  import { computed } from "vue"
  import { VueFlow } from "@vue-flow/core"
  import { tv } from "../utils/tv"
  import FlowBackground from "./flow/FlowBackground.vue"
  import FlowControls from "./flow/FlowControls.vue"
  import FlowMiniMap from "./flow/FlowMiniMap.vue"

  const {
    nodes = [],
    edges = [],
    fitViewOnInit = true,
    minZoom = 0.2,
    maxZoom = 4,
    nodesDraggable = true,
    nodesConnectable = true,
    elementsSelectable = true,
    background = true,
    controls = true,
    minimap = false,
    ui: uiProps = {},
  } = defineProps<FlowProps>()

  const emit = defineEmits<FlowEmits>()

  const ui = computed(() => tv({ extend: tv(theme) })({}))

  const backgroundProps = computed(() => {
    if (background === false) return null
    if (background === true) return {}
    return background
  })

  const controlsProps = computed(() => {
    if (controls === false) return null
    if (controls === true) return {}
    return controls
  })

  const minimapProps = computed(() => {
    if (minimap === false) return null
    if (minimap === true) return {}
    return minimap
  })
</script>

<template>
  <ClientOnly>
    <div :class="ui.root({ class: uiProps?.root })">
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :node-types="nodeTypes"
        :edge-types="edgeTypes"
        :fit-view-on-init="fitViewOnInit"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :nodes-draggable="nodesDraggable"
        :nodes-connectable="nodesConnectable"
        :elements-selectable="elementsSelectable"
        :connection-mode="connectionMode"
        :default-edge-options="defaultEdgeOptions"
        :class="ui.wrapper({ class: uiProps?.wrapper })"
        @update:nodes="emit('update:nodes', $event)"
        @update:edges="emit('update:edges', $event)"
        @node-click="emit('nodeClick', $event)"
        @edge-click="emit('edgeClick', $event)"
        @pane-click="emit('paneClick', $event)"
        @connect="emit('connect', $event)">
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData ?? {}" />
        </template>

        <FlowBackground v-if="backgroundProps" v-bind="backgroundProps" />
        <FlowControls v-if="controlsProps" v-bind="controlsProps" />
        <FlowMiniMap v-if="minimapProps" v-bind="minimapProps" />
      </VueFlow>
    </div>

    <template #fallback>
      <div :class="ui.root({ class: uiProps?.root })" />
    </template>
  </ClientOnly>
</template>
