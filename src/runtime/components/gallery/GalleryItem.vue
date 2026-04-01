<script lang="ts">
  export interface NormalizedGalleryItem {
    src: string
    thumbnail: string
    alt: string
    class?: any
  }
</script>

<script lang="ts" setup>
  const {
    item,
    index,
    ui,
  } = defineProps<{
    item: NormalizedGalleryItem
    index: number
    ui: {
      item: (props?: Record<string, any>) => string
      image: (props?: Record<string, any>) => string
    }
  }>()

  const emit = defineEmits<{
    select: [index: number]
  }>()
</script>

<template>
  <div
    :class="ui.item({ class: item.class })"
    role="button"
    tabindex="0"
    @click="emit('select', index)"
    @keydown.enter="emit('select', index)"
    @keydown.space.prevent="emit('select', index)">
    <slot :item="item" :index="index">
      <img
        :src="item.thumbnail"
        :alt="item.alt"
        :class="ui.image()"
        loading="lazy" />
    </slot>
  </div>
</template>
