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

```ts
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
```

## Alert

The `alert` method displays an informational dialog with a single dismiss button.

:component-example{name="DialogAlertExample"}

### Colors

Use the `color` prop to change the alert color. Each color has a corresponding default icon.

:component-example{name="DialogAlertColorsExample"}

## Confirm

The `confirm` method displays a dialog with confirm and dismiss buttons. It supports async callbacks with automatic loading states.

:component-example{name="DialogConfirmExample"}

### Async Confirmation

The confirm dialog automatically shows a loading state when `onConfirm` returns a Promise.

:component-example{name="DialogConfirmAsyncExample"}

### Delete Confirmation

A common pattern for destructive actions with error color.

:component-example{name="DialogConfirmDeleteExample"}

## API

### Returns

The composable returns an object with two methods:

| Method    | Type                                    | Description                |
| --------- | --------------------------------------- | -------------------------- |
| `alert`   | `(options: DialogAlertProps) => void`   | Show an alert dialog       |
| `confirm` | `(options: DialogConfirmProps) => void` | Show a confirmation dialog |

### Alert Options

| Option        | Type                                                          | Default     | Description             |
| ------------- | ------------------------------------------------------------- | ----------- | ----------------------- |
| `title`       | `string`                                                      | `''`        | Dialog title            |
| `description` | `string`                                                      | `''`        | Dialog description      |
| `icon`        | `string`                                                      | `undefined` | Icon to display         |
| `label`       | `string`                                                      | `'Ok'`      | Dismiss button label    |
| `color`       | `'primary' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'neutral'` | Color theme             |
| `onDismiss`   | `() => void \| Promise<void>`                                 | `undefined` | Callback when dismissed |

### Confirm Options

| Option         | Type                                                          | Default     | Description             |
| -------------- | ------------------------------------------------------------- | ----------- | ----------------------- |
| `title`        | `string`                                                      | `''`        | Dialog title            |
| `description`  | `string`                                                      | `''`        | Dialog description      |
| `icon`         | `boolean`                                                     | `true`      | Show auto-selected icon |
| `confirmLabel` | `string`                                                      | `'Yes'`     | Confirm button label    |
| `dismissLabel` | `string`                                                      | `'No'`      | Dismiss button label    |
| `color`        | `'primary' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'neutral'` | Color theme             |
| `close`        | `boolean`                                                     | `false`     | Show close button       |
| `onConfirm`    | `() => void \| Promise<void>`                                 | `undefined` | Callback when confirmed |
| `onDismiss`    | `() => void \| Promise<void>`                                 | `undefined` | Callback when dismissed |
