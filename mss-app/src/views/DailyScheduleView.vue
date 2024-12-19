<script setup lang="ts">
import { DAILY_TV_GAMES, type TvGame } from '@/graphQl';
import { flexScheduleLink, shouldShowPpvColumn, adjustWebExclusives } from '@/utils';
import { useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { defineAsyncComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import BackToTopButton from '../components/shared/BackToTopButton.vue';
import WeeklyBase from '../components/WeeklyBase.vue';

const route = useRoute();
const { sport } = route.params as { sport: string; };

const startDate = DateTime.now().setZone('America/New_York').toISODate();

const GoogleSearch = defineAsyncComponent(() => import('../components/shared/GoogleSearchBar.vue'));
const BackToTopScript = defineAsyncComponent(() => import('../components/shared/BackToTopScript.vue'));

const {
  result: dailyTvGameResult,
  loading: dailyTvGameLoading,
  error: dailyTvGameError
} = useQuery<{ dailyTvGames: TvGame[] }>(DAILY_TV_GAMES, {
  input: {
    sport,
    startDate
  }
});

let season: string = '';
let paramYear: string = '';
let flexLink: string = '';

watch(
  dailyTvGameResult,
  (dailyTvGameValue) => {
    if (dailyTvGameValue?.dailyTvGames.length) {
      paramYear = dailyTvGameValue?.dailyTvGames[0].season ?? '';
      season =
        sport === 'football' ? (paramYear ?? null) : `${paramYear.substring(0, 4)}-${paramYear.substring(5)}`;
      flexLink = flexScheduleLink(paramYear);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div v-if="dailyTvGameLoading">Loading {{ sport }} for {{ startDate }}</div>
    <div v-if="dailyTvGameError">Got a problem. Let Matt know.</div>
    <div v-if="dailyTvGameResult">
      <nav class="navbar DONTPrint">
        <div class="container">
          <div>
            <span class="blockspan">
              <RouterLink class="mobilespan" to="/">Home</RouterLink>
              <RouterLink v-if="season" class="mobilespan" :to="`/season/${sport}/${season}`">Season Home </RouterLink>
            </span>
            <span class="blockspan">
              <RouterLink v-if="flexLink" class="mobilespan" :to="`/tv-windows/${paramYear}`" target="_blank">
                Available TV Windows</RouterLink>
              <RouterLink class="mobilespan" :to="`/schedule/${sport}/daily/text`">
                Customizable Text-Only Page</RouterLink>
            </span>
            <br />
            <div class="filters" v-if="dailyTvGameResult">
              <input id="btnWebGames" type="button" value="Hide Web Exclusive Games" class="show_hideWeb"
                v-on:click="adjustWebExclusives()" />
            </div>
          </div>
        </div>
      </nav>
      <template v-if="dailyTvGameResult">
        <WeeklyBase :season="paramYear" :tvGames="dailyTvGameResult.dailyTvGames" :isBowlWeek="false"
          :isMbkPostseason="false" :showPpvColumn="shouldShowPpvColumn(paramYear)" />
        <p>
          <BackToTopScript />
          <BackToTopButton />
        </p>
        <GoogleSearch />
      </template>
    </div>
  </div>
</template>

<style scoped>
.show_hideWeb {
  display: inline-block;
}

.coverage a img,
.network a img {
  border: 0;
}

.network {
  text-align: center;
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
}

.coverage {
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.time {
  width: 60px;
  text-align: right;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 2px;
}

.conference {
  width: 100px;
  text-align: center;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 5px;
}

.telecast {
  width: 400px;
  text-align: center;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 5px;
}

.back-to-top {
  position: fixed;
  bottom: 2em;
  right: 0;
  text-decoration: none;
  padding: 1em;
  display: none;
}

.filters {
  margin: 0;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media all and (min-width: 641px) {
  .network {
    width: 135px;
    padding: 2px;
  }

  .coverage {
    width: 189px;
  }

  .mobilespan {
    display: block;
  }

  .filters {
    margin-top: 10px;
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
