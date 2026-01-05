import { addTemplate } from "@nuxt/kit"
import type { Nuxt, NuxtTemplate } from "@nuxt/schema"
import { kebabCase } from "scule"
import type { ModuleOptions } from "./module"
import * as theme from "./theme"

export function addTemplates(options: ModuleOptions, _nuxt: Nuxt) {
  const templates: NuxtTemplate[] = []

  function writeThemeTemplate(themeModules: Record<string, any>) {
    for (const component in themeModules) {
      templates.push({
        filename: `ui-elements/${kebabCase(component)}.ts`,
        write: true,
        getContents: () => {
          const template = (themeModules as any)[component]
          const result = typeof template === "function" ? template(options as Required<ModuleOptions>) : template

          const variants = Object.entries(result.variants || {})
            .filter(([_, values]) => {
              const keys = Object.keys(values as Record<string, unknown>)
              return keys.some((key) => key !== "true" && key !== "false")
            })
            .map(([key]) => key)

          let json = JSON.stringify(result, null, 2)

          // Apply type casting for variants
          for (const variant of variants) {
            json = json.replace(new RegExp(`("${variant}": "[^"]+")`, "g"), `$1 as typeof ${variant}[number]`)
            json = json.replace(new RegExp(`("${variant}": \\[\\s*)((?:"[^"]+",?\\s*)+)(\\])`, "g"), (_, before, match, after) => {
              const replaced = match.replace(/("[^"]+")/g, `$1 as typeof ${variant}[number]`)
              return `${before}${replaced}${after}`
            })
          }

          // Generate variant declarations
          const variantDeclarations = variants
            .filter((variant) => json.includes(`as typeof ${variant}`))
            .map((variant) => {
              const keys = Object.keys(result.variants[variant])
              return `const ${variant} = ${JSON.stringify(keys, null, 2)} as const`
            })

          return [...variantDeclarations, `export default ${json}`].join("\n\n")
        },
      })
    }
  }

  // Generate theme files
  writeThemeTemplate(theme)

  // Generate CSS file with @source directive pointing to generated theme files
  templates.push({
    filename: "ui-elements.css",
    write: true,
    getContents: () => {
      return `@source "./ui-elements";

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
`
    },
  })

  // Add all templates to Nuxt
  templates.forEach((template) => addTemplate(template))
}
