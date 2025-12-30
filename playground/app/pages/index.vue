<script setup lang="ts">
useSeoMeta({
  title: "Nuxt UI Elements Playground",
  description: "Beautiful, animated UI components for Nuxt UI",
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-8">
    <div class="max-w-2xl text-center space-y-6">
      <h1 class="text-4xl font-bold">Nuxt UI Elements</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        A collection of beautiful, animated UI components designed to work
        seamlessly with Nuxt UI.
      </p>
      <div class="flex gap-4 justify-center pt-4">
        <UButton
          to="/components/dialog"
          size="lg"
          label="View Components"
        />
        <UButton
          to="https://github.com/yourusername/nuxt-ui-elements"
          target="_blank"
          size="lg"
          color="neutral"
          variant="outline"
          label="GitHub"
        />
      </div>
    </div>
  </div>
</template>
