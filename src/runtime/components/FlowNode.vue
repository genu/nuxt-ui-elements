<script lang="ts">
  import type { AppConfig } from "@nuxt/schema"
  import theme from "#build/ui-elements/flow-node"
  import type { ComponentConfig } from "../types"

  type FlowNode = ComponentConfig<typeof theme, AppConfig, "flowNode">

  export interface FlowNodeProps {
    /** Label text */
    label?: string
    /** Theme color */
    color?: FlowNode["variants"]["color"]
    /** Visual variant */
    variant?: FlowNode["variants"]["variant"]
    /** Whether the node is currently selected */
    selected?: boolean
    /** Theme slot overrides */
    ui?: FlowNode["slots"]
  }
</script>

<script lang="ts" setup>
  import { computed } from "vue"
  import { tv } from "../utils/tv"

  const {
    label,
    color = "primary",
    variant = "outline",
    selected = false,
    ui: uiProps = {},
  } = defineProps<FlowNodeProps>()

  const ui = computed(() =>
    tv({ extend: tv(theme) })({
      color: color as FlowNode["variants"]["color"],
      variant,
      selected,
    }),
  )
</script>

<template>
  <div :class="ui.root({ class: uiProps?.root })">
    <div v-if="label" :class="ui.label({ class: uiProps?.label })">
      {{ label }}
    </div>
    <div v-if="$slots.default" :class="ui.content({ class: uiProps?.content })">
      <slot />
    </div>
  </div>
</template>
