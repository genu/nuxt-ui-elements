---
title: OrgChart
description: An interactive organization chart with zoom, search, drag-and-drop, and keyboard navigation.
category: component
navigation:
  badge:
    label: Pro
    color: primary
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/genu/nuxt-ui-elements-pro/blob/main/src/runtime/components/OrgChart.vue
---

## Overview

`OrgChart` renders a hierarchical tree from flat node data. It supports multiple layout directions, connector styles, node selection, search filtering, drag-and-drop rearrangement, zoom/pan, and keyboard navigation.

## Demo

:component-example{name="OrgChartExample"}

## Direction

The chart supports four layout directions: `vertical` (default), `horizontal`, `bottom-up`, and `right-to-left`.

:component-example{name="OrgChartDirectionExample"}

## Connector Styles

Choose between `right-angle` (default), `curved`, or `straight` connector lines between nodes.

:component-example{name="OrgChartConnectorStyleExample"}

## Selection

Enable node selection with `selection-mode`. Supports `none` (default), `single`, and `multiple`.

:component-example{name="OrgChartSelectionExample"}

## Drag and Drop

Set `draggable` to allow rearranging the hierarchy by dragging nodes onto new parents.

:component-example{name="OrgChartDragDropExample"}

## Search

Pass a `search-query` to filter and highlight matching nodes. The tree auto-expands to reveal matches, and non-matching nodes are dimmed.

:component-example{name="OrgChartSearchExample"}

## Connections

Add non-hierarchical connections (e.g., dotted-line reporting) between any two nodes using the `connections` prop.

:component-example{name="OrgChartConnectionsExample"}

## OrgChartNode Interface

Nodes are provided as a flat array with `parentId` references:

```ts
interface OrgChartNode {
  /** Unique identifier */
  id: string | number
  /** Parent node ID. `null` for the root node. */
  parentId: string | number | null
  /** Display name */
  name: string
  /** Optional secondary text (e.g., job title) */
  title?: string
  /** Avatar image URL */
  avatar?: string
  /** Icon name (e.g., `i-lucide-user`) */
  icon?: string
  /** Nuxt UI color override for this node */
  color?: string
  /** Arbitrary user-defined metadata passed through to slots */
  metadata?: Record<string, unknown>
}
```

## OrgChartConnection Interface

```ts
interface OrgChartConnection {
  /** Unique identifier */
  id: string | number
  /** Source node ID */
  fromId: string | number
  /** Target node ID */
  toId: string | number
  /** Optional label displayed on the connection */
  label?: string
  /** Line style @defaultValue 'dashed' */
  style?: 'dashed' | 'dotted' | 'solid'
  /** Nuxt UI color for this connection */
  color?: string
}
```

## API

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | HTML element or component to render as root |
| `nodes` | `OrgChartNode[]` | `[]` | Flat array of org chart nodes |
| `connections` | `OrgChartConnection[]` | `[]` | Non-hierarchical connections between nodes |
| `direction` | `'vertical' \| 'horizontal' \| 'bottom-up' \| 'right-to-left'` | `'vertical'` | Layout direction |
| `connectorStyle` | `'right-angle' \| 'curved' \| 'straight'` | `'right-angle'` | Connector line style |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Node selection mode |
| `compact` | `boolean` | `false` | Compact mode with reduced spacing |
| `draggable` | `boolean` | `false` | Enable drag-and-drop rearrangement |
| `animated` | `boolean` | `true` | Enable animations |
| `color` | `string` | `'primary'` | Theme color |
| `expanded` | `(string \| number)[]` | - | Two-way binding for expanded node IDs |
| `selected` | `(string \| number)[]` | - | Two-way binding for selected node IDs |
| `searchQuery` | `string` | - | Search query to filter and highlight nodes |
| `layoutConfig` | `OrgChartLayoutConfig` | - | Layout configuration overrides |
| `zoomConfig` | `OrgChartZoomConfig` | - | Zoom/pan configuration |
| `ui` | `object` | - | Custom classes for component slots |

### LayoutConfig

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `siblingGap` | `number` | `40` | Horizontal gap between siblings (px) |
| `levelGap` | `number` | `60` | Vertical gap between levels (px) |
| `nodeWidth` | `number` | `200` | Node width (px) |
| `nodeHeight` | `number` | `80` | Node height (px) |
| `connectorRadius` | `number` | `8` | Corner radius for right-angle connectors (px) |

### ZoomConfig

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Enable zoom/pan |
| `min` | `number` | `0.25` | Minimum zoom scale |
| `max` | `number` | `2` | Maximum zoom scale |
| `initial` | `number` | `1` | Initial zoom scale |
| `step` | `number` | `0.1` | Zoom step per scroll tick |
| `controls` | `boolean` | `true` | Show zoom controls overlay |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:expanded` | `(string \| number)[]` | Fired when expanded node IDs change |
| `update:selected` | `(string \| number)[]` | Fired when selected node IDs change |
| `node-click` | `OrgChartNode` | Fired when a node is clicked |
| `node-expand` | `{ node, expanded }` | Fired when a node is expanded or collapsed |
| `node-select` | `{ node, selected }` | Fired when a node is selected or deselected |
| `node-drop` | `{ node, oldParentId, newParentId }` | Fired when a node is dropped onto a new parent |
| `connection-click` | `OrgChartConnection` | Fired when a connection is clicked |

### Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | `OrgChartContext` | Compound mode: full rendering control |
| `node` | `{ node, treeNode, selected, expanded, focused, matched, dimmed }` | Custom node card content |
| `avatar` | `{ node }` | Custom avatar area |
| `label` | `{ node, highlight }` | Custom label |
| `description` | `{ node, highlight }` | Custom description |
| `connector` | `{ connectors }` | Custom connector rendering |
| `connection` | `{ connections }` | Custom connection rendering |
| `connection-label` | `{ connection, x, y }` | Custom connection label |
| `collapse-toggle` | `{ expanded, count, node }` | Custom collapse toggle |
| `zoom-controls` | `{ zoomIn, zoomOut, zoomReset, fitToView, scale }` | Custom zoom controls |
| `empty` | - | Empty state (no nodes) |

## Keyboard Navigation

| Key | Action |
| --- | --- |
| `ArrowDown` | Move focus to next visible node |
| `ArrowUp` | Move focus to previous visible node |
| `ArrowRight` | Expand focused node (or move to first child) |
| `ArrowLeft` | Collapse focused node (or move to parent) |
| `Enter` / `Space` | Select/deselect focused node |
| `Home` | Focus first node |
| `End` | Focus last visible node |

## Accessibility

- ARIA `role="tree"` on the root element
- Keyboard navigation with roving focus
- Screen reader labels on nodes and interactive elements
- Proper focus management during expand/collapse
