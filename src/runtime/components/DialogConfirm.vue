<!-- eslint-disable @typescript-eslint/no-empty-object-type -->
<script lang="ts">
  import type { AppConfig } from "@nuxt/schema"
  import theme from "#build/ui-elements/dialog-confirm"
  import type { ButtonProps } from "@nuxt/ui"
  import type { ComponentConfig } from "../types/tv"
  import { computed, ref } from "vue"
  import { DialogTitle, DialogDescription } from "reka-ui"
  import { tv } from "../utils/tv"

  type DialogConfirm = ComponentConfig<typeof theme, AppConfig, "dialogConfirm">

  interface DialogConfirmEmits {
    "update:open": [value: boolean]
    close: [value?: any]
  }

  interface DialogConfirmProps {
    title?: string
    description?: string
    icon?: boolean
    confirmLabel?: string
    dismissLabel?: string
    close?: boolean
    color?: DialogConfirm["variants"]["color"]
    variant?: DialogConfirm["variants"]["variant"]
    onConfirm?: (() => void) | (() => Promise<void>)
    onDismiss?: () => void
    ui?: DialogConfirm["slots"]
  }
</script>

<script lang="ts" setup>
  const {
    title = "",
    description = "",
    icon = true,
    confirmLabel = "Yes",
    dismissLabel = "No",
    close = false,
    color = "neutral",
    variant = "solid",
    onConfirm = () => {},
    onDismiss = () => {},
    ui: uiProps = {},
  } = defineProps<DialogConfirmProps>()

  const emits = defineEmits<DialogConfirmEmits>()

  // Async state
  const isLoading = ref(false)
  const isComplete = ref(false)
  const isError = ref(false)

  const ui = computed(() =>
    tv({
      extend: tv(theme),
    })({
      size: "sm",
      color: color as DialogConfirm["variants"]["color"],
      variant,
    }),
  )

  // Icon defaults based on color
  const colorIconMap: Record<string, string> = {
    primary: "i-lucide-info",
    secondary: "i-lucide-info",
    success: "i-lucide-circle-check",
    info: "i-lucide-info",
    warning: "i-lucide-triangle-alert",
    error: "i-lucide-circle-x",
    neutral: "i-lucide-info",
  }

  const dialogIcon = computed(() => {
    if (icon === false) return undefined
    return colorIconMap[color]
  })

  // Close button props
  const closeButtonProps = computed<ButtonProps>(() => ({
    icon: "i-lucide-x",
    size: "md",
    color: "neutral",
    variant: "ghost",
  }))

  // Handlers
  const confirmHandler = async () => {
    try {
      const result = onConfirm() as void | Promise<void>

      // Only show loading state if it's a Promise
      const isAsync = result instanceof Promise

      if (isAsync) {
        isLoading.value = true
        await result

        // Show success state
        isLoading.value = false
        isComplete.value = true

        // Wait a bit to show the checkmark, then close
        setTimeout(() => {
          emits("close")
        }, 800)
      } else {
        // Sync function, close immediately
        emits("close")
      }
    } catch (error) {
      // On error, show error state
      isLoading.value = false
      isError.value = true
      console.error("Dialog confirm error:", error)

      // Reset error state after showing it briefly
      setTimeout(() => {
        isError.value = false
      }, 2000)
    }
  }

  const dismiss = () => {
    if (onDismiss) {
      onDismiss()
    }
    emits("close")
  }

  const handleClose = () => {
    dismiss()
  }
</script>

<template>
  <UModal
    :dismissible="false"
    :close="false"
    :title="title"
    :description="description"
    :ui="{
      content: ui.content({ class: uiProps?.content }),
      header: ui.header({ class: uiProps?.header }),
      body: ui.body({ class: uiProps?.body }),
      footer: ui.footer({ class: uiProps?.footer }),
    }">
    <template #header>
      <div class="relative w-full flex items-start gap-3">
        <UIcon v-if="dialogIcon" :name="dialogIcon" data-slot="icon" :class="ui.icon({ class: uiProps?.icon })" />
        <div class="flex-1 min-w-0">
          <DialogTitle v-if="title" data-slot="title" :class="ui.title({ class: uiProps?.title })">
            {{ title }}
          </DialogTitle>

          <DialogDescription v-if="description" :class="ui.description({ class: uiProps?.description })">
            {{ description }}
          </DialogDescription>
        </div>

        <UButton
          v-if="close"
          v-bind="closeButtonProps"
          data-slot="close"
          :ui="{
            base: 'text-white hover:bg-white/10 active:bg-white/20',
          }"
          @click="handleClose" />
      </div>
    </template>

    <template #footer>
      <UButton
        v-if="dismissLabel && !isLoading && !isComplete && !isError"
        :label="dismissLabel"
        size="lg"
        color="neutral"
        variant="ghost"
        :ui="{
          base: 'text-white hover:bg-white/10 active:bg-white/20',
        }"
        @click="dismiss" />

      <UButton
        :label="isError ? 'Error' : isComplete ? 'Complete' : confirmLabel"
        size="lg"
        color="neutral"
        variant="outline"
        :loading="isLoading"
        :disabled="isComplete"
        :leading-icon="isError ? 'i-lucide-circle-x' : isComplete ? 'i-lucide-check' : undefined"
        :class="{ 'animate-shake': isError }"
        @click="confirmHandler" />
    </template>
  </UModal>
</template>
