---
title: plur
description: Pluralize strings based on count.
category: utility
links:
  - label: plur on npm
    icon: i-simple-icons-npm
    to: https://www.npmjs.com/package/plur
---

## Overview

The `plur` utility pluralizes words based on a count. It's a re-export of the [plur](https://github.com/sindresorhus/plur) package by Sindre Sorhus.

:component-example{name="PlurExample"}

## Usage

```ts
import std from "#std"

std.plur("unicorn", 1) // 'unicorn'
std.plur("unicorn", 2) // 'unicorns'
std.plur("puppy", 2) // 'puppies'
std.plur("box", 2) // 'boxes'
```

## API

### `plur(word, count, plural?)`

| Parameter | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| `word`    | `string` | The word to pluralize                  |
| `count`   | `number` | The count to determine singular/plural |
| `plural`  | `string` | Optional custom plural form            |

### Examples

```ts
import std from "#std"

// Basic usage
std.plur("file", 0) // 'files'
std.plur("file", 1) // 'file'
std.plur("file", 5) // 'files'

// Irregular plurals are handled automatically
std.plur("child", 2) // 'children'
std.plur("person", 2) // 'people'
std.plur("goose", 2) // 'geese'

// Custom plural form
std.plur("pokemon", 2, "pokemon") // 'pokemon'
```

## Common Use Cases

### Display counts with labels

```ts
import std from "#std"

const fileCount = 5
const message = `${fileCount} ${std.plur("file", fileCount)} selected`
// "5 files selected"
```

### In Vue templates

```vue
<script setup>
  import std from "#std"

  const items = ref([])
</script>

<template>
  <p>{{ items.length }} {{ std.plur("item", items.length) }} in cart</p>
</template>
```
