<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import WeekTextBase from './WeekTextBase.vue';
import BackToTopButton from '../components/shared/BackToTopButton.vue';
import { useWeekTextSchedule } from '@/composables/useWeekTextSchedule';
import { clearAllSelectedTextRows, checkAllTextRows, shouldShowPpvColumn } from '@/utils';

const GoogleSearch = defineAsyncComponent(() => import('../components/shared/GoogleSearchBar.vue'));
const BackToTopScript = defineAsyncComponent(() => import('../components/shared/BackToTopScript.vue'));

const props = defineProps<{ week: string; sport: string; paramYear: string }>();
const { week, sport, paramYear } = props;

const {
  tvGameResult,
  tvGameLoading,
  tvGameError,
  seasonContentsResult,
  seasonContentsLoading,
  seasonContentsError,
  year,
  nextWeek,
  previousWeek,
  isBowlWeek,
  isMbkPostseason,
  isWeekOne,
  isNextWeekMbkPostseason,
  isNextWeekBowlWeek
} = useWeekTextSchedule(sport, paramYear, week);
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
              >Season Home</RouterLink>
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
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${nextWeek}/text`">Next Week</RouterLink>
                </span>
              </template>
              <template v-else>
                <span style="float: left">
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${previousWeek}/text`">Previous Week</RouterLink>
                </span>
                <span
                  v-if="!isNextWeekMbkPostseason && !isNextWeekBowlWeek"
                  style="float: right"
                >
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${nextWeek}/text`">Next Week</RouterLink>
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