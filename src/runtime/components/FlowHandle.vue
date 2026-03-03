<script lang="ts">
  import type { AppConfig } from "@nuxt/schema"
  import theme from "#build/ui-elements/flow-handle"
  import type { ComponentConfig } from "../types"
  import type { Position } from "@vue-flow/core"

  type FlowHandle = ComponentConfig<typeof theme, AppConfig, "flowHandle">

  export interface FlowHandleProps {
    /** Handle type: source or target */
    type: "source" | "target"
    /** Handle position */
    position?: Position | "top" | "bottom" | "left" | "right"
    /** Handle ID (for multiple handles per node) */
    id?: string
    /** Theme color */
    color?: FlowHandle["variants"]["color"]
    /** Whether a connection is active on this handle */
    connected?: boolean
    /** Theme slot overrides */
    ui?: FlowHandle["slots"]
  }
</script>

<script lang="ts" setup>
  import { computed } from "vue"
  import { Handle, Position as VFPosition } from "@vue-flow/core"
  import { tv } from "../utils/tv"

  const {
    type,
    position = VFPosition.Bottom,
    color = "primary",
    connected = false,
    ui: uiProps = {},
  } = defineProps<FlowHandleProps>()

  const ui = computed(() =>
    tv({ extend: tv(theme) })({
      color: color as FlowHandle["variants"]["color"],
      connected,
    }),
  )
</script>

<template>
  <Handle :id="id" :type="type" :position="(position as Position)" :class="ui.root({ class: uiProps?.root })" />
</template>
