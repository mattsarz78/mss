<script setup lang="ts">
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';
import BackToTop from '@/components/shared/BackToTop.vue';
import Copyright from '@/components/shared/CopyrightLink.vue';
import WeekTextBase from '@/components/weeklyText/WeekTextBase.vue';
import { checkAllTextRows, clearAllSelectedTextRows } from '@/utils/domText';
import { useWeekScheduleNav } from '@composables/useWeekScheduleNav';
import { useWeekTextSchedule } from '@composables/useWeekTextSchedule';
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
    <template v-if="seasonContentsLoading || tvGameLoading">
      <div class="loading-container">
        <p class="loading-text">Loading Week {{ week }} for {{ paramYear }}</p>
      </div>
    </template>
    <template v-if="seasonContentsError || tvGameError">
      <div class="error-container">
        <p>Sorry. Got a bit of a problem. Let Matt know.</p>
      </div>
    </template>
    <template v-if="seasonContentsResult && tvGameResult">
      <nav class="navbar DONTPrint">
        <div class="container">
          <div class="flex-container">
            <div class="flex-row">
              <RouterLink to="/">Home</RouterLink>
            </div>
            <div class="flex-row">
              <RouterLink :to="`/season/${sport}/${paramYear}`">Season Home</RouterLink>
            </div>
            <div class="flex-row">
              <RouterLink class="DONTPrint" :to="`/schedule/${sport}/${paramYear}/${week}`">
                Weekly Schedule
              </RouterLink>
            </div>
          </div>
          <div v-if="!isMbkPostseason && !isBowlWeek" class="flex-container-row pad">
            <template v-if="isWeekOne">
              <div class="flex-row-left">
                <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${nextWeek}` }">Next Week</RouterLink>
              </div>
            </template>
            <template v-else>
              <div class="flex-row-left">
                <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${previousWeek}` }"
                  >Previous Week
                </RouterLink>
              </div>
              <div v-if="!isNextWeekMbkPostseason && !isNextWeekBowlWeek" class="flex-row-right">
                <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${nextWeek}`, force: true }"
                  >Next Week
                </RouterLink>
              </div>
            </template>
            <br class="mobilehide" />
          </div>
          <br />
          <p id="TextNav" class="DONTPrint">
            <button id="ClearAll" class="inputpad buttonfont" @click="clearAllSelectedTextRows">Clear All Games</button>

            <button id="CheckAll" class="inputpad buttonfont" @click="checkAllTextRows">Check All Games</button>
          </p>
        </div>
      </nav>
    </template>

    <template v-if="tvGameResult">
      <WeekTextBase
        :season="year"
        :tv-games="tvGameResult.tvGames.tvGames"
        :is-bowl-week="isBowlWeek"
        :is-mbk-postseason="isMbkPostseason"
        :show-ppv-column="tvGameResult.tvGames.showPPVColumn" />
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
  right: 0;
  z-index: 9999;
  width: 100%;
  background-color: white;
  padding: 2px 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  display: block;
  align-items: center;
  height: 119.5px;
}

.pad {
  padding: 5px 0;
}

.loading-container,
.error-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #eee;
}

.loading-text {
  font-size: 1.2em;
  color: #666;
}

.flex-container {
  display: flex;
  flex-direction: column;
}

.flex-container-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.flex-row-left {
  margin-right: 40%;
}

.flex-row-right {
  margin-left: 40%;
}

@media all and (min-width: 641px) {
  .buttonfont {
    font-size: 14px;
  }
}

@media only screen and (max-width: 640px) {
  .flex-container {
    flex-direction: row;
    padding-bottom: 4px;
  }

  .flex-row {
    padding-right: 10px;
  }

  .flex-row-left {
    margin-right: 30%;
  }

  .flex-row-right {
    margin-left: 30%;
  }

  .navbar {
    height: 70px;
    padding: 10px 3px;
  }

  .DONTPrint a {
    line-height: 13px;
  }

  .mobilehide {
    display: none;
  }

  .buttonfont {
    font-size: 0.9em;
  }
}
</style>
