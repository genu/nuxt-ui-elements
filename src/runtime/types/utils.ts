import type { AcceptableValue as _AcceptableValue } from "reka-ui"

/**
 * Excludes plain objects from reka-ui's AcceptableValue to keep primitives separate.
 * Boolean is added as it's commonly used as a value type.
 */
export type AcceptableValue = Exclude<_AcceptableValue, Record<string, any>> | boolean

/**
 * Represents either a flat array or a nested array (for grouped items).
 */
export type ArrayOrNested<T> = T[] | T[][]

/**
 * Extracts the inner item type from an array, handling nested arrays.
 */
export type NestedItem<T> = T extends Array<infer I> ? NestedItem<I> : T

/**
 * Gets all possible keys from an item type, including nested object keys.
 * Works with arrays of objects to extract the keys of the inner object type.
 */
export type GetItemKeys<I> = keyof Extract<NestedItem<I>, object>

/**
 * Determines the value type based on the item type and valueKey.
 * - When VK is undefined, returns the whole object type T
 * - When VK is a key of T, returns the type of that property
 *
 * @template I The items array type
 * @template VK The valueKey (keyof item or undefined)
 * @template T The nested item type (extracted from I)
 */
export type GetItemValue<
  I,
  VK extends GetItemKeys<I> | undefined,
  T extends NestedItem<I> = NestedItem<I>,
> = T extends object
  ? VK extends undefined
    ? T
    : VK extends keyof T
      ? T[VK]
      : never
  : T

/**
 * Determines the modelValue type based on item type, valueKey, and selection mode.
 * - For single selection (M = false): returns GetItemValue<T, VK>
 * - For multiple selection (M = true): returns GetItemValue<T, VK>[]
 *
 * @template T The items array type
 * @template VK The valueKey (keyof item or undefined)
 * @template M Whether multiple selection is enabled
 */
export type GetModelValue<
  T,
  VK extends GetItemKeys<T> | undefined,
  M extends boolean,
> = M extends true
  ? GetItemValue<T, VK>[]
  : GetItemValue<T, VK>

/**
 * Defines the emit type for modelValue updates.
 *
 * @template T The items array type
 * @template VK The valueKey (keyof item or undefined)
 * @template M Whether multiple selection is enabled
 */
export type GetModelValueEmits<
  T,
  VK extends GetItemKeys<T> | undefined,
  M extends boolean,
> = {
  /** Event handler called when the value changes. */
  "update:modelValue": [value: GetModelValue<T, VK, M>]
}
