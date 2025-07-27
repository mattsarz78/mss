<script setup lang="ts">
import { useDailyTvTextGames } from '#composables/useDailyTvTextGames.mjs';
import AdsByGoogle from '#shared/AdsByGoogle.vue';
import BackToTop from '#shared/BackToTop.vue';
import Copyright from '#shared/CopyrightLink.vue';
import WeekTextBase from '#text/WeekTextBase.vue';
import { checkAllTextRows, clearAllSelectedTextRows } from '#utils/domText.mjs';
import { addMetaTags } from '#utils/metaTags.mjs';
import { DateTime } from 'luxon';

const title = `Daily TV Games for ${DateTime.now().toFormat('LLLL dd, yyyy')}`;

addMetaTags(title);

const { dailyTvGameResult, dailyTvGameLoading, dailyTvGameError, season, paramYear, sport, startDate } =
  useDailyTvTextGames();
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
            <div class="flex-row">
              <RouterLink :to="`/season/${sport}/${season}`">Season Home </RouterLink>
            </div>
            <div class="flex-row">
              <RouterLink class="DONTPrint" :to="`/schedule/${sport}/daily`"> Daily Schedule </RouterLink>
            </div>
          </div>
          <br />
          <p id="TextNav" class="pad DONTPrint">
            <button id="ClearAll" class="inputpad buttonfont" @click="clearAllSelectedTextRows">Clear All Games</button>

            <button id="CheckAll" class="inputpad buttonfont" @click="checkAllTextRows">Check All Games</button>
          </p>
        </div>
      </nav>
      <WeekTextBase
        :season="paramYear"
        :tv-games="dailyTvGameResult.dailyTvGames.tvGames"
        :is-bowl-week="false"
        :is-mbk-postseason="false"
        :show-ppv-column="dailyTvGameResult.dailyTvGames.showPPVColumn" />
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  width: 100%;
  background-color: white;
  padding: 2px 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  align-items: center;
  height: 119.5px;
  display: block;
}

.pad {
  padding: 5px 0;
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

@media all and (min-width: 641px) {
  .buttonfont {
    font-size: 14px;
  }
}

@media only screen and (max-width: 640px) {
  .navbar {
    height: 60px;
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
