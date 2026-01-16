<script setup lang="ts">
  // Define item types for proper slot inference
  interface SocialAccount {
    id: number
    value: string
    label: string
    icon: string
  }

  interface ToolbarItem {
    value: string
    icon: string
  }

  interface Plan {
    value: string
    name: string
    price: string
    features: string[]
  }

  interface ImageItem {
    value: string
    src: string
    alt: string
  }

  // Interactive example state
  const interactiveValue = ref(1)
  const interactiveOrientation = ref<"horizontal" | "vertical">("horizontal")
  const interactiveMultiple = ref(true)
  const interactiveDisabled = ref(false)

  const socialAccounts: SocialAccount[] = [
    { id: 1, value: "twitter", label: "X (Twitter)", icon: "i-fa6-brands-x-twitter" },
    { id: 2, value: "facebook", label: "Facebook", icon: "i-fa6-brands-facebook" },
    { id: 3, value: "instagram", label: "Instagram", icon: "i-fa6-brands-instagram" },
    { id: 4, value: "linkedin", label: "LinkedIn", icon: "i-fa6-brands-linkedin" },
  ]

  const orientations = ["horizontal", "vertical"] as const

  // Toolbar example
  const toolbarSelected = ref<string[]>(["bold"])
  const toolbarItems: ToolbarItem[] = [
    { value: "bold", icon: "i-lucide-bold" },
    { value: "italic", icon: "i-lucide-italic" },
    { value: "underline", icon: "i-lucide-underline" },
    { value: "strikethrough", icon: "i-lucide-strikethrough" },
  ]

  // Card selection example
  const cardSelected = ref<string>("starter")
  const plans: Plan[] = [
    { value: "starter", name: "Starter", price: "$9", features: ["5 projects", "10GB storage"] },
    { value: "pro", name: "Pro", price: "$29", features: ["Unlimited projects", "100GB storage", "Priority support"] },
    { value: "enterprise", name: "Enterprise", price: "$99", features: ["Everything in Pro", "Custom integrations", "SLA"] },
  ]

  // Image selection example
  const imageSelected = ref<string>("nature")
  const images: ImageItem[] = [
    { value: "nature", src: "https://picsum.photos/seed/nature/200/150", alt: "Nature" },
    { value: "city", src: "https://picsum.photos/seed/city/200/150", alt: "City" },
    { value: "abstract", src: "https://picsum.photos/seed/abstract/200/150", alt: "Abstract" },
  ]

  // Whole object selection example
  interface Tag {
    id: number
    name: string
    color: string
  }
  const tags: Tag[] = [
    { id: 1, name: "Vue", color: "text-green-500" },
    { id: 2, name: "React", color: "text-blue-500" },
    { id: 3, name: "Svelte", color: "text-orange-500" },
  ]
  const selectedTags = ref<Tag[]>([tags[0]!])

  useSeoMeta({
    title: "Toggle Group - Nuxt UI Elements",
    description: "A slot-based selection primitive for building custom toggle interfaces",
  })
</script>

