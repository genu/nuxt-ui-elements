# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**nuxt-ui-elements** is a Nuxt module that provides a collection of beautiful, animated UI components designed to work seamlessly on top of Nuxt UI. The goal is to create reusable, elegant components that can be installed via npm and used across multiple Nuxt applications.

This project heavily depends on nuxt ui, consider it's codebase for most features: /Users/AV6AB7Z/Documents/git.nosync/os/ui

## Project Goals

1. **Modular Component Library**: Build a growing collection of UI components that extend Nuxt UI's capabilities
2. **Elegant API Design**: Provide clean, intuitive APIs that are easy to use with sensible defaults
3. **Auto-Import Components**: Components should be automatically available without manual imports
4. **TypeScript First**: Full type safety with comprehensive TypeScript interfaces
5. **Performance Optimized**: Components should be lightweight and performant
6. **Dark Mode Support**: Automatic theme switching compatible with Nuxt UI's color mode
7. **NPM Ready**: Package should be publishable to npm and installable via `pnpm add nuxt-ui-elements`

## Commands

### Development

```bash
pnpm install             # Install dependencies
pnpm run dev:prepare     # Build module stub and prepare playground
pnpm run dev             # Start playground dev server
pnpm run dev:build       # Build playground for production
```

### Building & Publishing

```bash
pnpm run prepack         # Build module for distribution
pnpm run lint            # Run ESLint
pnpm run test            # Run Vitest tests
pnpm run test:watch      # Run tests in watch mode
pnpm run test:types      # Type check with vue-tsc
pnpm run release         # Release new version (lint + test + build + publish)
```

## Architecture Overview

### Tech Stack

- **Nuxt Module Builder** - For creating the Nuxt module
- **Vue 3.5** - Component framework
- **TypeScript** - Type safety
- **Nuxt Kit** - Module utilities (@nuxt/kit)
- **Vitest** - Testing framework
- **ESLint** - Code linting

### Directory Structure

```
/src                     # Module source code
  ├── module.ts          # Main module definition and configuration
  └── runtime/           # Runtime code (available to users)
      └── components/    # Vue components that get auto-imported

/playground              # Test application for development
  ├── app.vue            # Main playground app
  └── nuxt.config.ts     # Playground Nuxt config

/test                    # Test files
/dist                    # Built module (gitignored, created on build)
```

### Module Architecture

#### Module Definition (`src/module.ts`)

- Uses `defineNuxtModule` from `@nuxt/kit`
- Configurable component prefix (default: `UiElements`)
- Auto-registers components using `addComponent()`
- Components are resolved from `./runtime/components/`

#### Component Naming Convention

Components are auto-registered with the configured prefix:

- Source: `FlickeringGrid.vue`
- Registered as: `UiElementsFlickeringGrid` (or `{prefix}FlickeringGrid`)

#### Module Configuration

Users can customize the module in their `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ["nuxt-ui-elements"],
  uiElements: {
    prefix: "Custom", // Changes component names to CustomFlickeringGrid, etc.
  },
})
```

## Current Components

### FlickeringGrid

**Location**: `src/runtime/components/FlickeringGrid.vue`

An animated canvas-based grid background component with customizable gradients and flicker effects.

**Key Features**:

- Canvas-based rendering for performance
- Customizable grid size, gap, and animation speed
- Gradient support (8 directional modes)
- Dark mode with separate color schemes
- IntersectionObserver for performance (only animates when visible)
- ResizeObserver for responsive behavior
- Optional Nuxt UI color mode integration

**Props Interface**: `FlickeringGridProps`

- All props are optional with sensible defaults
- TypeScript interface exported for reuse

**Design Principles**:

1. **Internal Complexity, External Simplicity**: Complex canvas logic hidden behind simple props
2. **Sensible Defaults**: Works out of the box with minimal configuration
3. **Flexible Customization**: Every visual aspect can be customized via props
4. **Performance First**: Uses observers to optimize rendering
5. **Framework Integration**: Detects and uses Nuxt UI's color mode when available

## Adding New Components

### Steps to Add a Component

1. **Create Component File**
   - Add `.vue` file in `src/runtime/components/`
   - Use `<script setup lang="ts">` for composition API
   - Export TypeScript interface for props (e.g., `export interface ComponentNameProps`)
   - Use `withDefaults(defineProps<Props>(), { ... })` for prop defaults

2. **Register in Module**
   - Add component to the `components` array in `src/module.ts`
   - Follow naming convention: `{ name: 'ComponentName', export: 'default' }`

3. **Update Documentation**
   - Add component section to README.md
   - Document all props with types, defaults, and descriptions
   - Provide usage examples
   - Add to feature list

4. **Test in Playground**
   - Add component usage to `playground/app.vue`
   - Test different prop combinations
   - Verify auto-import works

5. **Add Tests** (if applicable)
   - Create test file in `/test/`
   - Test component rendering and prop behavior

### Component Guidelines

