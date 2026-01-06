<script setup lang="ts">
  const { alert } = useDialog()

  type Color = "primary" | "secondary" | "success" | "info" | "warning" | "error" | (string & {})
  type Variant = "solid" | "outline"

  // Basic alert dialog with customizable color and variant
  const selectedColor = ref<Color>("primary")
  const selectedVariant = ref<Variant>("solid")

  const colorOptions = [
    { label: "Primary", value: "primary" },
    { label: "Secondary", value: "secondary" },
    { label: "Success", value: "success" },
    { label: "Info", value: "info" },
    { label: "Warning", value: "warning" },
    { label: "Error", value: "error" },
    { label: "Neutral", value: "neutral" },
  ]

  const variantOptions = [
    { label: "Solid", value: "solid" },
    { label: "Outline", value: "outline" },
  ]

  // Icon defaults based on color
  const colorIconMap: Record<Color, string> = {
    primary: "i-lucide-info",
    secondary: "i-lucide-info",
    success: "i-lucide-circle-check",
    info: "i-lucide-info",
    warning: "i-lucide-triangle-alert",
    error: "i-lucide-circle-x",
    neutral: "i-lucide-info",
  }

  function showBasicAlert() {
    alert({
      title: "Alert",
      description: "This is a basic alert message.",
      icon: colorIconMap[selectedColor.value],
      color: selectedColor.value,
      variant: selectedVariant.value,
      onDismiss: () => {
        console.log("User dismissed alert")
      },
    })
  }

  // Success alert
  function showSuccessAlert() {
    alert({
      title: "Success!",
      description: "Your changes have been saved successfully.",
      icon: "i-lucide-check-circle",
      color: "success",
      label: "Got it",
      onDismiss: () => {
        console.log("Success acknowledged")
      },
    })
  }

  // Error alert
  function showErrorAlert() {
    alert({
      title: "Error",
      description: "Something went wrong. Please try again later.",
      icon: "i-lucide-alert-circle",
      color: "error",
      label: "Close",
      onDismiss: () => {
        console.log("Error acknowledged")
      },
    })
  }

  // Warning alert
  function showWarningAlert() {
    alert({
      title: "Warning",
      description: "Your session will expire in 5 minutes. Please save your work.",
      icon: "i-lucide-alert-triangle",
      color: "warning",
      label: "Understood",
    })
  }

  // Info alert
  function showInfoAlert() {
    alert({
      title: "New Features Available",
      description: "We've added new features to improve your experience. Check out the changelog for details.",
      icon: "i-lucide-sparkles",
      color: "info",
      label: "Explore",
    })
  }

  // Async operation (success)
  function showAsyncAlert() {
    alert({
      title: "Notification Sent",
      description: "Your notification has been queued for delivery.",
      icon: "i-lucide-send",
      color: "primary",
      onDismiss: async () => {
        console.log("Starting async operation...")
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log("Async operation completed!")
      },
    })
  }

  // Async operation (with error)
  function showAsyncErrorAlert() {
    alert({
      title: "Clear Cache",
      description: "This will clear your local cache.",
      icon: "i-lucide-trash-2",
      color: "warning",
      onDismiss: async () => {
        // Simulate async operation that fails
        await new Promise((resolve) => setTimeout(resolve, 1500))
        throw new Error("Failed to clear cache")
      },
    })
  }

  // Custom icon
  function showCustomIconAlert() {
    alert({
      title: "Achievement Unlocked!",
      description: "You've completed all tasks for today.",
      icon: "i-lucide-trophy",
      color: "success",
      variant: "outline",
      label: "Awesome!",
    })
  }

  // No icon
  function showNoIconAlert() {
    alert({
      title: "Simple Message",
      description: "This alert has no icon.",
      color: "neutral",
      variant: "outline",
    })
  }

  // Long description
  function showLongDescriptionAlert() {
    alert({
      title: "Privacy Policy Update",
      description: `We've updated our privacy policy to provide more transparency about how we collect, use, and protect your data.
      These changes include new information about data retention, third-party sharing, and your rights to access and delete your information.
      Please review the updated policy to understand how these changes may affect you.`,
      icon: "i-lucide-shield",
      color: "info",
      label: "Review Policy",
    })
  }

  useSeoMeta({
    title: "Alert Dialog - Nuxt UI Elements",
    description: "Alert dialog composable for Nuxt UI",
  })
</script>

