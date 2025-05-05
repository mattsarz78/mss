<script setup lang="ts">
import WeekTextBase from './WeekTextBase.vue';
import BackToTop from '@/components/shared/BackToTop.vue';
import { useWeekTextSchedule } from '@/composables/useWeekTextSchedule';
import { checkAllTextRows, clearAllSelectedTextRows } from '@/utils/domText';
import { shouldShowPpvColumn } from '@/utils/ppvColumn';
import Copyright from './shared/CopyrightLink.vue';
import AdsByGoogle from './shared/AdsByGoogle.vue';
import { useWeekScheduleNav } from '@/composables/useWeekScheduleNav';

const props = defineProps<{ week: string; sport: string; paramYear: string }>();
const { week, sport, paramYear } = props;

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
  isNextWeekBowlWeek,
  weekInt,
  year
} = useWeekScheduleNav(sport, paramYear, week);

const { tvGameResult, tvGameLoading, tvGameError } = useWeekTextSchedule(sport, year.value, weekInt);
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
              <button id="ClearAll" class="inputpad" @click="clearAllSelectedTextRows">Clear All Games</button>

              <button id="CheckAll" class="inputpad" @click="checkAllTextRows">Check All Games</button>
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

#TextNav {
  margin: 0;
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
