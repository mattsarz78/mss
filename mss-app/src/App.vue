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

<style>
@media print {
  .DONTPrint {
    display: none;
  }
}

.maincontainer {
  max-width: 800px;
  margin: 0 auto;
  zoom: 1;
}

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
