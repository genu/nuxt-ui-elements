<script setup lang="ts">
import { ref } from "vue";

const variant = ref<"calm" | "energetic" | "cosmic">("cosmic");
const color = ref<
  "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"
>("primary");
const reverse = ref(false);
const customMode = ref(false);
const speed = ref(50);
const intensity = ref(50);
</script>

<template>
  <div class="relative w-screen h-screen bg-white dark:bg-gray-900">
    <UEBackgroundFlickeringGrid color="info">
      <div class="relative z-10 flex items-center justify-center h-full">
        <div class="text-center space-y-6">
          <UColorModeButton />
          <h1 class="text-6xl font-bold mb-4 text-gray-900 dark:text-white">
            Nuxt UI Elements
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            Aurora Background Component Demo
          </p>

          <!-- Controls -->
          <div class="flex flex-col gap-4 items-center">
            <!-- Color Selection -->
            <div class="flex gap-1 flex-wrap justify-center max-w-md">
              <UButton
                :color="color === 'primary' ? 'primary' : 'neutral'"
                label="Primary"
                size="xs"
                @click="color = 'primary'"
              />
              <UButton
                :color="color === 'secondary' ? 'primary' : 'neutral'"
                label="Secondary"
                size="xs"
                @click="color = 'secondary'"
              />
              <UButton
                :color="color === 'success' ? 'primary' : 'neutral'"
                label="Success"
                size="xs"
                @click="color = 'success'"
              />
              <UButton
                :color="color === 'info' ? 'primary' : 'neutral'"
                label="Info"
                size="xs"
                @click="color = 'info'"
              />
              <UButton
                :color="color === 'warning' ? 'primary' : 'neutral'"
                label="Warning"
                size="xs"
                @click="color = 'warning'"
              />
              <UButton
                :color="color === 'error' ? 'primary' : 'neutral'"
                label="Error"
                size="xs"
                @click="color = 'error'"
              />
              <UButton
                :color="color === 'neutral' ? 'primary' : 'neutral'"
                label="Neutral"
                size="xs"
                @click="color = 'neutral'"
              />
            </div>

            <div class="flex gap-2">
              <UButton
                :color="!customMode ? 'primary' : 'neutral'"
                label="Preset Mode"
                @click="customMode = false"
              />
              <UButton
                :color="customMode ? 'primary' : 'neutral'"
                label="Custom Mode"
                @click="customMode = true"
              />
            </div>

            <div v-if="!customMode" class="flex gap-2">
              <UButton
                :color="variant === 'calm' ? 'primary' : 'neutral'"
                label="Calm"
                @click="variant = 'calm'"
              />
              <UButton
                :color="variant === 'energetic' ? 'primary' : 'neutral'"
                label="Energetic"
                @click="variant = 'energetic'"
              />
              <UButton
                :color="variant === 'cosmic' ? 'primary' : 'neutral'"
                label="Cosmic"
                @click="variant = 'cosmic'"
              />
            </div>

            <div v-else class="space-y-2 w-64">
              <div>
                <label class="text-sm text-gray-700 dark:text-gray-300"
                  >Speed: {{ speed }}</label
                >
                <input
                  v-model.number="speed"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full"
                />
              </div>
              <div>
                <label class="text-sm text-gray-700 dark:text-gray-300"
                  >Intensity: {{ intensity }}</label
                >
                <input
                  v-model.number="intensity"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full"
                />
              </div>
            </div>

            <UButton
              :color="reverse ? 'primary' : 'neutral'"
              :label="reverse ? 'Reverse: ON' : 'Reverse: OFF'"
              @click="reverse = !reverse"
            />
          </div>
        </div>
      </div>
    </UEBackgroundFlickeringGrid>
  </div>
</template>
