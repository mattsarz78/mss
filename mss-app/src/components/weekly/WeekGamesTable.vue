<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { DateTime } from 'luxon';
import PostseasonMbkEvent from '@/components/weekly/PostseasonMbkEvent.vue';
import WeekGameRow from './WeekGameRow.vue';
const props = defineProps(['weekDate', 'tvGamesForDate', 'isMbkPostseason', 'isBowlWeek', 'showPpvColumn', 'season']);
const weekDate = props['weekDate'] as string;
const season = props['season'] as string;
const tvGamesForDate = props['tvGamesForDate'] as TvGame[];
const isBowlWeek = props['isBowlWeek'] as boolean;
const isMbkPostseason = props['isBowlWeek'] as boolean;
const showPPVColumn = props['showPpvColumn'] as boolean;
</script>

<template>
  {{ DateTime.fromISO(weekDate).toFormat('DDDD') }}
  <table class="noTVTable">
    <tbody>
      <tr class="header">
        <th>Game</th>
        <th>Network</th>
        <th>Coverage Notes / Network Streaming</th>
        <th v-if="!isBowlWeek && !isMbkPostseason && showPPVColumn">PPV</th>
        <th>Time</th>
      </tr>
      <template v-for="(tvGame, index) of tvGamesForDate" :key="index">
        <template v-if="isBowlWeek || isMbkPostseason">
          <tr>
            <PostseasonMbkEvent :tvGame="tvGame" :season="season"></PostseasonMbkEvent>
          </tr>
        </template>
        <template v-else>
          <tr :class="tvGame.mediaIndicator === 'W' ? 'webGame' : ''">
            <WeekGameRow :season="season" :showPPVColumn="showPPVColumn" :tvGame="tvGame" />
          </tr>
        </template>
      </template>
    </tbody>
  </table>
  <br />
</template>

<style scoped>
.webGame {
  display: table-row;
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

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media all and (min-width: 641px) {
  #RSNLists {
    width: 250px;
  }
}

@media only screen and (max-width: 640px) {
  #RSNLists {
    width: 160px;
  }
}
</style>
