<script setup lang="ts">
import type { ConferenceGame } from '@/graphQl';
import { formatGame, formatTime } from '@/utils/game';
import { formatNetworkJpgAndCoverage } from '@/utils/image';
import { DateTime } from 'luxon';
import { computed } from 'vue';

const props = defineProps<{ games: ConferenceGame[]; year: string }>();
const { games, year } = props;

const formattedGames = computed(() =>
  games.map((game) => ({
    ...game,
    formattedNetwork: game.network ? formatNetworkJpgAndCoverage(game.network, year) : '',
    formattedTime: {
      day: DateTime.fromISO(game.timeWithOffset).toLocal().toFormat('cccc'),
      date: DateTime.fromISO(game.timeWithOffset).toLocal().toFormat('LL/dd'),
      time: formatTime(game.timeWithOffset)
    }
  }))
);
</script>

<template>
  <table class="noTVTable">
    <thead>
      <tr class="header">
        <th>Game</th>
        <th>Network</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(game, index) in formattedGames" :key="index">
        <td class="game">
          <template v-if="game.gameTitle">
            <b
              ><i>{{ game.gameTitle }}</i></b
            ><br />
          </template>
          <template v-if="game.visitingTeam.length === 0" />
          <template v-else-if="game.visitingTeam.length === 1 && game.homeTeam.length === 1">
            {{ game.visitingTeam[0] }} {{ game.location ? 'vs.' : 'at' }} {{ game.homeTeam[0] }}<br />
          </template>
          <template v-else>
            {{ formatGame(game) }}
          </template>
          <template v-if="game.location"> (at {{ game.location }}) </template>
        </td>
        <!-- eslint-disable-next-line -->
        <td class="network" v-html="game.formattedNetwork" />
        <td class="time">
          {{ game.formattedTime.day }}<br />{{ game.formattedTime.date }}<br />{{ game.formattedTime.time }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.game,
.time,
.network {
  border: medium solid Gray;
  border-width: thin;
}

.network {
  text-align: center;
}

.time {
  width: 60px;
  text-align: right;
  padding: 2px;
}

.game {
  width: 243px;
}

.noTVTable {
  background-color: #fff;
  border: 2px ridge #fff;
  border-spacing: 1px;
  border-collapse: collapse;
  font-family: Arial;
}

:deep(.linkblock) {
  display: inline-block;
  padding-top: 7px;
  padding-bottom: 2px;
}

@media all and (min-width: 641px) {
  .game {
    padding: 2px;
  }

  .network {
    width: 135px;
    padding: 2px;
  }

  :deep(.imageDimensions) {
    height: 40px;
    width: 55px;
  }

  #Main {
    padding-top: 56px;
  }
}

@media only screen and (max-width: 640px) {
  .game {
    padding: 1px;
  }

  .network {
    width: 90px;
    padding: 0;
  }

  :deep(.imageDimensions) {
    height: 29px;
    width: 40px;
  }

  #Main {
    padding-top: 61px;
  }
}
</style>
