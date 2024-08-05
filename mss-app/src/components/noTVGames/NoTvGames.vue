<script setup lang="ts">
import type { NoTvGame } from '@/graphQl';
import { DateTime } from 'luxon';
import NoTvGamesTable from '../noTVGames/NoTvGamesTable.vue';

const props = defineProps(['noTvGames']);
const noTvGames = props['noTvGames'] as NoTvGame[];
const datesList: string[] = [];

noTvGames.map((value) => {
  const date = DateTime.fromISO(value.timeWithOffset).toLocal().toISODate()!;
  if (!datesList.some((dateFromList) => dateFromList === date)) {
    datesList.push(date);
  }
});
const toggleNoTV = () => {
  const noTVDiv = document.querySelector('.slidingNoTVDiv') as HTMLElement;
  if (noTVDiv.hasAttribute('style')) {
    noTVDiv.style.display === 'none' ? (noTVDiv.style.display = 'block') : (noTVDiv.style.display = 'none');
  } else {
    noTVDiv.style.display = 'block';
  }

  const buttonTitle = document.querySelector('#btnConferenceGames')?.getAttribute('value');

  buttonTitle?.startsWith('Show')
    ? document.querySelector('#btnConferenceGames')?.setAttribute('value', 'Hide Non-Televised Games')
    : document.querySelector('#btnConferenceGames')?.setAttribute('value', 'Show Non-Televised Games');
};
</script>

<template>
  <div>
    <input id="btnConferenceGames" type="button" value="Show Non-Televised Games" class="show_hideNoTV"
      v-on:click="toggleNoTV()" />
    <div class="slidingNoTVDiv">
      <p v-if="!noTvGames.length">All FBS games scheduled for this week are being televised or shown online</p>
      <NoTvGamesTable v-for="(noTVDate, index) of datesList" :key="index" :noTvDate="noTVDate" :noTvGamesForDate="noTvGames.filter((x) => DateTime.fromISO(x.timeWithOffset).toLocal().toISODate() === noTVDate)
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
