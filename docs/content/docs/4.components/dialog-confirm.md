---
title: DialogConfirm
description: A confirmation dialog with async support, loading states, and auto-selected icons.
category: component
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/genu/nuxt-ui-elements/blob/main/src/runtime/components/DialogConfirm.vue
---

## Overview

`DialogConfirm` is a modal dialog for confirming user actions. It supports async callbacks with automatic loading and success states, color-based icon selection, and error handling with a shake animation.

This component is typically used via the [`useDialog`](/docs/composables/use-dialog) composable rather than directly in templates.

## Usage

### Via useDialog (Recommended)

```vue
<script setup>
const dialog = useDialog()

function confirmDelete() {
  dialog.confirm({
    title: 'Delete Item?',
    description: 'This action cannot be undone.',
    color: 'error',
    confirmLabel: 'Delete',
    dismissLabel: 'Cancel',
    onConfirm: async () => {
      await deleteItem()
    }
  })
}
</script>

<template>
  <UButton color="error" @click="confirmDelete">Delete</UButton>
</template>
```

## Examples

### Basic Confirm

:component-example{name="DialogConfirmExample"}

### Async Confirmation

When `onConfirm` returns a Promise, the confirm button automatically shows a loading spinner. On success, a checkmark appears before the dialog closes.

:component-example{name="DialogConfirmAsyncExample"}

### Delete Confirmation

A common pattern for destructive actions using the `error` color.

:component-example{name="DialogConfirmDeleteExample"}

## Auto-Selected Icons

When `icon` is `true` (the default), an icon is automatically selected based on the `color` prop:

| Color | Icon |
| --- | --- |
| `primary` | `i-lucide-info` |
| `secondary` | `i-lucide-info` |
| `success` | `i-lucide-circle-check` |
| `info` | `i-lucide-info` |
| `warning` | `i-lucide-triangle-alert` |
| `error` | `i-lucide-circle-x` |
| `neutral` | `i-lucide-info` |

Set `icon` to `false` to hide the icon entirely.

## Async Behavior

The confirm dialog handles async operations automatically:

1. When `onConfirm` returns a Promise, the confirm button shows a **loading spinner**
2. On success, the button shows a **checkmark** icon and "Complete" label
3. After a brief delay (800ms), the dialog closes automatically
4. On error, the dialog shows an **error state** with a shake animation, then resets after 2 seconds

## API

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `''` | Dialog title text |
| `description` | `string` | `''` | Dialog description (supports HTML) |
| `icon` | `boolean` | `true` | Show auto-selected icon based on color |
| `confirmLabel` | `string` | `'Yes'` | Confirm button label |
| `dismissLabel` | `string` | `'No'` | Dismiss button label |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'error' \| 'neutral'` | `'neutral'` | Color theme |
| `variant` | `'solid' \| 'outline'` | `'solid'` | Visual variant |
| `close` | `boolean` | `false` | Show close (X) button in the header |
| `onConfirm` | `() => void \| Promise<void>` | `undefined` | Callback when confirmed (supports async) |
| `onDismiss` | `() => void \| Promise<void>` | `undefined` | Callback when dismissed |
| `ui` | `object` | `undefined` | Custom classes for component slots |

### UI Slots

The `ui` prop accepts custom classes for the following slots:

| Slot | Description |
| --- | --- |
| `content` | Modal content wrapper |
| `header` | Header section |
| `body` | Body section |
| `footer` | Footer with action buttons |
| `icon` | Icon element |
| `title` | Title text |
| `description` | Description text |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Emitted when open state changes |
| `close` | `any` | Emitted when dialog closes |
