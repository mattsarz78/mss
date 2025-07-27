<script setup lang="ts">
import { useAppUtils } from '#composables/useAppUtils.mjs';
import { RouterView } from 'vue-router';

const { isOnline } = useAppUtils();
</script>

<template>
  <div v-reset-adsense-height class="maincontainer">
    <div v-if="!isOnline" class="offline-banner">You are currently offline</div>
    <RouterView />
  </div>
</template>
