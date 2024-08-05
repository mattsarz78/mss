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

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>
