<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAppUtils } from '@composables/useAppUtils';

const { isOnline } = useAppUtils();
</script>

<template>
  <div v-reset-adsense-height class="maincontainer">
    <div v-if="!isOnline" class="offline-banner">You are currently offline</div>
    <RouterView />
  </div>
</template>
