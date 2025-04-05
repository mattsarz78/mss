import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfigWithVueTs(
  { ignores: ['node_modules/**/*', 'dist/**/*'] },
  pluginVue.configs[('flat/essential', 'flat/recommended')],
  vueTsConfigs.strictTypeChecked,
  vueTsConfigs.stylisticTypeChecked,
  eslintPluginPrettierRecommended
);
