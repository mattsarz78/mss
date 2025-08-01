<script setup lang="ts">
import type { TvGame } from '#/graphQl.mjs';
import { formatGame, formatTime } from '#utils/game.mjs';

const props = defineProps<{ tvGame: TvGame; showPPVColumn: boolean }>();
const { tvGame, showPPVColumn } = props;
</script>

<template>
  <td class="game">
    <template v-if="tvGame.gameTitle">
      <span class="gameTitle">{{ tvGame.gameTitle }}</span>
      <br />
    </template>
    <template v-if="tvGame.visitingTeam?.length === 0" />
    <template v-else-if="tvGame.visitingTeam?.length === 1 && tvGame.homeTeam?.length === 1">
      {{ tvGame.visitingTeam![0] }} {{ tvGame.location ? 'vs.' : 'at' }} {{ tvGame.homeTeam![0] }}<br />
    </template>
    <template v-else>
      <div v-dompurify-html="formatGame(tvGame)" />
    </template>
    <template v-if="tvGame.location"> (at {{ tvGame.location }}) </template>
  </td>
  <td v-dompurify-html="tvGame.networkJpg" class="network"></td>
  <td v-dompurify-html="tvGame.coverageNotes" :class="showPPVColumn ? 'coverage' : 'coverageppv'"></td>
  <td v-if="showPPVColumn" v-dompurify-html="tvGame.ppv" class="ppv"></td>
  <td class="time">
    {{ formatTime(tvGame.timeWithOffset!) }}
  </td>
</template>

<style scoped>
.gameTitle {
  font-weight: bold;
  font-style: italic;
}

.game {
  width: 35%;
  padding: 2px;
  border: medium solid Gray;
  border-width: thin;
}

:deep(.imgBorder) {
  border: 0;
}

.network {
  width: 20%;
  padding: 2px;
  text-align: center;
  border: medium solid Gray;
  border-width: thin;
}

.coverage,
.coverageppv {
  border: medium solid Gray;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.ppv {
  width: 10%;
  border: medium solid Gray;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.time {
  width: 10%;
  text-align: right;
  border: medium solid Gray;
  border-width: thin;
  padding: 2px;
}

:deep(.linkblock) {
  display: inline-block;
  padding-top: 7px;
  padding-bottom: 2px;
}

/* Base styles with fixed proportions */

.coverage {
  width: 25%;
}

.coverageppv {
  width: 30%;
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
