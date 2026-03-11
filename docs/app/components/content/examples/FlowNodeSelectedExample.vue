<script setup lang="ts">
  const selected = ref(false)
</script>

<template>
  <div class="flex items-center gap-4">
    <UEFlowNode label="Click to select" color="primary" variant="outline" :selected="selected" @click="selected = !selected">
      Toggle the selected state
    </UEFlowNode>
    <UEFlowNode label="Always Selected" color="success" variant="soft" :selected="true">
      With ring indicator
    </UEFlowNode>
  </div>
</template>
