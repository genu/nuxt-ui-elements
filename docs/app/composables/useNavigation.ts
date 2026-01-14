import type { ContentNavigationItem } from "@nuxt/content"

interface NavigationGroup {
  title: string
  children: ContentNavigationItem[]
}

const categoryLabels: Record<string, string> = {
  "getting-started": "Getting Started",
  components: "Components",
  composables: "Composables",
  "standard-library": "Standard Library",
  utilities: "Utilities",
}

function getCategorySlug(path: string): string {
  // Extract the category slug from path like "/docs/composables" -> "composables"
  const parts = path.split("/")
  return parts[parts.length - 1] || ""
}

export function useNavigation(navigation: Ref<ContentNavigationItem[]>) {
  const navigationByCategory = computed<NavigationGroup[]>(() => {
    if (!navigation.value?.length) {
      return []
    }

    // The navigation should be nested under a 'docs' root
    const docsNav = navigation.value.find((item) => item.path === "/docs")

    if (!docsNav?.children?.length) {
      return []
    }

    return docsNav.children.map((category) => {
      const slug = getCategorySlug(category.path || "")
      return {
        title: categoryLabels[slug] || category.title || "Untitled",
        children: category.children || [],
      }
    })
  })

  function findBreadcrumb(path: string): { label: string; to?: string }[] {
    const breadcrumb: { label: string; to?: string }[] = []

    function findInNav(items: ContentNavigationItem[], targetPath: string): boolean {
      for (const item of items) {
        if (item.path === targetPath) {
          breadcrumb.push({ label: item.title || "", to: item.path })
          return true
        }

        if (item.children?.length) {
          if (findInNav(item.children, targetPath)) {
            breadcrumb.unshift({ label: item.title || "", to: item.path })
            return true
          }
        }
      }
      return false
    }

    findInNav(navigation.value || [], path)

    return breadcrumb
  }

  function findSurround(path: string): (ContentNavigationItem | undefined)[] {
    const flatNav: ContentNavigationItem[] = []

    function flatten(items: ContentNavigationItem[]) {
      for (const item of items) {
        if (item.path && !item.path.endsWith("/index")) {
          flatNav.push(item)
        }
        if (item.children?.length) {
          flatten(item.children)
        }
      }
    }

    flatten(navigation.value || [])

    const currentIndex = flatNav.findIndex((item) => item.path === path)

    if (currentIndex === -1) {
      return [undefined, undefined]
    }

    return [
      currentIndex > 0 ? flatNav[currentIndex - 1] : undefined,
      currentIndex < flatNav.length - 1 ? flatNav[currentIndex + 1] : undefined,
    ]
  }

  return {
    navigationByCategory,
    findBreadcrumb,
    findSurround,
  }
}
