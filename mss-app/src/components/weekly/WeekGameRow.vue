<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { formatGame, formatTime } from '../../utils';
import { formatNetworkJpgAndCoverage } from '../../imageUtils';
const props = defineProps(['tvGame', 'showPPVColumn', 'season']);
const tvGame = props['tvGame'] as TvGame;
const showPPVColumn = props['showPPVColumn'] as boolean;
const season = props['season'] as string;
</script>

<template>
  <td class="game">
    <template v-if="tvGame.gameTitle">
      <b><i>{{ tvGame.gameTitle }}</i></b><br />
    </template>
    <template v-if="tvGame.visitingTeam?.length === 0"></template>
    <template v-else-if="tvGame.visitingTeam?.length === 1 && tvGame.homeTeam?.length === 1">
      {{ tvGame.visitingTeam![0] }} {{ tvGame.location ? 'vs.' : 'at' }} {{ tvGame.homeTeam![0] }}
    </template>
    <template v-else>
      <div v-html="formatGame(tvGame)" />
    </template>
    <template v-if="tvGame.location"><br />(at {{ tvGame.location }})</template>
  </td>
  <td class="network" v-html="!!tvGame.networkJpg ? formatNetworkJpgAndCoverage(tvGame.networkJpg!, season) : ''"></td>
  <td class="coverage"
    v-html="!!tvGame.coverageNotes ? formatNetworkJpgAndCoverage(tvGame.coverageNotes!, season) : ''" />
  <td v-if="showPPVColumn" class="ppv" v-html="!!tvGame.ppv ? formatNetworkJpgAndCoverage(tvGame.ppv!, season) : ''">
  </td>
  <td class="time">
    {{ formatTime(tvGame.timeWithOffset!) }}
  </td>
</template>

<style scoped>
.game {
  width: 243px;
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
}

.coverage a img,
.network a img {
  border: 0;
}

.network {
  text-align: center;
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
}

.coverage {
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.ppv {
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.time {
  width: 60px;
  text-align: right;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 2px;
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

  .coverage {
    width: 189px;
  }

  .ppv {
    width: 135px;
  }

  :deep(.imageDimensions) {
    height: 40px;
    width: 55px;
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

  .coverage {
    width: 105px;
  }

  .ppv {
    width: 44.22px;
  }

  :deep(.imageDimensions) {
    height: 29px;
    width: 40px;
  }
}
</style>
