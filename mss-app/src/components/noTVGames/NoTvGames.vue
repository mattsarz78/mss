<script setup lang="ts">
import { DateTime } from 'luxon';
import NoTvGamesTable from './NoTvGamesTable.vue';
import { ref } from 'vue';
import { useNoTvSchedule } from '@/composables/useNoTvSchedule';

const props = defineProps<{ week: string; year: string }>();
const { week, year } = props;

const { noTvGamesResults, noTvGamesLoading, noTvGamesError, datesList } = useNoTvSchedule(week, year);

const showNoTV = ref(false);

const toggleNoTV = () => {
  const button = document.getElementById('btnConferenceGames');
  if (!button) return;
  button.innerText = showNoTV.value ? 'Show Non-Televised Games' : 'Hide Non-Televised Games';
  showNoTV.value = !showNoTV.value;
};
</script>

<template>
  <div>
    <button id="btnConferenceGames" class="show_hideNoTV" @click="toggleNoTV">Show Non-Televised Games</button>
    <div v-if="noTvGamesLoading">Loading Week {{ week }} for {{ year }}</div>
    <div v-if="noTvGamesError">Sorry. Got a bit of a problem. Let Matt know.</div>
    <div v-show="showNoTV && noTvGamesResults" class="slidingNoTVDiv">
      <p v-if="!noTvGamesResults?.noTvGames.length">
        All FBS games scheduled for this week are being televised or shown online
      </p>
      <NoTvGamesTable
        v-for="(noTVDate, index) in datesList"
        :key="index"
        :no-tv-date="noTVDate"
        :no-tv-games-for-date="
          noTvGamesResults?.noTvGames.filter(
            (x) => DateTime.fromISO(x.timeWithOffset).toLocal().toISODate() === noTVDate
          ) || []
        " />
      <br />
    </div>
  </div>
</template>

<style scoped>
.slidingNoTVDiv {
  padding-top: 10px;
}

.show_hideNoTV {
  display: inline-block;
}
</style>
