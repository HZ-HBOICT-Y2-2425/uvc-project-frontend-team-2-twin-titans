import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: { ...globals.browser, Buffer: "readonly" } } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
  {
    rules: {
      "no-unused-vars": ["warn"],
      "no-self-assign": "off",
      "no-empty": "off",
      "no-useless-escape": "off",
      "@typescript-eslint/require-await": "off",
      "no-constant-condition": "off",
      "no-control-regex": "off",
      "no-async-promise-executor": "off", // Allow async promise executor
      "no-case-declarations": "off", // Allow case block lexical declarations
      "no-extra-boolean-cast": "off", // Allow redundant double negation
    },
  },
];
