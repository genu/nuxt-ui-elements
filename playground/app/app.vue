<script setup lang="ts"></script>

<template>
  <div class="relative w-screen h-screen bg-white dark:bg-gray-900">
    <UEBackgroundFlickeringGrid
      color="error"
      variant="subtle"
      :square-size="10"
      :grid-gap="10"
      gradient-direction="left-right"
      :flicker-speed="0.2"
    />
    <div class="relative z-10 flex items-center justify-center h-full">
      <div class="text-center">
        <h1 class="text-6xl font-bold mb-4 text-gray-900 dark:text-white">Nuxt UI Elements</h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">FlickeringGrid Component Demo</p>
        <UButton label="Hello World" />
      </div>
    </div>
  </div>
</template>
