<script lang="ts">
/**
 * Aurora - An animated aurora background component with gradient effects
 */

export type AuroraVariant = "calm" | "energetic" | "cosmic";

export interface AuroraProps {
  /**
   * Pin the aurora to a specific corner or edge
   * If undefined, aurora flows across the entire screen without mask
   * @default 'top-right'
   */
  pin?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  /**
   * Color variant
   * @default 'primary'
   */
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "error"
    | "neutral";
  /**
   * Speed of the animation (0-100, where 100 is fastest)
   * @default 50
   */
  speed?: number;
  /**
   * Intensity of the aurora effect (0-100)
   * Controls opacity and blur
   * @default 50
   */
  intensity?: number;
  /**
   * Animation style variant
   * Overrides speed and intensity when set
   */
  variant?: AuroraVariant;
  /**
   * Reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Additional CSS classes for the container
   */
  class?: any;
}

export interface AuroraSlots {
  /**
   * Default slot content rendered on top of the aurora
   */
  default(): any;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import {
  adjustLightness,
  getThemeColor,
  oklchToRgb,
} from "../../composables/useThemeColors";
import { createRepeatingGradient } from "../../composables/useGradient";

const props = withDefaults(defineProps<AuroraProps>(), {
  pin: "top-right",
  color: "primary",
  speed: 50,
  intensity: 50,
  reverse: false,
});

defineSlots<AuroraSlots>();

// Variant configurations
const variants: Record<
  AuroraVariant,
  { speed: number; intensity: number; blur: number }
> = {
  calm: { speed: 20, intensity: 30, blur: 15 },
  energetic: { speed: 80, intensity: 70, blur: 8 },
  cosmic: { speed: 50, intensity: 90, blur: 12 },
};

// Get effective values based on variant or props
const effectiveSpeed = computed(() =>
  props.variant ? variants[props.variant].speed : props.speed
);

const effectiveIntensity = computed(() =>
  props.variant ? variants[props.variant].intensity : props.intensity
);

const effectiveBlur = computed(() =>
  props.variant ? variants[props.variant].blur : 10
);

const baseColor = computed(() => getThemeColor(props.color, 500));

const auroraColors = computed(() => {
  const base = baseColor.value;
  return [
    oklchToRgb(adjustLightness(base, 60)),
    oklchToRgb(adjustLightness(base, 75)),
    oklchToRgb(adjustLightness(base, 70)),
    oklchToRgb(adjustLightness(base, 80)),
    oklchToRgb(adjustLightness(base, 65)),
  ];
});

const auroraColorsDark = computed(() => {
  const base = baseColor.value;
  return [
    oklchToRgb(adjustLightness(base, 30)),
    oklchToRgb(adjustLightness(base, 45)),
    oklchToRgb(adjustLightness(base, 40)),
    oklchToRgb(adjustLightness(base, 50)),
    oklchToRgb(adjustLightness(base, 35)),
  ];
});

const auroraGradient = computed(() =>
  createRepeatingGradient(auroraColors.value, 100)
);

const auroraGradientDark = computed(() =>
  createRepeatingGradient(auroraColorsDark.value, 100)
);

const animationDuration = computed(() => {
  const clampedSpeed = Math.max(1, Math.min(100, effectiveSpeed.value));
  const duration = 120 - clampedSpeed * 0.9;
  return `${duration}s`;
});

const animationState = computed(() =>
  effectiveSpeed.value === 0 ? "paused" : "running"
);

const animationDirection = computed(() =>
  props.reverse ? "reverse" : "normal"
);

const auroraOpacity = computed(() => {
  const clampedIntensity = Math.max(0, Math.min(100, effectiveIntensity.value));
  return clampedIntensity / 100;
});

const auroraBlur = computed(() => `${effectiveBlur.value}px`);

const maskGradient = computed(() => {
  if (!props.pin) return undefined;

  const positions: Record<NonNullable<typeof props.pin>, string> = {
    "top-left": "ellipse at 0% 0%",
    "top-right": "ellipse at 100% 0%",
    "bottom-left": "ellipse at 0% 100%",
    "bottom-right": "ellipse at 100% 100%",
    top: "ellipse at 50% 0%",
    bottom: "ellipse at 50% 100%",
    left: "ellipse at 0% 50%",
    right: "ellipse at 100% 50%",
  };

  return `radial-gradient(${positions[props.pin]}, black 10%, transparent 70%)`;
});
</script>

<template>
  <div
    class="relative flex h-full w-full items-center justify-center bg-zinc-50 text-slate-950 transition-bg dark:bg-zinc-900"
  >
    <div
      class="absolute inset-0 overflow-hidden"
      :style="maskGradient ? { maskImage: maskGradient } : {}"
    >
      <ClientOnly>
        <div
          class="aurora-effect pointer-events-none absolute -inset-2.5 h-full w-full will-change-transform animate-in fade-in duration-1000"
          :style="{ opacity: auroraOpacity }"
        />
      </ClientOnly>
    </div>

    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.aurora-effect {
  background-image: repeating-linear-gradient(
      100deg,
      #fff 0%,
      #fff 7%,
      transparent 10%,
      transparent 12%,
      #fff 16%
    ),
    v-bind(auroraGradient);
  background-size: 200%, 100%;
  background-position: 50% 50%, 50% 50%;
  filter: blur(v-bind(auroraBlur)) invert(1);
  animation: aurora v-bind(animationDuration) linear infinite;
  animation-play-state: v-bind(animationState);
  animation-direction: v-bind(animationDirection);
}

.aurora-effect::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
      100deg,
      #fff 0%,
      #fff 7%,
      transparent 10%,
      transparent 12%,
      #fff 16%
    ),
    v-bind(auroraGradient);
  background-size: 180%, 100%;
  background-position: 50% 50%, 50% 50%;
  background-attachment: fixed;
  mix-blend-mode: difference;
  animation: aurora v-bind(animationDuration) linear infinite;
  animation-play-state: v-bind(animationState);
  animation-direction: v-bind(animationDirection);
}

:global(.dark) .aurora-effect {
  background-image: repeating-linear-gradient(
      100deg,
      #000 0%,
      #000 7%,
      transparent 10%,
      transparent 12%,
      #000 16%
    ),
    v-bind(auroraGradientDark);
  filter: blur(10px) invert(0);
}

:global(.dark) .aurora-effect::after {
  background-image: repeating-linear-gradient(
      100deg,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.3) 7%,
      transparent 10%,
      transparent 12%,
      rgba(0, 0, 0, 0.3) 16%
    ),
    v-bind(auroraGradientDark);
  opacity: 0.3;
}

@keyframes aurora {
  from {
    background-position: 50% 50%, 50% 50%;
  }
  to {
    background-position: 350% 50%, 350% 50%;
  }
}
</style>
