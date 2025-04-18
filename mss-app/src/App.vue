<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAppUtils } from './composables/useAppUtils';

const { isOnline } = useAppUtils();
</script>

<template>
  <div>
    <div v-if="!isOnline" class="offline-banner">You are currently offline</div>
    <RouterView />
  </div>
</template>

<style>
.offline-banner {
  background-color: #ff5252;
  color: white;
  text-align: center;
  padding: 0.5rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>
