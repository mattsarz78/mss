<script setup lang="ts">
import AdsByGoogle from '#shared/AdsByGoogle.vue';
import Copyright from '#shared/CopyrightLink.vue';
import { addMetaTags } from '#utils/metaTags.mjs';
import { useSeasonData } from '#/composables/useSeasonData.mjs';
import { useRoute } from 'vue-router';

const route = useRoute();
const { year } = route.params as { year: string };

const title = `Football TV Windows for ${year}`;

const FLEXLINKSETUP = '/pubhtml?widget=true&amp;headers=false';

addMetaTags(title);

const { result, loading, error } = useSeasonData(year);
</script>

<template>
  <template v-if="result">
    <nav role="navigation" class="navbar DONTPrint">
      <div class="container">
        <div class="flex-container">
          <div>
            <RouterLink to="/">Home</RouterLink>
          </div>
          <div><br /></div>
          <div>
            <RouterLink :to="`/season/football/${year}`">Season Home</RouterLink>
          </div>
        </div>
      </div>
    </nav>
    <main v-reset-adsense-height>
      <iframe
        :title="`Football TV Windows for ${year} season`"
        class="tvFrame"
        :src="`${result.seasonData.flexScheduleLink}${FLEXLINKSETUP}`" />
      <AdsByGoogle />
    </main>
    <Copyright />
  </template>
  <template v-if="loading">
    <div class="loading-container">
      <p class="loading-text">TV Windows Loading...</p>
    </div>
  </template>
  <template v-if="error">
    <div class="error-container">
      <p>Sorry. Got a bit of a problem. Let Matt know.</p>
    </div>
  </template>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  width: 100%;
  background-color: white;
  padding: 2px 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  align-items: center;
  height: 55px;
  display: block;
}

.tvFrame {
  height: 450px;
  width: 100%;
  margin-top: 60px;
}

.container {
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.flex-container {
  display: flex;
  flex-direction: column;
}

@media only screen and (max-width: 640px) {
  .tvFrame {
    width: 97%;
  }

  .navbar {
    height: 45px;
  }
}
</style>
