export default defineNuxtConfig({
  compatibilityDate: "2025-12-15",
  modules: ["../src/module", "@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  uiElements: {},
  devtools: { enabled: true },

  // App configuration
  app: {
    head: {
      title: "Nuxt UI Elements",
      meta: [
        {
          name: "description",
          content: "Beautiful, animated UI components for Nuxt UI",
        },
      ],
    },
  },
})