- **TypeScript**: Always use TypeScript with exported prop interfaces
- **Props**: Use `withDefaults()` for all optional props
- **Naming**: PascalCase for component files and prop interfaces
- **Performance**: Consider using `onMounted`, `onBeforeUnmount` for lifecycle
- **Accessibility**: Follow ARIA guidelines where applicable
- **Dark Mode**: Support both light and dark themes when relevant
- **Documentation**: JSDoc comments on prop interfaces

## Development Workflow

### Working on Existing Components

1. Make changes to component in `src/runtime/components/`
2. Playground auto-reloads with changes (dev mode uses stub build)
3. Test in playground at `http://localhost:3000` (or assigned port)
4. Run `pnpm run test:types` to verify TypeScript
5. Run `pnpm run lint` before committing

### Testing Changes

The playground is a full Nuxt application that imports your module locally:

- Changes to components reflect immediately in dev mode
- Test all prop combinations
- Verify auto-import functionality
- Check dark mode behavior
- Test responsive behavior

### Building for Production

Before publishing or using in another project:

```bash
pnpm run prepack
```

This builds the module to `/dist/` with:

- Transpiled module code (`module.mjs`)
- TypeScript declarations (`types.d.mts`)
- Optimized for distribution

## Integration with Nuxt UI

This module is designed to **complement** Nuxt UI, not replace it:

- **Uses Nuxt UI utilities** when available (e.g., `useColorMode()`)
- **Fallback behavior**: Works without Nuxt UI but integrates when present
- **Styling compatibility**: Components use Tailwind classes compatible with Nuxt UI
- **Design consistency**: Follow Nuxt UI's design patterns and conventions

### Color Mode Integration

Components detect Nuxt UI's color mode:

```typescript
// Try to use Nuxt UI's useColorMode
const isDark = ref(false)
if (import.meta.client) {
  try {
    const colorMode = useColorMode?.()
    if (colorMode) {
      isDark = computed(() => colorMode.value === "dark")
    }
  } catch {
    // Fallback to prefers-color-scheme
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
  }
}
```

## Publishing to NPM

### Before Publishing

1. Update version in `package.json` (follow semver)
2. Update `CHANGELOG.md` with changes
3. Run full test suite: `pnpm run test`
4. Build module: `pnpm run prepack`
5. Verify `/dist/` contains expected files

### Publishing

```bash
# Automated (runs lint, test, build, changelogen)
pnpm run release

# Manual
npm publish
```

### Post-Publishing

1. Tag release in git
2. Update documentation with new features
3. Test installation in a fresh project:
   ```bash
   pnpm add nuxt-ui-elements
   ```

## Using in Another Project

### During Development (Before Publishing)

1. In this module directory:

   ```bash
   pnpm run dev:prepare  # Build stub
   pnpm link --global    # Create global link
   ```

2. In your target project:

   ```bash
   pnpm link --global nuxt-ui-elements
   ```

3. Add to target project's `nuxt.config.ts`:
   ```typescript
   export default defineNuxtConfig({
     modules: ["nuxt-ui-elements"],
   })
   ```

### After Publishing

```bash
pnpm add nuxt-ui-elements
```

Then configure in `nuxt.config.ts` as shown above.

## Common Patterns

### Creating an Animated Component

```vue
<script setup lang="ts">
  export interface MyComponentProps {
    // Props with defaults
    speed?: number
    color?: string
  }

  const props = withDefaults(defineProps<MyComponentProps>(), {
    speed: 1,
    color: "#000",
  })

  // Animation setup
  let animationFrameId: number | undefined

  function animate() {
    // Animation logic
    animationFrameId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    animate()
  })

  onBeforeUnmount(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  })
</script>

<template>
  <div>
    <!-- Component markup -->
  </div>
</template>
```

### Using Observers for Performance

```typescript
const isInView = ref(false)
let intersectionObserver: IntersectionObserver | undefined

onMounted(() => {
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      isInView.value = entries[0]?.isIntersecting ?? false
    },
    { threshold: 0 },
  )
  intersectionObserver.observe(elementRef.value!)
})

onBeforeUnmount(() => {
  intersectionObserver?.disconnect()
})
```

## Important Notes

- **Always run `dev:prepare` first**: This builds the module stub and generates types
- **Module uses ESM**: Configuration uses `type: "module"` in package.json
- **TypeScript strict mode**: Follow strict TypeScript practices
- **No external dependencies**: Keep the module lightweight (only @nuxt/kit in dependencies)
- **Components are auto-imported**: Users don't need to import components manually
- **Prefix is configurable**: Don't hardcode component names in documentation
- **Test before publishing**: Always test in playground and run full test suite

## Troubleshooting

### Types not updating

```bash
pnpm run dev:prepare
```

### Component not auto-importing

- Check component is registered in `src/module.ts`
- Verify file path matches registration
- Run `pnpm run dev:prepare`
- Restart dev server

### Build errors

- Ensure all imports are correct
- Check TypeScript types are valid
- Run `pnpm run test:types`

### Playground not loading component

- Check component is in `src/runtime/components/`
- Verify module is configured in `playground/nuxt.config.ts`
- Check for TypeScript/runtime errors in console
