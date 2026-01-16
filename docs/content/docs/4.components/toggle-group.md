---
title: ToggleGroup
description: A slot-based selection primitive for building custom toggle interfaces.
category: component
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/your-username/nuxt-ui-elements/blob/main/src/runtime/components/ToggleGroup.vue
---

## Overview

`ToggleGroup` is a headless selection primitive. It manages selection state (single or multiple) and keyboard navigation, but you control all rendering via the default slot.

Built on [reka-ui](https://reka-ui.com)'s ToggleGroup primitive with full keyboard navigation (arrow keys), roving focus, and RTL support.

## Usage

```vue
<template>
  <UEToggleGroup v-model="selected" :items="items">
    <template #default="{ item, selected }">
      <div :class="selected ? 'bg-primary text-white' : 'bg-gray-100'">
        {{ item.label }}
      </div>
    </template>
  </UEToggleGroup>
</template>

<script setup lang="ts">
const selected = ref<string[]>([])
const items = [
  { value: 'bold', label: 'Bold' },
  { value: 'italic', label: 'Italic' },
  { value: 'underline', label: 'Underline' }
]
</script>
```

## When to Use ToggleGroup

### ToggleGroup vs Nuxt UI Components

Nuxt UI provides several selection components. Here's when to choose `ToggleGroup` instead:

| Component | Best For | Rendering |
| --- | --- | --- |
| `RadioGroup` | Standard radio button selections | Pre-styled with labels, descriptions, icons |
| `CheckboxGroup` | Multi-select with checkboxes | Pre-styled checkbox list |
| `ButtonGroup` | Grouping action buttons | Pre-styled button container (not a selection primitive) |
| **ToggleGroup** | Custom toggle interfaces (cards, images, icons) | **Slot-based - you control all rendering** |

### Use ToggleGroup when you need:

- **Custom visuals** - Cards, images, complex layouts that don't fit standard radio/checkbox styling
- **Toggle toolbars** - Icon-based formatting buttons, view switchers
- **Whole object binding** - When you need the entire object as v-model, not just a key
- **Full keyboard navigation** - Arrow keys, roving focus, RTL support out of the box

### Use Nuxt UI components when:

- Standard radio/checkbox appearance is sufficient
- You need built-in validation states and error styling
- Consistency with other Nuxt UI form components is important

## Examples

### Toolbar (Icon Buttons)

A formatting toolbar with icon-only buttons and multiple selection:

```vue
<template>
  <UEToggleGroup v-model="selected" :items="items" :ui="{ root: 'gap-1' }">
    <template #default="{ item, selected }">
      <div :class="[
        'p-2 rounded-md transition-colors',
        selected ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100'
      ]">
        <UIcon :name="item.icon" class="size-5" />
      </div>
    </template>
  </UEToggleGroup>
</template>

<script setup lang="ts">
const selected = ref(['bold'])
const items = [
  { value: 'bold', icon: 'i-lucide-bold' },
  { value: 'italic', icon: 'i-lucide-italic' },
  { value: 'underline', icon: 'i-lucide-underline' }
]
</script>
```

### Card Selection (Single)

Select one pricing plan using `:multiple="false"` for radio-like behavior:

```vue
<template>
  <UEToggleGroup v-model="selected" :items="plans" :multiple="false" :ui="{ root: 'gap-4' }">
    <template #default="{ item, selected }">
      <div :class="[
        'p-4 rounded-lg border-2 transition-all cursor-pointer min-w-48',
        selected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
      ]">
        <div class="font-semibold text-lg">{{ item.name }}</div>
        <div class="text-2xl font-bold text-primary my-2">{{ item.price }}/mo</div>
      </div>
    </template>
  </UEToggleGroup>
</template>

<script setup lang="ts">
const selected = ref('starter')
const plans = [
  { value: 'starter', name: 'Starter', price: '$9' },
  { value: 'pro', name: 'Pro', price: '$29' },
  { value: 'enterprise', name: 'Enterprise', price: '$99' }
]
</script>
```

### Whole Object Selection

When `value-key` is undefined, the whole object is used as the model value:

```vue
<template>
  <UEToggleGroup v-model="selectedTags" :items="tags" :value-key="undefined">
    <template #default="{ item, selected }">
      <div :class="[
        'px-3 py-1.5 rounded-full border transition-colors',
        selected ? 'bg-gray-900 text-white' : 'border-gray-300'
      ]">
        {{ item.name }}
      </div>
    </template>
  </UEToggleGroup>
</template>

<script setup lang="ts">
interface Tag {
  id: number
  name: string
  color: string
}

const tags: Tag[] = [
  { id: 1, name: 'Vue', color: 'green' },
  { id: 2, name: 'React', color: 'blue' },
  { id: 3, name: 'Svelte', color: 'orange' }
]

// selectedTags will be the actual Tag objects, not just values
const selectedTags = ref<Tag[]>([tags[0]])
</script>
```

## Form Integration

ToggleGroup integrates with Nuxt UI's `UForm` via `useFormField`. Wrap it in a `UFormField` for validation, error states, and form submission.

```vue
<template>
  <UForm :state="state" :schema="schema" @submit="onSubmit">
    <UFormField name="categories" label="Select Categories">
      <UEToggleGroup v-model="state.categories" :items="categories" name="categories">
        <template #default="{ item, selected }">
          <!-- Your custom rendering -->
        </template>
      </UEToggleGroup>
    </UFormField>
  </UForm>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `T[]` | `[]` | Array of items to display |
| `modelValue` | `string \| string[]` | - | Selected value(s), bindable with `v-model` |
| `valueKey` | `string \| undefined` | `'value'` | Key to extract value from items. When undefined, whole objects are used |
| `defaultValue` | `string \| string[]` | - | Initial value when uncontrolled |
| `multiple` | `boolean` | `true` | Allow multiple items to be selected |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction (affects keyboard navigation) |
| `loop` | `boolean` | `true` | Loop focus from last to first item |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `name` | `string` | - | Form field name for form integration |
| `required` | `boolean` | `false` | Mark as required for form validation |
| `ui` | `{ root?, item? }` | - | Custom classes for root and item wrappers |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| string[]` | Emitted when selection changes |
| `change` | `Event` | Native change event for form integration |

### Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | `{ item: T, selected: boolean }` | Render each item (required) |

## Keyboard Navigation

| Key | Action |
| --- | --- |
| `ArrowRight` / `ArrowDown` | Move focus to next item |
| `ArrowLeft` / `ArrowUp` | Move focus to previous item |
| `Home` | Move focus to first item |
| `End` | Move focus to last item |
| `Space` / `Enter` | Toggle selection of focused item |
