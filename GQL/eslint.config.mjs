import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

/** @type {tseslint.InfiniteDepthConfigWithExtends[]} */
const config = tseslint.config(
  { files: ['**/*.{js,mjs,cjs,mts}'] },
  { ignores: ['node_modules/**/*', '__generated__/**/*', 'apollo.config.js', 'eslint.config.mjs'] },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 'latest'
      }
    }
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig
);

export default config;
