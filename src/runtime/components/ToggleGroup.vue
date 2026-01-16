<script lang="ts">
  import type { ToggleGroupRootProps, AcceptableValue } from "reka-ui"
  import type { AppConfig } from "@nuxt/schema"
  import theme from "#build/ui-elements/toggle-group"
  import type { ComponentConfig, GetItemKeys, GetModelValue, NestedItem } from "../types"
  import { computed } from "vue"
  import { ToggleGroupRoot, ToggleGroupItem as RekaToggleGroupItem } from "reka-ui"
  import { tv } from "../utils/tv"
  import { useFormField } from "@nuxt/ui/composables/useFormField"

  type ToggleGroup = ComponentConfig<typeof theme, AppConfig, "toggleGroup">

  /**
   * Base type for toggle group items. Can be a primitive or an object.
   */
  export type ToggleGroupItem = string | number | Record<string, any>

  export interface ToggleGroupProps<
    T extends ToggleGroupItem[] = ToggleGroupItem[],
    VK extends GetItemKeys<T> | undefined = "value",
    M extends boolean = true,
  > extends Pick<ToggleGroupRootProps, "loop" | "disabled" | "name" | "required"> {
    /**
     * The items to display
     */
    items?: T
    /**
     * When `items` is an array of objects, select the field to use as the value.
     * When undefined, the whole object is used as the value.
     * @defaultValue 'value'
     */
    valueKey?: VK
    /**
     * The controlled value of the ToggleGroup. Can be bound with `v-model`.
     * When `multiple` is true, this is an array. Otherwise, it's a single value.
     */
    modelValue?: GetModelValue<T, VK, M>
    /**
     * The value when initially rendered. Use when you do not need to control state.
     */
    defaultValue?: GetModelValue<T, VK, M>
    /**
     * Allow multiple items to be selected.
     * @defaultValue true
     */
    multiple?: M
    /**
     * The orientation the toggle items are laid out.
     * @defaultValue 'horizontal'
     */
    orientation?: "horizontal" | "vertical"
    ui?: ToggleGroup["slots"]
  }

  export interface ToggleGroupEmits<
    T extends ToggleGroupItem[] = ToggleGroupItem[],
    VK extends GetItemKeys<T> | undefined = "value",
    M extends boolean = true,
  > {
    "update:modelValue": [value: GetModelValue<T, VK, M>]
    change: [event: Event]
  }

  export interface ToggleGroupSlots<T extends ToggleGroupItem[] = ToggleGroupItem[], I extends NestedItem<T> = NestedItem<T>> {
    default(props: { item: I; selected: boolean }): any
  }
</script>

<script
  lang="ts"
  setup
  generic="T extends ToggleGroupItem[], VK extends GetItemKeys<T> | undefined = 'value', M extends boolean = true">
  const {
    multiple = true as M,
    valueKey = "value" as VK,
    orientation = "horizontal",
    loop = true,
    disabled = false,
    required = false,
    ui: propUi,
    ...props
  } = defineProps<ToggleGroupProps<T, VK, M>>()

  const emit = defineEmits<ToggleGroupEmits<T, VK, M>>()
  defineSlots<ToggleGroupSlots<T>>()

  const {
    emitFormChange,
    emitFormInput,
    name: formFieldName,
    disabled: formDisabled,
  } = useFormField<ToggleGroupProps<T, VK, M>>({ name: props.name, disabled }, { bind: false })

  const ui = computed(() =>
    tv({
      extend: tv(theme),
    })({
      orientation,
      disabled: formDisabled.value,
    }),
  )

  // Get a value from an object by key path
  function get(obj: Record<string, any> | undefined, key: string): any {
    if (obj === undefined || obj === null) return undefined
    return obj[key]
  }

  // Get the value to use for an item (either the extracted field or the whole object)
  function getItemValue(item: any, index: number): any {
    if (item === null || item === undefined) return index
    if (typeof item === "string" || typeof item === "number") return item
    if (valueKey === undefined) return item
    const val = get(item, valueKey as string)
    return val !== undefined ? val : index
  }

  // Generate a unique key for the item (always a string/number for Vue's :key)
  function getKeyValue(item: any, index: number): string | number {
    if (item === null || item === undefined) return index
    if (typeof item === "string" || typeof item === "number") return item
    if (valueKey !== undefined) {
      const val = get(item, valueKey as string)
      return val !== undefined ? val : index
    }
    // For whole objects, use index as key
    return index
  }

  // Convert modelValue to internal format for reka-ui
  // When valueKey is undefined (whole object mode), we use indices internally
  const internalValue = computed((): AcceptableValue | AcceptableValue[] | undefined => {
    if (valueKey !== undefined) {
      // valueKey mode: pass through directly
      return props.modelValue as AcceptableValue | AcceptableValue[]
    }

    // Whole object mode: convert objects to indices
    if (props.modelValue === undefined || props.modelValue === null) {
      return multiple ? [] : undefined
    }

    if (!multiple) {
      const idx = props.items?.findIndex((item) => item === props.modelValue)
      return idx !== undefined && idx >= 0 ? idx : undefined
    }

    // Multiple mode
    const values = props.modelValue as any[]
    return values
      .map((val) => {
        const idx = props.items?.findIndex((item) => item === val)
        return idx !== undefined && idx >= 0 ? idx : -1
      })
      .filter((idx) => idx >= 0)
  })

  // Convert internal value back to the correct format for modelValue
  function onUpdate(value: any) {
    if (value === null || value === undefined) return

    if (valueKey !== undefined) {
      // valueKey mode: emit directly
      emit("update:modelValue", value)
    } else {
      // Whole object mode: convert indices back to objects
      if (!multiple) {
        const item = props.items?.[value as number]
        emit("update:modelValue", item as GetModelValue<T, VK, M>)
      } else {
        const indices = value as number[]
        const objects = indices.map((idx) => props.items?.[idx]).filter(Boolean)
        emit("update:modelValue", objects as GetModelValue<T, VK, M>)
      }
    }

    // @ts-expect-error - 'target' does not exist in type 'EventInit'
    const event = new Event("change", { target: { value } })

    emit("change", event)
    emitFormChange()
    emitFormInput()
  }
</script>

<template>
  <ToggleGroupRoot
    :type="multiple ? 'multiple' : 'single'"
    :model-value="internalValue"
    :default-value="defaultValue"
    :orientation="orientation"
    :loop="loop"
    :disabled="formDisabled"
    :name="formFieldName"
    :required="required"
    data-slot="root"
    :class="ui.root({ class: [propUi?.root] })"
    @update:model-value="onUpdate">
    <RekaToggleGroupItem
      v-for="(item, index) in items"
      :key="getKeyValue(item, index)"
      :value="valueKey === undefined ? index : getItemValue(item, index)"
      :disabled="formDisabled"
      data-slot="item"
      :class="ui.item({ class: propUi?.item })"
      #="{ pressed }">
      <slot v-if="item" :item="item as NestedItem<T>" :selected="pressed" />
    </RekaToggleGroupItem>
  </ToggleGroupRoot>
</template>
