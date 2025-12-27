<script lang="ts">
import type { ComponentConfig } from "../../types/tv";
import backgroundFlickeringGridTheme from "../../themes/background-flickering-grid";

type BackgroundFlickeringGrid = ComponentConfig<
  typeof backgroundFlickeringGridTheme
>;

/**
 * FlickeringGrid - An animated canvas-based grid background component
 */
export interface FlickeringGridProps {
  /**
   * The square size of the grid (before scaling)
   * @default 8
   */
  size?: number;
  /**
   * The gap between grid squares
   * @default 8
   */
  gap?: number;
  /**
   * Animation speed (higher = faster flicker)
   * Scale from 1 (slowest) to 10 (fastest)
   * @default 5
   */
  speed?: number;
  /**
   * Apply fade/vignette effect with directional masking
   * - 'radial': Radial fade from center (spotlight effect)
   * - 'left', 'right', 'top', 'bottom': Linear fade from specified edge
   *
   */
  fade?: "radial" | "left" | "right" | "top" | "bottom";
  /**
   * Color for the grid. Supports:
   * - Nuxt UI semantic: 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'
   * - Tailwind colors: 'blue-500', 'red-600', 'slate-200', etc.
   * - Direct values: '#3b82f6', 'oklch(0.6 0.15 250)', 'rgb(59, 130, 246)'
   *
   * This controls the base hue/color of the grid. Use `lightness` to adjust how bright/washed out it appears.
   *
   * @example 'primary' - Nuxt UI semantic color
   * @example 'blue-500' - Tailwind color
   * @example '#3b82f6' - Direct hex color value
   *
   * @default 'neutral'
   */
  color?: ColorInput;

  /**
   * Lightness adjustment in OKLCH color space (0-100).
   *
   * Controls how bright or washed-out the color appears WITHOUT changing transparency.
   * This modifies the color itself, making it closer to white (higher values) or more saturated (lower values).
   *
   * Think of it as a "color brightness" slider:
   * - Lower values (70-80): Darker, more saturated, vibrant colors
   * - Medium values (85-92): Balanced, natural colors
   * - Higher values (93-100): Very light, pastel, washed-out colors (approaching white)
   *
   * Use cases:
   * - Subtle background: `color="blue-500" lightness={95}` → Very light blue tint
   * - Bold accent: `color="blue-500" lightness={75}` → Vibrant, saturated blue
   * - Combined with opacity: `lightness={90} opacity={0.3}` → Medium-tone color, very transparent
   *
   * Range: 0-100
   * @default 95
   */
  lightness?: number;

  /**
   * Opacity/transparency of the grid squares (0-100).
   *
   * Controls how see-through the grid is WITHOUT changing the color itself.
   * This is pure transparency - the color stays the same, just more/less visible.
   *
   * Think of it as a "visibility" slider:
   * - 0: Completely invisible (transparent)
   * - 30: Very subtle, barely visible
   * - 50: Medium visibility
   * - 80: Bold, prominent
   * - 100: Fully opaque, no transparency
   *
   * Use cases:
   * - Gentle texture: `opacity={20}` → Barely visible background pattern
   * - Strong effect: `opacity={80}` → Prominent, eye-catching grid
   * - Combined with lightness: `lightness={95} opacity={50}` → Light color, medium transparency
   *
   * Range: 0-100
   * @default 50
   */
  opacity?: number;

  /**
   * Dark mode overrides for color, lightness, and opacity.
   *
   * Allows you to customize the grid appearance specifically for dark mode.
   * Any property not specified will use the default light mode value.
   *
   * @example { color: 'blue-300', lightness: 90, opacity: 0.3 }
   */
  dark?: {
    color?: ColorInput;
    lightness?: number;
    opacity?: number;
  };

  /**
   * UI slot customization
   */
  ui?: BackgroundFlickeringGrid["slots"];
}

export interface FlickeringGridSlots {
  /**
   * Default slot content rendered on top of the grid
   */
  default(): any;
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useColorMode } from "#imports";
import { tv } from "../../utils/tv";
import theme from "../../themes/background-flickering-grid";
import { adjustLightness, darkenColor, oklchToRgb } from "../../composables/useThemeColors";
import {
  resolveColor,
  type ColorInput,
} from "../../composables/useColorResolver";

const {
  size = 8,
  gap = 9,
  speed = 5,
  color = "neutral",
  lightness = 95,
  opacity = 50,
  ...props
} = defineProps<FlickeringGridProps>();

// Get color mode from Nuxt UI
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

// Determine effective color based on color mode
const effectiveColor = computed(() => {
  if (isDark.value && props.dark?.color) {
    return props.dark.color;
  }
  return color;
});

// Determine effective lightness based on color mode
const effectiveLightness = computed(() => {
  if (isDark.value && props.dark?.lightness !== undefined) {
    return props.dark.lightness;
  }
  return lightness;
});

// Determine effective opacity based on color mode (convert 0-100 to 0-1)
const effectiveOpacity = computed(() => {
  const opacityValue = isDark.value && props.dark?.opacity !== undefined
    ? props.dark.opacity
    : opacity;
  return opacityValue / 100;
});

// Map user-friendly 1-10 speed scale to internal decimal range
// 1 → 0.01, 5 → 0.05, 10 → 0.1
const internalSpeed = computed(() => {
  return speed * 0.01;
});

defineSlots<FlickeringGridSlots>();

// Compute UI classes using tailwind-variants
const ui = computed(() => tv(theme)());

