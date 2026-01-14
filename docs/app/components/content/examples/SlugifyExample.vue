<script setup lang="ts">
  import { slugify } from "#std"

  const input = ref("Hello World! How are you?")

  const output = computed(() => slugify(input.value))
</script>

<template>
  <div class="space-y-4">
    <UFormField label="Input text">
      <UInput v-model="input" placeholder="Enter text to slugify" />
    </UFormField>

    <div class="p-3 bg-muted/50 rounded-md">
      <div class="text-xs text-muted mb-1">Output</div>
      <code class="font-mono">{{ output }}</code>
    </div>
  </div>
</template>
