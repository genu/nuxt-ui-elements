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
   * @default 12
   */
  squareSize?: number;
  /**
   * The gap between grid squares
   * @default 6
   */
  gridGap?: number;
  /**
   * The flicker animation speed (higher = faster)
   * @default 0.3
   */
  flickerChance?: number;
  /**
   * Speed multiplier for flicker animation
   * @default 1
   */
  flickerSpeed?: number;
  /**
   * Gradient direction for the grid
   * @default 'left-right'
   */
  gradientDirection?:
    | "left-right"
    | "right-left"
    | "top-bottom"
    | "bottom-top"
    | "in-out"
    | "out-in"
    | "top-left-bottom-right"
    | "bottom-right-top-left";
  /**
   * Maximum opacity of flickering squares
   * @default 0.3
   */
  maxOpacity?: number;
  /**
   * Apply radial fade to edges
   * @default true
   */
  fade?: boolean;
  /**
   * Canvas width (defaults to container width)
   */
  width?: number;
  /**
   * Canvas height (defaults to container height)
   */
  height?: number;
  /**
   * Color variant
   * @default 'neutral'
   */
  color?: BackgroundFlickeringGrid["variants"]["color"];
  /**
   * Style variant
   * @default 'subtle'
   */
  variant?: BackgroundFlickeringGrid["variants"]["variant"];
  /**
   * Additional CSS classes for the container
   */
  class?: any;
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
import { tv } from "../../utils/tv";
import { calculateGradientIntensity } from "../../composables/useGradient";
import theme from "../../themes/background-flickering-grid";
import { getThemeColor, adjustLightness, oklchToRgb } from "../../composables/useThemeColors";

const props = withDefaults(defineProps<FlickeringGridProps>(), {
  squareSize: 8,
  gridGap: 8,
  flickerChance: 0.3,
  flickerSpeed: 0.2,
  gradientDirection: "left-right",
  maxOpacity: 0.3,
  fade: true,
  color: "neutral",
  variant: "subtle",
  class: "",
});

defineSlots<FlickeringGridSlots>();

// Compute UI classes using tailwind-variants
const ui = computed(() =>
  tv(theme)({
    color: props.color,
    variant: props.variant,
  })
);

// Radial fade mask
const maskStyle = computed(() => {
  if (!props.fade) return {};
  return {
    maskImage: "radial-gradient(circle at center, black 20%, transparent 90%)",
    WebkitMaskImage: "radial-gradient(circle at center, black 20%, transparent 90%)",
  };
});

// Refs
const containerRef = ref<HTMLElement>();
const canvasRef = ref<HTMLCanvasElement>();
const context = ref<CanvasRenderingContext2D | null>(null);
const isInView = ref(false);
const canvasSize = ref({ width: 0, height: 0 });
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

// Get grid colors based on theme color and variant
const gridColors = computed(() => {
  const baseColor = getThemeColor(props.color, 500);

  // Define lightness values for each variant
  const lightnessMap = {
    subtle: { start: 96, end: 98, flicker: 93 },
    soft: { start: 92, end: 96, flicker: 88 },
    solid: { start: 80, end: 92, flicker: 70 },
  };

  const lightness = lightnessMap[props.variant];

  // Create OKLCH colors with adjusted lightness and convert to RGB
  const startRgb = oklchToRgb(adjustLightness(baseColor, lightness.start));
  const endRgb = oklchToRgb(adjustLightness(baseColor, lightness.end));
  const flickerRgb = oklchToRgb(adjustLightness(baseColor, lightness.flicker));

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

  return calculateGradientIntensity(x, y, props.gradientDirection);
}

// Canvas setup
function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const cols = Math.floor(width / (props.squareSize + props.gridGap));
  const rows = Math.floor(height / (props.squareSize + props.gridGap));
  const squares = new Float32Array(cols * rows);
  for (let i = 0; i < squares.length; i++) {
    squares[i] = Math.random() * props.maxOpacity;
  }
  return { cols, rows, squares, dpr };
}

// Animation logic
function updateSquares(squares: Float32Array, deltaTime: number) {
  for (let i = 0; i < squares.length; i++) {
    if (Math.random() < props.flickerChance * props.flickerSpeed * deltaTime) {
      squares[i] = Math.random() * props.maxOpacity;
    }
  }
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cols: number,
  rows: number,
  squares: Float32Array,
  dpr: number
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, width, height);

  const colors = gridColors.value;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const idx = i * rows + j;
      const opacity = squares[idx] ?? 0;
      const t = getGradientT(i, j, cols, rows);
      const baseColor = lerpColor(colors.start, colors.end, t);
      let cellColor: [number, number, number] = baseColor;
      let cellAlpha = opacity;
      if (opacity > 0.5 * props.maxOpacity) {
        const blendT =
          (opacity - 0.5 * props.maxOpacity) / (0.5 * props.maxOpacity);
        cellColor = lerpColor(baseColor, colors.flicker, blendT);
        cellAlpha = Math.min(1, opacity + 0.2);
      }
      ctx.fillStyle = rgbToString(cellColor, cellAlpha);
      ctx.fillRect(
        i * (props.squareSize + props.gridGap) * dpr,
        j * (props.squareSize + props.gridGap) * dpr,
        props.squareSize * dpr,
        props.squareSize * dpr
      );
    }
  }
}

function updateCanvasSize() {
  const newWidth = props.width || containerRef.value?.clientWidth || 0;
  const newHeight = props.height || containerRef.value?.clientHeight || 0;
  canvasSize.value = { width: newWidth, height: newHeight };
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
    () => props.gradientDirection,
    () => props.squareSize,
    () => props.gridGap,
    () => props.maxOpacity,
    () => props.color,
    () => props.variant,
  ],
  () => {
    updateCanvasSize();
  }
);
</script>

<template>
  <div
    ref="containerRef"
    data-slot="base"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <canvas
      ref="canvasRef"
      data-slot="canvas"
      :class="ui.canvas({ class: props.ui?.canvas })"
      :style="maskStyle"
      :width="canvasSize.width"
      :height="canvasSize.height"
    />
    <slot />
  </div>
</template>
