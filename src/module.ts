import {
  defineNuxtModule,
  addImportsDir,
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
    "@nuxt/ui": {},
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);
    const logger = useLogger("nuxt-ui-elements");

    // Auto-import composables (useDialog)
    addImportsDir(resolver.resolve("./runtime/composables"));

    // Note: DialogConfirm component is NOT auto-registered
    // It's used internally by useDialog composable via useOverlay
  },
});
