<script setup lang="ts">
import { NO_TV_GAMES, SEASON_CONTENTS, TV_GAMES, type NoTvGame, type TvGame, type WeekInfo } from '@/graphQl';
import {
  getBasketballSeason,
  flexScheduleLink,
  isBowlGameWeek,
  isBasketballPostseason,
  hasNoTVGames,
  shouldShowPpvColumn,
  isFirstWeek,
  isNextWeekBasketballPostseason,
  isNextWeekBowlGameWeek,
  adjustWebExclusives
} from '@/utils';
import { useQuery } from '@vue/apollo-composable';
import { defineAsyncComponent, computed } from 'vue';
import BackToTopButton from './shared/BackToTopButton.vue';
import WeeklyBase from './WeeklyBase.vue';
import NoTvGames from './noTVGames/NoTvGames.vue';
import { DateTime } from 'luxon';

const GoogleSearch = defineAsyncComponent(() => import('./shared/GoogleSearchBar.vue'));
const BackToTopScript = defineAsyncComponent(() => import('./shared/BackToTopScript.vue'));

const props = defineProps<{ week: string; sport: string; paramYear: string }>();
const { week, sport, paramYear } = props;

const weekInt = parseInt(week);
const year = computed(() => (sport === 'football' ? paramYear : getBasketballSeason(paramYear)));
const flexLink = computed(() => flexScheduleLink(year.value));
const showNoTvGames = computed(() => hasNoTVGames(year.value));

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

const {
  result: noTvGamesResult,
  loading: noTvGamesLoading,
  error: noTvGamesError
} = useQuery<{ noTvGames: NoTvGame[] }>(NO_TV_GAMES, {
  input: {
    season: year.value,
    week: weekInt
  }
});

const nextWeek = computed(() => weekInt + 1);
const previousWeek = computed(() => weekInt - 1);

const isBowlWeek = computed(() => isBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
const isMbkPostseason = computed(() => isBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
const gamesToday = computed(() => {
  return seasonContentsResult.value?.seasonContents
    .filter((x) => x.week === weekInt)
    .some((x) => {
      const dateToCompare = DateTime.now().setZone('America/New_York');
      return DateTime.fromISO(x.endDate) >= dateToCompare && DateTime.fromISO(x.startDate) <= dateToCompare;
    }) ?? false;
});
const isWeekOne = computed(() => isFirstWeek(seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
const isNextWeekMbkPostseason = computed(() => isNextWeekBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
const isNextWeekBowlWeek = computed(() => isNextWeekBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
</script>

<template>
  <div>
    <div v-if="seasonContentsLoading || noTvGamesLoading || tvGameLoading">
      Loading Week {{ week }} for {{ paramYear }}
    </div>
    <div v-if="seasonContentsError || noTvGamesError || tvGameError">
      Sorry. Got a bit of a problem. Let Matt know.
    </div>
    <div v-if="seasonContentsResult && noTvGamesResult && tvGameResult">
      <nav class="navbar DONTPrint">
        <div class="container">
          <div>
            <span class="blockspan">
              <RouterLink
                class="mobilespan"
                to="/"
              >Home</RouterLink>
              <RouterLink
                class="mobilespan"
                :to="`/season/${sport}/${paramYear}`"
              >Season Home </RouterLink>
              <RouterLink
                v-if="gamesToday"
                class="mobilespan"
                :to="`/schedule/${sport}/daily`"
              >Today's Schedule
              </RouterLink>
            </span>
            <span class="blockspan">
              <RouterLink
                v-if="flexLink"
                class="mobilespan"
                :to="`/tv-windows/${paramYear}`"
                target="_blank"
              >Available
                TV Windows</RouterLink>
              <RouterLink
                class="mobilespan"
                :to="`/schedule/${sport}/${paramYear}/${week}/text`"
              >Customizable Text-Only
                Page</RouterLink>
            </span>
            <div
              v-if="!isMbkPostseason && !isBowlWeek"
              class="pad"
            >
              <template v-if="isWeekOne">
                <span style="float: left">
                  <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${nextWeek}` }">Next Week</RouterLink>
                </span>
              </template>
              <template v-else>
                <span style="float: left">
                  <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${previousWeek}` }">Previous Week
                  </RouterLink>
                </span>
                <span
                  v-if="!isNextWeekMbkPostseason && !isNextWeekBowlWeek"
                  style="float: right"
                >
                  <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${nextWeek}`, force: true }">Next Week
                  </RouterLink>
                </span>
              </template>
              <br class="mobilehide">
            </div>
            <br>
            <div
              v-if="tvGameResult"
              class="filters"
            >
              <input
                v-if="!isBowlWeek && !isMbkPostseason"
                id="btnWebGames"
                type="button"
                value="Hide Web Exclusive Games"
                class="show_hideWeb"
                @click="adjustWebExclusives"
              >
            </div>
          </div>
        </div>
      </nav>
      <template v-if="tvGameResult">
        <WeeklyBase
          :season="year"
          :tv-games="tvGameResult.tvGames"
          :is-bowl-week="isBowlWeek"
          :is-mbk-postseason="isMbkPostseason"
          :show-ppv-column="shouldShowPpvColumn(year)"
        />
        <NoTvGames
          v-if="!isBowlWeek && showNoTvGames && noTvGamesResult"
          :no-tv-games="noTvGamesResult?.noTvGames"
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
.show_hideWeb {
  display: inline-block;
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

.pad {
  padding: 5px 0;
}

@media all and (min-width: 641px) {
  .mobilespan {
    display: block;
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

  .mobilehide {
    display: none;
  }
}
</style>
