<script setup lang="ts">
import type { NoTvGame } from '@/graphQl';
import { updatedTvOptions } from '@/utils/game';
import { DateTime } from 'luxon';
import { computed } from 'vue';

const props = defineProps<{ noTvGamesForDate: NoTvGame[]; noTvDate: string }>();
const { noTvGamesForDate, noTvDate } = props;

const formattedDate = computed(() => DateTime.fromISO(noTvDate).toFormat('DDDD'));
</script>

<template>
  <div>
    <h3>{{ formattedDate }}</h3>
    <table class="noTVTable">
      <thead>
        <tr class="header">
          <th>Game</th>
          <th>Conference</th>
          <th>Television Options</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(noTvGameForDate, index) in noTvGamesForDate" :key="index" :class="{ fcsgame: noTvGameForDate.fcs }">
          <td class="game">
            <template v-if="noTvGameForDate.gameTitle">
              <b
                ><i>{{ noTvGameForDate.gameTitle }}</i></b
              ><br />
            </template>
            <template v-if="noTvGameForDate.location">
              <template v-if="noTvGameForDate.visitingTeam">
                {{ noTvGameForDate.visitingTeam }} vs. {{ noTvGameForDate.homeTeam }}<br />
              </template>
              (at {{ noTvGameForDate.location }})
            </template>
            <template v-else>
              <template v-if="noTvGameForDate.visitingTeam">
                {{ noTvGameForDate.visitingTeam }} at {{ noTvGameForDate.homeTeam }}<br />
              </template>
            </template>
          </td>
          <td class="conference">
            {{ noTvGameForDate.conference }}
          </td>
          <td class="telecast">
            {{ updatedTvOptions(noTvGameForDate) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.fcsgame {
  background-color: #ff0;
}

.game,
.conference,
.telecast {
  border: medium solid Gray;
  border-width: thin;
}

.noTVTable {
  background-color: #fff;
  border: 2px ridge #fff;
  border-spacing: 1px;
  border-collapse: collapse;
}

.conference,
.telecast {
  text-align: center;
  padding: 5px;
}

.game {
  width: 243px;
}

.conference {
  width: 100px;
}

.telecast {
  width: 400px;
}

@media all and (min-width: 641px) {
  .game {
    padding: 2px;
  }
}

@media only screen and (max-width: 640px) {
  .game {
    padding: 1px;
  }
}
</style>
