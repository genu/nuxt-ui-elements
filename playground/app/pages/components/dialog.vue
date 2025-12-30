<script setup lang="ts">
const { confirm, confirmNavigate } = useDialog();

const isLoading = ref(false);

// Basic confirmation dialog
function showBasicDialog() {
  confirm({
    title: "Confirm Action",
    description: "Are you sure you want to proceed with this action?",
  })
    .onConfirm(() => {
      console.log("User confirmed!");
    })
    .onDismiss(() => {
      console.log("User dismissed");
    })
    .open();
}

// Custom labels
function showCustomLabels() {
  confirm({
    title: "Delete Item",
    description:
      "This action cannot be undone. Are you sure you want to delete this item?",
    confirmLabel: "Delete",
    dismissLabel: "Cancel",
  })
    .onConfirm(() => {
      console.log("Item deleted!");
    })
    .open();
}

// Async operation (success)
function showAsyncDialog() {
  confirm({
    title: "Process Data",
    description: "This will start processing your data. Continue?",
    async: true,
  })
    .onConfirm(async () => {
      console.log("Starting async operation...");
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Async operation completed!");
    })
    .open();
}

// Async operation (with error)
function showAsyncErrorDialog() {
  confirm({
    title: "Delete All Data",
    description:
      "This action will permanently delete all your data. Are you absolutely sure?",
    async: true,
    confirmLabel: "Delete Everything",
  })
    .onConfirm(async () => {
      // Simulate async operation that fails
      await new Promise((resolve) => setTimeout(resolve, 1500));
      throw new Error("Failed to delete: Permission denied");
    })
    .open();
}

// Without dismiss button
function showNoDismiss() {
  confirm({
    title: "Important Notice",
    description: "Please read and acknowledge this important information.",
    dismissLabel: "",
    confirmLabel: "I Understand",
  })
    .onConfirm(() => {
      console.log("Acknowledged");
    })
    .open();
}

// Navigation confirmation
function showNavigationDialog() {
  confirmNavigate("/");
}

// HTML in description
function showHTMLDialog() {
  confirm({
    title: "Terms and Conditions",
    description: `
      <div class="space-y-2">
        <p>By clicking accept, you agree to:</p>
        <ul class="list-disc list-inside space-y-1">
          <li>Our terms of service</li>
          <li>Privacy policy</li>
          <li>Cookie policy</li>
        </ul>
      </div>
    `,
    confirmLabel: "Accept",
    dismissLabel: "Decline",
  })
    .onConfirm(() => {
      console.log("Terms accepted");
    })
    .open();
}

useSeoMeta({
  title: "Dialog - Nuxt UI Elements",
  description: "Confirmation dialog composable for Nuxt UI",
});
</script>

<template>
  <div class="p-8 space-y-8">
    <div>
      <h1 class="text-3xl font-bold mb-2">Dialog</h1>
      <p class="text-gray-600 dark:text-gray-400">
        A composable for creating confirmation dialogs with async support and
        customizable options.
      </p>
    </div>

    <div class="space-y-6">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Basic Usage</h2>
        </template>

        <div class="space-y-4">
          <div>
            <h3 class="font-medium mb-2">Basic Confirmation</h3>
            <UButton @click="showBasicDialog" label="Show Basic Dialog" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Custom Labels</h3>
            <UButton
              @click="showCustomLabels"
              color="error"
              label="Delete Item"
            />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Async Operation (Success)</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Shows loading state, then "Complete" with checkmark before closing
            </p>
            <UButton @click="showAsyncDialog" label="Start Async Process" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Async Operation (Error)</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Demonstrates error handling - dialog stays open on error
            </p>
            <UButton
              @click="showAsyncErrorDialog"
              color="error"
              label="Trigger Error"
            />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Without Dismiss Button</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Use for acknowledgments or required actions
            </p>
            <UButton @click="showNoDismiss" label="Show Notice" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">HTML Description</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Support for HTML content in descriptions
            </p>
            <UButton @click="showHTMLDialog" label="Show Terms" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Navigation Confirmation</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Confirm before navigating away (uses confirmNavigate helper)
            </p>
            <UButton
              @click="showNavigationDialog"
              label="Navigate to Home"
              color="neutral"
            />
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">API Reference</h2>
        </template>

        <div class="space-y-4">
          <div>
            <h3 class="font-medium mb-2">useDialog()</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Returns an object with <code>confirm()</code> and
              <code>confirmNavigate()</code> methods.
            </p>
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">confirm(options)</h3>
            <div class="space-y-2 text-sm">
              <p
                class="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded"
              >
                interface Options { title: string description?: string
                confirmLabel?: string // default: "Yes" dismissLabel?: string //
                default: "No" size?: "sm" | "md" // default: "sm" async?:
                boolean // default: false clickToClose?: boolean // default:
                false }
              </p>
              <p class="text-gray-600 dark:text-gray-400">
                Returns a dialog instance with <code>onConfirm()</code>,
                <code>onDismiss()</code>, and <code>open()</code> methods.
              </p>
            </div>
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Dialog Instance Methods</h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <code>onConfirm(callback)</code> - Set callback for confirm
                action (chainable)
              </li>
              <li>
                <code>onDismiss(callback)</code> - Set callback for dismiss
                action (chainable)
              </li>
              <li><code>open()</code> - Open the dialog (chainable)</li>
            </ul>
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">confirmNavigate(path)</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Helper method that shows a confirmation dialog before navigating
              to the specified path. Uses default "Leave this page?" messaging.
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Code Example</h2>
        </template>

        <pre
          class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto text-sm"
        ><code>const { confirm, confirmNavigate } = useDialog()

// Basic usage
confirm({
  title: 'Confirm Action',
  description: 'Are you sure?',
})
  .onConfirm(() => {
    console.log('Confirmed!')
  })
  .onDismiss(() => {
    console.log('Dismissed')
  })
  .open()

// Async operation
confirm({
  title: 'Delete Item',
  async: true,
})
  .onConfirm(async () => {
    await deleteItem()
  })
  .open()

// Navigation helper
confirmNavigate('/home')</code></pre>
      </UCard>
    </div>
  </div>
</template>
