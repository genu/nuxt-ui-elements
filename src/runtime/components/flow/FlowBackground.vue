<script lang="ts">
  import type { AppConfig } from "@nuxt/schema"
  import theme from "#build/ui-elements/flow-background"
  import type { ComponentConfig } from "../../types"

  type FlowBackground = ComponentConfig<typeof theme, AppConfig, "flowBackground">

  export interface FlowBackgroundProps {
    /** Background pattern variant */
    pattern?: "dots" | "lines"
    /** Background pattern gap */
    gap?: number | number[]
    /** Background pattern size */
    size?: number
    /** Background pattern color */
    color?: string
    /** Background line width (for lines pattern) */
    lineWidth?: number
    /** Theme slot overrides */
    ui?: FlowBackground["slots"]
  }
</script>

<script lang="ts" setup>
  import { computed } from "vue"
  import { Background } from "@vue-flow/background"
  import { tv } from "../../utils/tv"

  const {
    pattern = "dots",
    gap = 20,
    size = 1,
    color,
    lineWidth,
    ui: uiProps = {},
  } = defineProps<FlowBackgroundProps>()

  const ui = computed(() =>
    tv({ extend: tv(theme) })({
      pattern: pattern as FlowBackground["variants"]["pattern"],
    }),
  )
</script>

<template>
  <Background
    :variant="pattern"
    :gap="gap"
    :size="size"
    :color="color"
    :line-width="lineWidth"
    :class="ui.root({ class: uiProps?.root })" />
</template>
