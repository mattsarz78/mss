<script setup lang="ts">
import type { NoTvGame } from '@/graphQl';
import { DateTime } from 'luxon';
import NoTvGamesTable from './NoTvGamesTable.vue';
import { computed, ref } from 'vue';

const props = defineProps<{ noTvGames: NoTvGame[] }>();
const { noTvGames } = props;

const datesList = computed(() => {
  const dates = new Set<string>();
  noTvGames.forEach((value) => {
    const date = DateTime.fromISO(value.timeWithOffset).toLocal().toISODate();
    if (date) {
      dates.add(date);
    }
  });
  return Array.from(dates);
});

const showNoTV = ref(false);

const toggleNoTV = () => {
  showNoTV.value = !showNoTV.value;
};
</script>

<template>
  <div>
    <input
      id="btnConferenceGames"
      type="button"
      :value="showNoTV ? 'Hide Non-Televised Games' : 'Show Non-Televised Games'"
      class="show_hideNoTV"
      @click="toggleNoTV"
    >
    <div
      v-show="showNoTV"
      class="slidingNoTVDiv"
    >
      <p v-if="!noTvGames.length">
        All FBS games scheduled for this week are being televised or shown online
      </p>
      <NoTvGamesTable
        v-for="(noTVDate, index) in datesList"
        :key="index"
        :no-tv-date="noTVDate"
        :no-tv-games-for-date="noTvGames.filter((x) => DateTime.fromISO(x.timeWithOffset).toLocal().toISODate() === noTVDate)"
      />
      <br>
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