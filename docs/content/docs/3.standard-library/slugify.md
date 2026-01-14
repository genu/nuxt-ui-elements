---
title: slugify
description: Convert strings to URL-friendly slugs.
category: utility
links:
  - label: "@sindresorhus/slugify on npm"
    icon: i-simple-icons-npm
    to: https://www.npmjs.com/package/@sindresorhus/slugify
---

## Overview

The `slugify` utility converts strings to URL-friendly slugs. It's a re-export of the [@sindresorhus/slugify](https://github.com/sindresorhus/slugify) package by Sindre Sorhus.

:component-example{name="SlugifyExample"}

## Usage

```ts
import std from "#std"

std.slugify("Hello World") // 'hello-world'
std.slugify("I ♥ Dogs") // 'i-love-dogs'
std.slugify("Déjà Vu!") // 'deja-vu'
std.slugify("fooBar 123 $#%") // 'foo-bar-123'
```

## API

### `slugify(string, options?)`

| Parameter | Type     | Description            |
| --------- | -------- | ---------------------- |
| `string`  | `string` | The string to slugify  |
| `options` | `object` | Optional configuration |

### Options

| Option                      | Type      | Default | Description                         |
| --------------------------- | --------- | ------- | ----------------------------------- |
| `separator`                 | `string`  | `'-'`   | The separator to use                |
| `lowercase`                 | `boolean` | `true`  | Convert to lowercase                |
| `decamelize`                | `boolean` | `true`  | Convert camelCase to separate words |
| `preserveLeadingUnderscore` | `boolean` | `false` | Keep leading underscores            |

### Examples

```ts
import std from "#std"

// Custom separator
std.slugify("Hello World", { separator: "_" }) // 'hello_world'

// Preserve case
std.slugify("Hello World", { lowercase: false }) // 'Hello-World'

// Disable decamelize
std.slugify("fooBar", { decamelize: false }) // 'foobar'

// Preserve leading underscore
std.slugify("_foo bar", { preserveLeadingUnderscore: true }) // '_foo-bar'
```

## Common Use Cases

### Generate URL slugs

```ts
import std from "#std"

const title = "My Blog Post Title!"
const slug = std.slugify(title) // 'my-blog-post-title'
const url = `/blog/${slug}` // '/blog/my-blog-post-title'
```

### Create file-safe names

```ts
import std from "#std"

const fileName = std.slugify("Report Q1 2024.pdf", { separator: "_" })
// 'report_q1_2024_pdf'
```

### Generate IDs from labels

```ts
import std from "#std"

const sections = ["Getting Started", "API Reference", "FAQ & Support"]
const ids = sections.map((s) => std.slugify(s))
// ['getting-started', 'api-reference', 'faq-and-support']
```
