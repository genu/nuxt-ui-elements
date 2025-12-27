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
   * Choose lighter shades (e.g., 'blue-200') for subtle backgrounds or darker shades (e.g., 'blue-600') for bolder effects.
   *
   * @example 'primary' - Nuxt UI semantic color
   * @example 'blue-200' - Light Tailwind color for subtle effect
   * @example 'blue-600' - Dark Tailwind color for bold effect
   * @example '#e0f2fe' - Direct hex color value (light blue)
   *
   * @default 'neutral'
   */
  color?: ColorInput;

  /**
   * Opacity/visibility of the grid squares.
   * Controls how transparent the grid appears.
   *
   * - 0: Completely invisible
   * - 0.3: Subtle, background texture
   * - 0.5: Medium visibility
   * - 0.8: Bold, prominent
   * - 1: Fully opaque
   *
   * Range: 0-1
   *
   * @default 0.5
   */
  opacity?: number;

  /**
   * Dark mode overrides for color and opacity.
   *
   * Allows you to customize the grid appearance specifically for dark mode.
   * Any property not specified will use the default light mode value.
   *
   * @example { color: 'blue-300', opacity: 0.3 }
   */
  dark?: {
    color?: ColorInput;
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
import { darkenColor, oklchToRgb } from "../../composables/useThemeColors";
import {
  resolveColor,
  type ColorInput,
} from "../../composables/useColorResolver";

const {
  size = 8,
  gap = 9,
  speed = 5,
  color = "neutral",
  opacity = 0.5,
  ...props
} = defineProps<FlickeringGridProps>();

// Get color mode from Nuxt UI
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

// Determine effective color based on color mode
const effectiveColor = computed(() => {
  // If in dark mode and dark color override is specified, use it
  if (isDark.value && props.dark?.color) {
    return props.dark.color;
  }
  return color;
});

// Determine effective opacity based on color mode
const effectiveOpacity = computed(() => {
  // If in dark mode and dark opacity override is specified, use it
  if (isDark.value && props.dark?.opacity !== undefined) {
    return props.dark.opacity;
  }
  return opacity;
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

// Get grid colors based on resolved color
const gridColors = computed(() => {
  // Resolve the color input to an actual color value
  const baseColor = resolveColor(effectiveColor.value);

  // Convert base color to RGB for canvas
  const baseRgb = oklchToRgb(baseColor);

  // For flicker effect, darken the color by 10%
  const darkerColor = darkenColor(baseColor, 10);
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
    () => opacity,
    () => props.dark?.color,
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
