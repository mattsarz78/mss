<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { formatNetworkJpgAndCoverage } from '@/imageUtils';
import { formatTime } from '../../utils';
const props = defineProps(['tvGame', 'season']);
const tvGame = props['tvGame'] as TvGame;
const season = props['season'] as string;
</script>

<template>
  <td class="game">
    <template v-if="tvGame.gameTitle">
      <b
        ><i>{{ tvGame.gameTitle }}</i></b
      ><br />
    </template>
    <template v-if="tvGame.location">
      <template v-if="tvGame.visitingTeam?.length">
        {{ tvGame.visitingTeam[0] }} vs. {{ tvGame.homeTeam![0] }}<br />
      </template>
      (at {{ tvGame.location }})<br />
    </template>
    <template v-else>
      <template v-if="tvGame.visitingTeam?.length">
        {{ tvGame.visitingTeam[0] }} at {{ tvGame.homeTeam![0] }}<br />
      </template>
    </template>
  </td>
  <td class="network" v-html="!!tvGame.networkJpg ? formatNetworkJpgAndCoverage(tvGame.networkJpg!, season) : ''"></td>
  <td
    class="coverage"
    v-html="!!tvGame.coverageNotes ? formatNetworkJpgAndCoverage(tvGame.coverageNotes!, season) : ''"
  />
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

.overlay {
  display: none;
  position: absolute;
  z-index: 100000;
  opacity: 0.4;
  filter: alpha(opacity=40);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #333;
}

#RSNLists {
  position: absolute;
  z-index: 99999999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border: 1px solid #000;
  padding: 10px;
  display: none;
}

.FSNLink,
.closer {
  text-decoration: underline;
  color: #00f;
  cursor: pointer;
}

.FSNrow {
  border-width: 1px;
  border-style: solid;
  vertical-align: top;
}

.rsnLabel {
  vertical-align: middle;
}

.FSNtable {
  border-width: 1px;
  border-style: solid;
  margin: auto;
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

  .coverage {
    width: 189px;
  }

  #RSNLists {
    width: 250px;
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

  #RSNLists {
    width: 160px;
  }

  :deep(.imageDimensions) {
    height: 29px;
    width: 40px;
  }
}
</style>
