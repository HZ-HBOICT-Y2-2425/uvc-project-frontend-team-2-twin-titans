// Zorg ervoor dat globals correct wordt geïmporteerd
import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser, // Voor browser globals zoals `window`, `document`, etc.
        ...globals.node,    // Voor Node.js globals zoals `process`, `module`, etc.
        ...globals.jest,    // Voor Jest globals zoals `test`, `expect`, etc.
      },
    },
    settings: {
      react: {
        version: "detect", // Automatisch de React-versie detecteren
      },
    },
    plugins: {
      react: pluginReact, // Voeg de react plugin als object toe
    },
    rules: {
      "no-unused-vars": "off", // Schakel 'no-unused-vars' uit
      "no-self-assign": "off", // Schakel 'no-self-assign' uit
      "no-empty": "off", // Schakel 'no-empty' uit
    },
  },
  pluginJs.configs.recommended, // Basisregels voor JavaScript
];
