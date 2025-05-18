<script setup lang="ts">
import WeekTextBase from './WeekTextBase.vue';
import BackToTop from '@/components/shared/BackToTop.vue';
import { useWeekTextSchedule } from '@/composables/useWeekTextSchedule';
import { checkAllTextRows, clearAllSelectedTextRows } from '@/utils/domText';
import { shouldShowPpvColumn } from '@/utils/ppvColumn';
import Copyright from './shared/CopyrightLink.vue';
import AdsByGoogle from './shared/AdsByGoogle.vue';
import { useWeekScheduleNav } from '@/composables/useWeekScheduleNav';
import { computed } from 'vue';

const props = defineProps<{ week: string; sport: string; paramYear: string }>();
const { week, sport, paramYear } = props;

const year = computed(() =>
  sport === 'football' ? paramYear : `${paramYear.substring(0, 4)}${paramYear.substring(5)}`
);

const weekInt = computed(() => parseInt(week));

const {
  seasonContentsResult,
  seasonContentsLoading,
  seasonContentsError,
  nextWeek,
  previousWeek,
  isBowlWeek,
  isMbkPostseason,
  isWeekOne,
  isNextWeekMbkPostseason,
  isNextWeekBowlWeek
} = useWeekScheduleNav(sport, year.value, weekInt.value);

const { tvGameResult, tvGameLoading, tvGameError } = useWeekTextSchedule(sport, year.value, weekInt.value);
</script>

<template>
  <div>
    <template v-if="seasonContentsLoading || tvGameLoading">Loading Week {{ week }} for {{ paramYear }}</template>
    <template v-if="seasonContentsError || tvGameError">
      <p>Sorry. Got a bit of a problem. Let Matt know.</p>
    </template>
    <template v-if="seasonContentsResult && !(tvGameError || seasonContentsError)">
      <nav class="navbar DONTPrint">
        <div class="container">
          <div>
            <span>
              <RouterLink class="homelink" to="/">Home</RouterLink>
              <RouterLink class="seasonhome" :to="`/season/${sport}/${paramYear}`">Season Home</RouterLink>
            </span>
            <RouterLink class="DONTPrint" :to="`/schedule/${sport}/${paramYear}/${week}`"> Weekly Schedule </RouterLink>
            <br />
            <div v-if="!isMbkPostseason && !isBowlWeek" class="pad">
              <template v-if="isWeekOne">
                <span style="float: left">
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${nextWeek}/text`">Next Week</RouterLink>
                </span>
              </template>
              <template v-else>
                <span style="float: left">
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${previousWeek}/text`">Previous Week</RouterLink>
                </span>
                <span v-if="!isNextWeekMbkPostseason && !isNextWeekBowlWeek" style="float: right">
                  <RouterLink :to="`/schedule/${sport}/${paramYear}/${nextWeek}/text`">Next Week</RouterLink>
                </span>
              </template>
              <br class="mobilehide" />
            </div>
            <br />
            <p id="TextNav" class="DONTPrint">
              <button id="ClearAll" class="inputpad buttonfont" @click="clearAllSelectedTextRows">
                Clear All Games
              </button>

              <button id="CheckAll" class="inputpad buttonfont" @click="checkAllTextRows">Check All Games</button>
            </p>
          </div>
        </div>
      </nav>
    </template>

    <template v-if="tvGameResult">
      <WeekTextBase
        :season="year"
        :tv-games="tvGameResult.tvGames"
        :is-bowl-week="isBowlWeek"
        :is-mbk-postseason="isMbkPostseason"
        :show-ppv-column="shouldShowPpvColumn(year)" />
      <BackToTop />
      <AdsByGoogle />
      <Copyright />
    </template>
  </div>
</template>

<style scoped>
.inputpad {
  padding-left: 10px;
  margin-right: 3px;
}

.container {
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
}

#TextNav {
  margin: 0;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  background-color: white;
  padding: 2px 0;
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

  .buttonfont {
    font-size: 14px;
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

  .buttonfont {
    font-size: 0.9em;
  }
}
</style>
