export interface NavigationItem {
  label: string
  to?: string
  icon?: string
  children?: NavigationItem[]
}

export interface ComponentItem {
  name: string
  path: string
  category: "overlays" | "forms" | "backgrounds" | "buttons" | "animations" | "composables" | "other"
}

export function useNavigation() {
  // List of all components organized by category
  const components: ComponentItem[] = [
    { name: "Dialog", path: "/components/dialog", category: "overlays" },
    { name: "Dialog Alert", path: "/components/dialog-alert", category: "overlays" },
    { name: "Toggle Group", path: "/components/toggle-group", category: "forms" },
  ]

  // Group components by category
  const componentsByCategory = computed(() => {
    const grouped: Record<string, ComponentItem[]> = {}
    components.forEach((component) => {
      if (!grouped[component.category]) {
        grouped[component.category] = []
      }
      grouped[component.category]!.push(component)
    })
    return grouped
  })

  // Main navigation structure
  const navigation = computed<NavigationItem[]>(() => {
    const links: NavigationItem[] = [
      {
        label: "Home",
        to: "/",
        icon: "i-heroicons-home",
      },
    ]

    // Add Overlays section
    if (componentsByCategory.value.overlays?.length) {
      links.push({
        label: "Overlays",
        icon: "i-heroicons-rectangle-stack",
        children: componentsByCategory.value.overlays.map((c) => ({
          label: c.name,
          to: c.path,
        })),
      })
    }

    // Add Forms section
    if (componentsByCategory.value.forms?.length) {
      links.push({
        label: "Forms",
        icon: "i-heroicons-pencil-square",
        children: componentsByCategory.value.forms.map((c) => ({
          label: c.name,
          to: c.path,
        })),
      })
    }

    // Add Composables section
    if (componentsByCategory.value.composables?.length) {
      links.push({
        label: "Composables",
        icon: "i-heroicons-code-bracket",
        children: componentsByCategory.value.composables.map((c) => ({
          label: c.name,
          to: c.path,
        })),
      })
    }

    return links
  })

  // Flat list of all component routes for navigation
  const componentRoutes = computed(() => components.map((c) => c.path))

  // Get next/previous component based on current route
  function getAdjacentComponent(currentPath: string, direction: "next" | "previous") {
    const currentIndex = components.findIndex((c) => c.path === currentPath)
    if (currentIndex === -1) return null

    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
    if (nextIndex < 0 || nextIndex >= components.length) return null

    return components[nextIndex]
  }

  return {
    navigation,
    components,
    componentsByCategory,
    componentRoutes,
    getAdjacentComponent,
  }
}
