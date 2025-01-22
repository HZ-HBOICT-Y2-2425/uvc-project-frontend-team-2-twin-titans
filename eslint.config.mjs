import react from 'eslint-plugin-react';

export default {
  plugins: ['react'],
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect', // Dit zorgt ervoor dat de juiste React-versie wordt gedetecteerd
    },
  },
};
