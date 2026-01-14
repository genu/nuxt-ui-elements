<script setup lang="ts">
  import { upperFirst, camelCase, kebabCase } from "scule"

  const props = defineProps<{
    /** Override the slug taken from the route */
    slug?: string
    class?: any
    /** List of props to ignore in selection */
    ignore?: string[]
    /** List of props to hide from code */
    hide?: string[]
    props?: { [key: string]: any }
    slots?: { [key: string]: any }
    /**
     * Whether to collapse the code block
     * @defaultValue false
     */
    collapse?: boolean
  }>()

  const route = useRoute()

  const camelName = camelCase(props.slug ?? route.path.split("/").pop() ?? "")
  const name = `UE${upperFirst(camelName)}`

  // Try to dynamically import the component
  const component = defineAsyncComponent(async () => {
    try {
      // Import from nuxt-ui-elements runtime
      return await import(`nuxt-ui-elements/runtime/components/${upperFirst(camelName)}.vue`)
    } catch {
      // Fallback - return a placeholder
      return defineComponent({
        setup() {
          return () => h("div", { class: "text-muted italic" }, `Component ${name} not found`)
        },
      })
    }
  })

  const componentProps = reactive({
    ...props.props,
  })

  function getComponentProp(name: string) {
    return componentProps[name]
  }

  function setComponentProp(name: string, value: any) {
    componentProps[name] = value
  }

  // Generate code for display
  const code = computed(() => {
    let code = ""

    if (props.collapse) {
      code += `::code-collapse\n`
    }

    code += `\`\`\`vue
<template>
  <${name}`

    for (const [key, value] of Object.entries(componentProps)) {
      if (value === undefined || value === null || value === "" || props.hide?.includes(key)) {
        continue
      }

      const attrName = kebabCase(key)

      if (typeof value === "boolean") {
        code += value ? ` ${attrName}` : ` :${attrName}="false"`
      } else if (typeof value === "object") {
        code += ` :${attrName}="${JSON.stringify(value, null, 2)}"`
      } else if (typeof value === "number") {
        code += ` :${attrName}="${value}"`
      } else {
        code += ` ${attrName}="${value}"`
      }
    }

    if (props.slots?.default) {
      code += `>${props.slots.default}</${name}>`
    } else {
      code += " />"
    }

    code += `
</template>
\`\`\``

    if (props.collapse) {
      code += `\n::`
    }

    return code
  })
</script>

<template>
  <div class="my-5">
    <div class="relative group/component">
      <!-- Component Preview -->
      <div class="flex justify-center border border-b-0 border-muted rounded-t-md relative p-4 z-[1]" :class="[props.class]">
        <component :is="component" v-bind="componentProps">
          <template v-for="slot in Object.keys(slots || {})" :key="slot" #[slot]>
            <slot :name="slot">
              {{ slots?.[slot] }}
            </slot>
          </template>
        </component>
      </div>
    </div>

    <!-- Code Block -->
    <MDC :value="code" class="[&_pre]:!rounded-t-none [&_div.my-5]:!mt-0" />
  </div>
</template>
