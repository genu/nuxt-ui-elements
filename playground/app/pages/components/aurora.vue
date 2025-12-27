<script setup lang="ts">
import { ref, computed } from "vue";

useSeoMeta({
  title: "Aurora - Nuxt UI Elements",
  description: "An animated aurora background component with gradient effects",
});

// Interactive controls
const pin = ref<
  | "top-right"
  | "top-left"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | undefined
>("top-right");
const colorMode = ref<string>("primary");
const customColor = ref("#8b5cf6");
const speed = ref(50);
const opacity = ref(50);
const lightness = ref(70);
const reverse = ref(false);

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

const pinOptions = [
  { label: "None", value: undefined },
  { label: "Top Right", value: "top-right" },
  { label: "Top Left", value: "top-left" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

// Computed color value based on mode
const color = computed(() => {
  return colorMode.value === "custom" ? customColor.value : colorMode.value;
});
</script>

<template>
  <div class="h-full flex flex-col lg:flex-row gap-6 p-6">
    <!-- Main Aurora Preview -->
    <div
      class="flex-1 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"
    >
      <UEBackgroundAurora
        :pin="pin"
        :color="color"
        :speed="speed"
        :opacity="opacity"
        :lightness="lightness"
        :reverse="reverse"
      >
        <div class="flex items-center justify-center h-full">
          <div class="text-center space-y-2">
            <h1 class="text-4xl font-bold">Aurora</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              Animated gradient background
            </p>
          </div>
        </div>
      </UEBackgroundAurora>
    </div>

    <!-- Controls Panel -->
    <div class="w-full lg:w-80 space-y-6">
      <div>
        <h2 class="text-2xl font-bold mb-2">Controls</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Adjust the parameters to customize the aurora effect
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
          help="Pick a color or enter hex, Tailwind colors (e.g., purple-500), or oklch/rgb"
        >
          <UColorPicker v-model="customColor" />
        </UFormField>

        <!-- Pin Position -->
        <UFormField label="Pin Position">
          <USelect v-model="pin" :items="pinOptions" />
        </UFormField>

        <!-- Speed Slider -->
        <UFormField :label="`Speed: ${speed}`">
          <USlider v-model="speed" :min="0" :max="100" :step="1" />
          <template #hint>
            <span class="text-xs">0 = paused, 100 = fastest</span>
          </template>
        </UFormField>

        <!-- Opacity Slider -->
        <UFormField :label="`Opacity: ${opacity}%`">
          <USlider v-model="opacity" :min="0" :max="100" :step="5" />
          <template #hint>
            <span class="text-xs">0 = transparent, 100 = opaque</span>
          </template>
        </UFormField>

        <!-- Lightness Slider -->
        <UFormField :label="`Lightness: ${lightness}%`">
          <USlider v-model="lightness" :min="30" :max="90" :step="1" />
          <template #hint>
            <span class="text-xs"
              >Lower = more saturated, Higher = more pastel</span
            >
          </template>
        </UFormField>

        <!-- Reverse Toggle -->
        <UFormField label="Reverse Animation">
          <USwitch v-model="reverse" />
        </UFormField>

        <!-- Reset Button -->
        <UButton
          block
          color="neutral"
          variant="outline"
          label="Reset to Defaults"
          @click="
            () => {
              pin = 'top-right';
              colorMode = 'primary';
              customColor = '#8b5cf6';
              speed = 50;
              opacity = 50;
              lightness = 70;
              reverse = false;
            }
          "
        />
      </div>
    </div>
  </div>
</template>
