<script setup lang="ts">
import type { NoTvGame } from '@/graphQl';
import { updatedTvOptions } from '@/utils';
import { DateTime } from 'luxon';
import { computed } from 'vue';

const props = defineProps<{ noTvGamesForDate: NoTvGame[]; noTvDate: string }>();
const { noTvGamesForDate, noTvDate } = props;

const formattedDate = computed(() => DateTime.fromISO(noTvDate).toFormat('DDDD'));
</script>

<template>
  <p>
    {{ formattedDate }}
  <table class="noTVTable">
    <tbody>
      <tr class="header">
        <th>Game</th>
        <th>Conference</th>
        <th>Television Options</th>
      </tr>
      <template v-for="(noTvGameForDate, index) of noTvGamesForDate" :key="index">
        <tr :class="noTvGameForDate.fcs ? 'fcsgame' : ''">
          <td class="game">
            <template v-if="noTvGameForDate.gameTitle">
              <b><i>{{ noTvGameForDate.gameTitle }}</i></b><br />
            </template>
            <template v-if="noTvGameForDate.location">
              <template v-if="noTvGameForDate.visitingTeam">
                {{ noTvGameForDate.visitingTeam }} vs. {{ noTvGameForDate.homeTeam }}<br />
              </template>
              (at {{ noTvGameForDate.location }})</template>
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
      </template>
    </tbody>
  </table>
  </p>
</template>

<style scoped>
.fcsgame {
  background-color: #ff0;
}

.game {
  width: 243px;
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
}

.noTVTable {
  background-color: #fff;
  border-color: #fff;
  border-style: ridge;
  border-width: 2px;
  border-spacing: 1px;
  border-collapse: collapse;
  font-family: Arial;
}

.conference {
  width: 100px;
  text-align: center;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 5px;
}

.telecast {
  width: 400px;
  text-align: center;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 5px;
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
