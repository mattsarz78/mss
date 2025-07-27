import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginVue from 'eslint-plugin-vue';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

export default defineConfigWithVueTs(
  { ignores: ['node_modules/**/*', 'dist/**/*'] },
  pluginVue.configs[('flat/essential', 'flat/recommended')],
  vueTsConfigs.recommended,
  eslintPluginPrettierRecommended,
  pluginVueA11y.configs['flat/recommended']
);
