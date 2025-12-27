<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# Nuxt UI Elements

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A collection of beautiful, animated UI components for Nuxt applications. Built with Vue 3 and designed to work seamlessly with Nuxt UI.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- ✨ **FlickeringGrid** - Animated canvas-based grid background with gradient effects
- 🌟 **ShimmerButton** - Animated button with elegant shimmer effect
- 🎨 **Dark Mode Support** - Automatic theme switching with customizable colors
- 🚀 **Performance Optimized** - Uses IntersectionObserver and only animates when visible
- 📦 **Auto-import** - Components are automatically available in your app
- 🎯 **TypeScript** - Full type safety out of the box
- ⚡️ **Lightweight** - Zero external dependencies

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
pnpm add nuxt-ui-elements
```

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-ui-elements']
})
```

That's it! You can now use Nuxt UI Elements in your Nuxt app ✨

## Usage

### FlickeringGrid

A beautiful animated grid background component perfect for hero sections and landing pages.

```vue
<template>
  <div class="relative w-full h-screen">
    <UiElementsFlickeringGrid
      :square-size="7"
      :grid-gap="10"
      gradient-direction="left-right"
      gradient-end-color="white"
      :flicker-speed="0.2"
      class="z-0"
    />
    <div class="relative z-10">
      <!-- Your content here -->
    </div>
  </div>
</template>
```

#### Props

| Prop                     | Type     | Default        | Description                            |
| ------------------------ | -------- | -------------- | -------------------------------------- |
| `squareSize`             | `number` | `4`            | Size of each grid square in pixels     |
| `gridGap`                | `number` | `6`            | Gap between grid squares               |
| `flickerChance`          | `number` | `0.3`          | Probability of flicker per frame       |
| `flickerSpeed`           | `number` | `1`            | Animation speed multiplier             |
| `gradientDirection`      | `string` | `'left-right'` | Gradient direction (see options below) |
| `gradientStartColor`     | `string` | `'#aaf'`       | Light mode gradient start color        |
| `gradientEndColor`       | `string` | `'#fff'`       | Light mode gradient end color          |
| `flickerColor`           | `string` | `'#fff'`       | Light mode flicker color               |
| `darkGradientStartColor` | `string` | `'#23272f'`    | Dark mode gradient start color         |
| `darkGradientEndColor`   | `string` | `'#353b45'`    | Dark mode gradient end color           |
| `darkFlickerColor`       | `string` | `'#6b7280'`    | Dark mode flicker color                |
| `maxOpacity`             | `number` | `0.3`          | Maximum opacity of grid squares        |
| `width`                  | `number` | -              | Custom width (defaults to container)   |
| `height`                 | `number` | -              | Custom height (defaults to container)  |
| `class`                  | `string` | -              | Additional CSS classes                 |

#### Gradient Directions

- `left-right`
- `right-left`
- `top-bottom`
- `bottom-top`
- `in-out` (radial from center)
- `out-in` (radial to center)
- `top-left-bottom-right`
- `bottom-right-top-left`

### ShimmerButton

An animated button component with an elegant shimmer effect, perfect for call-to-action buttons and hero sections.

```vue
<template>
  <UEButtonShimmer
    label="Get Started"
    size="lg"
    shimmer-color="#60a5fa"
    background="rgba(59, 130, 246, 1)"
    :speed="2.5"
    @click="handleClick"
  />
</template>
```

#### Props

| Prop            | Type     | Default              | Description                                      |
| --------------- | -------- | -------------------- | ------------------------------------------------ |
| `label`         | `string` | -                    | Button label text                                |
| `shimmerColor`  | `string` | `'#ffffff'`          | Color of the shimmer effect                      |
| `shimmerSize`   | `string` | `'0.05em'`           | Size of the shimmer effect                       |
| `speed`         | `number` | `3`                  | Animation speed in seconds (lower = faster)      |
| `background`    | `string` | `'rgba(0, 0, 0, 1)'` | Background color of the button                   |
| `radius`        | `string` | `'100px'`            | Border radius of the button                      |
| `size`          | `string` | `'md'`               | Button size: `xs`, `sm`, `md`, `lg`, `xl`        |
| `class`         | `string` | -                    | Additional CSS classes                           |
| `ui`            | `object` | -                    | UI slot customization for advanced styling       |

#### Slots

- `leading` - Content before the label (e.g., icons)
- `default` - Main button content (overrides `label` prop)
- `trailing` - Content after the label (e.g., icons)

#### Events

- `click` - Emitted when the button is clicked

#### Examples

**Basic Usage:**
```vue
<UEButtonShimmer label="Click Me" />
```

**With Custom Colors:**
```vue
<UEButtonShimmer
  label="Primary Action"
  shimmer-color="#a78bfa"
  background="rgba(139, 92, 246, 1)"
/>
```

**Different Sizes:**
```vue
<UEButtonShimmer label="Small" size="sm" />
<UEButtonShimmer label="Medium" size="md" />
<UEButtonShimmer label="Large" size="lg" />
<UEButtonShimmer label="Extra Large" size="xl" />
```

**With Slots:**
```vue
<UEButtonShimmer>
  <template #leading>
    <Icon name="i-heroicons-arrow-right" />
  </template>
  Get Started
  <template #trailing>
    <Icon name="i-heroicons-arrow-right" />
  </template>
</UEButtonShimmer>
```

**Fast Animation:**
```vue
<UEButtonShimmer
  label="Fast Shimmer"
  :speed="1.5"
/>
```

## Configuration

You can customize the component prefix in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-ui-elements'],
  uiElements: {
    prefix: 'Custom' // Components will be named CustomFlickeringGrid
  }
})
```

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/my-module
[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/my-module
[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/my-module
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
