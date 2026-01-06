/**
 * Standard utility library re-exports
 * Import from '#std' for tree-shakeable utilities
 *
 * @example
 * import { plur, slugify, date } from '#std'
 *
 * const text = plur('item', count)
 * const slug = slugify('Hello World')
 * const nextMonth = date.add(date.today(), 1, 'month')
 */

// String utilities
export { default as plur } from "plur"
export { default as slugify } from "@sindresorhus/slugify"

// Date utilities - all functions exported as namespace
export * as date from "./std/date"