<template>
  <div class="p-8 space-y-8">
    <div>
      <h1 class="text-3xl font-bold mb-2">ToggleGroup</h1>
      <p class="text-gray-600 dark:text-gray-400">
        A slot-based selection primitive. You provide the rendering, it handles selection state.
      </p>
    </div>

    <!-- Philosophy -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">How it works</h2>
      </template>

      <div class="space-y-4 text-sm">
        <p class="text-gray-600 dark:text-gray-400">
          <strong>ToggleGroup</strong> is a headless selection primitive. It manages selection state (single or multiple) and keyboard
          navigation, but you control all rendering via the default slot.
        </p>

        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <pre v-pre class="text-xs overflow-x-auto"><code>&lt;UEToggleGroup v-model="selected" :items="items"&gt;
  &lt;template #default="{ item, selected }"&gt;
    &lt;!-- You render whatever you want here --&gt;
    &lt;div :class="selected ? 'bg-primary' : 'bg-muted'"&gt;
      {{ item.label }}
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UEToggleGroup&gt;</code></pre>
        </div>

        <p class="text-gray-500 dark:text-gray-400 text-xs">
          Built on <code>reka-ui</code>'s ToggleGroup primitive with keyboard navigation (arrow keys), roving focus, and RTL support.
        </p>
      </div>
    </UCard>

    <div class="space-y-6">
      <!-- Interactive Playground -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Interactive Playground</h2>
            <UBadge color="primary" variant="subtle">Try it</UBadge>
          </div>
        </template>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Preview -->
          <div class="space-y-4">
            <h3 class="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Preview</h3>

            <div
              class="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 min-h-50 flex items-center justify-center">
              <UEToggleGroup
                v-model="interactiveValue"
                :items="socialAccounts"
                :multiple="interactiveMultiple"
                :orientation="interactiveOrientation"
                :disabled="interactiveDisabled"
                value-key="id"
                :ui="{ root: 'gap-0', item: '' }">
                <template #default="{ item, selected }">
                  <div
                    :class="[
                      'flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 transition-colors',
                      'first:rounded-l-lg last:rounded-r-lg -ml-px first:ml-0',
                      selected
                        ? 'bg-primary text-white border-primary z-10'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
                    ]">
                    <UIcon :name="item.icon" class="size-4" />
                    <span class="text-sm">{{ item.label }}</span>
                  </div>
                </template>
              </UEToggleGroup>
            </div>

            <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm">
              <span class="text-gray-500 dark:text-gray-400">v-model: </span>
              <span class="text-primary">{{ JSON.stringify(interactiveValue) }}</span>
            </div>

            <p class="text-xs text-gray-500 dark:text-gray-400">Try using arrow keys to navigate between items.</p>
          </div>

          <!-- Controls -->
          <div class="space-y-4">
            <h3 class="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Props</h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium">multiple</label>
                <USwitch v-model="interactiveMultiple" />
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium">orientation</label>
                <USelectMenu v-model="interactiveOrientation" :items="orientations" class="w-32" />
              </div>

              <div class="flex items-center justify-between">
                <label class="text-sm font-medium">disabled</label>
                <USwitch v-model="interactiveDisabled" />
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Toolbar Example -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Toolbar (Icon Buttons)</h2>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">A formatting toolbar with icon-only buttons.</p>

          <UEToggleGroup v-model="toolbarSelected" :items="toolbarItems" :ui="{ root: 'gap-1' }">
            <template #default="{ item, selected }">
              <div
                :class="[
                  'p-2 rounded-md transition-colors',
                  selected ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800',
                ]">
                <UIcon :name="item.icon" class="size-5" />
              </div>
            </template>
          </UEToggleGroup>

          <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm">
            <span class="text-gray-500 dark:text-gray-400">v-model: </span>
            <span class="text-primary">{{ JSON.stringify(toolbarSelected) }}</span>
          </div>

          <pre
            class="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto"><code>&lt;UEToggleGroup v-model="selected" :items="items"&gt;
  &lt;template #default="{ item, selected }"&gt;
    &lt;div :class="['p-2 rounded-md', selected ? 'bg-gray-200' : 'hover:bg-gray-100']"&gt;
      &lt;UIcon :name="item.icon" /&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UEToggleGroup&gt;</code></pre>
        </div>
      </UCard>

      <!-- Card Selection Example -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Card Selection (Pricing Plans)</h2>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Select a pricing plan. Uses <code>:multiple="false"</code> for radio-like behavior.
          </p>

          <UEToggleGroup v-model="cardSelected" :items="plans" :multiple="false" :ui="{ root: 'gap-4' }">
            <template #default="{ item, selected }">
              <div
                :class="[
                  'p-4 rounded-lg border-2 transition-all cursor-pointer min-w-48',
                  selected ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
                ]">
                <div class="font-semibold text-lg">{{ item.name }}</div>
                <div class="text-2xl font-bold text-primary my-2">{{ item.price }}<span class="text-sm font-normal">/mo</span></div>
                <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li v-for="feature in item.features" :key="feature">{{ feature }}</li>
                </ul>
              </div>
            </template>
          </UEToggleGroup>

          <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm">
            <span class="text-gray-500 dark:text-gray-400">v-model: </span>
            <span class="text-primary">{{ JSON.stringify(cardSelected) }}</span>
          </div>
        </div>
      </UCard>

      <!-- Image Selection Example -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Image Selection</h2>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">Select an image as a background. Full control over rendering.</p>

          <UEToggleGroup v-model="imageSelected" :items="images" :multiple="false" :ui="{ root: 'gap-4' }">
            <template #default="{ item, selected }">
              <div
                :class="[
                  'relative rounded-lg overflow-hidden cursor-pointer transition-all',
                  selected ? 'ring-4 ring-primary scale-105' : 'hover:scale-102 opacity-70 hover:opacity-100',
                ]">
                <img :src="item.src" :alt="item.alt" class="w-48 h-36 object-cover" />
                <div v-if="selected" class="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                  <UIcon name="i-lucide-check" class="size-4" />
                </div>
              </div>
            </template>
          </UEToggleGroup>

          <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm">
            <span class="text-gray-500 dark:text-gray-400">v-model: </span>
            <span class="text-primary">{{ JSON.stringify(imageSelected) }}</span>
          </div>
        </div>
      </UCard>

      <!-- Whole Object Selection Example -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Whole Object Selection</h2>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            When <code>value-key</code> is undefined, the whole object is used as the model value.
          </p>

          <UEToggleGroup v-model="selectedTags" :items="tags" :value-key="undefined" :ui="{ root: 'gap-2' }">
            <template #default="{ item, selected }">
              <div
                :class="[
                  'px-3 py-1.5 rounded-full border transition-colors text-sm font-medium',
                  selected
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400',
                  item.color,
                ]">
                {{ item.name }}
              </div>
            </template>
          </UEToggleGroup>

          <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-xs overflow-x-auto">
            <span class="text-gray-500 dark:text-gray-400">v-model: </span>
            <span class="text-primary">{{ JSON.stringify(selectedTags) }}</span>
          </div>

          <pre
            v-pre
            class="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto"><code>&lt;!-- When valueKey is undefined, whole objects are emitted --&gt;
