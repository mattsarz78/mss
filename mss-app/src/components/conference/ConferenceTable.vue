<script setup lang="ts">
import type { ConferenceGame } from '@/graphQl';
import { formatGame, formatTime } from '../../utils';
import { formatNetworkJpgAndCoverage } from '../../imageUtils';
import { DateTime } from 'luxon';

const props = defineProps(['games', 'year']);
const games: ConferenceGame[] = props['games'];
const year: string = props['year'];
</script>

<template>
  <table class="noTVTable">
    <tbody>
      <tr class="header">
        <th>Game</th>
        <th>Network</th>
        <th>Time</th>
      </tr>
      <tr v-for="(game, index) of games" :key="index">
        <td class="game">
          <template v-if="game.gameTitle">
            <b><i>{{ game.gameTitle }}</i></b><br />
          </template>
          <template v-if="game.visitingTeam!.length === 0"></template>
          <template v-else-if="game.visitingTeam!.length === 1 && game.homeTeam!.length === 1">
            {{ game.visitingTeam![0] }} {{ game.location ? 'vs.' : 'at' }} {{ game.homeTeam![0] }}<br>
          </template>
          <template v-else> {{ formatGame(game) }} </template>
          <template v-if="game.location">(at {{ game.location }})</template>
        </td>
        <td class="network" v-html="formatNetworkJpgAndCoverage(game.network!, year)" />
        <td class="time">
          {{ DateTime.fromISO(game.timeWithOffset!).toLocal().toFormat('cccc') }}<br />{{
            DateTime.fromISO(game.timeWithOffset!).toLocal().toFormat('LL/dd')
          }}<br />{{ formatTime(game.timeWithOffset!) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.game,
.time,
.network {
  border: medium;
  border-style: solid;
  border-color: Gray;
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
  border-color: #fff;
  border-style: ridge;
  border-width: 2px;
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
