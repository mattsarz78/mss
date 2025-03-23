<script setup lang="ts">
import { adjustNavBar, flexScheduleLink } from '@/utils';
import { defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { year } = route.params as { year: string };

const flexLink = `${flexScheduleLink(year)}/pubhtml?widget=true&amp;headers=false`;

const GoogleSearch = defineAsyncComponent(() => import('../components/shared/GoogleSearchBar.vue'));

onMounted(adjustNavBar);
</script>

<template>
  <nav class="navbar DONTPrint">
    <div class="container">
      <div>
        <span class="blockspan">
          <RouterLink
            class="homelink"
            to="/"
          >Home</RouterLink><br>
          <RouterLink
            class="seasonhome"
            :to="`/season/football/${year}`"
          >Season Home</RouterLink>
        </span>
      </div>
    </div>
  </nav>
  <div id="Main">
    <iframe
      class="tvFrame"
      :src="flexLink"
    />
    <GoogleSearch />
  </div>
</template>

<style scoped>
.coverage a img,
.network a img {
  border: 0;
}

.network {
  text-align: center;
  border: medium solid Gray;
  border-width: thin;
}

.coverage {
  border: medium solid Gray;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.time {
  width: 60px;
  text-align: right;
  border: medium solid Gray;
  border-width: thin;
  padding: 2px;
}

.conference {
  width: 100px;
  text-align: center;
  border: medium solid Gray;
  border-width: thin;
  padding: 5px;
}

.telecast {
  width: 400px;
  text-align: center;
  border: medium solid Gray;
  border-width: thin;
  padding: 5px;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.tvFrame {
  height: 400px;
}

@media all and (min-width: 641px) {
  .network {
    width: 135px;
    padding: 2px;
  }

  .coverage {
    width: 189px;
  }

  .tvFrame {
    width: 700px;
  }

  .homelink,
  .seasonhome {
    display: block;
  }
}

@media only screen and (max-width: 640px) {
  .network {
    width: 90px;
    padding: 0;
  }

  .coverage {
    width: 105px;
  }

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
