<script setup lang="ts">
import { ref, computed } from "vue";

useSeoMeta({
  title: "Flickering Grid - Nuxt UI Elements",
  description:
    "An animated canvas-based grid background component with customizable gradients and flicker effects",
});

// Interactive controls
const size = ref(8);
const gap = ref(9);
const speed = ref(5);
const lightness = ref(95);
const opacity = ref(50);
const colorMode = ref<string>("primary");
const customColor = ref("#3b82f6");
const fade = ref<"radial" | "left" | "right" | "top" | "bottom" | undefined>(
  "radial"
);

const colorOptions = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "error",
  "neutral",
  "custom",
];

const fadeOptions = [
  { label: "None", value: undefined },
  { label: "Radial", value: "radial" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
];

// Computed color value based on mode
const color = computed(() => {
  return colorMode.value === "custom" ? customColor.value : colorMode.value;
});
</script>

<template>
  <div class="h-full flex flex-col lg:flex-row gap-6 p-6">
    <!-- Main Grid Preview -->
    <div
      class="flex-1 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"
    >
      <UEBackgroundFlickeringGrid
        :size="size"
        :gap="gap"
        :speed="speed"
        :lightness="lightness"
        :opacity="opacity"
        :color="color"
        :fade="fade"
      >
        <div class="flex items-center justify-center h-full">
          <div class="text-center space-y-2">
            <h1 class="text-4xl font-bold">Flickering Grid</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              Animated canvas-based background
            </p>
          </div>
        </div>
      </UEBackgroundFlickeringGrid>
    </div>

    <!-- Controls Panel -->
    <div class="w-full lg:w-80 space-y-6">
      <div>
        <h2 class="text-2xl font-bold mb-2">Controls</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Adjust the parameters to customize the grid effect
        </p>
      </div>

      <div class="space-y-6">
        <!-- Color Selector -->
        <UFormField label="Color">
          <USelect v-model="colorMode" :items="colorOptions" />
        </UFormField>

        <!-- Custom Color Picker -->
        <UFormField
          v-if="colorMode === 'custom'"
          label="Custom Color"
          help="Pick a color or enter hex, Tailwind colors (e.g., blue-500), or oklch/rgb"
        >
          <UColorPicker v-model="customColor" />
        </UFormField>

        <!-- Fade Direction -->
        <UFormField label="Fade Direction">
          <USelect v-model="fade" :items="fadeOptions" />
        </UFormField>

        <!-- Size Slider -->
        <UFormField :label="`Size: ${size}px`">
          <USlider v-model="size" :min="4" :max="20" :step="1" />
        </UFormField>

        <!-- Gap Slider -->
        <UFormField :label="`Gap: ${gap}px`">
          <USlider v-model="gap" :min="1" :max="20" :step="1" />
        </UFormField>

        <!-- Speed Slider -->
        <UFormField :label="`Speed: ${speed}`">
          <USlider v-model="speed" :min="1" :max="10" :step="1" />
          <template #hint>
            <span class="text-xs">1 = slowest, 10 = fastest</span>
          </template>
        </UFormField>

        <!-- Lightness Slider -->
        <UFormField :label="`Lightness: ${lightness}%`">
          <USlider v-model="lightness" :min="70" :max="100" :step="1" />
          <template #hint>
            <span class="text-xs"
              >Lower = more saturated, Higher = more pastel</span
            >
          </template>
        </UFormField>

        <!-- Opacity Slider -->
        <UFormField :label="`Opacity: ${opacity}%`">
          <USlider v-model="opacity" :min="0" :max="100" :step="5" />
          <template #hint>
            <span class="text-xs">0 = transparent, 100 = opaque</span>
          </template>
        </UFormField>

        <!-- Reset Button -->
        <UButton
          block
          color="neutral"
          variant="outline"
          label="Reset to Defaults"
          @click="
            () => {
              size = 8;
              gap = 9;
              speed = 5;
              lightness = 95;
              opacity = 50;
              colorMode = 'primary';
              customColor = '#3b82f6';
              fade = 'radial';
            }
          "
        />
      </div>
    </div>
  </div>
</template>
