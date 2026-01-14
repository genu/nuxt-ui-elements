<script setup lang="ts">
import { plur } from '#std'

const count = ref(1)

const examples = computed(() => [
  { word: 'item', result: plur('item', count.value) },
  { word: 'person/people', result: plur('person', count.value, 'people') },
  { word: 'child/children', result: plur('child', count.value, 'children') },
  { word: 'file', result: plur('file', count.value) }
])
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4">
      <UFormField label="Count">
        <UInput v-model.number="count" type="number" :min="0" class="w-24" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div
        v-for="example in examples"
        :key="example.word"
        class="p-3 bg-muted/50 rounded-md"
      >
        <div class="text-xs text-muted mb-1">{{ example.word }}</div>
        <div class="font-medium">{{ count }} {{ example.result }}</div>
      </div>
    </div>
  </div>
</template>
