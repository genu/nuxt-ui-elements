---
title: Flow
description: A themed wrapper around vue-flow for building interactive node-based graphs and diagrams.
category: component
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/genu/nuxt-ui-elements/blob/main/src/runtime/components/Flow.vue
  - label: Vue Flow
    icon: i-simple-icons-github
    to: https://vueflow.dev
---

## Overview

`Flow` is a single component that wraps [Vue Flow](https://vueflow.dev) with Nuxt UI theming, built-in background, controls, and minimap. It provides a clean API where everything is configured through props — no need to manually compose multiple sub-components.

Requires `@vue-flow/core` and optionally `@vue-flow/background`, `@vue-flow/controls`, `@vue-flow/minimap` as peer dependencies.

## Installation

```bash
pnpm add @vue-flow/core @vue-flow/background @vue-flow/controls @vue-flow/minimap
```

## Examples

### Basic

A simple three-node flow. Background and controls are enabled by default — drag nodes and use the zoom controls.

:component-example{name="FlowBasicExample"}

### Colors & Variants

Nodes support all Nuxt UI theme colors and variants (`solid`, `outline`, `soft`, `subtle`). Edges can be animated. Minimap is enabled via `:minimap="true"`.

:component-example{name="FlowColorsExample"}

### Background Patterns

Toggle between `dots` and `lines` background patterns:

:component-example{name="FlowBackgroundExample"}

### Custom Nodes

Use any markup in node slots — here with avatars and metadata:

:component-example{name="FlowCustomNodeExample"}

## Node Colors & Variants

`FlowNode` supports all Nuxt UI theme colors and four visual variants:

:component-example{name="FlowNodeExample"}

### Selected State

Nodes can show a selection ring when the `selected` prop is true:

:component-example{name="FlowNodeSelectedExample"}

## Architecture

The `Flow` component exposes a single public API. Background, controls, and minimap are managed internally via props:

| Feature | Prop | Default | Config |
| --- | --- | --- | --- |
| Background | `background` | `true` | `true`, `false`, or `{ pattern, gap, size, color }` |
| Controls | `controls` | `true` | `true`, `false`, or `{ showZoom, showFitView, position }` |
| Minimap | `minimap` | `false` | `true`, `false`, or `{ pannable, zoomable, position }` |

Two companion components are available for use in node templates:

- **`FlowNode`** — Themed node card with color, variant, and selected state
- **`FlowHandle`** — Themed connection handle (source/target)

## API

### Flow Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` | `Node[]` | `[]` | Array of node objects |
| `edges` | `Edge[]` | `[]` | Array of edge objects |
| `nodeTypes` | `Record<string, any>` | - | Map of custom node type components |
| `edgeTypes` | `Record<string, any>` | - | Map of custom edge type components |
| `fitViewOnInit` | `boolean` | `true` | Fit view on initialization |
| `minZoom` | `number` | `0.2` | Minimum zoom level |
| `maxZoom` | `number` | `4` | Maximum zoom level |
| `nodesDraggable` | `boolean` | `true` | Whether nodes are draggable |
| `nodesConnectable` | `boolean` | `true` | Whether nodes are connectable |
| `elementsSelectable` | `boolean` | `true` | Whether elements are selectable |
| `connectionMode` | `ConnectionMode` | - | Connection mode |
| `defaultEdgeOptions` | `Record<string, any>` | - | Default edge options |
| `background` | `boolean \| object` | `true` | Show/configure background |
| `controls` | `boolean \| object` | `true` | Show/configure controls |
| `minimap` | `boolean \| object` | `false` | Show/configure minimap |
| `ui` | `object` | - | Theme slot overrides |

### Flow Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:nodes` | `Node[]` | Nodes changed |
| `update:edges` | `Edge[]` | Edges changed |
| `nodeClick` | `event` | Node was clicked |
| `edgeClick` | `event` | Edge was clicked |
| `paneClick` | `event` | Pane was clicked |
| `connect` | `params` | Connection was made |

### FlowNode Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | - | Label text |
| `color` | `string` | `'primary'` | Theme color |
| `variant` | `'solid' \| 'outline' \| 'soft' \| 'subtle'` | `'outline'` | Visual variant |
| `selected` | `boolean` | `false` | Selected state (shows ring) |
| `ui` | `object` | - | Theme slot overrides (`root`, `label`, `content`) |

### FlowHandle Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'source' \| 'target'` | **required** | Handle type |
| `position` | `Position` | `'bottom'` | Handle position (`top`, `bottom`, `left`, `right`) |
| `id` | `string` | - | Handle ID (for multiple handles per node) |
| `color` | `string` | `'primary'` | Theme color |
| `connected` | `boolean` | `false` | Whether a connection is active |
| `ui` | `object` | - | Theme slot overrides |

### Background Config

When `background` is an object:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `pattern` | `'dots' \| 'lines'` | `'dots'` | Background pattern |
| `gap` | `number \| number[]` | `20` | Pattern gap |
| `size` | `number` | `1` | Pattern size |
| `color` | `string` | - | Pattern color |
| `lineWidth` | `number` | - | Line width (for lines pattern) |

### Controls Config

When `controls` is an object:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `showZoom` | `boolean` | `true` | Show zoom buttons |
| `showFitView` | `boolean` | `true` | Show fit-view button |
| `showInteractive` | `boolean` | `true` | Show interactive toggle |
| `position` | `PanelPositionType` | `'bottom-left'` | Panel position |

### Minimap Config

When `minimap` is an object:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `pannable` | `boolean` | `true` | Enable drag to pan |
| `zoomable` | `boolean` | `true` | Enable zoom |
| `position` | `PanelPositionType` | `'bottom-right'` | Panel position |
| `nodeColor` | `string` | - | Node color in minimap |
| `width` | `number` | - | Minimap width |
| `height` | `number` | - | Minimap height |
