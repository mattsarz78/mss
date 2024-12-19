<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { DateTime } from 'luxon';
import PostseasonMbkEvent from '@/components/weekly/PostseasonMbkEvent.vue';
import WeekGameRow from './WeekGameRow.vue';
import { computed } from 'vue';

const props = defineProps<{
  weekDate: string;
  tvGamesForDate: TvGame[];
  isMbkPostseason: boolean;
  isBowlWeek: boolean;
  showPpvColumn: boolean;
  season: string;
}>();

const { weekDate, tvGamesForDate, isMbkPostseason, isBowlWeek, showPpvColumn, season } = props;

const formattedDate = computed(() => DateTime.fromISO(weekDate).toFormat('DDDD'));</script>

<template>
  {{ formattedDate }}
  <table class="noTVTable">
    <tbody>
      <tr class="header">
        <th>Game</th>
        <th>Network</th>
        <th>Coverage Notes / Network Streaming</th>
        <th v-if="!isBowlWeek && !isMbkPostseason && showPpvColumn">PPV</th>
        <th>Time</th>
      </tr>
      <template v-for="(tvGame, index) in tvGamesForDate" :key="index">
        <template v-if="isBowlWeek || isMbkPostseason">
          <tr>
            <PostseasonMbkEvent :tvGame="tvGame" :season="season"></PostseasonMbkEvent>
          </tr>
        </template>
        <template v-else>
          <tr :class="tvGame.mediaIndicator === 'W' ? 'webGame' : ''">
            <WeekGameRow :season="season" :showPPVColumn="showPpvColumn" :tvGame="tvGame" />
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
