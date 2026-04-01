<script setup lang="ts">
  const gridImages = Array.from({ length: 9 }, (_, i) => ({
    src: `https://picsum.photos/seed/gallery${i + 1}/800/600`,
    thumbnail: `https://picsum.photos/seed/gallery${i + 1}/400/300`,
    alt: `Gallery image ${i + 1}`,
  }))

  const masonryImages = [
    { src: "https://picsum.photos/seed/m1/800/600", thumbnail: "https://picsum.photos/seed/m1/400/300", alt: "Landscape 1" },
    { src: "https://picsum.photos/seed/m2/800/1200", thumbnail: "https://picsum.photos/seed/m2/400/600", alt: "Portrait 1" },
    { src: "https://picsum.photos/seed/m3/800/800", thumbnail: "https://picsum.photos/seed/m3/400/400", alt: "Square 1" },
    { src: "https://picsum.photos/seed/m4/800/500", thumbnail: "https://picsum.photos/seed/m4/400/250", alt: "Wide 1" },
    { src: "https://picsum.photos/seed/m5/800/1000", thumbnail: "https://picsum.photos/seed/m5/400/500", alt: "Portrait 2" },
    { src: "https://picsum.photos/seed/m6/800/600", thumbnail: "https://picsum.photos/seed/m6/400/300", alt: "Landscape 2" },
    { src: "https://picsum.photos/seed/m7/800/900", thumbnail: "https://picsum.photos/seed/m7/400/450", alt: "Tall 1" },
    { src: "https://picsum.photos/seed/m8/800/600", thumbnail: "https://picsum.photos/seed/m8/400/300", alt: "Landscape 3" },
  ]

  const simpleImages = [
    "https://picsum.photos/seed/simple1/800/600",
    "https://picsum.photos/seed/simple2/800/600",
    "https://picsum.photos/seed/simple3/800/600",
    "https://picsum.photos/seed/simple4/800/600",
    "https://picsum.photos/seed/simple5/800/600",
    "https://picsum.photos/seed/simple6/800/600",
  ]

  useSeoMeta({
    title: "Gallery - Nuxt UI Elements",
    description: "Image gallery with grid/masonry layouts and lightbox",
  })
</script>

<template>
  <div class="p-8 space-y-8">
    <div>
      <h1 class="text-3xl font-bold mb-2">Gallery</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Image gallery with grid/masonry layouts and an integrated lightbox. Click any image to open the lightbox.
      </p>
    </div>

    <!-- Simple string array -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Simple (String URLs)</h2>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Pass an array of image URL strings. Thumbnails use the same URL.
        </p>
        <UEGallery :items="simpleImages" />
      </div>
    </UCard>

    <!-- Grid layout with objects -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Grid Layout (Default)</h2>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          3-column grid with separate thumbnail and full-size URLs.
        </p>
        <UEGallery :items="gridImages" :columns="3" />
      </div>
    </UCard>

    <!-- Different column counts -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Column Variations</h2>
      </template>

      <div class="space-y-6">
        <div>
          <h3 class="text-sm font-medium text-gray-500 mb-2">2 Columns</h3>
          <UEGallery :items="gridImages.slice(0, 4)" :columns="2" gap="md" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500 mb-2">4 Columns</h3>
          <UEGallery :items="gridImages.slice(0, 8)" :columns="4" gap="xs" />
        </div>
      </div>
    </UCard>

    <!-- Aspect ratios -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Aspect Ratios</h2>
      </template>

      <div class="space-y-6">
        <div>
          <h3 class="text-sm font-medium text-gray-500 mb-2">Video (16:9)</h3>
          <UEGallery :items="gridImages.slice(0, 3)" ratio="video" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500 mb-2">Auto (natural)</h3>
          <UEGallery :items="gridImages.slice(0, 3)" ratio="auto" />
        </div>
      </div>
    </UCard>

    <!-- Masonry layout -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Masonry Layout</h2>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Variable-height images arranged with CSS columns. Aspect ratio is preserved.
        </p>
        <UEGallery :items="masonryImages" layout="masonry" :columns="3" gap="sm" />
      </div>
    </UCard>

    <!-- No lightbox -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Lightbox Disabled</h2>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Grid-only mode with <code>:lightbox="false"</code>. Clicking does nothing.
        </p>
        <UEGallery :items="gridImages.slice(0, 3)" :lightbox="false" />
      </div>
    </UCard>
  </div>
</template>
