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
import { defineAsyncComponent, watch } from 'vue';
import BackToTopButton from './shared/BackToTopButton.vue';
import WeeklyBase from './WeeklyBase.vue';
import NoTvGames from './noTVGames/NoTvGames.vue';
import { DateTime } from 'luxon';

const GoogleSearch = defineAsyncComponent(() => import('./shared/GoogleSearchBar.vue'));
const BackToTopScript = defineAsyncComponent(() => import('./shared/BackToTopScript.vue'));

const props = defineProps(['week', 'sport', 'paramYear']);
const week = parseInt(props['week'] as string);
const sport = props['sport'] as string;
const paramYear = props['paramYear'] as string;

const year = sport === 'football' ? paramYear : getBasketballSeason(paramYear);
const flexLink = flexScheduleLink(year);
const showNoTvGames = hasNoTVGames(year);

const {
  result: tvGameResult,
  loading: tvGameLoading,
  error: tvGameError
} = useQuery<{ tvGames: TvGame[] }>(TV_GAMES, {
  input: {
    season: year,
    sport,
    week
  }
});

const {
  result: seasonContentsResult,
  loading: seasonContentsLoading,
  error: seasonContentsError
} = useQuery<{ seasonContents: WeekInfo[] }>(SEASON_CONTENTS, {
  input: {
    season: year
  }
});

const {
  result: noTvGamesResult,
  loading: noTvGamesLoading,
  error: noTvGamesError
} = useQuery<{ noTvGames: NoTvGame[] }>(NO_TV_GAMES, {
  input: {
    season: year,
    week
  }
});

const nextWeek = week + 1;
const previousWeek = week - 1;

let isBowlWeek: boolean = false;
let isMbkPostseason: boolean = false;
let gamesToday: boolean = false;
let isWeekOne: boolean = false;
let isNextWeekMbkPostseason: boolean = false;
let isNextWeekBowlWeek: boolean = false;

watch(
  [seasonContentsResult, noTvGamesResult, tvGameResult],
  ([seasonContentsValue, noTvGamesValue, tvGameValue]) => {
    if (!!seasonContentsValue && !!noTvGamesValue && !!tvGameValue) {
      isBowlWeek = isBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, week);
      isMbkPostseason = isBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, week);
      gamesToday =
        seasonContentsResult.value?.seasonContents
          .filter((x) => x.week === week)
          .some((x) => {
            const dateToCompare = DateTime.now().setZone('America/New_York');
            return DateTime.fromISO(x.endDate) >= dateToCompare && DateTime.fromISO(x.startDate) <= dateToCompare;
          }) ?? false;
      isWeekOne = isFirstWeek(seasonContentsResult.value?.seasonContents!, week);
      isNextWeekMbkPostseason = isNextWeekBasketballPostseason(
        sport,
        seasonContentsResult.value?.seasonContents!,
        week
      );
      isNextWeekBowlWeek = isNextWeekBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, week);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div v-if="seasonContentsLoading || noTvGamesLoading || tvGameLoading">
      Loading Week {{ week }} for {{ paramYear }}
    </div>
    <div v-if="seasonContentsError || noTvGamesError || tvGameError">Sorry. Got a bit of a problem. Let Matt know.</div>
    <div v-if="seasonContentsResult && noTvGamesResult && tvGameResult">
      <nav class="navbar DONTPrint">
        <div class="container">
          <div>
            <span class="blockspan">
              <RouterLink class="mobilespan" to="/">Home</RouterLink>
              <RouterLink class="mobilespan" :to="`/season/${sport}/${paramYear}`">Season Home </RouterLink>
              <RouterLink class="mobilespan" v-if="gamesToday" :to="`/schedule/${sport}/daily`">Today's Schedule
              </RouterLink>
            </span>
            <span class="blockspan">
              <RouterLink v-if="flexLink" class="mobilespan" :to="`/tv-windows/${paramYear}`" target="_blank">
                Available TV Windows</RouterLink>
              <RouterLink class="mobilespan" :to="`/schedule/${sport}/${paramYear}/${week}/text`">
                Customizable Text-Only Page</RouterLink>
            </span>
            <div class="pad" v-if="!isMbkPostseason && !isBowlWeek">
              <template v-if="isWeekOne">
                <span style="float: left">
                  <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${nextWeek}` }">Next Week </RouterLink>
                </span>
              </template>
              <template v-else>
                <span style="float: left">
                  <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${previousWeek}` }">
                    Previous Week
                  </RouterLink>
                </span>
                <span style="float: right" v-if="!isNextWeekMbkPostseason && !isNextWeekBowlWeek">
                  <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${nextWeek}`, force: true }">Next Week
                  </RouterLink>
                </span>
              </template>
              <br class="mobilehide" />
            </div>
            <br />
            <div class="filters" v-if="tvGameResult">
              <input v-if="!isBowlWeek && !isMbkPostseason" id="btnWebGames" type="button"
                value="Hide Web Exclusive Games" class="show_hideWeb" v-on:click="adjustWebExclusives()" />
              <!-- @Html.Partial("TimeZoneDropDown") -->
            </div>
          </div>
        </div>
      </nav>
      <template v-if="tvGameResult">
        <!-- <form action="@ViewBag.ActionName" id="WeekForm" method="post"> -->
        <!-- @if (Model.ShowRSNPartialView)
              {
              @Html.Partial("CoverageNotes/" + Model.SportYear + "/FSNWeek" + Model.Week)
              } -->
        <WeeklyBase :season="year" :tvGames="tvGameResult.tvGames" :isBowlWeek="isBowlWeek"
          :isMbkPostseason="isMbkPostseason" :showPpvColumn="shouldShowPpvColumn(year)" />
        <NoTvGames v-if="!isBowlWeek && showNoTvGames && noTvGamesResult" :noTvGames="noTvGamesResult?.noTvGames" />
        <p>
          <BackToTopScript />
          <BackToTopButton />
        </p>
        <!-- </form> -->
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
