import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {tseslint.InfiniteDepthConfigWithExtends[]} */
const config = tseslint.config(
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['node_modules/**/*', '__generated__/**/*', 'apollo.config.js', 'eslint.config.mjs'] },
  {
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 'latest'
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintPluginPrettierRecommended
);

export default config;
