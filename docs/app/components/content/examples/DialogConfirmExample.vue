<script setup lang="ts">
  const dialog = useDialog()
  const result = ref<string>("")

  async function showSyncConfirm() {
    result.value = ""
    dialog.confirm({
      title: "Confirm Action",
      description: "Are you sure you want to proceed?",
      color: "primary",
      onConfirm: () => {
        result.value = "Confirmed!"
      },
      onDismiss: () => {
        result.value = "Dismissed"
      },
    })
  }

  async function showAsyncConfirm() {
    result.value = ""
    dialog.confirm({
      title: "Save Changes?",
      description: "Your changes will be saved to the server.",
      color: "success",
      confirmLabel: "Save",
      dismissLabel: "Cancel",
      onConfirm: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        result.value = "Changes saved!"
      },
      onDismiss: () => {
        result.value = "Cancelled"
      },
    })
  }

  async function showDeleteConfirm() {
    result.value = ""
    dialog.confirm({
      title: "Delete Item?",
      description: "This action cannot be undone. The item will be permanently deleted.",
      color: "error",
      confirmLabel: "Delete",
      dismissLabel: "Keep",
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        result.value = "Item deleted!"
      },
      onDismiss: () => {
        result.value = "Item kept"
      },
    })
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <UButton @click="showSyncConfirm"> Simple Confirm </UButton>

      <UButton color="success" @click="showAsyncConfirm"> Async Confirm </UButton>

      <UButton color="error" @click="showDeleteConfirm"> Delete Confirm </UButton>
    </div>

    <div v-if="result" class="p-3 bg-muted rounded-md">
      <span class="text-sm">Result: {{ result }}</span>
    </div>
  </div>
</template>
