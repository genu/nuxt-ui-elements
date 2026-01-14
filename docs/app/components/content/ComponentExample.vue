<script setup lang="ts">
import { camelCase } from 'scule'

const props = withDefaults(defineProps<{
  name: string
  class?: string
  /**
   * Whether to show the preview
   * @defaultValue true
   */
  preview?: boolean
  /**
   * Whether to show the source code
   * @defaultValue true
   */
  source?: boolean
  /**
   * Whether to collapse the code block
   * @defaultValue false
   */
  collapse?: boolean
  /**
   * A list of line numbers to highlight in the code block
   */
  highlights?: number[]
}>(), {
  preview: true,
  source: true,
  collapse: false
})

// The example component should be registered globally via the nuxt.config.ts hook
const componentInstance = resolveComponent(props.name)
const camelName = camelCase(props.name)

// Fetch the example source code
const data = await fetchComponentExample(camelName)

const code = computed(() => {
  let codeBlock = ''

  if (props.collapse) {
    codeBlock += `::code-collapse
`
  }

  codeBlock += `\`\`\`vue${props.preview ? '' : ` [${data?.pascalName || props.name}.vue]`}${props.highlights?.length ? `{${props.highlights.join('-')}}` : ''}
${data?.code ?? '// Example source code not found'}
\`\`\``

  if (props.collapse) {
    codeBlock += `
::`
  }

  return codeBlock
})

const { data: ast } = await useAsyncData(`component-example-${camelName}`, async () => {
  return parseMarkdown(code.value)
}, { watch: [code] })
</script>

<template>
  <div class="my-5">
    <!-- Preview -->
    <template v-if="preview">
      <div class="relative group/component">
        <div
          class="border border-muted relative z-[1]"
          :class="[{ 'border-b-0 rounded-t-md': source, 'rounded-md': !source }]"
        >
          <div class="flex justify-center p-4" :class="props.class">
            <component :is="componentInstance" v-if="componentInstance !== props.name" />
            <div v-else class="text-muted italic">
              Example "{{ props.name }}" not found. Make sure it exists in app/components/content/examples/
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Source Code -->
    <template v-if="source && ast">
      <MDCRenderer
        :body="ast.body"
        :data="ast.data"
        :class="[preview && '[&_pre]:!rounded-t-none [&_div.my-5]:!mt-0']"
      />
    </template>
  </div>
</template>
