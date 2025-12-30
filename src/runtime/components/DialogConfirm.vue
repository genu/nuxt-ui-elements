<script lang="ts" setup>
import { computed, ref } from "vue";

interface Props {
  open?: boolean;
  size?: "sm" | "md";
  title: string;
  description?: string;
  confirmLabel?: string;
  dismissLabel?: string;
  clickToClose?: boolean;
  async?: boolean;
  successDelay?: number; // How long to show "Complete" state before closing (ms)
  onConfirm?: (() => void) | (() => Promise<void>);
  onDismiss?: () => void;
  onClose?: () => void;
}
const {
  open = false,
  size = "sm",
  confirmLabel = "Yes",
  dismissLabel = "No",
  async = false,
  successDelay = 1200,
  ...props
} = defineProps<Props>();

defineEmits<{
  "update:open": [value: boolean];
  close: [value?: any];
  "after:leave": [];
}>();

const sizeClass = computed(() => {
  switch (size) {
    case "sm":
      return "sm:max-w-md";
    case "md":
      return "sm:max-w-3xl";
    default:
      return "max-w-3xl";
  }
});

const isConfirming = ref(false);
const isComplete = ref(false);
const error = ref<string | null>(null);

const confirm = async () => {
  if (props.onConfirm) {
    if (async) {
      isConfirming.value = true;
      error.value = null;
      try {
        await Promise.resolve(props.onConfirm());
        isConfirming.value = false;
        isComplete.value = true;
        // Show success state before closing
        await new Promise((resolve) => setTimeout(resolve, successDelay));
        props.onClose?.();
      } catch (e) {
        isConfirming.value = false;
        error.value = e instanceof Error ? e.message : "An error occurred";
        return; // Don't close on error
      }
    } else {
      props.onConfirm();
      props.onClose?.();
    }
  }
};

const dismiss = () => {
  if (props.onDismiss) {
    props.onDismiss();
  }
  props.onClose?.();
};
</script>

<template>
  <UModal
    :open="open"
    :dismissible="clickToClose"
    :close="false"
    :title="title"
    :ui="{
      content: `${sizeClass} divide-y-0`,
      header: 'px-2 sm:px-5 py-3',
      body: 'p-2 sm:p-5 sm:pt-0',
      footer: 'justify-end gap-3',
    }"
    @update:open="$emit('update:open', $event)"
    @close="$emit('close', $event)"
    @after:leave="$emit('after:leave')"
  >
    <template #body>
      <div class="space-y-3">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="text-sm text-gray-500" v-html="description" />

        <!-- Error message -->
        <div
          v-if="error"
          class="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950 p-3 rounded"
        >
          {{ error }}
        </div>
      </div>
    </template>
    <template #footer>
      <UButton
        v-if="dismissLabel"
        :ui="{ base: 'justify-around' }"
        color="neutral"
        variant="outline"
        :label="dismissLabel"
        @click="dismiss"
      />
      <UButton
        color="neutral"
        :loading="isConfirming"
        :disabled="isComplete"
        :label="isComplete ? undefined : confirmLabel"
        :icon="isComplete ? 'i-heroicons-check' : undefined"
        :ui="{ base: 'justify-around' }"
        @click="confirm"
      />
    </template>
  </UModal>
</template>
