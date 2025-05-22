<script setup lang="ts">
import { addMetaTags } from '@/utils/metaTags';
import { useRoute } from 'vue-router';
import Copyright from '@/components/shared/CopyrightLink.vue';
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';
import flexScheduleLinks from '@/staticData/flexScheduleLinks.json';
import type { FlexScheduleLink } from '@/staticData/exportTypes';

const route = useRoute();
const { year } = route.params as { year: string };

const title = `Football TV Windows for ${year}`;

const FLEXLINKSETUP = '/pubhtml?widget=true&amp;headers=false';

addMetaTags(title);

const flexLink = flexScheduleLinks.find((link: FlexScheduleLink) => link.season === year)?.url ?? '';
</script>

<template>
  <nav class="navbar DONTPrint">
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
  <div id="Main" v-reset-adsense-height>
    <iframe class="tvFrame" :src="`${flexLink}${FLEXLINKSETUP}`" />
    <AdsByGoogle />
  </div>
  <Copyright />
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
