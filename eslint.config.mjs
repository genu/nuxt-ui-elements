import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import { createConfigForNuxt } from "@nuxt/eslint-config"

export default createConfigForNuxt(eslintPluginPrettierRecommended, {
  rules: {
    "nuxt/prefer-import-meta": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-namespace": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],

    // Stylistic
    "@stylistic/quotes": "off",
    "@stylistic/brace-style": "off",
    "@stylistic/arrow-parens": "off",
    "@stylistic/member-delimiter-style": "off",
    "@stylistic/operator-linebreak": "off",
    "@stylistic/indent": "off",
    "@stylistic/quote-props": "off",

    // Vue
    "vue/max-attributes-per-line": ["off"],
    "vue/space-infix-ops": ["error"],
    "vue/multi-word-component-names": "off",
    "vue/html-self-closing": "off",
    "vue/require-default-prop": "off",
  },
})
