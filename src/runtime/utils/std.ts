/**
 * Standard utility library re-exports
 * Import from '#std' for tree-shakeable utilities
 *
 * @example
 * import { plur, dayjs } from '#std'
 *
 * const text = plur('item', count)
 * const date = dayjs().format('YYYY-MM-DD')
 */

// String utilities
export { default as plur } from "plur"

// Date utilities
export { default as dayjs } from "dayjs"
