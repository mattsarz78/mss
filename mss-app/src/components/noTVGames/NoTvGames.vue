<script setup lang="ts">
import { useNoTvSchedule } from '#composables/useNoTvSchedule.mjs';
import NoTvGamesTable from '#noTv/NoTvGamesTable.vue';
import { DateTime } from 'luxon';
import { ref } from 'vue';

const props = defineProps<{ week: string; year: string }>();
const { week, year } = props;

const { noTvGamesResults, noTvGamesLoading, noTvGamesError, datesList, load } = useNoTvSchedule(week, year);

const showNoTV = ref(false);

const toggleNoTV = async () => {
  await load();
  const button = document.getElementById('btnConferenceGames');
  if (!button) return;
  button.innerText = showNoTV.value ? 'Show Non-Televised Games' : 'Hide Non-Televised Games';
  showNoTV.value = !showNoTV.value;
};
</script>

<template>
  <div>
    <button id="btnConferenceGames" class="show_hideNoTV buttonfont" @click="toggleNoTV">
      Show Non-Televised Games
    </button>
    <br />
    <template v-if="noTvGamesLoading">
      <div class="loading-container">
        <p class="loading-text">Loading Week {{ week }} for {{ year }}</p>
      </div>
    </template>
    <template v-if="noTvGamesError">
      <div class="error-container">
        <p>Sorry. Got a bit of a problem. Let Matt know.</p>
      </div>
    </template>
    <template v-if="showNoTV && noTvGamesResults">
      <div class="slidingNoTVDiv">
        <p v-if="!noTvGamesResults?.noTvGames.length">
          All FBS games scheduled for this week are being televised or shown online
        </p>
        <NoTvGamesTable
          v-for="(noTVDate, index) in datesList"
          :key="index"
          :no-tv-date="noTVDate"
          :no-tv-games-for-date="
            noTvGamesResults?.noTvGames.filter(
              (x) => DateTime.fromISO(x.timeWithOffset).setZone('America/New_York').toISODate() === noTVDate
            ) || []
          " />
        <br />
      </div>
    </template>
  </div>
</template>

<style scoped>
.slidingNoTVDiv {
  padding-top: 10px;
}

.show_hideNoTV {
  display: inline-block;
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

@media only screen and (max-width: 640px) {
  .buttonfont {
    font-size: 0.9em;
  }
}

@media all and (min-width: 641px) {
  .buttonfont {
    font-size: 14px;
  }
}
</style>
