<script setup lang="ts" generic="T extends Record<string, any[]>">
/**
 * Matrix component for displaying all combinations of component props
 * Similar to Nuxt UI's Matrix component for testing component variations
 */
interface MatrixProps {
  /**
   * Object containing arrays of prop values to combine
   * @example { color: ['primary', 'secondary'], size: ['sm', 'md', 'lg'] }
   */
  props: T
  /**
   * Whether to display prop labels
   * @default true
   */
  showLabels?: boolean
}

const props = withDefaults(defineProps<MatrixProps>(), {
  showLabels: true
})

defineSlots<{
  default(props: { [K in keyof T]: T[K][number] }): any
}>()

// Generate all combinations of prop values (cartesian product)
function generateCombinations<T extends Record<string, any[]>>(obj: T): Array<{ [K in keyof T]: T[K][number] }> {
  const keys = Object.keys(obj) as Array<keyof T>

  if (keys.length === 0) return [{}] as any

  const combinations: Array<{ [K in keyof T]: T[K][number] }> = []

  function combine(index: number, current: Partial<{ [K in keyof T]: T[K][number] }>) {
    if (index === keys.length) {
      combinations.push({ ...current } as { [K in keyof T]: T[K][number] })
      return
    }

    const key = keys[index]
    const values = obj[key]

    for (const value of values) {
      combine(index + 1, { ...current, [key]: value })
    }
  }

  combine(0, {})
  return combinations
}

const combinations = computed(() => generateCombinations(props.props))

// Format prop name for display
function formatPropName(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

// Format prop value for display
function formatPropValue(value: any): string {
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  return JSON.stringify(value)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="(combination, index) in combinations"
      :key="index"
      class="space-y-2"
    >
      <!-- Prop labels -->
      <div v-if="showLabels" class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <div v-for="(value, key) in combination" :key="String(key)" class="flex gap-2">
          <span class="font-medium">{{ formatPropName(String(key)) }}:</span>
          <span class="font-mono">{{ formatPropValue(value) }}</span>
        </div>
      </div>

      <!-- Component with props -->
      <div class="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <slot v-bind="combination" />
      </div>
    </div>
  </div>
</template>
