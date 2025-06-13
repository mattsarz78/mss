<script setup lang="ts">
import type { ConferenceGame } from '@/graphQl';
import { formatGame, formatTime } from '@/utils/game';
import { DateTime } from 'luxon';
import { computed } from 'vue';

const props = defineProps<{ games: ConferenceGame[] }>();
const { games } = props;

const getTimeSource = (timeWithOffset: string) => {
  const eastern = DateTime.fromISO(timeWithOffset).setZone('America/New_York');
  return eastern.toFormat('t') === '12:00 AM' ? eastern : DateTime.fromISO(timeWithOffset).toLocal();
};

const formattedGames = computed(() =>
  games.map((game) => ({
    ...game,
    formattedNetwork: game.network ?? '',
    formattedTime: {
      day: getTimeSource(game.timeWithOffset).toFormat('cccc'),
      date: getTimeSource(game.timeWithOffset).toFormat('LL/dd'),
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
            <span class="gameTitle">{{ game.gameTitle }}</span>
            <br />
          </template>
          <template v-if="game.visitingTeam.length === 0" />
          <template v-else-if="game.visitingTeam.length === 1 && game.homeTeam.length === 1">
            {{ game.visitingTeam[0] }} {{ game.location ? 'vs.' : 'at' }} {{ game.homeTeam[0] }}<br />
          </template>
          <template v-else>
            <div v-dompurify-html="formatGame(game)" />
          </template>
          <template v-if="game.location"> (at {{ game.location }}) </template>
        </td>
        <td v-dompurify-html="game.formattedNetwork" class="network" />
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

.header {
  text-align: center;
}

.network {
  width: 30%;
  padding: 2px;
  text-align: center;
}

.time {
  width: 15%;
  text-align: right;
  padding: 2px;
}

.game {
  width: 55%;
  padding: 2px;
}

.noTVTable {
  background-color: #fff;
  border: 2px ridge #fff;
  border-spacing: 1px;
  border-collapse: collapse;
  width: 100%;
  max-width: 550px;
  table-layout: auto;
  /* Prevent column width changes */
}

:deep(.linkblock) {
  display: inline-block;
  padding-top: 7px;
  padding-bottom: 2px;
}

.gameTitle {
  font-weight: bold;
  font-style: italic;
}

@media only screen and (max-width: 640px) {
  .game {
    padding: 1px;
  }

  .network {
    padding: 0;
  }
}
</style>
