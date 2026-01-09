# Nuxt UI Elements

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

**A growing collection of components and utilities that extend [@nuxt/ui](https://ui.nuxt.com) with enhanced functionality.**

This module extends Nuxt UI with additional components and utilities designed to integrate with Nuxt UI's design system.

> **Early Development Notice**: This project is in early development. APIs, component interfaces, and utilities are subject to change in future releases. Please use with caution in production environments.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 🧩 **Additional Components** - Extended component library built on top of Nuxt UI
- 🎨 **Themeable** - Seamlessly extends Nuxt UI's theme system with color variants
- 📦 **Tree-shakeable Utilities** - Standard utilities via `#std` for common tasks
- 🔄 **Auto-import** - Components and composables are automatically available
- 🎯 **TypeScript** - Full type safety out of the box
- 🌙 **Dark Mode** - Automatic theme switching compatible with Nuxt UI

## Requirements

This module requires [@nuxt/ui](https://ui.nuxt.com) v4.0.0 or higher.

## Installation

```bash
# pnpm
pnpm add nuxt-ui-elements

# npm
npm install nuxt-ui-elements

# yarn
yarn add nuxt-ui-elements
```

Add the module to your `nuxt.config.ts`:

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

That's it! You can now use Nuxt UI Elements in your Nuxt app ✨

> **Note:** The CSS import is required for Tailwind v4 to properly scan and generate styles from the component themes.

## Usage

Components and composables are automatically imported. Standard utilities (`#std`) are available via explicit imports.

### Dialog Components

The module provides two dialog components via the `useDialog` composable: Alert and Confirm dialogs.

#### Alert Dialog

Display informational messages to users:

```vue
<script setup>
const { alert } = useDialog()

function showAlert() {
  alert({
    title: 'Success!',
    description: 'Your changes have been saved.',
    icon: 'i-lucide-check-circle',
    label: 'Got it',
    color: 'success'
  })
}
</script>

<template>
  <UButton @click="showAlert">Show Alert</UButton>
</template>
```

**Alert Dialog API:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `''` | Dialog title |
| `description` | `string` | `''` | Dialog description/message |
| `icon` | `string` | `undefined` | Icon name (e.g., 'i-lucide-info') |
| `label` | `string` | `'Ok'` | Dismiss button label |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'error' \| 'neutral'` | `'neutral'` | Color theme |
| `variant` | `'solid' \| 'outline'` | `'solid'` | Dialog variant |
| `onDismiss` | `() => void \| Promise<void>` | `() => {}` | Callback when dismissed |
| `ui` | `object` | `{}` | Custom UI classes override |

#### Confirm Dialog

Request user confirmation with async support:

```vue
<script setup>
const { confirm } = useDialog()

async function handleDelete() {
  confirm({
    title: 'Delete Item',
    description: 'Are you sure? This action cannot be undone.',
    confirmLabel: 'Delete',
    dismissLabel: 'Cancel',
    color: 'error',
    onConfirm: async () => {
      // Async operations are supported
      await deleteItem()
      // Dialog shows loading state and success feedback automatically
    },
    onDismiss: () => {
      console.log('User cancelled')
    }
  })
}
</script>

<template>
  <UButton @click="handleDelete">Delete</UButton>
</template>
```

**Confirm Dialog API:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `''` | Dialog title |
| `description` | `string` | `''` | Dialog description/message |
| `icon` | `boolean` | `true` | Show icon (auto-selected based on color) |
| `confirmLabel` | `string` | `'Yes'` | Confirm button label |
| `dismissLabel` | `string` | `'No'` | Dismiss button label |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'error' \| 'neutral'` | `'neutral'` | Color theme |
| `variant` | `'solid' \| 'outline'` | `'solid'` | Dialog variant |
| `close` | `boolean` | `false` | Show close button in header |
| `onConfirm` | `() => void \| Promise<void>` | `() => {}` | Callback when confirmed (supports async) |
| `onDismiss` | `() => void \| Promise<void>` | `() => {}` | Callback when dismissed |
| `ui` | `object` | `{}` | Custom UI classes override |

**Async Support**: When `onConfirm` returns a Promise, the dialog automatically shows loading state and displays success/error feedback before closing.

## Standard Utilities (`#std`)

The module provides tree-shakeable utility functions via the `#std` alias. These are **not** auto-imported and must be explicitly imported.

### Date Utilities

Comprehensive date manipulation built on `@internationalized/date`. Import the entire module or individual functions:

```typescript
import std from '#std'

const nextMonth = std.date.add(std.date.today(), 1, 'month')
const formatted = std.date.format(new Date(), 'YYYY-MM-DD')

// Or import individual functions
import { add, format, today, relative } from '#std/date'

// Add/subtract time
const nextMonth = add(today(), 1, 'month')
const lastWeek = subtract(new Date(), 7, 'day')

// Format dates (Day.js-compatible tokens)
format(new Date(), 'YYYY-MM-DD')           // "2024-01-15"
format(new Date(), 'MMMM D, YYYY')         // "January 15, 2024"
format(new Date(), 'MMM DD, YYYY h:mm A')  // "Jan 15, 2024 3:30 PM"

// Relative time
relative(someDate)  // "2 days ago" or "in 3 months"

// Date comparisons
isBefore(date1, date2)
isAfter(date1, date2)
isSame(date1, date2)
isBetween(date, startDate, endDate)

// Date manipulation
set(someDate, { day: 15, month: 3 })
startOf(someDate, 'month')
endOf(someDate, 'week')

// Calculate differences
diff(date1, date2, 'days')  // number of days between dates

// Conversions
toDate(dateValue)              // Convert to JavaScript Date
asCalendarDate(date)           // Date without time
asCalendarDateTime(date)       // Date with time, no timezone
asZonedDateTime(date, 'UTC')   // Date with timezone

// Utilities
today()              // Current date
now()                // Current date and time
parse('2024-01-15')  // Parse date string
```

**Available Functions:**

| Function | Description |
|----------|-------------|
| `add(date, amount, unit)` | Add time to a date |
| `subtract(date, amount, unit)` | Subtract time from a date |
| `set(date, values)` | Set specific date/time values |
| `format(date, formatString, locale?)` | Format date with Day.js tokens |
| `relative(date, locale?)` | Get relative time string |
| `toDate(input, timeZone?)` | Convert to JavaScript Date |
| `asCalendarDate(input)` | Convert to date without time |
| `asCalendarDateTime(input)` | Convert to date with time |
| `asZonedDateTime(input, timeZone?)` | Convert to date with timezone |
| `isBefore(date1, date2)` | Check if date1 is before date2 |
| `isAfter(date1, date2)` | Check if date1 is after date2 |
| `isSame(date1, date2)` | Check if dates are equal |
| `isBetween(date, start, end, inclusive?)` | Check if date is in range |
| `diff(date1, date2, unit?)` | Calculate difference between dates |
| `startOf(date, unit, locale?)` | Get start of time period |
| `endOf(date, unit, locale?)` | Get end of time period |
| `today(timeZone?)` | Get today's date |
| `now(timeZone?)` | Get current date and time |
| `parse(dateString)` | Parse YYYY-MM-DD string |

Plus re-exported utilities: `isSameDay`, `isSameMonth`, `isSameYear`, `isToday`, `isWeekend`, `getDayOfWeek`, `getWeeksInMonth`, `getLocalTimeZone`

**Tree-shakeable**: All utilities under `#std` are tree-shakeable. Only imported functions will be included in your bundle, whether you import the entire module or individual functions.

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
