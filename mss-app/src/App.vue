<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAppUtils } from './composables/useAppUtils';

const { isOnline } = useAppUtils();
</script>

<template>
  <div>
    <div class="maincontainer">
      <div v-if="!isOnline" class="offline-banner">You are currently offline</div>
      <RouterView />
    </div>
  </div>
</template>
