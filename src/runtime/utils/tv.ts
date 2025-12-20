// Create our own tv instance since Nuxt UI's version depends on #build/app.config
// which is only available in the user's app context, not in our module
import { createTV } from "tailwind-variants";

export const tv = /* @__PURE__ */ createTV({});
