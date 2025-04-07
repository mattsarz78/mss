<script setup lang="ts">
import { useDailyTvTextGames } from '@/composables/useDailyTvTextGames';
import { clearAllSelectedTextRows, checkAllTextRows } from '@/utils/dom';
import { shouldShowPpvColumn } from '@/utils/conference';
import WeekTextBase from '@/components/WeekTextBase.vue';

const { dailyTvGameResult, dailyTvGameLoading, dailyTvGameError, season, paramYear, sport, startDate } =
  useDailyTvTextGames();
</script>

<template>
  <div>
    <div v-if="dailyTvGameLoading">Loading {{ sport }} for {{ startDate }}</div>
    <div v-if="dailyTvGameError">Got a problem. Let Matt know.</div>
    <div v-if="dailyTvGameResult">
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
              <input
                id="ClearAll"
                type="button"
                value="Clear All Games"
                class="inputpad"
                @click="clearAllSelectedTextRows()" />
              <input id="CheckAll" type="button" value="Check All Games" class="inputpad" @click="checkAllTextRows()" />
            </p>
          </div>
        </div>
      </nav>
      <template v-if="dailyTvGameResult">
        <WeekTextBase
          :season="paramYear"
          :tv-games="dailyTvGameResult.dailyTvGames"
          :is-bowl-week="false"
          :is-mbk-postseason="false"
          :show-ppv-column="shouldShowPpvColumn(paramYear)" />
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
