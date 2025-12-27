export interface NavigationItem {
  label: string
  to?: string
  icon?: string
  children?: NavigationItem[]
}

export interface ComponentItem {
  name: string
  path: string
  category: 'backgrounds' | 'buttons' | 'other'
}

export function useNavigation() {
  // List of all components organized by category
  const components: ComponentItem[] = [
    { name: 'Aurora', path: '/components/aurora', category: 'backgrounds' },
    { name: 'Flickering Grid', path: '/components/flickering-grid', category: 'backgrounds' },
  ]

  // Group components by category
  const componentsByCategory = computed(() => {
    const grouped: Record<string, ComponentItem[]> = {}
    components.forEach(component => {
      if (!grouped[component.category]) {
        grouped[component.category] = []
      }
      grouped[component.category].push(component)
    })
    return grouped
  })

  // Main navigation structure
  const navigation = computed<NavigationItem[]>(() => {
    const links: NavigationItem[] = [
      {
        label: 'Home',
        to: '/',
        icon: 'i-heroicons-home'
      }
    ]

    // Add Backgrounds section
    if (componentsByCategory.value.backgrounds?.length) {
      links.push({
        label: 'Backgrounds',
        icon: 'i-heroicons-photo',
        children: componentsByCategory.value.backgrounds.map(c => ({
          label: c.name,
          to: c.path
        }))
      })
    }

    // Add Buttons section
    if (componentsByCategory.value.buttons?.length) {
      links.push({
        label: 'Buttons',
        icon: 'i-heroicons-cursor-arrow-ripple',
        children: componentsByCategory.value.buttons.map(c => ({
          label: c.name,
          to: c.path
        }))
      })
    }

    return links
  })

  // Flat list of all component routes for navigation
  const componentRoutes = computed(() => components.map(c => c.path))

  // Get next/previous component based on current route
  function getAdjacentComponent(currentPath: string, direction: 'next' | 'previous') {
    const currentIndex = components.findIndex(c => c.path === currentPath)
    if (currentIndex === -1) return null

    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    if (nextIndex < 0 || nextIndex >= components.length) return null

    return components[nextIndex]
  }

  return {
    navigation,
    components,
    componentsByCategory,
    componentRoutes,
    getAdjacentComponent
  }
}
