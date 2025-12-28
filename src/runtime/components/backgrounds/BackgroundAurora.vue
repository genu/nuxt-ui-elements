<script lang="ts">
import type { ColorInput } from "../../composables/useColorResolver";

/**
 * Aurora - An animated aurora background component with gradient effects
 *
 * A beautiful CSS-based gradient animation that creates flowing aurora-like effects.
 * Perfect for hero sections, landing pages, or anywhere you want eye-catching backgrounds.
 */

export type AuroraVariant = "calm" | "energetic" | "cosmic";

export interface AuroraProps {
  /**
   * Pin the aurora to a specific corner or edge of the container.
   *
   * When set, creates a radial mask that constrains the aurora effect to originate from
   * the specified position, creating a spotlight or glow effect from that corner/edge.
   *
   * When undefined, aurora flows freely across the entire container without masking.
   *
   * Use cases:
   * - 'top-right': Glow from top-right corner (perfect for hero sections)
   * - 'bottom-left': Accent from bottom corner
   * - 'top': Top edge glow (header backgrounds)
   * - undefined: Full-screen flowing effect (landing pages)
   *
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
   * Color for the aurora gradient. Supports:
   * - Nuxt UI semantic: 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'
   * - Tailwind colors: 'blue-500', 'red-600', 'purple-400', etc.
   * - Direct values: '#3b82f6', 'oklch(0.6 0.15 250)', 'rgb(59, 130, 246)'
   *
   * The component automatically generates multiple gradient shades from this base color
   * with different lightness values for a rich, multi-tone aurora effect.
   *
   * @example 'primary' - Uses Nuxt UI theme primary color
   * @example 'purple-500' - Tailwind purple
   * @example '#8b5cf6' - Direct hex value
   *
   * @default 'primary'
   */
  color?: ColorInput;

  /**
   * Speed of the aurora animation (0-100, where 100 is fastest).
   *
   * Controls how quickly the aurora gradient flows across the screen.
   * - 0: Paused (no animation)
   * - 1-30: Slow, calm movement
   * - 40-60: Medium, steady flow
   * - 70-100: Fast, energetic motion
   *
   * Range: 0-100
   * @default 50
   */
  speed?: number;

  /**
   * Opacity/visibility of the aurora effect (0-100).
   *
   * Controls the overall transparency of the aurora gradient overlay.
   * Does NOT affect blur amount - use `variant` for preset blur configurations.
   *
   * - 0: Completely invisible
   * - 30: Subtle, gentle glow
   * - 50: Balanced visibility
   * - 80-100: Bold, prominent effect
   *
   * Range: 0-100
   * @default 50
   */
  opacity?: number;

  /**
   * Lightness adjustment for the base color in OKLCH color space (0-100).
   *
   * Controls the brightness/saturation of the generated gradient colors.
   * - Lower values (30-50): Darker, more saturated colors (better for dark mode)
   * - Higher values (60-80): Lighter, pastel colors (better for light mode)
   *
   * The component automatically adjusts this for dark mode, but you can override
   * using the `dark` prop for custom dark mode appearance.
   *
   * Range: 0-100
   * @default 70 (light mode), 40 (dark mode)
   */
  lightness?: number;

  /**
   * Dark mode overrides for color, lightness, and opacity.
   *
   * Allows you to customize the aurora appearance specifically for dark mode.
   * Any property not specified will use the default light mode value.
   *
   * @example { color: 'blue-400', lightness: 30, opacity: 60 }
   */
  dark?: {
    color?: ColorInput;
    lightness?: number;
    opacity?: number;
  };

  /**
   * Animation style variant with preset configurations.
   *
   * When set, overrides `speed`, `opacity`, and blur settings with carefully tuned presets.
   * - 'calm': Slow, gentle, heavily blurred (meditative feel)
   * - 'energetic': Fast, vibrant, lightly blurred (dynamic feel)
   * - 'cosmic': Medium speed, high opacity, moderate blur (space-like effect)
   *
   * Leave undefined to manually control speed and opacity.
   */
  variant?: AuroraVariant;

  /**
   * Reverse the animation direction.
   *
   * When true, the aurora flows in the opposite direction.
   *
   * @default false
   */
  reverse?: boolean;

  /**
   * Additional CSS classes for the container element.
   */
  class?: any;
}

export interface AuroraSlots {
  /**
   * Default slot content rendered on top of the aurora background.
   *
   * Content is positioned with z-index above the aurora effect.
   */
  default(): any;
}
</script>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useColorMode } from "#imports";
import { resolveColor } from "../../composables/useColorResolver";
import {
  adjustLightness,
  oklchToRgb,
} from "../../composables/useThemeColors";
import { createRepeatingGradient } from "../../composables/useGradient";

const {
  pin = "top-right",
  color = "primary",
  speed = 50,
  opacity = 50,
  lightness = 70,
  reverse = false,
  ...props
} = defineProps<AuroraProps>();

defineSlots<AuroraSlots>();

// Detect dark mode - initialize with false to avoid hydration issues
const isDark = ref(false);

onMounted(() => {
  const colorMode = useColorMode();
  isDark.value = colorMode.value === "dark";

  // Watch for changes
  watch(
    () => colorMode.value,
    (newValue: string) => {
      isDark.value = newValue === "dark";
    }
  );
});

