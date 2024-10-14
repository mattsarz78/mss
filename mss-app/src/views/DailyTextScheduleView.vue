<script setup lang="ts">
import { DAILY_TV_GAMES, type TvGame } from '@/graphQl';
import { shouldShowPpvColumn, clearAllSelectedTextRows, checkAllTextRows } from '@/utils';
import { useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import WeekTextBase from '../components/WeekTextBase.vue';

const route = useRoute();
const sport = route.params.sport as string;

const startDate = DateTime.now().setZone('America/New_York').toISODate();

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

watch(
  dailyTvGameResult,
  (dailyTvGameValue) => {
    if (dailyTvGameValue?.dailyTvGames.length) {
      paramYear = dailyTvGameValue?.dailyTvGames[0].season ?? '';
      season =
        sport === 'football' ? (paramYear ?? null) : `${paramYear.substring(0, 4)}-${paramYear.substring(5)}`;
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
            <span>
              <RouterLink class="homelink" to="/">Home</RouterLink>
              <RouterLink class="seasonhome" :to="`/season/${sport}/${season}`">Season Home </RouterLink>
            </span>
            <RouterLink class="DONTPrint" :to="`/schedule/${sport}/daily`">Daily Schedule </RouterLink>
            <br />
            <p id="TextNav" class="pad DONTPrint">
              <input type="button" id="ClearAll" value="Clear All Games" v-on:click="clearAllSelectedTextRows()"
                class="inputpad" />
              <input type="button" id="CheckAll" value="Check All Games" v-on:click="checkAllTextRows()"
                class="inputpad" />
            </p>
          </div>
        </div>
      </nav>
      <template v-if="dailyTvGameResult">
        <WeekTextBase :season="paramYear" :tvGames="dailyTvGameResult.dailyTvGames" :isBowlWeek="false"
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
.inputpad {
  padding-left: 10px;
  margin-right: 3px;
}

.back-to-top {
  position: fixed;
  bottom: 2em;
  right: 0;
  text-decoration: none;
  padding: 1em;
  display: none;
}

#TextNav {
  margin: 0;
}

#Directions {
  margin-top: 0;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.pad {
  padding: 5px 0;
}

@media all and (min-width: 641px) {

  .homelink,
  .seasonhome {
    display: block;
  }
}

@media only screen and (max-width: 640px) {
  .DONTPrint a {
    line-height: 13px;
  }

  .homelink,
  .seasonhome {
    display: inline-block;
    padding-right: 10px;
  }

  .mobilehide {
    display: none;
  }
}
</style>
