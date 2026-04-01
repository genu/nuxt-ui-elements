<script lang="ts">
  import type { NormalizedGalleryItem } from "./GalleryItem.vue"
</script>

<script lang="ts" setup>
  import { onBeforeUnmount, ref, watch } from "vue"

  const {
    items,
    open = false,
    startIndex = 0,
    loop = true,
    arrows = true,
    dots = false,
    ui,
  } = defineProps<{
    items: NormalizedGalleryItem[]
    open?: boolean
    startIndex?: number
    loop?: boolean
    arrows?: boolean
    dots?: boolean
    ui: {
      overlay: (props?: Record<string, any>) => string
      lightbox: (props?: Record<string, any>) => string
      lightboxImage: (props?: Record<string, any>) => string
      close: (props?: Record<string, any>) => string
      counter: (props?: Record<string, any>) => string
    }
  }>()

  const emit = defineEmits<{
    close: []
  }>()

  defineSlots<{
    item(props: { item: NormalizedGalleryItem; index: number }): any
  }>()

  const currentIndex = ref(startIndex)

  function onCarouselSelect(index: number) {
    currentIndex.value = index
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      emit("close")
    }
  }

  function onBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      emit("close")
    }
  }

  watch(
    () => open,
    (isOpen) => {
      if (isOpen) {
        document.addEventListener("keydown", onKeydown)
        document.body.style.overflow = "hidden"
      } else {
        document.removeEventListener("keydown", onKeydown)
        document.body.style.overflow = ""
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", onKeydown)
    document.body.style.overflow = ""
  })
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95">
      <div
        v-if="open"
        :class="ui.overlay()"
        @click="onBackdropClick">
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          :class="ui.close()"
          :ui="{ base: 'text-white hover:bg-white/20' }"
          @click="emit('close')" />

        <div :class="ui.lightbox()">
          <UCarousel
            :items="items"
            :arrows="arrows"
            :dots="dots"
            :loop="loop"
            :start-index="startIndex"
            :ui="{
              item: 'basis-full flex items-center justify-center',
            }"
            @select="onCarouselSelect">
            <template #default="{ item, index }">
              <slot :item="(item as NormalizedGalleryItem)" :index="index">
                <img
                  :src="(item as NormalizedGalleryItem).src"
                  :alt="(item as NormalizedGalleryItem).alt"
                  :class="ui.lightboxImage()" />
              </slot>
            </template>
          </UCarousel>
        </div>

        <div :class="ui.counter()">
          {{ currentIndex + 1 }} / {{ items.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
