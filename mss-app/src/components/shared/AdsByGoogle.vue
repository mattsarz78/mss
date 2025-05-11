<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const AdsByGoogleScript = defineAsyncComponent(() => import('./AdsByGoogleScript.vue'));
const GoogleSearchBar = defineAsyncComponent(() => import('./GoogleSearchBar.vue'));
</script>

<template>
  <div v-reset-adsense-height class="DONTPrint">
    <GoogleSearchBar />
    <div class="gcse-search" />
    <AdsByGoogleScript />
    <ins
      class="adsbygoogle"
      style="display: block"
      data-ad-client="ca-pub-0296554708545211"
      data-ad-slot="9539391470"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
    <component :is="'script'"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
  </div>
</template>
