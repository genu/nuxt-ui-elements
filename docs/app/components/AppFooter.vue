<script setup lang="ts"></script>

<template>
  <UFooter>
    <template #left>
      <span class="text-muted text-sm">
        Built with
        <NuxtLink to="https://ui.nuxt.com" target="_blank" class="text-primary hover:underline"> Nuxt UI </NuxtLink>
      </span>
    </template>

    <template #right>
      <UButton
        to="https://github.com/your-username/nuxt-ui-elements"
        target="_blank"
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="GitHub" />
    </template>
  </UFooter>
</template>
