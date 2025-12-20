<script lang="ts">
import type { ComponentConfig } from '../../types/tv'
import backgroundFlickeringGridTheme from '../../themes/background-flickering-grid'

type BackgroundFlickeringGrid = ComponentConfig<typeof backgroundFlickeringGridTheme>

/**
 * FlickeringGrid - An animated canvas-based grid background component
 */
export interface FlickeringGridProps {
  /**
   * The square size of the grid (before scaling)
   * @default 4
   */
  squareSize?: number
  /**
   * The gap between grid squares
   * @default 6
   */
  gridGap?: number
  /**
   * The flicker animation speed (higher = faster)
   * @default 0.3
   */
  flickerChance?: number
  /**
   * Speed multiplier for flicker animation
   * @default 1
   */
  flickerSpeed?: number
  /**
   * Gradient direction for the grid
   * @default 'left-right'
   */
  gradientDirection?:
    | 'left-right'
    | 'right-left'
    | 'top-bottom'
    | 'bottom-top'
    | 'in-out'
    | 'out-in'
    | 'top-left-bottom-right'
    | 'bottom-right-top-left'
  /**
   * Maximum opacity of flickering squares
   * @default 0.3
   */
  maxOpacity?: number
  /**
   * Canvas width (defaults to container width)
   */
  width?: number
  /**
   * Canvas height (defaults to container height)
   */
  height?: number
  /**
   * Color variant
   * @default 'neutral'
   */
  color?: BackgroundFlickeringGrid['variants']['color']
  /**
   * Style variant
   * @default 'subtle'
   */
  variant?: BackgroundFlickeringGrid['variants']['variant']
  /**
   * Additional CSS classes for the container
   */
  class?: any
  /**
   * UI slot customization
   */
  ui?: BackgroundFlickeringGrid['slots']
}

