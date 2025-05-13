<script setup lang="ts">
import { addMetaTags } from '@/utils/metaTags';
import { adjustNavBar } from '@/utils/navBar';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Copyright from '@/components/shared/CopyrightLink.vue';
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';
import flexScheduleLinks from '@/staticData/flexScheduleLinks.json';
import type { FlexScheduleLink } from '@/staticData/exportTypes';
import { FLEXLINKSETUP } from '@/staticData/constants';

const route = useRoute();
const { year } = route.params as { year: string };

const title = `Football TV Windows for ${year}`;

addMetaTags(title);

const flexLink = flexScheduleLinks.find((link: FlexScheduleLink) => link.season === year)?.url ?? '';

onMounted(adjustNavBar);
</script>

<template>
  <nav class="navbar DONTPrint">
    <div class="container">
      <div>
        <span class="blockspan">
          <RouterLink class="homelink" to="/">Home</RouterLink><br />
          <RouterLink class="seasonhome" :to="`/season/football/${year}`">Season Home</RouterLink>
        </span>
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
  z-index: 9999;
  width: 100%;
  background-color: white;
  padding: 2px 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.tvFrame {
  height: 450px;
  margin-top: 10px;
}

.container {
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
}

@media all and (min-width: 641px) {
  .tvFrame {
    width: 800px;
  }

  .homelink,
  .seasonhome {
    display: block;
  }
}

@media only screen and (max-width: 640px) {
  .blockspan {
    display: block;
    padding-bottom: 3px;
  }

  .tvFrame {
    width: 97%;
  }

  .homelink,
  .seasonhome {
    display: inline-block;
    padding-right: 10px;
  }
}
</style>
