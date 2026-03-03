<script lang="ts">
  import type { AppConfig } from "@nuxt/schema"
  import theme from "#build/ui-elements/flow"
  import type { ComponentConfig } from "../types"
  import type { Node, Edge, ConnectionMode } from "@vue-flow/core"

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
</script>

<script lang="ts" setup>
  import { computed } from "vue"
  import { VueFlow } from "@vue-flow/core"
  import { tv } from "../utils/tv"

  const {
    nodes = [],
    edges = [],
    fitViewOnInit = true,
    minZoom = 0.2,
    maxZoom = 4,
    nodesDraggable = true,
    nodesConnectable = true,
    elementsSelectable = true,
    ui: uiProps = {},
  } = defineProps<FlowProps>()

  const emit = defineEmits<FlowEmits>()

  const ui = computed(() => tv({ extend: tv(theme) })({}))
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
      </VueFlow>
    </div>

    <template #fallback>
      <div :class="ui.root({ class: uiProps?.root })" />
    </template>
  </ClientOnly>
</template>
