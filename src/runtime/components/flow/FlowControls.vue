<script lang="ts">
  import type { AppConfig } from "@nuxt/schema"
  import theme from "#build/ui-elements/flow-controls"
  import type { ComponentConfig } from "../../types"
  import type { PanelPositionType, FitViewParams } from "@vue-flow/core"

  type FlowControls = ComponentConfig<typeof theme, AppConfig, "flowControls">

  export interface FlowControlsProps {
    /** Show zoom controls */
    showZoom?: boolean
    /** Show fit-view button */
    showFitView?: boolean
    /** Show interactive toggle */
    showInteractive?: boolean
    /** Fit view params */
    fitViewParams?: FitViewParams
    /** Panel position */
    position?: PanelPositionType
    /** Theme slot overrides */
    ui?: FlowControls["slots"]
  }
</script>

<script lang="ts" setup>
  import { computed } from "vue"
  import { Controls } from "@vue-flow/controls"
  import { tv } from "../../utils/tv"

  const {
    showZoom = true,
    showFitView = true,
    showInteractive = true,
    fitViewParams,
    position = "bottom-left",
    ui: uiProps = {},
  } = defineProps<FlowControlsProps>()

  const ui = computed(() => tv({ extend: tv(theme) })({}))
</script>

<template>
  <Controls
    :show-zoom="showZoom"
    :show-fit-view="showFitView"
    :show-interactive="showInteractive"
    :fit-view-params="fitViewParams"
    :position="position"
    :class="ui.root({ class: uiProps?.root })">
    <slot />
  </Controls>
</template>
