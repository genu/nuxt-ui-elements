<script setup lang="ts">
import { ref, computed } from "vue";
import colors from "tailwindcss/colors";

const opacity = ref(0.5);
const fade = ref<"radial" | "left" | "right" | "top" | "bottom" | undefined>(
  "radial"
);
const colorMode = ref<"semantic" | "tailwind" | "direct">("semantic");

// Color options for different modes
const semanticColor = ref("primary");
const tailwindColor = ref("blue-200");
const directColor = ref("#dbeafe");

// Computed current color based on mode
const currentColor = computed(() => {
  if (colorMode.value === "semantic") return semanticColor.value;
  if (colorMode.value === "tailwind") return tailwindColor.value;
  return directColor.value;
});
</script>

<template>
  <div class="relative w-screen h-screen bg-white dark:bg-gray-900">
    <UEBackgroundFlickeringGrid
      :color="currentColor"
      :opacity="opacity"
      :fade="fade"
      :dark="{
        color: 'gray-700',
        opacity: 0.5,
      }"
    >
      <div class="absolute flex items-center justify-center h-full top-0 z-30">
        <div class="text-center space-y-6 max-w-2xl mx-auto p-6">
          <div class="flex justify-center mb-4">
            <UButton label="My Button" />
            <UColorModeButton />
          </div>

          <h1 class="text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            Nuxt UI Elements
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
            FlickeringGrid Component - Flexible Color System
          </p>

          <!-- Color Mode Selection -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Color Input Mode
            </h3>
            <div class="flex gap-2 justify-center">
              <UButton
                :color="colorMode === 'semantic' ? 'primary' : 'neutral'"
                label="Semantic"
                size="sm"
                @click="colorMode = 'semantic'"
              />
              <UButton
                :color="colorMode === 'tailwind' ? 'primary' : 'neutral'"
                label="Tailwind"
                size="sm"
                @click="colorMode = 'tailwind'"
              />
              <UButton
                :color="colorMode === 'direct' ? 'primary' : 'neutral'"
                label="Direct"
                size="sm"
                @click="colorMode = 'direct'"
              />
            </div>
          </div>

          <!-- Semantic Colors -->
          <div v-if="colorMode === 'semantic'" class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nuxt UI Semantic Colors
            </h3>
            <div class="flex gap-1 flex-wrap justify-center">
              <UButton
                :color="semanticColor === 'primary' ? 'primary' : 'neutral'"
                label="Primary"
                size="xs"
                @click="semanticColor = 'primary'"
              />
              <UButton
                :color="semanticColor === 'secondary' ? 'primary' : 'neutral'"
                label="Secondary"
                size="xs"
                @click="semanticColor = 'secondary'"
              />
              <UButton
                :color="semanticColor === 'success' ? 'primary' : 'neutral'"
                label="Success"
                size="xs"
                @click="semanticColor = 'success'"
              />
              <UButton
                :color="semanticColor === 'info' ? 'primary' : 'neutral'"
                label="Info"
                size="xs"
                @click="semanticColor = 'info'"
              />
              <UButton
                :color="semanticColor === 'warning' ? 'primary' : 'neutral'"
                label="Warning"
                size="xs"
                @click="semanticColor = 'warning'"
              />
              <UButton
                :color="semanticColor === 'error' ? 'primary' : 'neutral'"
                label="Error"
                size="xs"
                @click="semanticColor = 'error'"
              />
              <UButton
                :color="semanticColor === 'neutral' ? 'primary' : 'neutral'"
                label="Neutral"
                size="xs"
                @click="semanticColor = 'neutral'"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Current:
              <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{{
                semanticColor
              }}</code>
            </p>
          </div>

          <!-- Tailwind Colors -->
          <div v-if="colorMode === 'tailwind'" class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tailwind CSS Colors
            </h3>
            <div class="flex gap-1 flex-wrap justify-center">
              <UButton
                :color="tailwindColor === 'blue-200' ? 'primary' : 'neutral'"
                label="blue-200"
                size="xs"
                @click="tailwindColor = 'blue-200'"
              />
              <UButton
                :color="tailwindColor === 'red-200' ? 'primary' : 'neutral'"
                label="red-200"
                size="xs"
                @click="tailwindColor = 'red-200'"
              />
              <UButton
                :color="tailwindColor === 'green-200' ? 'primary' : 'neutral'"
                label="green-200"
                size="xs"
                @click="tailwindColor = 'green-200'"
              />
              <UButton
                :color="tailwindColor === 'purple-300' ? 'primary' : 'neutral'"
                label="purple-300"
                size="xs"
                @click="tailwindColor = 'purple-300'"
              />
              <UButton
                :color="tailwindColor === 'amber-200' ? 'primary' : 'neutral'"
                label="amber-200"
                size="xs"
                @click="tailwindColor = 'amber-200'"
              />
              <UButton
                :color="tailwindColor === 'cyan-200' ? 'primary' : 'neutral'"
                label="cyan-200"
                size="xs"
                @click="tailwindColor = 'cyan-200'"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Current:
              <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{{
                tailwindColor
              }}</code>
            </p>
          </div>

          <!-- Direct Colors -->
          <div v-if="colorMode === 'direct'" class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Direct Color Values
            </h3>
            <div class="flex gap-1 flex-wrap justify-center">
              <UButton
                :color="directColor === '#dbeafe' ? 'primary' : 'neutral'"
                label="Light Blue"
                size="xs"
                @click="directColor = '#dbeafe'"
              />
              <UButton
                :color="directColor === '#fecaca' ? 'primary' : 'neutral'"
                label="Light Red"
                size="xs"
                @click="directColor = '#fecaca'"
              />
              <UButton
                :color="
                  directColor === 'oklch(0.85 0.1 250)' ? 'primary' : 'neutral'
                "
                label="OKLCH Blue"
                size="xs"
                @click="directColor = 'oklch(0.85 0.1 250)'"
              />
              <UButton
                :color="
                  directColor === 'rgb(233, 213, 255)' ? 'primary' : 'neutral'
                "
                label="RGB Purple"
                size="xs"
                @click="directColor = 'rgb(233, 213, 255)'"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Current:
              <code
                class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs"
                >{{ directColor }}</code
              >
            </p>
          </div>

          <!-- Fade Direction -->
          <div
            class="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Fade Direction
            </h3>
            <div class="flex gap-1 flex-wrap justify-center">
              <UButton
                :color="fade === undefined ? 'primary' : 'neutral'"
                label="None"
                size="xs"
                @click="fade = undefined"
              />
              <UButton
                :color="fade === 'radial' ? 'primary' : 'neutral'"
                label="Radial"
                size="xs"
                @click="fade = 'radial'"
              />
              <UButton
                :color="fade === 'left' ? 'primary' : 'neutral'"
                label="Left"
                size="xs"
                @click="fade = 'left'"
              />
              <UButton
                :color="fade === 'right' ? 'primary' : 'neutral'"
                label="Right"
                size="xs"
                @click="fade = 'right'"
              />
              <UButton
                :color="fade === 'top' ? 'primary' : 'neutral'"
                label="Top"
                size="xs"
                @click="fade = 'top'"
              />
              <UButton
                :color="fade === 'bottom' ? 'primary' : 'neutral'"
                label="Bottom"
                size="xs"
                @click="fade = 'bottom'"
              />
            </div>
          </div>

          <!-- Opacity Control -->
          <div
            class="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Opacity ({{ opacity }})
            </h3>
            <div class="flex gap-4 items-center justify-center">
              <span class="text-xs text-gray-500 dark:text-gray-400"
                >Invisible</span
              >
              <input
                v-model.number="opacity"
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="w-48"
              />
              <span class="text-xs text-gray-500 dark:text-gray-400"
                >Opaque</span
              >
            </div>
            <div class="flex gap-2 justify-center">
              <UButton
                :color="opacity === 0.2 ? 'primary' : 'neutral'"
                label="Subtle (0.2)"
                size="xs"
                @click="opacity = 0.2"
              />
              <UButton
                :color="opacity === 0.5 ? 'primary' : 'neutral'"
                label="Medium (0.5)"
                size="xs"
                @click="opacity = 0.5"
              />
              <UButton
                :color="opacity === 0.8 ? 'primary' : 'neutral'"
                label="Bold (0.8)"
                size="xs"
                @click="opacity = 0.8"
              />
            </div>
          </div>
        </div>
      </div>
    </UEBackgroundFlickeringGrid>
  </div>
</template>