&lt;UEToggleGroup v-model="selectedTags" :items="tags" :value-key="undefined"&gt;
  &lt;template #default="{ item, selected }"&gt;
    &lt;div :class="[selected ? 'bg-primary' : 'bg-muted']"&gt;
      {{ item.name }}
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UEToggleGroup&gt;

&lt;!-- selectedTags will be: [{ id: 1, name: "Vue", color: "..." }] --&gt;</code></pre>
        </div>
      </UCard>

      <!-- API Reference -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">API Reference</h2>
        </template>

        <div class="space-y-6">
          <!-- Props -->
          <div>
            <h3 class="font-medium mb-3">Props</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 pr-4 font-medium">Prop</th>
                    <th class="text-left py-2 pr-4 font-medium">Type</th>
                    <th class="text-left py-2 pr-4 font-medium">Default</th>
                    <th class="text-left py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody class="font-mono text-xs">
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 pr-4 text-primary">items</td>
                    <td class="py-2 pr-4 text-gray-500">T[]</td>
                    <td class="py-2 pr-4 text-gray-500">[]</td>
                    <td class="py-2 font-sans text-sm">Array of items to display</td>
                  </tr>
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 pr-4 text-primary">modelValue</td>
                    <td class="py-2 pr-4 text-gray-500">string | string[]</td>
                    <td class="py-2 pr-4 text-gray-500">-</td>
                    <td class="py-2 font-sans text-sm">Selected value(s) (v-model)</td>
                  </tr>
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 pr-4 text-primary">valueKey</td>
                    <td class="py-2 pr-4 text-gray-500">string | undefined</td>
                    <td class="py-2 pr-4 text-gray-500">"value"</td>
                    <td class="py-2 font-sans text-sm">Key to extract value from items. When undefined, whole objects are used.</td>
                  </tr>
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 pr-4 text-primary">multiple</td>
                    <td class="py-2 pr-4 text-gray-500">boolean</td>
                    <td class="py-2 pr-4 text-gray-500">true</td>
                    <td class="py-2 font-sans text-sm">Allow multiple items to be selected</td>
                  </tr>
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 pr-4 text-primary">orientation</td>
                    <td class="py-2 pr-4 text-gray-500">"horizontal" | "vertical"</td>
                    <td class="py-2 pr-4 text-gray-500">"horizontal"</td>
                    <td class="py-2 font-sans text-sm">Layout direction (affects keyboard nav)</td>
                  </tr>
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 pr-4 text-primary">loop</td>
                    <td class="py-2 pr-4 text-gray-500">boolean</td>
                    <td class="py-2 pr-4 text-gray-500">true</td>
                    <td class="py-2 font-sans text-sm">Loop focus from last to first</td>
                  </tr>
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 pr-4 text-primary">disabled</td>
                    <td class="py-2 pr-4 text-gray-500">boolean</td>
                    <td class="py-2 pr-4 text-gray-500">false</td>
                    <td class="py-2 font-sans text-sm">Disable all interactions</td>
                  </tr>
                  <tr>
                    <td class="py-2 pr-4 text-primary">ui</td>
                    <td class="py-2 pr-4 text-gray-500">{ root?, item? }</td>
                    <td class="py-2 pr-4 text-gray-500">-</td>
                    <td class="py-2 font-sans text-sm">Custom classes for root and item wrappers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <USeparator />

          <!-- Slots -->
          <div>
            <h3 class="font-medium mb-3">Slots</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 pr-4 font-medium">Slot</th>
                    <th class="text-left py-2 pr-4 font-medium">Props</th>
                    <th class="text-left py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody class="font-mono text-xs">
                  <tr>
                    <td class="py-2 pr-4 text-primary">default</td>
                    <td class="py-2 pr-4 text-gray-500">{ item: T, selected: boolean }</td>
                    <td class="py-2 font-sans text-sm">Render each item (required)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <USeparator />

          <!-- Events -->
          <div>
            <h3 class="font-medium mb-3">Events</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 pr-4 font-medium">Event</th>
                    <th class="text-left py-2 pr-4 font-medium">Payload</th>
                    <th class="text-left py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody class="font-mono text-xs">
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 pr-4 text-primary">update:modelValue</td>
                    <td class="py-2 pr-4 text-gray-500">string | string[]</td>
                    <td class="py-2 font-sans text-sm">Emitted when selection changes</td>
                  </tr>
                  <tr>
                    <td class="py-2 pr-4 text-primary">change</td>
                    <td class="py-2 pr-4 text-gray-500">Event</td>
                    <td class="py-2 font-sans text-sm">Native change event for form integration</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </UCard>

      <!-- When to Use -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">When to Use ToggleGroup</h2>
        </template>

        <div class="space-y-6">
          <div class="space-y-4">
            <h3 class="font-medium">ToggleGroup vs Nuxt UI Components</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Nuxt UI provides several selection components (<code>RadioGroup</code>, <code>CheckboxGroup</code>, <code>ButtonGroup</code>).
              Here's when to choose <code>ToggleGroup</code> instead:
            </p>

            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 pr-4 font-medium">Component</th>
                    <th class="text-left py-2 pr-4 font-medium">Best For</th>
                    <th class="text-left py-2 font-medium">Rendering</th>
                  </tr>
                </thead>
                <tbody class="text-xs">
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 pr-4 font-mono text-primary">RadioGroup</td>
                    <td class="py-2 pr-4">Standard radio button selections</td>
                    <td class="py-2">Pre-styled with labels, descriptions, icons</td>
                  </tr>
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 pr-4 font-mono text-primary">CheckboxGroup</td>
                    <td class="py-2 pr-4">Multi-select with checkboxes</td>
                    <td class="py-2">Pre-styled checkbox list</td>
                  </tr>
                  <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 pr-4 font-mono text-primary">ButtonGroup</td>
                    <td class="py-2 pr-4">Grouping action buttons</td>
                    <td class="py-2">Pre-styled button container (not a selection primitive)</td>
                  </tr>
                  <tr>
                    <td class="py-2 pr-4 font-mono text-green-600 dark:text-green-400">ToggleGroup</td>
                    <td class="py-2 pr-4">Custom toggle interfaces (cards, images, icons)</td>
                    <td class="py-2 font-medium">Slot-based - you control all rendering</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <USeparator />

          <div class="space-y-4">
            <h3 class="font-medium">Use ToggleGroup when you need:</h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li class="flex items-start gap-2">
                <UIcon name="i-lucide-check" class="size-4 text-green-500 mt-0.5 shrink-0" />
                <span><strong>Custom visuals</strong> - Cards, images, complex layouts that don't fit standard radio/checkbox styling</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-lucide-check" class="size-4 text-green-500 mt-0.5 shrink-0" />
                <span><strong>Toggle toolbars</strong> - Icon-based formatting buttons, view switchers</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-lucide-check" class="size-4 text-green-500 mt-0.5 shrink-0" />
                <span><strong>Whole object binding</strong> - When you need the entire object as v-model, not just a key</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-lucide-check" class="size-4 text-green-500 mt-0.5 shrink-0" />
                <span><strong>Full keyboard navigation</strong> - Arrow keys, roving focus, RTL support out of the box</span>
              </li>
            </ul>
          </div>

          <USeparator />

          <div class="space-y-4">
            <h3 class="font-medium">Use Nuxt UI components when:</h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li class="flex items-start gap-2">
                <UIcon name="i-lucide-x" class="size-4 text-gray-400 mt-0.5 shrink-0" />
                <span>Standard radio/checkbox appearance is sufficient</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-lucide-x" class="size-4 text-gray-400 mt-0.5 shrink-0" />
                <span>You need built-in validation states and error styling</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-lucide-x" class="size-4 text-gray-400 mt-0.5 shrink-0" />
                <span>Consistency with other Nuxt UI form components is important</span>
              </li>
            </ul>
          </div>

          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div class="flex gap-3">
              <UIcon name="i-lucide-info" class="size-5 text-blue-500 shrink-0 mt-0.5" />
              <div class="text-sm">
                <p class="font-medium text-blue-900 dark:text-blue-100">Form Integration</p>
                <p class="text-blue-700 dark:text-blue-300 mt-1">
                  ToggleGroup integrates with Nuxt UI's <code>UForm</code> via <code>useFormField</code>.
                  Wrap it in a <code>UFormField</code> for validation, error states, and form submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
