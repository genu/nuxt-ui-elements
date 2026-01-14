<script setup lang="ts">
  const dialog = useDialog()

  const colors = ["primary", "success", "warning", "error", "info", "neutral"] as const
  const selectedColor = ref<(typeof colors)[number]>("primary")

  const colorIcons: Record<(typeof colors)[number], string> = {
    primary: "i-lucide-info",
    success: "i-lucide-check-circle",
    warning: "i-lucide-alert-triangle",
    error: "i-lucide-x-circle",
    info: "i-lucide-info",
    neutral: "i-lucide-message-circle",
  }

  function showAlert() {
    dialog.alert({
      icon: colorIcons[selectedColor.value],
      title: `${selectedColor.value.charAt(0).toUpperCase() + selectedColor.value.slice(1)} Alert`,
      description: `This is a ${selectedColor.value} alert dialog example.`,
      color: selectedColor.value,
    })
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="color in colors"
        :key="color"
        :color="color"
        :variant="selectedColor === color ? 'solid' : 'outline'"
        size="sm"
        @click="selectedColor = color">
        {{ color }}
      </UButton>
    </div>

    <UButton @click="showAlert"> Show {{ selectedColor }} Alert </UButton>
  </div>
</template>
