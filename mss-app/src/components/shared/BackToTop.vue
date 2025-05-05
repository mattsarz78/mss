<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import BackToTopButton from './BackToTopButton.vue';

const BackToTopScript = defineAsyncComponent(() => import('./BackToTopScript.vue'));
</script>

<template>
  <p>
    <BackToTopScript />
    <BackToTopButton />
  </p>
</template>
