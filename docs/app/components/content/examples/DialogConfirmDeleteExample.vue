<script setup lang="ts">
const dialog = useDialog()

async function handleDelete() {
  dialog.confirm({
    title: 'Delete Item?',
    description: 'This action cannot be undone. The item will be permanently deleted.',
    color: 'error',
    confirmLabel: 'Delete',
    dismissLabel: 'Keep',
    onConfirm: async () => {
      // Simulate API deletion
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
  })
}
</script>

<template>
  <UButton color="error" @click="handleDelete">
    Delete Item
  </UButton>
</template>
