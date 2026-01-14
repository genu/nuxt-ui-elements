<script setup lang="ts">
const dialog = useDialog()
const saved = ref(false)

async function handleSave() {
  dialog.confirm({
    title: 'Save Changes?',
    description: 'Your changes will be saved to the server.',
    color: 'primary',
    confirmLabel: 'Save',
    dismissLabel: 'Cancel',
    onConfirm: async () => {
      // Simulate API call - the button shows loading automatically
      await new Promise(resolve => setTimeout(resolve, 2000))
      saved.value = true
    }
  })
}
</script>

<template>
  <div class="flex items-center gap-4">
    <UButton @click="handleSave">
      Save Changes
    </UButton>
    <span v-if="saved" class="text-success text-sm">Changes saved!</span>
  </div>
</template>
