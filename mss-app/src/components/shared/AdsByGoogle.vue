<script setup lang="ts">
import AdsByGoogleScript from '@/components/shared/AdsByGoogleScript.vue';
import GoogleSearchBar from '@/components/shared/GoogleSearchBar.vue';
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
    <component :is="'script'" async> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
  </div>
</template>
