<script setup lang="ts">
const route = useRoute()
const { navigation } = useNavigation()
</script>

<template>
  <UApp>
    <UDashboardGroup>
      <UDashboardSidebar resizable collapsible>
        <template #header="{ collapsed }">
          <NuxtLink to="/" class="inline-flex items-center gap-2">
            <UIcon name="i-heroicons-cube" class="w-5 h-5" />
            <span v-if="!collapsed" class="font-semibold">UI Elements</span>
          </NuxtLink>

          <UColorModeButton v-if="!collapsed" class="ms-auto" />
        </template>

        <template #default="{ collapsed }">
          <UDashboardSearchButton :collapsed="collapsed" />

          <UNavigationMenu :collapsed="collapsed" :items="navigation" orientation="vertical" />
        </template>

        <template #footer="{ collapsed }">
          <USeparator v-if="!collapsed" type="dashed" />

          <div v-if="!collapsed" class="p-4 space-y-2">
            <UButton
              to="https://github.com/yourusername/nuxt-ui-elements"
              target="_blank"
              color="neutral"
              variant="ghost"
              block
              icon="i-heroicons-code-bracket"
              label="GitHub"
            />
            <UButton
              to="https://ui.nuxt.com"
              target="_blank"
              color="neutral"
              variant="ghost"
              block
              icon="i-heroicons-cube"
              label="Nuxt UI"
            />
          </div>
        </template>
      </UDashboardSidebar>

      <UDashboardPanel>
        <template #body>
          <!-- Show navbar only on component pages -->
          <Navbar v-if="route.path.startsWith('/components/')" />

          <NuxtPage />
        </template>
      </UDashboardPanel>
    </UDashboardGroup>
  </UApp>
</template>
