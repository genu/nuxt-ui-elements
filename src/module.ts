import { defineNuxtModule, addImportsDir, createResolver } from "@nuxt/kit"
import { addTemplates } from "./templates"

type Color = "primary" | "secondary" | "success" | "info" | "warning" | "error" | (string & {})

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Prefix for component names
   * @default 'UE'
   */
  prefix?: string
}

// Internal options with theme from Nuxt UI
interface ModuleOptionsWithTheme extends ModuleOptions {
  theme: {
    colors: Color[]
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-ui-elements",
    configKey: "uiElements",
  },
  defaults: {
    prefix: "UE",
  },
  moduleDependencies: {
    "@nuxt/ui": {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    // const logger = useLogger("nuxt-ui-elements")

    // Get theme colors from Nuxt UI's configuration
    const uiOptions = nuxt.options.ui as any
    const themeColors = uiOptions?.theme?.colors || ["primary", "secondary", "success", "info", "warning", "error"]

    // Pass Nuxt UI's theme to our templates
    const optionsWithTheme: ModuleOptionsWithTheme = {
      ...options,
      theme: {
        colors: themeColors,
      },
    }

    // Generate theme template files with proper type casting
    addTemplates(optionsWithTheme, nuxt)

    // Add CSS file with @source directives for Tailwind v4
    nuxt.options.css.push(resolver.resolve("./runtime/index.css"))

    // Auto-import composables (useDialog)
    addImportsDir(resolver.resolve("./runtime/composables"))
  },
})
