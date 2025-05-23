<script setup lang="ts">
import { useRoute } from 'vue-router';
import BackToTop from '@/components/shared/BackToTop.vue';
import WeeklyBase from '@/components/weekly/WeeklyBase.vue';
import { useDailyTvGames } from '@/composables/useDailyTvGames';
import { shouldShowPpvColumn } from '@/utils/ppvColumn';
import { useWebExclusives } from '@/composables/webExclusives';
import { DateTime } from 'luxon';
import { addMetaTags } from '@/utils/metaTags';
import Copyright from '@/components/shared/CopyrightLink.vue';
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';

const route = useRoute();
const { sport } = route.params as { sport: string };

const title = `Daily TV Games for ${DateTime.now().toFormat('LLLL dd, yyyy')}`;

const { buttonText, toggleWebExclusives } = useWebExclusives();

addMetaTags(title);

const {
  result: dailyTvGameResult,
  loading: dailyTvGameLoading,
  error: dailyTvGameError,
  season,
  flexLink,
  startDate
} = useDailyTvGames(sport);
</script>

<template>
  <div v-reset-adsense-height>
    <template v-if="dailyTvGameLoading">
      <div class="loading-container">
        <p class="loading-text">Loading {{ sport }} for {{ startDate }}</p>
      </div>
    </template>
    <template v-if="dailyTvGameError">
      <div class="error-container">
        <p>Sorry. Got a bit of a problem. Let Matt know.</p>
      </div>
    </template>
    <template v-if="dailyTvGameResult">
      <nav class="navbar DONTPrint">
        <div class="container">
          <div class="flex-container">
            <div class="flex-row">
              <RouterLink to="/">Home</RouterLink>
            </div>
            <div v-if="season" class="flex-row">
              <RouterLink :to="`/season/${sport}/${season}`">Season Home</RouterLink>
            </div>
          </div>
          <div class="flex-container">
            <div v-if="flexLink" class="flex-row">
              <RouterLink :to="`/tv-windows/${season}`" target="_blank">Available TV Windows </RouterLink>
            </div>
            <div class="flex-row">
              <RouterLink :to="`/schedule/${sport}/${season}/daily/text`">Customizable Text-Only Page </RouterLink>
            </div>
            <br />
          </div>
          <div v-if="dailyTvGameResult" class="filters">
            <button id="btnWebGames" class="show_hideWeb buttonfont" @click="toggleWebExclusives">
              {{ buttonText }}
            </button>
          </div>
        </div>
      </nav>
      <WeeklyBase
        :tv-games="dailyTvGameResult.dailyTvGames"
        :is-bowl-week="false"
        :is-mbk-postseason="false"
        :show-ppv-column="shouldShowPpvColumn(season)" />
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

:deep(.imgBorder) {
  border: 0;
}

.filters {
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
  min-height: 70px;
  display: block;
  align-items: center;
}

.container {
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
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

@media all and (min-width: 641px) {
  .filters {
    margin-top: 10px;
  }

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

  .blockspan {
    display: block;
    padding-bottom: 3px;
  }

  .filters {
    margin-top: 5px;
  }

  .buttonfont {
    font-size: 0.9em;
  }

  .navbar {
    height: 58px;
    padding: 10px 3px;
  }
}
</style>
