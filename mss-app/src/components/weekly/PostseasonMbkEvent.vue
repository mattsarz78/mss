<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { formatNetworkJpgAndCoverage } from '@/imageUtils';
import { formatTime } from '../../utils';
import { computed } from 'vue';

const props = defineProps<{ tvGame: TvGame; season: string }>();
const { tvGame, season } = props;

const networkHtml = computed(() => tvGame.networkJpg ? formatNetworkJpgAndCoverage(tvGame.networkJpg, season) : '');
const coverageHtml = computed(() => tvGame.coverageNotes ? formatNetworkJpgAndCoverage(tvGame.coverageNotes, season) : '');
</script>

<template>
  <td class="game">
    <template v-if="tvGame.gameTitle">
      <b><i>{{ tvGame.gameTitle }}</i></b><br>
    </template>
    <template v-if="tvGame.location">
      <template v-if="tvGame.visitingTeam?.length">
        {{ tvGame.visitingTeam[0] }} vs. {{ tvGame.homeTeam![0] }}<br>
      </template>
      (at {{ tvGame.location }})<br>
    </template>
    <template v-else>
      <template v-if="tvGame.visitingTeam?.length">
        {{ tvGame.visitingTeam[0] }} at {{ tvGame.homeTeam![0] }}<br>
      </template>
    </template>
  </td>
  <!-- eslint-disable-next-line -->
  <td class="network" v-html="networkHtml" />
  <!-- eslint-disable-next-line -->
  <td class="coverage" v-html="coverageHtml" />
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

  :deep(.imageDimensions) {
    height: 29px;
    width: 40px;
  }
}
</style>
