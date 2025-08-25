<template>
  <div v-reset-adsense-height class="DONTPrint">
    <component :is="'script'" async src="https://cse.google.com/cse.js?cx=partner-pub-0296554708545211:rp92al-azpy" />
    <div class="gcse-search" />
    <component
      :is="'script'"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0296554708545211"
      crossorigin="anonymous">
    </component>
    <ins
      class="adsbygoogle DONTPrint"
      style="display: block"
      data-ad-client="ca-pub-0296554708545211"
      data-ad-slot="9539391470"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
    <component :is="'script'"> (adsbygoogle = window.adsbygoogle || []).push({}); </component>
  </div>
</template>
