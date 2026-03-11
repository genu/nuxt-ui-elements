# Nuxt UI Elements

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

**A growing collection of components and utilities that extend [@nuxt/ui](https://ui.nuxt.com) with enhanced functionality.**

> **Early Development Notice**: This project is in early development. APIs, component interfaces, and utilities are subject to change in future releases. Please use with caution in production environments.

- [Release Notes](/CHANGELOG.md)

## Features

- 🧩 **Additional Components** - Extended component library built on top of Nuxt UI
- 🎨 **Themeable** - Seamlessly extends Nuxt UI's theme system with color variants
- 📦 **Tree-shakeable Utilities** - Standard utilities via `#std` for common tasks
- 🔄 **Auto-import** - Components and composables are automatically available
- 🎯 **TypeScript** - Full type safety out of the box
- 🌙 **Dark Mode** - Automatic theme switching compatible with Nuxt UI

## Requirements

This module requires [@nuxt/ui](https://ui.nuxt.com) v4.0.0 or higher.

## Quick Setup

Install the module:

```bash
pnpm add nuxt-ui-elements
```

Add it to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-ui-elements']
})
```

Import the module's CSS in your main CSS file (e.g., `assets/css/main.css`):

```css
@import "tailwindcss";
@import "@nuxt/ui";
@import "nuxt-ui-elements";
```

That's it! Components and composables are automatically available in your Nuxt app.

> **Note:** The CSS import is required for Tailwind v4 to properly scan and generate styles from the component themes.

## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  # Install dependencies
  pnpm install

  # Generate type stubs
  pnpm run dev:prepare

  # Develop with the playground
  pnpm run dev

  # Build the playground
  pnpm run dev:build

  # Run ESLint
  pnpm run lint

  # Run Vitest
  pnpm run test
  pnpm run test:watch

  # Release new version
  pnpm run release
  ```

</details>

## License

MIT

## Repository

[https://github.com/genu/nuxt-ui-elements](https://github.com/genu/nuxt-ui-elements)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-ui-elements/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-ui-elements
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-ui-elements.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-ui-elements
[license-src]: https://img.shields.io/npm/l/nuxt-ui-elements.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-ui-elements
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
