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
   * Gradient direction for the grid
   * @default 'left-right'
   */
  gradient?:
    | "left-right"
    | "right-left"
    | "top-bottom"
    | "bottom-top"
    | "in-out"
    | "out-in";
  /**
   * Apply radial fade to edges
   * @default true
   */
  fade?: boolean;
  /**
   * Color for the grid. Supports:
   * - Nuxt UI semantic: 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'
   * - Tailwind colors: 'blue-500', 'red-600', 'slate-200', etc.
   * - Direct values: '#3b82f6', 'oklch(0.6 0.15 250)', 'rgb(59, 130, 246)'
   *
   * @example 'primary' - Nuxt UI semantic color
   * @example 'blue-500' - Tailwind color
   * @example '#3b82f6' - Direct hex color value
   *
   * @default 'neutral'
   */
  color?: ColorInput;
  /**
   * Lightness value for the grid (controls how light/subtle the grid appears)
   * Range: 0-100, where higher values = lighter/more subtle
   * @default 95
   */
  lightness?: number;
  /**
   * Fine-grained element customization (similar to Nuxt UI's ui prop)
   *
   * @example { colorDark: 'blue-300' } - Override color for dark mode
   */

  element?: {
    /**
     * Override color specifically for dark mode
     */
    colorDark?: ColorInput;
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
import { calculateGradientIntensity } from "../../composables/useGradient";
import theme from "../../themes/background-flickering-grid";
import { adjustLightness, oklchToRgb } from "../../composables/useThemeColors";
import {
  resolveColor,
  type ColorInput,
} from "../../composables/useColorResolver";

const props = withDefaults(defineProps<FlickeringGridProps>(), {
  size: 8,
  gap: 8,
  speed: 5,
  gradient: "left-right",
  fade: false,
  color: "neutral",
  lightness: 95,
});

// Get color mode from Nuxt UI
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

// Determine effective color based on color mode
const effectiveColor = computed(() => {
  // If in dark mode and dark color override is specified, use it
  if (isDark.value && props.element?.colorDark) {
    return props.element.colorDark;
  }
  return props.color;
});

// Map user-friendly 1-10 speed scale to internal decimal range
// 1 → 0.01, 5 → 0.05, 10 → 0.1
const internalSpeed = computed(() => {
  return props.speed * 0.01;
});

// Calculate effective opacity based on lightness
// Lower lightness (darker colors) need higher opacity to be visible
// Higher lightness (lighter colors) need lower opacity to stay subtle
const effectiveOpacity = computed(() => {
  // Map lightness (70-100) to opacity (0.6-0.2)
  // Linear interpolation: opacity = 0.6 - (lightness - 70) * (0.4 / 30)
  const minLightness = 70;
  const maxLightness = 100;
  const maxOpacity = 0.8;
  const minOpacity = 0.15;

  const t = Math.max(
    0,
    Math.min(
      1,
      (props.lightness - minLightness) / (maxLightness - minLightness)
    )
  );
  return maxOpacity - t * (maxOpacity - minOpacity);
});

defineSlots<FlickeringGridSlots>();

// Compute UI classes using tailwind-variants
const ui = computed(() => tv(theme)());

// Radial fade mask
const maskStyle = computed(() => {
  if (!props.fade) return {};
  return {
    maskImage: "radial-gradient(circle at center, black 20%, transparent 90%)",
    WebkitMaskImage:
      "radial-gradient(circle at center, black 20%, transparent 90%)",
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

  // Calculate lightness values based on the lightness prop
  // Use proportional spacing for better visual differentiation
  const lightnessStart = props.lightness;
  const lightnessEnd = Math.min(100, props.lightness + 3); // Slightly lighter
  const lightnessFlicker = Math.max(0, props.lightness - 10); // More prominent flicker

  // Create OKLCH colors with adjusted lightness and convert to RGB
  const startRgb = oklchToRgb(adjustLightness(baseColor, lightnessStart));
  const endRgb = oklchToRgb(adjustLightness(baseColor, lightnessEnd));
  const flickerRgb = oklchToRgb(adjustLightness(baseColor, lightnessFlicker));

  // Parse to tuples for canvas
  return {
    start: parseColor(startRgb),
    end: parseColor(endRgb),
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

// Gradient calculation using the reusable composable
function getGradientT(
  i: number,
  j: number,
  cols: number,
  rows: number
): number {
  // Normalize grid coordinates to 0-1 range
  const x = cols > 1 ? i / (cols - 1) : 0.5;
  const y = rows > 1 ? j / (rows - 1) : 0.5;

  return calculateGradientIntensity(x, y, props.gradient);
}

// Canvas setup
function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const cols = Math.floor(width / (props.size + props.gap));
  const rows = Math.floor(height / (props.size + props.gap));
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
      const t = getGradientT(i, j, cols, rows);
      const baseColor = lerpColor(colors.start, colors.end, t);
      let cellColor: [number, number, number] = baseColor;
      let cellAlpha = opacity;
      if (opacity > 0.5 * effectiveOpacity.value) {
        const blendT =
          (opacity - 0.5 * effectiveOpacity.value) /
          (0.5 * effectiveOpacity.value);
        cellColor = lerpColor(baseColor, colors.flicker, blendT);
        cellAlpha = Math.min(1, opacity + 0.2);
      }
      ctx.fillStyle = rgbToString(cellColor, cellAlpha);
      ctx.fillRect(
        i * (props.size + props.gap) * dpr,
        j * (props.size + props.gap) * dpr,
        props.size * dpr,
        props.size * dpr
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
    () => props.gradient,
    () => props.size,
    () => props.gap,
    () => props.color,
    () => props.lightness,
  ],
  () => {
    updateCanvasSize();
  }
);
</script>

<template>
  <div ref="containerRef" :class="ui.base({ class: [props.ui?.base] })">
    <canvas
      ref="canvasRef"
      :class="ui.canvas({ class: props.ui?.canvas })"
      :style="maskStyle"
    />
    <slot />
  </div>
</template>
