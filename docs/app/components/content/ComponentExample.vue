<script setup lang="ts">
  const props = defineProps<{
    name: string
    class?: string
  }>()

  // The example component should be registered globally via the nuxt.config.ts hook
  const component = resolveComponent(props.name)
</script>

<template>
  <div class="my-5">
    <div class="border border-muted rounded-md p-4" :class="props.class">
      <component :is="component" v-if="component !== props.name" />
      <div v-else class="text-muted italic">
        Example "{{ props.name }}" not found. Make sure it exists in app/components/content/examples/
      </div>
    </div>
  </div>
</template>
