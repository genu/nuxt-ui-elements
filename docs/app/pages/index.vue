<script setup lang="ts">
  definePageMeta({
    layout: "default",
  })

  const { data: page } = await useAsyncData("index", () => queryCollection("index").first())

  useSeoMeta({
    title: page.value?.title,
    description: page.value?.description,
    ogTitle: page.value?.title,
    ogDescription: page.value?.description,
  })
</script>

<template>
  <div v-if="page">
    <!-- Hero Section -->
    <UPageHero v-bind="page.hero">
      <template #title>
        <span v-html="page.hero?.title" />
      </template>
    </UPageHero>

    <!-- Features Section -->
    <UPageSection v-if="page.features?.length">
      <UPageGrid>
        <UPageCard
          v-for="(feature, index) in page.features"
          :key="index"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon"
          :to="feature.to" />
      </UPageGrid>
    </UPageSection>

    <!-- Additional Sections -->
    <template v-if="page.sections?.length">
      <UPageSection v-for="(section, index) in page.sections" :key="index" :title="section.title" :description="section.description">
        <UPageGrid v-if="section.features?.length">
          <UPageCard
            v-for="(feature, fIndex) in section.features"
            :key="fIndex"
            :title="feature.title"
            :description="feature.description"
            :icon="feature.icon"
            :to="feature.to" />
        </UPageGrid>
      </UPageSection>
    </template>
  </div>
</template>
