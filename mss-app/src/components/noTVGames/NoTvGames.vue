<script setup lang="ts">
import { DateTime } from 'luxon';
import NoTvGamesTable from './NoTvGamesTable.vue';
import { ref } from 'vue';
import { useNoTvSchedule } from '@/composables/useNoTvSchedule';

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
    <template v-if="noTvGamesLoading">Loading Week {{ week }} for {{ year }}</template>
    <template v-if="noTvGamesError">
      <p>Sorry. Got a bit of a problem. Let Matt know.</p>
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
