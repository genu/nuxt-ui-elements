<!-- eslint-disable @typescript-eslint/no-empty-object-type -->
<script lang="ts">
  import type { AppConfig } from "@nuxt/schema"
  import theme from "#build/ui-elements/dialog-alert"
  import type { ComponentConfig } from "../types/tv"
  import { computed } from "vue"
  import { DialogTitle, DialogDescription } from "reka-ui"
  import { tv } from "../utils/tv"

  type DialogAlert = ComponentConfig<typeof theme, AppConfig, "dialogAlert">

  interface DialogAlertEmits {
    "update:open": [value: boolean]
    close: [value?: any]
  }

  interface DialogAlertProps {
    title?: string
    description?: string
    icon?: string
    label?: string
    color?: DialogAlert["variants"]["color"]
    variant?: DialogAlert["variants"]["variant"]
    onDismiss?: (() => void) | (() => Promise<void>)
    ui?: DialogAlert["slots"]
  }
</script>

<script lang="ts" setup>
  const {
    title = "",
    description = "",
    icon = undefined,
    label = "Ok",
    color = "neutral",
    variant = "solid",
    onDismiss = () => {},
    ui: uiProps = {},
  } = defineProps<DialogAlertProps>()

  const emits = defineEmits<DialogAlertEmits>()

  const ui = computed(() =>
    tv({
      extend: tv(theme),
    })({
      size: "sm",
      color: color as DialogAlert["variants"]["color"],
      variant,
    }),
  )

  // Handler
  const dismissHandler = () => {
    onDismiss()
    emits("close")
  }
</script>

<template>
  <UModal
    :dismissible="false"
    :close="false"
    :title="title"
    :description="description"
    :ui="{
      content: ui.content({ class: ['animate-alert-bounce', uiProps?.content] }),
      header: ui.header({ class: uiProps?.header }),
      body: ui.body({ class: uiProps?.body }),
      footer: ui.footer({ class: uiProps?.footer }),
    }">
    <template #header>
      <div class="relative w-full flex flex-col items-center text-center gap-3">
        <UIcon v-if="icon" :name="icon" data-slot="icon" :class="ui.icon({ class: uiProps?.icon })" />
        <div class="w-full">
          <DialogTitle v-if="title" data-slot="title" :class="ui.title({ class: uiProps?.title })">
            {{ title }}
          </DialogTitle>

          <DialogDescription v-if="description" :class="ui.description({ class: uiProps?.description })">
            {{ description }}
          </DialogDescription>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton :label="label" size="lg" color="neutral" variant="outline" @click="dismissHandler" />
    </template>
  </UModal>
</template>