export interface FlickeringGridSlots {
  /**
   * Default slot content rendered on top of the grid
   */
  default(): any
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { tv } from '../../utils/tv'
import theme from '../../themes/background-flickering-grid'

const props = withDefaults(defineProps<FlickeringGridProps>(), {
  squareSize: 4,
  gridGap: 6,
  flickerChance: 0.3,
  flickerSpeed: 1,
  gradientDirection: 'left-right',
  maxOpacity: 0.3,
  color: 'neutral',
  variant: 'subtle',
  class: '',
})

defineSlots<FlickeringGridSlots>()

// Compute UI classes using tailwind-variants
const ui = computed(() => tv(theme)({
  color: props.color,
  variant: props.variant,
}))

// Refs
const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const context = ref<CanvasRenderingContext2D | null>(null)
const isInView = ref(false)
const canvasSize = ref({ width: 0, height: 0 })
const gridParams = ref<{ cols: number, rows: number, squares: Float32Array, dpr: number } | null>(null)

// Get CSS variable values from the canvas element
function getGridColors() {
  if (!canvasRef.value)
    return { start: '#aaa', end: '#fff', flicker: '#fff' }

  const styles = getComputedStyle(canvasRef.value)
  return {
    start: styles.getPropertyValue('--grid-start-color').trim() || '#aaa',
    end: styles.getPropertyValue('--grid-end-color').trim() || '#fff',
    flicker: styles.getPropertyValue('--grid-flicker-color').trim() || '#fff',
  }
}

// Color parsing utilities
function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '')
  if (c.length === 3) {
    c = c
      .split('')
      .map(x => x + x)
      .join('')
  }
  const num = Number.parseInt(c, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function parseColor(color: string): [number, number, number] {
  if (color.startsWith('#'))
    return hexToRgb(color)
  if (color.startsWith('rgb')) {
    const m = color.match(/\d+/g)
    if (m && m.length >= 3)
      return [Number(m[0]), Number(m[1]), Number(m[2])]
  }
  return [255, 255, 255]
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  if (!a || a.length !== 3)
    a = [255, 255, 255]
  if (!b || b.length !== 3)
    b = [255, 255, 255]
  return [Math.round(lerp(a[0], b[0], t)), Math.round(lerp(a[1], b[1], t)), Math.round(lerp(a[2], b[2], t))]
}

function rgbToString(rgb: [number, number, number], alpha = 1) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`
}

// Computed colors based on theme
const gridColors = computed(() => {
  const colors = getGridColors()
  return {
    start: parseColor(colors.start),
    end: parseColor(colors.end),
    flicker: parseColor(colors.flicker),
  }
})

// Gradient calculation
function getGradientT(i: number, j: number, cols: number, rows: number): number {
  switch (props.gradientDirection) {
    case 'left-right':
      return i / (cols - 1)
    case 'right-left':
      return 1 - i / (cols - 1)
    case 'top-bottom':
      return j / (rows - 1)
    case 'bottom-top':
      return 1 - j / (rows - 1)
    case 'in-out': {
      const cx = (cols - 1) / 2
      const cy = (rows - 1) / 2
      const dx = i - cx
      const dy = j - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = Math.sqrt(cx * cx + cy * cy)
      return dist / maxDist
    }
    case 'out-in': {
      const cx = (cols - 1) / 2
      const cy = (rows - 1) / 2
      const dx = i - cx
      const dy = j - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = Math.sqrt(cx * cx + cy * cy)
      return 1 - dist / maxDist
    }
    case 'top-left-bottom-right':
      return (i + j) / (cols + rows - 2)
    case 'bottom-right-top-left':
      return 1 - (i + j) / (cols + rows - 2)
    default:
      return i / (cols - 1)
  }
}

// Canvas setup
function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  const cols = Math.floor(width / (props.squareSize + props.gridGap))
  const rows = Math.floor(height / (props.squareSize + props.gridGap))
  const squares = new Float32Array(cols * rows)
  for (let i = 0; i < squares.length; i++) {
    squares[i] = Math.random() * props.maxOpacity
  }
  return { cols, rows, squares, dpr }
}

// Animation logic
function updateSquares(squares: Float32Array, deltaTime: number) {
  for (let i = 0; i < squares.length; i++) {
    if (Math.random() < props.flickerChance * props.flickerSpeed * deltaTime) {
      squares[i] = Math.random() * props.maxOpacity
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
  dpr: number,
) {
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = 'transparent'
  ctx.fillRect(0, 0, width, height)

  const colors = gridColors.value

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const idx = i * rows + j
      const opacity = squares[idx] ?? 0
      const t = getGradientT(i, j, cols, rows)
      const baseColor = lerpColor(colors.start, colors.end, t)
      let cellColor: [number, number, number] = baseColor
      let cellAlpha = opacity
      if (opacity > 0.5 * props.maxOpacity) {
        const blendT = (opacity - 0.5 * props.maxOpacity) / (0.5 * props.maxOpacity)
        cellColor = lerpColor(baseColor, colors.flicker, blendT)
        cellAlpha = Math.min(1, opacity + 0.2)
      }
      ctx.fillStyle = rgbToString(cellColor, cellAlpha)
      ctx.fillRect(
        i * (props.squareSize + props.gridGap) * dpr,
        j * (props.squareSize + props.gridGap) * dpr,
        props.squareSize * dpr,
        props.squareSize * dpr,
      )
    }
  }
}

function updateCanvasSize() {
  const newWidth = props.width || containerRef.value?.clientWidth || 0
  const newHeight = props.height || containerRef.value?.clientHeight || 0
  canvasSize.value = { width: newWidth, height: newHeight }
  if (canvasRef.value) {
    gridParams.value = setupCanvas(canvasRef.value, newWidth, newHeight)
  }
}

// Animation loop
let animationFrameId: number | undefined
let resizeObserver: ResizeObserver | undefined
let intersectionObserver: IntersectionObserver | undefined
let lastTime = 0

function animate(time: number) {
  if (!isInView.value || !gridParams.value || !context.value)
    return
  const deltaTime = (time - lastTime) / 1000
  lastTime = time
  updateSquares(gridParams.value.squares, deltaTime)
  drawGrid(
    context.value,
    canvasRef.value!.width,
    canvasRef.value!.height,
    gridParams.value.cols,
    gridParams.value.rows,
    gridParams.value.squares,
    gridParams.value.dpr,
  )
  animationFrameId = requestAnimationFrame(animate)
}

// Lifecycle
onMounted(() => {
  if (!canvasRef.value || !containerRef.value)
    return
  context.value = canvasRef.value.getContext('2d')
  if (!context.value)
    return
  updateCanvasSize()
  resizeObserver = new ResizeObserver(() => {
    updateCanvasSize()
  })
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry)
        return
      isInView.value = entry.isIntersecting
      if (isInView.value) {
        lastTime = performance.now()
        animationFrameId = requestAnimationFrame(animate)
      }
    },
    { threshold: 0 },
  )
  resizeObserver.observe(containerRef.value)
  intersectionObserver.observe(canvasRef.value)
})

onBeforeUnmount(() => {
  if (animationFrameId)
    cancelAnimationFrame(animationFrameId)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
})

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
    updateCanvasSize()
  },
)
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
      :width="canvasSize.width"
      :height="canvasSize.height"
    />
    <slot />
  </div>
</template>
