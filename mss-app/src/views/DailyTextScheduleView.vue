<script setup lang="ts">
import { useDailyTvTextGames } from '@/composables/useDailyTvTextGames';
import { clearAllSelectedTextRows, checkAllTextRows } from '@/utils/domText';
import { shouldShowPpvColumn } from '@/utils/ppvColumn';
import WeekTextBase from '@/components/WeekTextBase.vue';
import { DateTime } from 'luxon';
import { addMetaTags } from '@/utils/metaTags';
import Copyright from '@/components/shared/CopyrightLink.vue';
import BackToTop from '@/components/shared/BackToTop.vue';
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';

const title = `Daily TV Games for ${DateTime.now().toFormat('LLLL dd, yyyy')}`;

addMetaTags(title);

const { dailyTvGameResult, dailyTvGameLoading, dailyTvGameError, season, paramYear, sport, startDate } =
  useDailyTvTextGames();
</script>

<template>
  <div>
    <template v-if="dailyTvGameLoading">Loading {{ sport }} for {{ startDate }}</template>
    <template v-if="dailyTvGameError">Got a problem. Let Matt know.</template>
    <template v-if="dailyTvGameResult">
      <nav class="navbar DONTPrint">
        <div class="container">
          <div>
            <span>
              <RouterLink class="homelink" to="/">Home</RouterLink>
              <RouterLink class="seasonhome" :to="`/season/${sport}/${season}`">Season Home </RouterLink>
            </span>
            <RouterLink class="DONTPrint" :to="`/schedule/${sport}/daily`"> Daily Schedule </RouterLink>
            <br />
            <p id="TextNav" class="pad DONTPrint">
              <button id="ClearAll" class="inputpad" @click="clearAllSelectedTextRows">Clear All Games</button>

              <button id="CheckAll" class="inputpad" @click="checkAllTextRows">Check All Games</button>
            </p>
          </div>
        </div>
      </nav>
      <WeekTextBase :season="paramYear" :tv-games="dailyTvGameResult.dailyTvGames" :is-bowl-week="false"
        :is-mbk-postseason="false" :show-ppv-column="shouldShowPpvColumn(paramYear)" />
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
