---
title: useDialog
description: A composable for programmatic dialog management.
category: composable
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/your-username/nuxt-ui-elements/blob/main/src/runtime/composables/useDialog.ts
---

## Usage

The `useDialog` composable provides a simple API for showing alert and confirmation dialogs programmatically.

```vue
<script setup lang="ts">
const dialog = useDialog()

// Show an alert
dialog.alert({
  title: 'Success!',
  description: 'Your changes have been saved.',
  color: 'success'
})

// Show a confirmation
dialog.confirm({
  title: 'Delete Item?',
  description: 'This action cannot be undone.',
  color: 'error'
})
</script>
```

### Alert

The `alert` method displays an informational dialog with a single dismiss button.

```vue
<script setup lang="ts">
const dialog = useDialog()

async function showSuccess() {
  dialog.alert({
    icon: 'i-lucide-check-circle',
    title: 'Success!',
    description: 'Operation completed successfully.',
    color: 'success',
    label: 'Got it'
  })
}

async function showError() {
  dialog.alert({
    icon: 'i-lucide-alert-circle',
    title: 'Error',
    description: 'Something went wrong. Please try again.',
    color: 'error'
  })
}
</script>

<template>
  <div class="flex gap-2">
    <UButton @click="showSuccess">Show Success</UButton>
    <UButton @click="showError" color="error">Show Error</UButton>
  </div>
</template>
```

### Confirm

The `confirm` method displays a dialog with confirm and dismiss buttons. It supports async callbacks with automatic loading states.

```vue
<script setup lang="ts">
const dialog = useDialog()

async function confirmDelete() {
  dialog.confirm({
    title: 'Delete Item?',
    description: 'This action cannot be undone.',
    color: 'error',
    confirmLabel: 'Delete',
    dismissLabel: 'Cancel',
    onConfirm: async () => {
      // This can be an async function
      await deleteItem()
    },
    onDismiss: () => {
      console.log('User cancelled')
    }
  })
}
</script>

<template>
  <UButton color="error" @click="confirmDelete">
    Delete Item
  </UButton>
</template>
```

## API

### Returns

The composable returns an object with two methods:

| Method | Type | Description |
|--------|------|-------------|
| `alert` | `(options: DialogAlertProps) => void` | Show an alert dialog |
| `confirm` | `(options: DialogConfirmProps) => void` | Show a confirmation dialog |

### Alert Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `''` | Dialog title |
| `description` | `string` | `''` | Dialog description |
| `icon` | `string` | `undefined` | Icon to display |
| `label` | `string` | `'Ok'` | Dismiss button label |
| `color` | `'primary' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'neutral'` | Color theme |
| `onDismiss` | `() => void \| Promise<void>` | `undefined` | Callback when dismissed |

### Confirm Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `''` | Dialog title |
| `description` | `string` | `''` | Dialog description |
| `icon` | `boolean` | `true` | Show auto-selected icon |
| `confirmLabel` | `string` | `'Yes'` | Confirm button label |
| `dismissLabel` | `string` | `'No'` | Dismiss button label |
| `color` | `'primary' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'neutral'` | Color theme |
| `close` | `boolean` | `false` | Show close button |
| `onConfirm` | `() => void \| Promise<void>` | `undefined` | Callback when confirmed |
| `onDismiss` | `() => void \| Promise<void>` | `undefined` | Callback when dismissed |

## Examples

### Async Confirmation

The confirm dialog automatically shows loading and success states when `onConfirm` returns a Promise:

```vue
<script setup lang="ts">
const dialog = useDialog()

async function handleSave() {
  dialog.confirm({
    title: 'Save Changes?',
    description: 'Your changes will be saved to the server.',
    color: 'primary',
    confirmLabel: 'Save',
    dismissLabel: 'Cancel',
    onConfirm: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Dialog will show success state, then close automatically
    }
  })
}
</script>
```

### Different Colors

Each color theme has a default icon:

```vue
<script setup lang="ts">
const dialog = useDialog()

const examples = [
  { color: 'primary', title: 'Primary', description: 'This is a primary dialog' },
  { color: 'success', title: 'Success', description: 'Operation completed' },
  { color: 'warning', title: 'Warning', description: 'Please review' },
  { color: 'error', title: 'Error', description: 'Something went wrong' },
]

function showDialog(example: typeof examples[0]) {
  dialog.alert(example)
}
</script>
```
