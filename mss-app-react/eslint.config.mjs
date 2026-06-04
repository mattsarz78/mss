import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import ts from 'typescript-eslint';

export default [
  // 1. Global Ignores (Must be in an isolated object)
  { ignores: ['dist', 'node_modules', '.venv', 'build'] },

  // 2. Global Base Language Environment Configurations
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest', // Automatically matches modern 2026/ESNext syntax specifications
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node, // Safely handles script environments like vite.config or scripts
      },
      parser: ts.parser, // Explicitly binds the TypeScript Flat Config parser asset node
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: '18', // Dynamically matches your local package.json React build version
      },
    },
  },

  // 3. Recommended Core Engine Flag Layout Sets
  js.configs.recommended,
  ...ts.configs.recommended,

  // 4. Custom React Application Rules Mapping Layout
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react: react.configs.flat.recommended.plugins.react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
