<script setup lang="ts">
import { addMetaTags, flexScheduleLink } from '@/utils/base';
import { adjustNavBar } from '@/utils/dom';
import { defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { year } = route.params as { year: string };

const title = `Football TV Windows for ${year}`;

addMetaTags(title);

const flexLink = `${flexScheduleLink(year)}/pubhtml?widget=true&amp;headers=false`;

const GoogleSearch = defineAsyncComponent(() => import('@/components/shared/GoogleSearchBar.vue'));

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
    <GoogleSearch />
  </div>
</template>

<style scoped>
a img {
  border: 0;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.tvFrame {
  height: 400px;
}

@media all and (min-width: 641px) {
  .tvFrame {
    width: 700px;
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
    width: 90%;
  }

  .homelink,
  .seasonhome {
    display: inline-block;
    padding-right: 10px;
  }
}
</style>
