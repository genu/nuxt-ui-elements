<script setup lang="ts">
  /**
   * Navbar component for component pages
   * Provides navigation between components with keyboard shortcuts
   */
  const route = useRoute()
  const router = useRouter()
  const { getAdjacentComponent } = useNavigation()

  // Extract component name from route
  const componentName = computed(() => {
    const path = route.path
    const parts = path.split("/")
    const name = parts[parts.length - 1]
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  })

  // Get previous and next components
  const previousComponent = computed(() => getAdjacentComponent(route.path, "previous"))
  const nextComponent = computed(() => getAdjacentComponent(route.path, "next"))

  // Navigate to previous/next component
  function navigateToPrevious() {
    if (previousComponent.value) {
      router.push(previousComponent.value.path)
    }
  }

  function navigateToNext() {
    if (nextComponent.value) {
      router.push(nextComponent.value.path)
    }
  }

  // Keyboard shortcuts (J = next, K = previous)
  onMounted(() => {
    function handleKeydown(event: KeyboardEvent) {
      // Only handle if not in an input/textarea
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.key === "j" && nextComponent.value) {
        navigateToNext()
      } else if (event.key === "k" && previousComponent.value) {
        navigateToPrevious()
      }
    }

    window.addEventListener("keydown", handleKeydown)

    onUnmounted(() => {
      window.removeEventListener("keydown", handleKeydown)
    })
  })
</script>

<template>
  <div class="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Component name -->
      <div>
        <h1 class="text-2xl font-bold">
          {{ componentName }}
        </h1>
      </div>

      <!-- Navigation buttons -->
      <div class="flex items-center gap-2">
        <UTooltip text="Previous (K)">
          <UButton
            icon="i-heroicons-arrow-left"
            color="neutral"
            variant="ghost"
            :disabled="!previousComponent"
            @click="navigateToPrevious" />
        </UTooltip>
        <UTooltip text="Next (J)">
          <UButton icon="i-heroicons-arrow-right" color="neutral" variant="ghost" :disabled="!nextComponent" @click="navigateToNext" />
        </UTooltip>
        <UTooltip text="View on GitHub">
          <UButton
            icon="i-heroicons-code-bracket"
            color="neutral"
            variant="ghost"
            to="https://github.com/yourusername/nuxt-ui-elements"
            target="_blank" />
        </UTooltip>
      </div>
    </div>
  </div>
</template>
