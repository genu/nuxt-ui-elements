<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))

provide<Ref<ContentNavigationItem[]>>('navigation', navigation as Ref<ContentNavigationItem[]>)
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
