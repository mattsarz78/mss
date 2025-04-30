<script setup lang="ts">
import { addMetaTags } from '@/utils/metaTags';
import { adjustNavBar } from '@/utils/navBar';
import { flexScheduleLink } from '@/utils/flexSchedule';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Copyright from '@/components/shared/CopyrightLink.vue';
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';

const route = useRoute();
const { year } = route.params as { year: string };

const title = `Football TV Windows for ${year}`;

addMetaTags(title);

const flexLink = `${flexScheduleLink(year)}/pubhtml?widget=true&amp;headers=false`;

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
  <div id="Main">
    <iframe class="tvFrame" :src="flexLink" />
    <AdsByGoogle />
  </div>
  <Copyright />
</template>

<style scoped>
a img {
  border: 0;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.tvFrame {
  height: 450px;
  margin-top: 10px;
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
