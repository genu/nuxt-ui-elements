---
title: GanttChart
description: A project timeline chart with zoom levels, dependencies, drag-and-drop, and progress tracking.
category: component
navigation:
  badge:
    label: Pro
    color: primary
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/genu/nuxt-ui-elements-pro/blob/main/src/runtime/components/GanttChart.vue
---

## Overview

`GanttChart` renders a project timeline with support for task hierarchies, dependencies, milestones, drag-and-drop scheduling, resize, progress tracking, and multiple zoom levels.

## Demo

:component-example{name="GanttChartExample"}

## Zoom Levels

The chart supports five zoom levels: `day`, `week`, `month` (default), `quarter`, and `year`. Use `v-model:zoom-level` for two-way binding.

:component-example{name="GanttChartZoomExample"}

## Drag and Drop

Tasks can be dragged to reschedule them. Set `draggable: false` on individual tasks to lock them in place, or disable globally with `:editable="false"`.

:component-example{name="GanttChartDragDropExample"}

## Dependencies

Define task dependencies using the `dependencies` prop. Dependencies are rendered as arrows between tasks.

:component-example{name="GanttChartDependenciesExample"}

## Progress

Each task can display a progress bar via the `progress` prop (0–100).

:component-example{name="GanttChartProgressExample"}

## GanttTask Interface

```ts
interface GanttTask {
  /** Unique identifier */
  id: string | number
  /** Display title */
  title: string
  /** Start date — accepts Date, ISO string, or @internationalized/date DateValue */
  start: Date | string | DateValue
  /** End date */
  end: Date | string | DateValue
  /** Parent task ID for grouping. `null` for top-level tasks. */
  parentId?: string | number | null
  /** Nuxt UI theme color name */
  color?: string
  /** Completion percentage (0–100) @defaultValue 0 */
  progress?: number
  /** Render as a diamond milestone marker @defaultValue false */
  milestone?: boolean
  /** Whether this task can be dragged @defaultValue true */
  draggable?: boolean
  /** Whether this task can be resized @defaultValue true */
  resizable?: boolean
  /** Arbitrary user-defined metadata */
  metadata?: Record<string, unknown>
}
```

## GanttDependency Interface

```ts
interface GanttDependency {
  /** Unique identifier */
  id: string | number
  /** Predecessor task ID */
  fromId: string | number
  /** Successor task ID */
  toId: string | number
  /** Dependency type @defaultValue 'finish-to-start' */
  type?: 'finish-to-start'
}
```

## API

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string \| Component` | `'div'` | HTML element or component to render as root |
| `tasks` | `GanttTask[]` | `[]` | Array of tasks to display |
| `dependencies` | `GanttDependency[]` | `[]` | Task dependency arrows |
| `modelValue` | `Date \| string \| DateValue` | `today()` | Displayed date (supports `v-model`) |
| `zoomLevel` | `GanttZoomLevel` | `'month'` | Zoom level (supports `v-model:zoom-level`) |
| `zoomLevels` | `GanttZoomLevel[]` | all levels | Available zoom levels |
| `locale` | `string` | `'en-US'` | Locale for date formatting |
| `editable` | `boolean` | `true` | Enable drag-and-drop and resize globally |
| `loading` | `boolean` | `false` | Show loading state |
| `color` | `string` | `'primary'` | Theme color for chart chrome |
| `rowHeight` | `number` | `40` | Height of each task row in pixels |
| `expanded` | `(string \| number)[]` | - | Two-way binding for expanded group IDs |
| `ui` | `object` | - | Custom classes for component slots |

### GanttZoomLevel

```ts
type GanttZoomLevel = 'day' | 'week' | 'month' | 'quarter' | 'year'
```

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `CalendarDate` | Fired when the displayed date changes |
| `update:zoomLevel` | `GanttZoomLevel` | Fired when the zoom level changes |
| `update:expanded` | `(string \| number)[]` | Fired when expanded group IDs change |
| `taskClick` | `GanttTask` | Fired when a task bar is clicked |
| `taskDrop` | `GanttTaskDropPayload` | Fired after a drag-and-drop operation |
| `taskResize` | `GanttTaskResizePayload` | Fired after a resize operation |

### GanttTaskDropPayload

```ts
interface GanttTaskDropPayload {
  task: GanttTask
  oldStart: CalendarDate
  oldEnd: CalendarDate
  newStart: CalendarDate
  newEnd: CalendarDate
}
```

### GanttTaskResizePayload

```ts
interface GanttTaskResizePayload {
  task: GanttTask
  oldStart: CalendarDate
  oldEnd: CalendarDate
  newStart: CalendarDate
  newEnd: CalendarDate
  edge: 'start' | 'end'
}
```

### Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | `GanttChartContext` | Compound mode: full rendering control |
| `header` | `{ title, zoomLevel, setZoomLevel }` | Custom header |
| `header-title` | `{ title }` | Custom header title |
| `header-nav` | `{ prev, next, today }` | Custom navigation controls |
| `zoom-switcher` | `{ zoomLevel, setZoomLevel, zoomLevels }` | Custom zoom level switcher |
| `task-bar` | `{ task, bar }` | Custom task bar content |
| `milestone` | `{ task, bar }` | Custom milestone marker |
| `group-header` | `{ task, bar, expanded, toggle }` | Custom group header |
| `today-marker` | - | Custom today marker |
| `dependency` | `{ paths }` | Custom dependency rendering |
| `loading` | - | Custom loading state |
| `empty` | - | Custom empty state |

### Exposed API

```ts
defineExpose({
  expandAll: () => void
  collapseAll: () => void
  toggleExpand: (id: string | number) => void
  scrollToDate: (date: CalendarDate) => void
  scrollToTask: (taskId: string | number) => void
})
```

## Keyboard Navigation

| Key | Action |
| --- | --- |
| `ArrowDown` | Move focus to next task |
| `ArrowUp` | Move focus to previous task |
| `ArrowRight` | Expand group or move to next time unit |
| `ArrowLeft` | Collapse group or move to previous time unit |
| `Enter` / `Space` | Select focused task |
| `Home` | Focus first task |
| `End` | Focus last task |
