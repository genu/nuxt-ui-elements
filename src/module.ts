import {
  defineNuxtModule,
  addComponentsDir,
  createResolver,
  hasNuxtModule,
  useLogger,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Prefix for component names
   * @default 'UE'
   */
  prefix?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-ui-elements",
    configKey: "uiElements",
  },
  defaults: {
    prefix: "UE",
  },
  moduleDependencies: {
    "motion-v/nuxt": {},
  },
  setup(options, _nuxt) {
    const resolver = createResolver(import.meta.url);
    const logger = useLogger("nuxt-ui-elements");

    // Check for @nuxt/ui after all modules are loaded
    if (!hasNuxtModule("@nuxt/ui")) {
      logger.error("[nuxt-ui-elements] @nuxt/ui is required. Please install it");
    }

    // Auto-register background components from backgrounds directory
    addComponentsDir({
      path: resolver.resolve("./runtime/components/background"),
      pathPrefix: false,
      prefix: `${options.prefix}Background`,
      global: true,
    });
  },
});
