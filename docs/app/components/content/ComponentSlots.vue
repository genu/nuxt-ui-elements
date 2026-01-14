<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'
import type { ComponentMeta } from 'vue-component-meta'

const props = withDefaults(defineProps<{
  slug?: string
}>(), {})

const route = useRoute()

const camelName = camelCase(props.slug ?? route.path.split('/').pop() ?? '')
const componentName = `UE${upperFirst(camelName)}`

const meta = await fetchComponentMeta(componentName as any)

const metaSlots = computed(() => {
  if (!meta?.meta?.slots?.length) {
    return []
  }
  return meta.meta.slots
})
</script>

<template>
  <div v-if="metaSlots.length" class="my-5">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-muted">
            <th class="py-2 px-3 text-sm font-semibold">Slot</th>
            <th class="py-2 px-3 text-sm font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in metaSlots" :key="slot.name" class="border-b border-muted">
            <td class="py-2 px-3">
              <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">#{{ slot.name }}</code>
            </td>
            <td class="py-2 px-3">
              <span v-if="slot.description" class="text-sm">{{ slot.description }}</span>
              <span v-else class="text-muted">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else class="my-5 text-muted italic">
    No slots available for this component.
  </div>
</template>