// Variant configurations
const variants: Record<
  AuroraVariant,
  { speed: number; opacity: number; blur: number }
> = {
  calm: { speed: 20, opacity: 30, blur: 15 },
  energetic: { speed: 80, opacity: 70, blur: 8 },
  cosmic: { speed: 50, opacity: 90, blur: 12 },
};

// Get effective values based on variant or props
const effectiveSpeed = computed(() =>
  props.variant ? variants[props.variant].speed : speed
);

const effectiveOpacity = computed(() =>
  props.variant ? variants[props.variant].opacity : opacity
);

const effectiveBlur = computed(() =>
  props.variant ? variants[props.variant].blur : 10
);

// Resolve color for light and dark modes
const effectiveColor = computed(() =>
  isDark.value && props.dark?.color ? props.dark.color : color
);

const effectiveLightness = computed(() =>
  isDark.value && props.dark?.lightness !== undefined
    ? props.dark.lightness
    : isDark.value
      ? 40
      : lightness
);

const effectiveOpacityValue = computed(() =>
  isDark.value && props.dark?.opacity !== undefined
    ? props.dark.opacity
    : effectiveOpacity.value
);

const baseColor = computed(() => resolveColor(effectiveColor.value));

const auroraColors = computed(() => {
  const base = baseColor.value;
  const baseLightness = effectiveLightness.value;
  return [
    oklchToRgb(adjustLightness(base, baseLightness - 10)),
    oklchToRgb(adjustLightness(base, baseLightness + 5)),
    oklchToRgb(adjustLightness(base, baseLightness)),
    oklchToRgb(adjustLightness(base, baseLightness + 10)),
    oklchToRgb(adjustLightness(base, baseLightness - 5)),
  ];
});

const auroraGradient = computed(() =>
  createRepeatingGradient(auroraColors.value, 100)
);

const animationDuration = computed(() => {
  const clampedSpeed = Math.max(1, Math.min(100, effectiveSpeed.value));
  const duration = 120 - clampedSpeed * 0.9;
  return `${duration}s`;
});

const animationState = computed(() =>
  effectiveSpeed.value === 0 ? "paused" : "running"
);

const animationDirection = computed(() => (reverse ? "reverse" : "normal"));

const auroraOpacityValue = computed(() => {
  const clampedOpacity = Math.max(
    0,
    Math.min(100, effectiveOpacityValue.value)
  );
  return clampedOpacity / 100;
});

const auroraBlur = computed(() => `${effectiveBlur.value}px`);

// CSS-specific computed values to avoid complex v-bind expressions
const lineColor = computed(() => (isDark.value ? "#000" : "#fff"));
const lineColorAfter = computed(() =>
  isDark.value ? "rgba(0, 0, 0, 0.3)" : "#fff"
);
const filterInvert = computed(() => (isDark.value ? "invert(0)" : "invert(1)"));
const afterOpacity = computed(() => (isDark.value ? 0.3 : 1));

const maskGradient = computed(() => {
  if (!pin) return undefined;

  const positions: Record<NonNullable<typeof pin>, string> = {
    "top-left": "ellipse at 0% 0%",
    "top-right": "ellipse at 100% 0%",
    "bottom-left": "ellipse at 0% 100%",
    "bottom-right": "ellipse at 100% 100%",
    top: "ellipse at 50% 0%",
    bottom: "ellipse at 50% 100%",
    left: "ellipse at 0% 50%",
    right: "ellipse at 100% 50%",
  };

  return `radial-gradient(${positions[pin]}, black 10%, transparent 70%)`;
});
</script>

<template>
  <div
    class="relative flex h-full w-full items-center justify-center bg-zinc-50 text-slate-950 transition-bg dark:bg-zinc-900"
    :class="props.class"
  >
    <div
      class="absolute inset-0 overflow-hidden"
      :style="maskGradient ? { maskImage: maskGradient } : {}"
    >
      <div
        class="aurora-effect pointer-events-none absolute -inset-2.5 h-full w-full will-change-transform animate-in fade-in duration-1000"
        :style="{ opacity: auroraOpacityValue }"
      />
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
      v-bind(lineColor) 0%,
      v-bind(lineColor) 7%,
      transparent 10%,
      transparent 12%,
      v-bind(lineColor) 16%
    ),
    v-bind(auroraGradient);
  background-size: 200%, 100%;
  background-position: 50% 50%, 50% 50%;
  filter: blur(v-bind(auroraBlur)) v-bind(filterInvert);
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
      v-bind(lineColorAfter) 0%,
      v-bind(lineColorAfter) 7%,
      transparent 10%,
      transparent 12%,
      v-bind(lineColorAfter) 16%
    ),
    v-bind(auroraGradient);
  background-size: 180%, 100%;
  background-position: 50% 50%, 50% 50%;
  background-attachment: fixed;
  mix-blend-mode: difference;
  opacity: v-bind(afterOpacity);
  animation: aurora v-bind(animationDuration) linear infinite;
  animation-play-state: v-bind(animationState);
  animation-direction: v-bind(animationDirection);
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
