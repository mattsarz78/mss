<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAppUtils } from './composables/useAppUtils';
import { defineAsyncComponent } from 'vue';

const { isOnline } = useAppUtils();

const AdsByGoogle = defineAsyncComponent(() => import('./adsByGoogle.vue'));
</script>

<template>
  <div>
    <div v-if="!isOnline" class="offline-banner">You are currently offline</div>
    <RouterView />
    <div class="DONTPrint">
      <ins
        class="adsbygoogle"
        style="display: block"
        data-ad-client="ca-pub-0296554708545211"
        data-ad-slot="9539391470"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
      <AdsByGoogle />
    </div>
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
