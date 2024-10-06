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
import { defineAsyncComponent, watch } from 'vue';
import WeekTextBase from './WeekTextBase.vue';
import BackToTopButton from '../components/shared/BackToTopButton.vue';
const GoogleSearch = defineAsyncComponent(() => import('../components/shared/GoogleSearchBar.vue'));
const BackToTopScript = defineAsyncComponent(() => import('../components/shared/BackToTopScript.vue'));

const props = defineProps(['week', 'sport', 'paramYear']);
const week = parseInt(props['week'] as string);
const sport = props['sport'] as string;
const paramYear = props['paramYear'] as string;
const year = sport === 'football' ? paramYear : getBasketballSeason(paramYear);

const nextWeek = week + 1;
const previousWeek = week - 1;

let isBowlWeek: boolean = false;
let isMbkPostseason: boolean = false;
let isWeekOne: boolean = false;
let isNextWeekMbkPostseason: boolean = false;
let isNextWeekBowlWeek: boolean = false;

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

watch(
  [tvGameResult, seasonContentsResult],
  ([tvGameValue, seasonContentsValue]) => {
    if (!!tvGameValue && !!seasonContentsValue) {
      isBowlWeek = isBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, week);
      isMbkPostseason = isBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, week);
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
    <div v-if="seasonContentsLoading || tvGameLoading">Loading Week {{ week }} for {{ paramYear }}</div>
    <div v-if="seasonContentsError || tvGameError">Sorry. Got a bit of a problem. Let Matt know.</div>
    <div v-if="seasonContentsResult && tvGameResult">
      <nav class="navbar DONTPrint">
        <div class="container">
          <div>
            <span>
              <RouterLink class="homelink" to="/">Home</RouterLink>
              <RouterLink class="seasonhome" :to="`/season/${sport}/${paramYear}`">Season Home </RouterLink>
            </span>
            <RouterLink class="DONTPrint" :to="`/schedule/${sport}/${paramYear}/${week}`">Weekly Schedule </RouterLink>
            <br />
            <div class="pad" v-if="!isMbkPostseason && !isBowlWeek">
              <template v-if="isWeekOne">
                <span style="float: left">
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${nextWeek}/text`">Next Week </RouterLink>
                </span>
              </template>
              <template v-else>
                <span style="float: left">
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${previousWeek}/text`"> Previous Week </RouterLink>
                </span>
                <span style="float: right" v-if="!isNextWeekMbkPostseason && !isNextWeekBowlWeek">
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${nextWeek}/text`">Next Week </RouterLink>
                </span>
              </template>
              <br class="mobilehide" />
            </div>
            <br />
            <p id="TextNav" class="DONTPrint">
              <!-- @Html.Partial("TimeZoneDropDown") -->
              <input type="button" id="ClearAll" value="Clear All Games" v-on:click="clearAllSelectedTextRows()"
                class="inputpad" />
              <input type="button" id="CheckAll" value="Check All Games" v-on:click="checkAllTextRows()"
                class="inputpad" />
            </p>
          </div>
        </div>
      </nav>
      <template v-if="tvGameResult">
        <!-- <form action="@ViewBag.ActionName" id="WeekForm" method="post"> -->
        <!-- @if (Model.ShowRSNPartialView)
              {
              @Html.Partial("CoverageNotes/" + Model.SportYear + "/FSNWeek" + Model.Week)
              } -->
        <WeekTextBase :season="year" :tvGames="tvGameResult.tvGames" :isBowlWeek="isBowlWeek"
          :isMbkPostseason="isMbkPostseason" :showPpvColumn="shouldShowPpvColumn(year)" />
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
