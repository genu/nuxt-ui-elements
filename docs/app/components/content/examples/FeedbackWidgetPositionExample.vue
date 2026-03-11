<script setup lang="ts">
  import type { FeedbackWidgetPosition, FeedbackSubmission, FeedbackSubmitResult } from "#ui-elements-pro"

  const position = ref<FeedbackWidgetPosition>("bottom-right")

  const positions: FeedbackWidgetPosition[] = ["bottom-right", "bottom-left", "top-right", "top-left"]

  async function onSubmit(submission: FeedbackSubmission): Promise<FeedbackSubmitResult> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  }
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="pos in positions"
        :key="pos"
        :label="pos"
        :variant="position === pos ? 'solid' : 'outline'"
        size="sm"
        @click="position = pos" />
    </div>

    <div class="relative h-[400px] w-full border border-default rounded-lg overflow-hidden">
      <div class="flex items-center justify-center h-full text-muted">
        Feedback button is at {{ position }}
      </div>
      <UEFeedbackWidget :position="position" :on-submit="onSubmit" />
    </div>
  </div>
</template>
