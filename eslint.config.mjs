export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    settings: {
      // Verwijder het react gedeelte als je geen React gebruikt
      react: {
        version: "detect",
      },
    },
    plugins: {
      // Verwijder de plugin als je geen React gebruikt
      // react: pluginReact,
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  pluginJs.configs.recommended,
];
