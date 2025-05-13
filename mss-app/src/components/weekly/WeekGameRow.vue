<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { formatGame, formatTime } from '@/utils/game';
import { formatNetworkJpgAndCoverage } from '@/utils/image';
import { computed } from 'vue';

const props = defineProps<{ tvGame: TvGame; showPPVColumn: boolean; season: string }>();
const { tvGame, showPPVColumn, season } = props;

const networkHtml = computed(() => (tvGame.networkJpg ? formatNetworkJpgAndCoverage(tvGame.networkJpg, season) : ''));
const coverageHtml = computed(() =>
  tvGame.coverageNotes ? formatNetworkJpgAndCoverage(tvGame.coverageNotes, season) : ''
);
const ppvHtml = computed(() => (tvGame.ppv ? formatNetworkJpgAndCoverage(tvGame.ppv, season) : ''));
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
  <td v-dompurify-html="networkHtml" class="network"></td>
  <td v-dompurify-html="coverageHtml" :class="showPPVColumn ? 'coverage' : 'coverageppv'"></td>
  <td v-if="showPPVColumn" v-dompurify-html="ppvHtml" class="ppv"></td>
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
  width: 270px;
  border: medium solid Gray;
  border-width: thin;
}

:deep(.imgBorder) {
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
  width: 70px;
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
    width: 150px;
    padding: 2px;
  }

  .coverage {
    width: 210px;
  }

  .coverageppv {
    width: 288.89px;
  }

  .ppv {
    width: 150px;
  }
}

@media only screen and (max-width: 640px) {
  .game {
    padding: 1px;
    width: 245px;
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
    width: 135px;
  }

  .time {
    width: 62px;
  }
}
</style>