// Fade mask - supports radial and directional fades
const maskStyle = computed(() => {
  if (!props.fade) return {};

  let maskImage: string;

  switch (props.fade) {
    case "radial":
      maskImage =
        "radial-gradient(circle at center, black 20%, transparent 90%)";
      break;
    case "left":
      maskImage = "linear-gradient(to right, transparent 0%, black 30%)";
      break;
    case "right":
      maskImage = "linear-gradient(to left, transparent 0%, black 30%)";
      break;
    case "top":
      maskImage = "linear-gradient(to bottom, transparent 0%, black 30%)";
      break;
    case "bottom":
      maskImage = "linear-gradient(to top, transparent 0%, black 30%)";
      break;
    default:
      return {};
  }

  return {
    maskImage,
    WebkitMaskImage: maskImage,
  };
});

// Refs
const containerRef = ref<HTMLElement>();
const canvasRef = ref<HTMLCanvasElement>();
const context = ref<CanvasRenderingContext2D | null>(null);
const isInView = ref(false);
const gridParams = ref<{
  cols: number;
  rows: number;
  squares: Float32Array;
  dpr: number;
} | null>(null);

// Parse RGB string to [r, g, b] tuple for canvas
function parseColor(color: string): [number, number, number] {
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match && match[1] && match[2] && match[3]) {
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  }
  return [255, 255, 255];
}

// Get grid colors based on resolved color and lightness
const gridColors = computed(() => {
  // Resolve the color input to an actual color value
  const baseColor = resolveColor(effectiveColor.value);

  // Apply lightness adjustment to get the actual color to display
  const adjustedColor = adjustLightness(baseColor, effectiveLightness.value);
  const baseRgb = oklchToRgb(adjustedColor);

  // For flicker effect, darken the adjusted color by 10%
  const darkerColor = darkenColor(adjustedColor, 10);
  const flickerRgb = oklchToRgb(darkerColor);

  return {
    base: parseColor(baseRgb),
    flicker: parseColor(flickerRgb),
  };
});

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  if (!a || a.length !== 3) a = [255, 255, 255];
  if (!b || b.length !== 3) b = [255, 255, 255];
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}

function rgbToString(rgb: [number, number, number], alpha = 1) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
}

// Canvas setup
function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const cols = Math.floor(width / (size + gap));
  const rows = Math.floor(height / (size + gap));
  const squares = new Float32Array(cols * rows);
  for (let i = 0; i < squares.length; i++) {
    squares[i] = Math.random() * effectiveOpacity.value;
  }
  return { cols, rows, squares, dpr };
}

// Animation logic
function updateSquares(squares: Float32Array, deltaTime: number) {
  for (let i = 0; i < squares.length; i++) {
    if (Math.random() < internalSpeed.value * deltaTime) {
      squares[i] = Math.random() * effectiveOpacity.value;
    }
  }
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  cols: number,
  rows: number,
  squares: Float32Array,
  dpr: number
) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const colors = gridColors.value;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const idx = i * rows + j;
      const opacity = squares[idx] ?? 0;

      // Use base color, blend to flicker color for brighter squares
      let cellColor: [number, number, number] = colors.base;
      let cellAlpha = opacity;

      if (opacity > 0.5 * effectiveOpacity.value) {
        const blendT =
          (opacity - 0.5 * effectiveOpacity.value) /
          (0.5 * effectiveOpacity.value);
        cellColor = lerpColor(colors.base, colors.flicker, blendT);
        cellAlpha = Math.min(1, opacity + 0.2);
      }

      ctx.fillStyle = rgbToString(cellColor, cellAlpha);
      ctx.fillRect(
        i * (size + gap) * dpr,
        j * (size + gap) * dpr,
        size * dpr,
        size * dpr
      );
    }
  }
}

function updateCanvasSize() {
  const newWidth = containerRef.value?.clientWidth || 0;
  const newHeight = containerRef.value?.clientHeight || 0;
  if (canvasRef.value) {
    gridParams.value = setupCanvas(canvasRef.value, newWidth, newHeight);
  }
}

// Animation loop
let animationFrameId: number | undefined;
let resizeObserver: ResizeObserver | undefined;
let intersectionObserver: IntersectionObserver | undefined;
let lastTime = 0;

function animate(time: number) {
  if (!isInView.value || !gridParams.value || !context.value) return;
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;
  updateSquares(gridParams.value.squares, deltaTime);
  drawGrid(
    context.value,
    canvasRef.value!.width,
    canvasRef.value!.height,
    gridParams.value.cols,
    gridParams.value.rows,
    gridParams.value.squares,
    gridParams.value.dpr
  );
  animationFrameId = requestAnimationFrame(animate);
}

// Lifecycle
onMounted(() => {
  if (!canvasRef.value || !containerRef.value) return;
  context.value = canvasRef.value.getContext("2d");
  if (!context.value) return;

  updateCanvasSize();
  resizeObserver = new ResizeObserver(() => {
    updateCanvasSize();
  });
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      isInView.value = entry.isIntersecting;
      if (isInView.value) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    },
    { threshold: 0 }
  );
  resizeObserver.observe(containerRef.value);
  intersectionObserver.observe(canvasRef.value);
});

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
});

// Watch for prop changes that require redraw
watch(
  [
    () => size,
    () => gap,
    () => color,
    () => lightness,
    () => opacity,
    () => props.dark?.color,
    () => props.dark?.lightness,
    () => props.dark?.opacity,
  ],
  () => {
    updateCanvasSize();
  }
);
</script>

<template>
  <div ref="containerRef" :class="ui.base({ class: [props.ui?.base] })">
    <canvas ref="canvasRef" :class="ui.canvas({ class: props.ui?.canvas })" :style="maskStyle" />
    <slot />
  </div>
</template>
