<script setup lang="ts">
import type { NoTvGame } from '@/graphQl';
import { DateTime } from 'luxon';
import NoTvGamesTable from '../noTVGames/NoTvGamesTable.vue';
import { computed } from 'vue';

const props = defineProps<{ noTvGames: NoTvGame[] }>();
const { noTvGames } = props;

const datesList = computed(() => {
  const dates = new Set<string>();
  noTvGames.forEach((value) => {
    const date = DateTime.fromISO(value.timeWithOffset).toLocal().toISODate()!;
    dates.add(date);
  });
  return Array.from(dates);
});

const toggleNoTV = () => {
  const noTVDiv = document.querySelector('.slidingNoTVDiv') as HTMLElement;
  const button = document.querySelector('#btnConferenceGames') as HTMLInputElement;

  if (noTVDiv.style.display === 'none' || !noTVDiv.style.display) {
    noTVDiv.style.display = 'block';
    button.value = 'Hide Non-Televised Games';
  } else {
    noTVDiv.style.display = 'none';
    button.value = 'Show Non-Televised Games';
  }
};

</script>

<template>
  <div>
    <input id="btnConferenceGames" type="button" value="Show Non-Televised Games" class="show_hideNoTV"
      v-on:click="toggleNoTV()" />
    <div class="slidingNoTVDiv">
      <p v-if="!noTvGames.length">All FBS games scheduled for this week are being televised or shown online</p>
      <NoTvGamesTable v-for="(noTVDate, index) in datesList" :key="index" :noTvDate="noTVDate" :noTvGamesForDate="noTvGames.filter((x) => DateTime.fromISO(x.timeWithOffset).toLocal().toISODate() === noTVDate)
        " />
      <br />
    </div>
  </div>
</template>

<style scoped>
.slidingNoTVDiv {
  display: none;
  padding-top: 10px;
}

.show_hideNoTV {
  display: inline-block;
}
</style>
