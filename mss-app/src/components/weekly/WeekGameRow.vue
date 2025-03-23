<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { formatGame, formatTime } from '../../utils';
import { formatNetworkJpgAndCoverage } from '../../imageUtils';
import { computed } from 'vue';

const props = defineProps<{ tvGame: TvGame; showPPVColumn: boolean; season: string }>();
const { tvGame, showPPVColumn, season } = props;

const networkHtml = computed(() => tvGame.networkJpg ? formatNetworkJpgAndCoverage(tvGame.networkJpg, season) : '');
const coverageHtml = computed(() => tvGame.coverageNotes ? formatNetworkJpgAndCoverage(tvGame.coverageNotes, season) : '');
const ppvHtml = computed(() => tvGame.ppv ? formatNetworkJpgAndCoverage(tvGame.ppv, season) : '');
</script>

<template>
  <td class="game">
    <template v-if="tvGame.gameTitle">
      <b><i>{{ tvGame.gameTitle }}</i></b><br>
    </template>
    <template v-if="tvGame.visitingTeam?.length === 0" />
    <template v-else-if="tvGame.visitingTeam?.length === 1 && tvGame.homeTeam?.length === 1">
      {{ tvGame.visitingTeam![0] }} {{ tvGame.location ? 'vs.' : 'at' }} {{ tvGame.homeTeam![0] }}<br>
    </template>
    <template v-else>
      <!-- eslint-disable-next-line -->
      <div v-html="formatGame(tvGame)" />
    </template>
    <template v-if="tvGame.location">
      (at {{ tvGame.location }})
    </template>
  </td>
  <!-- eslint-disable-next-line -->
  <td class="network" v-html="networkHtml"></td>
  <!-- eslint-disable-next-line -->
  <td :class="showPPVColumn ? 'coverage' : 'coverageppv'" v-html="coverageHtml"></td>
  <!-- eslint-disable-next-line -->
  <td v-if="showPPVColumn" class="ppv" v-html="ppvHtml"></td>
  <td class="time">
    {{ formatTime(tvGame.timeWithOffset!) }}
  </td>
</template>

<style scoped>
.game {
  width: 243px;
  border: medium solid Gray;
  border-width: thin;
}

.coverage a img,
.coverageppv a img,
.network a img {
  border: 0;
}

.network {
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
  border: medium solid Gray;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.time {
  width: 60px;
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

  .coverageppv {
    width: 260px;
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

  .coverageppv {
    width: 189px;
  }

  :deep(.imageDimensions) {
    height: 29px;
    width: 40px;
  }
}
</style>