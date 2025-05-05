<script setup lang="ts">
import { useRoute } from 'vue-router';
import BackToTop from '@/components/shared/BackToTop.vue';
import WeeklyBase from '@/components/WeeklyBase.vue';
import { useDailyTvGames } from '@/composables/useDailyTvGames';
import { shouldShowPpvColumn } from '@/utils/ppvColumn';
import { adjustWebExclusives } from '@/utils/webExclusives';
import { DateTime } from 'luxon';
import { addMetaTags } from '@/utils/metaTags';
import Copyright from '@/components/shared/CopyrightLink.vue';
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';

const route = useRoute();
const { sport } = route.params as { sport: string };

const title = `Daily TV Games for ${DateTime.now().toFormat('LLLL dd, yyyy')}`;

addMetaTags(title);

const {
  result: dailyTvGameResult,
  loading: dailyTvGameLoading,
  error: dailyTvGameError,
  season,
  flexLink,
  startDate
} = useDailyTvGames(sport);
</script>

<template>
  <div>
    <template v-if="dailyTvGameLoading">Loading {{ sport }} for {{ startDate }}</template>
    <template v-if="dailyTvGameError">Got a problem. Let Matt know.</template>
    <template v-if="dailyTvGameResult">
      <nav class="navbar DONTPrint">
        <div class="container">
          <div>
            <span class="blockspan">
              <RouterLink class="mobilespan" to="/">Home</RouterLink>
              <RouterLink v-if="season" class="mobilespan" :to="`/season/${sport}/${season}`">Season Home </RouterLink>
            </span>
            <span class="blockspan">
              <RouterLink v-if="flexLink" class="mobilespan" :to="`/tv-windows/${season}`" target="_blank">
                Available TV Windows</RouterLink
              >
              <RouterLink class="mobilespan" :to="`/schedule/${sport}/daily/text`">
                Customizable Text-Only Page</RouterLink
              >
            </span>
            <br />
            <div v-if="dailyTvGameResult" class="filters">
              <button id="btnWebGames" class="show_hideWeb" @click="adjustWebExclusives">
                Hide Web Exclusive Games
              </button>
            </div>
          </div>
        </div>
      </nav>
      <WeeklyBase
        :season="season"
        :tv-games="dailyTvGameResult.dailyTvGames"
        :is-bowl-week="false"
        :is-mbk-postseason="false"
        :show-ppv-column="shouldShowPpvColumn(season)" />
        <BackToTop />
      <AdsByGoogle />
      <Copyright />
    </template>
  </div>
</template>

<style scoped>
.show_hideWeb {
  display: inline-block;
}

a img {
  border: 0;
}

.filters {
  margin: 0;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media all and (min-width: 641px) {
  .mobilespan {
    display: block;
  }

  .filters {
    margin-top: 10px;
  }
}

@media only screen and (max-width: 640px) {
  .mobilespan {
    display: inline-block;
    padding-right: 10px;
  }

  .blockspan {
    display: block;
    padding-bottom: 3px;
  }

  .filters {
    margin-top: 5px;
  }
}
</style>