<template>
  <div class="p-8 space-y-8">
    <div>
      <h1 class="text-3xl font-bold mb-2">Alert Dialog</h1>
      <p class="text-gray-600 dark:text-gray-400">
        A composable for creating alert dialogs with async support and customizable options. Unlike confirmation dialogs, alerts only
        have a dismiss button and no close button.
      </p>
    </div>

    <div class="space-y-6">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Basic Usage</h2>
        </template>

        <div class="space-y-4">
          <div>
            <h3 class="font-medium mb-3">Basic Alert</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Customize the appearance with different colors and variants</p>
            <div class="flex flex-wrap gap-3 mb-3">
              <USelectMenu v-model="selectedColor" :items="colorOptions" value-key="value" placeholder="Color" class="w-40" />
              <USelectMenu v-model="selectedVariant" :items="variantOptions" value-key="value" placeholder="Variant" class="w-40" />
            </div>
            <UButton label="Show Alert" @click="showBasicAlert" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Success Alert</h3>
            <UButton color="success" label="Show Success" @click="showSuccessAlert" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Error Alert</h3>
            <UButton color="error" label="Show Error" @click="showErrorAlert" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Warning Alert</h3>
            <UButton color="warning" label="Show Warning" @click="showWarningAlert" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Info Alert</h3>
            <UButton color="info" label="Show Info" @click="showInfoAlert" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Async Operation (Success)</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Shows loading state, then "Complete" with checkmark before closing
            </p>
            <UButton label="Show Async Alert" @click="showAsyncAlert" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Async Operation (Error)</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Demonstrates error handling - dialog stays open on error</p>
            <UButton color="error" label="Trigger Error" @click="showAsyncErrorAlert" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Custom Icon</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Use any Lucide icon</p>
            <UButton label="Show Achievement" @click="showCustomIconAlert" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">No Icon</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Alert without an icon</p>
            <UButton color="neutral" variant="outline" label="Show Simple Alert" @click="showNoIconAlert" />
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Long Description</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Alert with a longer message</p>
            <UButton label="Show Policy Update" @click="showLongDescriptionAlert" />
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
              Returns an object with <code>confirm()</code>, <code>confirmNavigate()</code>, and <code>alert()</code> methods.
            </p>
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">alert(options)</h3>
            <div class="space-y-2 text-sm">
              <div class="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded space-y-1">
                <div>interface DialogAlertOptions {</div>
                <div class="pl-4">title: string</div>
                <div class="pl-4">description?: string</div>
                <div class="pl-4">icon?: string // Lucide icon name</div>
                <div class="pl-4">label?: string // default: "Dismiss"</div>
                <div class="pl-4">color?: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"</div>
                <div class="pl-4">variant?: "solid" | "outline"</div>
                <div class="pl-4">onDismiss?: () => void | Promise&lt;void&gt;</div>
                <div class="pl-4">ui?: any // Custom styling overrides</div>
                <div>}</div>
              </div>
              <p class="text-gray-600 dark:text-gray-400">
                Creates and opens an alert dialog with only a dismiss button and no close icon.
              </p>
            </div>
          </div>

          <USeparator />

          <div>
            <h3 class="font-medium mb-2">Features</h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
              <li>Single dismiss button (no confirm button)</li>
              <li>No close button in header</li>
              <li>Custom icon support (any Lucide icon)</li>
              <li>Async dismiss callbacks with loading states</li>
              <li>Error handling with visual feedback</li>
              <li>Color and variant customization</li>
              <li>Custom button labels</li>
            </ul>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Code Example</h2>
        </template>

        <div class="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded space-y-2">
          <div>const { alert } = useDialog()</div>
          <div />
          <div>// Basic usage</div>
          <div>alert({</div>
          <div class="pl-4">title: "Success!",</div>
          <div class="pl-4">description: "Your changes have been saved.",</div>
          <div class="pl-4">icon: "i-lucide-check-circle",</div>
          <div class="pl-4">color: "success",</div>
          <div class="pl-4">label: "Got it",</div>
          <div>})</div>
          <div />
          <div>// With async callback</div>
          <div>alert({</div>
          <div class="pl-4">title: "Clear Cache",</div>
          <div class="pl-4">icon: "i-lucide-trash-2",</div>
          <div class="pl-4">onDismiss: async () => {</div>
          <div class="pl-8">await clearCache()</div>
          <div class="pl-4">},</div>
          <div>})</div>
        </div>
      </UCard>
    </div>
  </div>
</template>
