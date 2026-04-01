<script lang="ts">
  import type { AppConfig } from "@nuxt/schema"
  import theme from "#build/ui-elements/gallery"
  import type { ComponentConfig } from "../types"
  import type { NormalizedGalleryItem } from "./gallery/GalleryItem.vue"

  type Gallery = ComponentConfig<typeof theme, AppConfig, "gallery">

  export interface GalleryItemObject {
    src: string
    thumbnail?: string
    alt?: string
    class?: any
  }

  export interface GalleryProps {
    items?: (string | GalleryItemObject)[]
    layout?: "grid" | "masonry"
    columns?: 1 | 2 | 3 | 4 | 5 | 6
    gap?: "xs" | "sm" | "md" | "lg"
    lightbox?: boolean
    ratio?: "square" | "video" | "auto"
    loop?: boolean
    arrows?: boolean
    dots?: boolean
    ui?: Gallery["slots"]
  }

  export interface GalleryEmits {
    select: [index: number]
    "update:open": [value: boolean]
  }

  export interface GallerySlots {
    item(props: { item: NormalizedGalleryItem; index: number }): any
    "lightbox-item"(props: { item: NormalizedGalleryItem; index: number }): any
  }
</script>

<script lang="ts" setup>
  import { computed, ref } from "vue"
  import { tv } from "../utils/tv"
  import GalleryItem from "./gallery/GalleryItem.vue"
  import GalleryLightbox from "./gallery/GalleryLightbox.vue"

  const {
    items = [],
    layout = "grid",
    columns = 3,
    gap = "sm",
    lightbox = true,
    ratio = "square",
    loop = true,
    arrows = true,
    dots = false,
    ui: uiProps = {},
  } = defineProps<GalleryProps>()

  const emit = defineEmits<GalleryEmits>()
  defineSlots<GallerySlots>()

  const ui = computed(() =>
    tv({
      extend: tv(theme),
    })({
      columns,
      gap,
      ratio: layout === "masonry" ? undefined : ratio,
      layout,
    }),
  )

  // Normalize items: strings become objects, thumbnails fall back to src
  const normalizedItems = computed<NormalizedGalleryItem[]>(() =>
    (items || []).map((item) => {
      if (typeof item === "string") {
        return { src: item, thumbnail: item, alt: "" }
      }
      return {
        src: item.src,
        thumbnail: item.thumbnail || item.src,
        alt: item.alt || "",
        class: item.class,
      }
    }),
  )

  // Lightbox state
  const isOpen = ref(false)
  const lightboxIndex = ref(0)

  function openLightbox(index: number) {
    emit("select", index)
    if (!lightbox) return
    lightboxIndex.value = index
    isOpen.value = true
    emit("update:open", true)
  }

  function closeLightbox() {
    isOpen.value = false
    emit("update:open", false)
  }

  // Masonry mode: switch from CSS grid to CSS columns
  const gridClass = computed(() => {
    if (layout === "masonry") {
      const colsMap: Record<number, string> = {
        1: "columns-1",
        2: "columns-2",
        3: "columns-3",
        4: "columns-4",
        5: "columns-5",
        6: "columns-6",
      }
      const gapMap: Record<string, string> = {
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
      }
      return `${colsMap[columns]} ${gapMap[gap]}`
    }
    return ui.value.grid({ class: uiProps?.grid })
  })

  const itemClass = computed(() => {
    if (layout === "masonry") {
      return "break-inside-avoid mb-2"
    }
    return ""
  })
</script>

<template>
  <div :class="ui.root({ class: uiProps?.root })">
    <div :class="gridClass">
      <div
        v-for="(item, index) in normalizedItems"
        :key="item.src + index"
        :class="itemClass">
        <GalleryItem
          :item="item"
          :index="index"
          :ui="{
            item: (props) => ui.item({ class: [uiProps?.item, props?.class] }),
            image: (props) => ui.image({ class: [uiProps?.image, props?.class] }),
          }"
          @select="openLightbox">
          <template v-if="$slots.item" #default="slotProps">
            <slot name="item" v-bind="slotProps" />
          </template>
        </GalleryItem>
      </div>
    </div>

    <GalleryLightbox
      v-if="lightbox && isOpen"
      :items="normalizedItems"
      :start-index="lightboxIndex"
      :loop="loop"
      :arrows="arrows"
      :dots="dots"
      :ui="{
        overlay: (props) => ui.overlay({ class: [uiProps?.overlay, props?.class] }),
        lightbox: (props) => ui.lightbox({ class: [uiProps?.lightbox, props?.class] }),
        lightboxImage: (props) => ui.lightboxImage({ class: [uiProps?.lightboxImage, props?.class] }),
        close: (props) => ui.close({ class: [uiProps?.close, props?.class] }),
        counter: (props) => ui.counter({ class: [uiProps?.counter, props?.class] }),
      }"
      @close="closeLightbox">
      <template v-if="$slots['lightbox-item']" #item="slotProps">
        <slot name="lightbox-item" v-bind="slotProps" />
      </template>
    </GalleryLightbox>
  </div>
</template>
