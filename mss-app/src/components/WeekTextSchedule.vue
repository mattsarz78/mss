<script setup lang="ts">
import { type TvGame, type WeekInfo, SEASON_CONTENTS, TV_GAMES } from '@/graphQl';
import {
  clearAllSelectedTextRows,
  getBasketballSeason,
  isBasketballPostseason,
  isBowlGameWeek,
  isFirstWeek,
  isNextWeekBasketballPostseason,
  isNextWeekBowlGameWeek,
  shouldShowPpvColumn,
  checkAllTextRows
} from '@/utils';
import { useQuery } from '@vue/apollo-composable';
import { defineAsyncComponent, computed } from 'vue';
import WeekTextBase from './WeekTextBase.vue';
import BackToTopButton from '../components/shared/BackToTopButton.vue';

const GoogleSearch = defineAsyncComponent(() => import('../components/shared/GoogleSearchBar.vue'));
const BackToTopScript = defineAsyncComponent(() => import('../components/shared/BackToTopScript.vue'));

const props = defineProps<{ week: string; sport: string; paramYear: string }>();
const { week, sport, paramYear } = props;

const weekInt = parseInt(week);
const year = computed(() => (sport === 'football' ? paramYear : getBasketballSeason(paramYear)));

const nextWeek = computed(() => weekInt + 1);
const previousWeek = computed(() => weekInt - 1);

const {
  result: tvGameResult,
  loading: tvGameLoading,
  error: tvGameError
} = useQuery<{ tvGames: TvGame[] }>(TV_GAMES, {
  input: {
    season: year.value,
    sport,
    week: weekInt
  }
});

const {
  result: seasonContentsResult,
  loading: seasonContentsLoading,
  error: seasonContentsError
} = useQuery<{ seasonContents: WeekInfo[] }>(SEASON_CONTENTS, {
  input: {
    season: year.value
  }
});

const isBowlWeek = computed(() => isBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
const isMbkPostseason = computed(() => isBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
const isWeekOne = computed(() => isFirstWeek(seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
const isNextWeekMbkPostseason = computed(() => isNextWeekBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
const isNextWeekBowlWeek = computed(() => isNextWeekBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
</script>

<template>
  <div>
    <div v-if="seasonContentsLoading || tvGameLoading">
      Loading Week {{ week }} for {{ paramYear }}
    </div>
    <div v-if="seasonContentsError || tvGameError">
      Sorry. Got a bit of a problem. Let Matt know.
    </div>
    <div v-if="seasonContentsResult && tvGameResult">
      <nav class="navbar DONTPrint">
        <div class="container">
          <div>
            <span>
              <RouterLink
                class="homelink"
                to="/"
              >Home</RouterLink>
              <RouterLink
                class="seasonhome"
                :to="`/season/${sport}/${paramYear}`"
              >Season Home </RouterLink>
            </span>
            <RouterLink
              class="DONTPrint"
              :to="`/schedule/${sport}/${paramYear}/${week}`"
            >
              Weekly Schedule
            </RouterLink>
            <br>
            <div
              v-if="!isMbkPostseason && !isBowlWeek"
              class="pad"
            >
              <template v-if="isWeekOne">
                <span style="float: left">
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${nextWeek}/text`">Next Week </RouterLink>
                </span>
              </template>
              <template v-else>
                <span style="float: left">
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${previousWeek}/text`"> Previous Week </RouterLink>
                </span>
                <span
                  v-if="!isNextWeekMbkPostseason && !isNextWeekBowlWeek"
                  style="float: right"
                >
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${nextWeek}/text`">Next Week </RouterLink>
                </span>
              </template>
              <br class="mobilehide">
            </div>
            <br>
            <p
              id="TextNav"
              class="DONTPrint"
            >
              <input
                id="ClearAll"
                type="button"
                value="Clear All Games"
                class="inputpad"
                @click="clearAllSelectedTextRows"
              >
              <input
                id="CheckAll"
                type="button"
                value="Check All Games"
                class="inputpad"
                @click="checkAllTextRows"
              >
            </p>
          </div>
        </div>
      </nav>
      <template v-if="tvGameResult">
        <WeekTextBase
          :season="year"
          :tv-games="tvGameResult.tvGames"
          :is-bowl-week="isBowlWeek"
          :is-mbk-postseason="isMbkPostseason"
          :show-ppv-column="shouldShowPpvColumn(year)"
        />
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
