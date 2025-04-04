import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';

export default defineConfigWithVueTs(
  {
    ignores: ['node_modules/**/*', 'dist/**/*']
  },
  pluginVue.configs[('flat/essential', 'flat/recommended', 'flat/strongly-recommended')],
  vueTsConfigs.recommendedTypeChecked
);
