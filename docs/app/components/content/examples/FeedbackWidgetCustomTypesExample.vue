<script setup lang="ts">
  import type { FeedbackType, FeedbackSubmission, FeedbackSubmitResult } from "#ui-elements-pro"

  const feedbackTypes: FeedbackType[] = [
    { id: "love", label: "I love it!", icon: "i-lucide-heart", description: "Tell us what you enjoy" },
    { id: "confused", label: "I'm confused", icon: "i-lucide-help-circle", description: "Something is unclear" },
    { id: "idea", label: "I have an idea", icon: "i-lucide-lightbulb", description: "Suggest something new" },
  ]

  async function onSubmit(submission: FeedbackSubmission): Promise<FeedbackSubmitResult> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  }
</script>

<template>
  <div class="relative h-[400px] w-full border border-default rounded-lg overflow-hidden">
    <div class="flex items-center justify-center h-full text-muted">
      Open the widget to see custom feedback types
    </div>
    <UEFeedbackWidget
      :feedback-types="feedbackTypes"
      :on-submit="onSubmit"
      button-label="Share your thoughts" />
  </div>
</template>
