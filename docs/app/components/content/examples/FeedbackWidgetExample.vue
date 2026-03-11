<script setup lang="ts">
  import type { FeedbackSubmission, FeedbackSubmitResult } from "#ui-elements-pro"

  async function onSubmit(submission: FeedbackSubmission): Promise<FeedbackSubmitResult> {
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log("Feedback submitted:", submission)
    return { success: true }
  }
</script>

<template>
  <div class="relative h-[400px] w-full border border-default rounded-lg overflow-hidden">
    <div class="flex items-center justify-center h-full text-muted">
      Click the feedback button in the corner
    </div>
    <UEFeedbackWidget :on-submit="onSubmit" />
  </div>
</template>
