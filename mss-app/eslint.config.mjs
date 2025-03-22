import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';

export default [
  {
    ignores: ['node_modules/**/*', 'dist/**/*']
  },
  ...pluginVue.configs['flat/essential','flat/recommended'],
  ...vueTsEslintConfig()
];
