---
title: DialogAlert
description: An informational dialog with a single dismiss button and optional icon.
category: component
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/genu/nuxt-ui-elements/blob/main/src/runtime/components/DialogAlert.vue
---

## Overview

`DialogAlert` is a modal dialog for displaying informational messages to the user. It renders centered content with an optional icon, title, description, and a single dismiss button.

This component is typically used via the [`useDialog`](/docs/composables/use-dialog) composable rather than directly in templates.

## Usage

### Via useDialog (Recommended)

```vue
<script setup>
const dialog = useDialog()

function showAlert() {
  dialog.alert({
    icon: 'i-lucide-check-circle',
    title: 'Success!',
    description: 'Your changes have been saved.',
    color: 'success'
  })
}
</script>

<template>
  <UButton @click="showAlert">Show Alert</UButton>
</template>
```

### Direct Usage

```vue
<template>
  <UEDialogAlert
    icon="i-lucide-info"
    title="Information"
    description="This is an informational message."
    color="primary"
  />
</template>
```

## Examples

### Basic Alert

:component-example{name="DialogAlertExample"}

### Colors

Use the `color` prop to change the alert's visual style. Each color works well with a matching icon.

:component-example{name="DialogAlertColorsExample"}

## API

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `''` | Dialog title text |
| `description` | `string` | `''` | Dialog description (supports HTML) |
| `icon` | `string` | `undefined` | Icon name to display above the title |
| `label` | `string` | `'Ok'` | Dismiss button label |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'error' \| 'neutral'` | `'neutral'` | Color theme |
| `variant` | `'solid' \| 'outline'` | `'solid'` | Visual variant |
| `onDismiss` | `() => void \| Promise<void>` | `undefined` | Callback when dialog is dismissed |
| `ui` | `object` | `undefined` | Custom classes for component slots |

### UI Slots

The `ui` prop accepts custom classes for the following slots:

| Slot | Description |
| --- | --- |
| `content` | Modal content wrapper |
| `header` | Header section |
| `body` | Body section |
| `footer` | Footer with dismiss button |
| `icon` | Icon element |
| `title` | Title text |
| `description` | Description text |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Emitted when open state changes |
| `close` | `any` | Emitted when dialog closes |

## Animation

DialogAlert uses a custom `animate-alert-bounce` entrance animation for a bouncy appearance when opening.
