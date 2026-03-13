<script setup lang="ts">
  const dialog = useDialog()

  function showInfoAlert() {
    dialog.alert({
      icon: "i-lucide-info",
      title: "Information",
      description: "This is an informational alert dialog.",
      color: "primary",
    })
  }

  function showSuccessAlert() {
    dialog.alert({
      icon: "i-lucide-check-circle",
      title: "Success",
      description: "The operation completed successfully.",
      color: "success",
    })
  }

  function showWarningAlert() {
    dialog.alert({
      icon: "i-lucide-alert-triangle",
      title: "Warning",
      description: "Please review before continuing.",
      color: "warning",
    })
  }
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <UButton @click="showInfoAlert">
      Info Alert
    </UButton>

    <UButton color="success" @click="showSuccessAlert">
      Success Alert
    </UButton>

    <UButton color="warning" @click="showWarningAlert">
      Warning Alert
    </UButton>
  </div>
</template>
