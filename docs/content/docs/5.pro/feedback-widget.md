---
title: FeedbackWidget
description: A drop-in feedback collection widget with customizable types, positioning, and server-side handling.
category: component
navigation:
  badge:
    label: Pro
    color: primary
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/genu/nuxt-ui-elements-pro/blob/main/src/runtime/components/FeedbackWidget.vue
---

## Overview

`FeedbackWidget` is a floating feedback form with built-in feedback type selection, email collection, and success/error states. It supports custom submit handlers, configurable positioning, and server-side endpoints with rate limiting.

## Demo

:component-example{name="FeedbackWidgetExample"}

## Position

The widget can be placed in any corner using the `position` prop.

:component-example{name="FeedbackWidgetPositionExample"}

## Custom Feedback Types

Override the default feedback types (Bug Report, Feature Request, General Feedback) with your own.

:component-example{name="FeedbackWidgetCustomTypesExample"}

## FeedbackType Interface

```ts
interface FeedbackType {
  /** Unique identifier */
  id: FeedbackTypeId
  /** Display label */
  label: string
  /** Icon name (e.g., 'i-lucide-bug') */
  icon?: string
  /** Short description */
  description?: string
}

type FeedbackTypeId = 'bug' | 'feature' | 'general' | (string & {})
```

### Default Types

The widget ships with three built-in feedback types:

| ID | Label | Icon |
| --- | --- | --- |
| `bug` | Bug Report | `i-lucide-bug` |
| `feature` | Feature Request | `i-lucide-lightbulb` |
| `general` | General Feedback | `i-lucide-message-circle` |

## FeedbackSubmission Interface

```ts
interface FeedbackSubmission {
  type: FeedbackTypeId
  email: string
  message: string
  screenshot?: string        // Base64 data URL
}
```

## API

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | HTML element or component to render as root |
| `feedbackTypes` | `FeedbackType[]` | default types | Available feedback type options |
| `position` | `FeedbackWidgetPosition` | `'bottom-right'` | Widget position on screen |
| `color` | `string` | `'primary'` | Theme color |
| `showScreenshot` | `boolean` | `false` | Enable screenshot capture |
| `buttonIcon` | `string` | `'i-lucide-message-square-plus'` | Trigger button icon |
| `buttonLabel` | `string` | `'Send feedback'` | Trigger button label |
| `title` | `string` | `'Send Feedback'` | Panel header title |
| `emailPlaceholder` | `string` | `'your@email.com'` | Email input placeholder |
| `messagePlaceholder` | `string` | `'Tell us what you think...'` | Message textarea placeholder |
| `onSubmit` | `(submission: FeedbackSubmission) => Promise<FeedbackSubmitResult> \| FeedbackSubmitResult` | - | Custom submit handler |
| `submitEndpoint` | `string` | `'/api/_feedback'` | Server endpoint for form submission |
| `ui` | `object` | - | Custom classes for component slots |

### FeedbackWidgetPosition

```ts
type FeedbackWidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
```

### FeedbackSubmitResult

```ts
interface FeedbackSubmitResult {
  success: boolean
  error?: string
}
```

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `open` | - | Fired when the widget panel opens |
| `close` | - | Fired when the widget panel closes |
| `success` | `FeedbackSubmission` | Fired after a successful submission |
| `error` | `string` | Fired when submission fails |

### Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | `FeedbackWidgetContext` | Compound mode: full rendering control |
| `button` | `{ open, close, toggle, isOpen }` | Custom trigger button |
| `panel-header` | `{ title, close }` | Custom panel header |
| `type-selector` | `{ types, selected, select }` | Custom type selection UI |
| `form` | `{ email, message, screenshot }` | Custom form content |
| `success` | `{ reset, close }` | Custom success state |
| `submit-area` | `{ submit, isValid, isSubmitting }` | Custom submit button area |

### Exposed API

```ts
defineExpose({
  open: () => void
  close: () => void
  toggle: () => void
  reset: () => void
  submit: () => Promise<void>
  isOpen: Ref<boolean>
  isSubmitted: Ref<boolean>
})
```
