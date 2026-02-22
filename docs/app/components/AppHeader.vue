<script setup lang="ts">
  const colorMode = useColorMode()

  const links = [
    {
      label: "Docs",
      to: "/docs/getting-started",
    },
    {
      label: "Composables",
      to: "/docs/composables",
    },
    {
      label: "Components",
      to: "/docs/components",
    },
    {
      label: "Utilities",
      to: "/docs/standard-library",
    },
  ]

  function toggleColorMode() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
  }
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2">
        <UIcon name="i-lucide-box" class="w-6 h-6 text-primary" />
        <span class="font-bold text-lg">Nuxt UI Elements</span>
      </NuxtLink>
    </template>

    <UNavigationMenu :items="links" />

    <template #right>
      <UButton
        to="https://github.com/genu/nuxt-ui-elements"
        target="_blank"
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        aria-label="GitHub" />

      <UButton
        :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
        color="neutral"
        variant="ghost"
        aria-label="Toggle color mode"
        @click="toggleColorMode" />
    </template>
  </UHeader>
</template>
