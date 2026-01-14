<script setup lang="ts">
const dialog = useDialog()

const colors = ['primary', 'success', 'warning', 'error', 'info', 'neutral'] as const

function showAlert(color: typeof colors[number]) {
  const icons: Record<typeof colors[number], string> = {
    primary: 'i-lucide-info',
    success: 'i-lucide-check-circle',
    warning: 'i-lucide-alert-triangle',
    error: 'i-lucide-x-circle',
    info: 'i-lucide-info',
    neutral: 'i-lucide-message-circle'
  }

  dialog.alert({
    icon: icons[color],
    title: `${color.charAt(0).toUpperCase() + color.slice(1)} Alert`,
    description: `This is a ${color} alert dialog.`,
    color
  })
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <UButton
      v-for="color in colors"
      :key="color"
      :color="color"
      @click="showAlert(color)"
    >
      {{ color }}
    </UButton>
  </div>
</template>
