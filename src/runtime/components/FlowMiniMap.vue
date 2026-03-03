<script lang="ts">
  import type { AppConfig } from "@nuxt/schema"
  import theme from "#build/ui-elements/flow-mini-map"
  import type { ComponentConfig } from "../types"
  import type { PanelPositionType } from "@vue-flow/core"

  type FlowMiniMap = ComponentConfig<typeof theme, AppConfig, "flowMiniMap">

  export interface FlowMiniMapProps {
    /** Enable drag to pan viewport */
    pannable?: boolean
    /** Enable zoom to zoom viewport */
    zoomable?: boolean
    /** Panel position */
    position?: PanelPositionType
    /** Node color */
    nodeColor?: string
    /** Node stroke color */
    nodeStrokeColor?: string
    /** Node border radius */
    nodeBorderRadius?: number
    /** Mask color */
    maskColor?: string
    /** Width */
    width?: number
    /** Height */
    height?: number
    /** Theme slot overrides */
    ui?: FlowMiniMap["slots"]
  }
</script>

<script lang="ts" setup>
  import { computed } from "vue"
  import { MiniMap } from "@vue-flow/minimap"
  import { tv } from "../utils/tv"

  const {
    pannable = true,
    zoomable = true,
    position = "bottom-right",
    nodeColor,
    nodeStrokeColor,
    nodeBorderRadius = 4,
    maskColor,
    width,
    height,
    ui: uiProps = {},
  } = defineProps<FlowMiniMapProps>()

  const ui = computed(() => tv({ extend: tv(theme) })({}))
</script>

<template>
  <MiniMap
    :pannable="pannable"
    :zoomable="zoomable"
    :position="position"
    :node-color="nodeColor"
    :node-stroke-color="nodeStrokeColor"
    :node-border-radius="nodeBorderRadius"
    :mask-color="maskColor"
    :width="width"
    :height="height"
    :class="ui.root({ class: uiProps?.root })">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </MiniMap>
</template>
