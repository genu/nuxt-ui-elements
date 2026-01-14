<script setup lang="ts">
import { upperFirst, camelCase, kebabCase } from 'scule'
import type { ComponentMeta } from 'vue-component-meta'

const props = withDefaults(defineProps<{
  slug?: string
  ignore?: string[]
}>(), {
  ignore: () => []
})

const route = useRoute()

const camelName = camelCase(props.slug ?? route.path.split('/').pop() ?? '')
const componentName = `UE${upperFirst(camelName)}`

const meta = await fetchComponentMeta(componentName as any)

const metaProps: ComputedRef<ComponentMeta['props']> = computed(() => {
  if (!meta?.meta?.props?.length) {
    return []
  }

  return meta.meta.props.filter((prop) => {
    return !props.ignore?.includes(prop.name)
  }).map((prop) => {
    if (prop.default) {
      prop.default = prop.default.replace(' as never', '').replace(/^"(.*)"$/, '\'$1\'')
    }

    return prop
  }).sort((a, b) => {
    // Put 'ui' prop at the end
    if (a.name === 'ui') return 1
    if (b.name === 'ui') return -1
    return 0
  })
})
</script>

<template>
  <div v-if="metaProps.length" class="my-5">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-muted">
            <th class="py-2 px-3 text-sm font-semibold">Prop</th>
            <th class="py-2 px-3 text-sm font-semibold">Default</th>
            <th class="py-2 px-3 text-sm font-semibold">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in metaProps" :key="prop.name" class="border-b border-muted">
            <td class="py-2 px-3">
              <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">{{ prop.name }}</code>
            </td>
            <td class="py-2 px-3">
              <code v-if="prop.default" class="text-sm text-primary font-mono">{{ prop.default }}</code>
              <span v-else class="text-muted">-</span>
            </td>
            <td class="py-2 px-3">
              <code class="text-sm text-muted font-mono">{{ prop.type }}</code>
              <p v-if="prop.description" class="text-sm text-muted mt-1">{{ prop.description }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else class="my-5 text-muted italic">
    No props available for this component.
  </div>
</template>
