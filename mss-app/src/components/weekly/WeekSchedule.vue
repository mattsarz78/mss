<script setup lang="ts">
import { useWebExclusives } from '#composables/useWebExclusives.mjs';
import { useWeekSchedule } from '#composables/useWeekSchedule.mjs';
import { useWeekScheduleNav } from '#composables/useWeekScheduleNav.mjs';
import NoTvGames from '#noTv/NoTvGames.vue';
import AdsByGoogle from '#shared/AdsByGoogle.vue';
import BackToTop from '#shared/BackToTop.vue';
import Copyright from '#shared/CopyrightLink.vue';
import WeeklyBase from '#weekly/WeeklyBase.vue';
import { DateTime } from 'luxon';
import { computed } from 'vue';

const props = defineProps<{ week: string; sport: string; paramYear: string }>();
const { week, sport, paramYear } = props;

const year = computed(() =>
  sport === 'football' ? paramYear : `${paramYear.substring(0, 4)}${paramYear.substring(5)}`
);

const { buttonText, toggleWebExclusives } = useWebExclusives();

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

const gamesToday = computed(() => {
  const nowInET = DateTime.now().setZone('America/New_York');
  return seasonContentsResult.value?.seasonContents.seasonContents
    .filter((content: { week: number }) => content.week === weekInt.value)
    .some((content: { startDate: string; endDate: string }) => {
      const startIso = DateTime.fromISO(content.startDate).toUTC().toISO();
      const endIso = DateTime.fromISO(content.endDate).toUTC().toISO();
      const nowIso = nowInET.toISO({ includeOffset: false });
      if (!startIso || !endIso || !nowIso) return false;
      return startIso <= nowIso && endIso >= nowIso;
    });
});

const navbarClass = computed(() => {
  if (isMbkPostseason.value || isBowlWeek.value) {
    return 'short-height';
  }
  if (gamesToday.value) {
    return 'navbar-pad-height';
  }
  return 'navbar-height';
});

const { tvGameResult, tvGameLoading, tvGameError } = useWeekSchedule(sport, year.value, weekInt.value);
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
      <nav :class="`navbar DONTPrint ${navbarClass}`">
        <div class="container">
          <div class="flex-container">
            <div class="flex-row">
              <RouterLink to="/">Home</RouterLink>
            </div>
            <div class="flex-row">
              <RouterLink :to="`/season/${sport}/${paramYear}`">Season Home</RouterLink>
            </div>
            <div v-if="gamesToday" class="flex-row">
              <RouterLink :to="`/schedule/${sport}/daily`">Today's Schedule </RouterLink>
            </div>
          </div>
          <div class="flex-container">
            <div v-if="seasonContentsResult.seasonContents.flexScheduleLink" class="flex-row">
              <RouterLink :to="`/tv-windows/${paramYear}`" target="_blank" rel="noopener"
                >Available TV Windows
              </RouterLink>
            </div>
            <div class="flex-row">
              <RouterLink :to="`/schedule/${sport}/${paramYear}/${week}/text`">Customizable Text-Only Page</RouterLink>
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
                <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${nextWeek}` }">Next Week </RouterLink>
              </div>
            </template>
            <br class="mobilehide" />
          </div>
          <br />
          <div v-if="tvGameResult" class="filters">
            <button
              v-if="!isBowlWeek && !isMbkPostseason"
              id="btnWebGames"
              class="show_hideWeb buttonfont"
              @click="toggleWebExclusives">
              {{ buttonText }}
            </button>
          </div>
        </div>
      </nav>
    </template>
    <template v-if="tvGameResult">
      <WeeklyBase
        :tv-games="tvGameResult.tvGames.tvGames"
        :is-bowl-week="isBowlWeek"
        :is-mbk-postseason="isMbkPostseason"
        :show-ppv-column="tvGameResult.tvGames.showPPVColumn" />
      <NoTvGames v-if="!isBowlWeek && tvGameResult.tvGames.hasNoTVGames" :sport="sport" :year="year" :week="week" />
      <BackToTop />
      <AdsByGoogle />
      <Copyright />
    </template>
  </div>
</template>

<style scoped>
.show_hideWeb {
  display: inline-block;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: white;
  padding: 2px 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  display: block;
  align-items: center;
}

.navbar-height {
  height: 140px;
}

.navbar-pad-height {
  height: 155px;
}

.short-height {
  height: 69.5px;
}

.container {
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.filters {
  margin: 0;
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
  .short-height {
    height: 39.5px;
  }

  .navbar-pad-height,
  .navbar-height {
    height: 88px;
  }

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

  .blockspan {
    display: block;
    padding-bottom: 3px;
  }

  .mobilehide {
    display: none;
  }

  .buttonfont {
    font-size: 0.9em;
  }

  .navbar {
    padding: 10px 3px;
  }
}
</style>
