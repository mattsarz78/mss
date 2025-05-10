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

const formattedDate = computed(() => DateTime.fromISO(weekDate).toFormat('DDDD'));
</script>

<template>
  <div>
    <h3>{{ formattedDate }}</h3>
    <table class="noTVTable">
      <thead>
        <tr class="header">
          <th>Game</th>
          <th>Network</th>
          <th>Coverage Notes / Network Streaming</th>
          <th v-if="!isBowlWeek && !isMbkPostseason && showPpvColumn">PPV</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(tvGame, index) in tvGamesForDate" :key="index">
          <tr :class="{ webGame: tvGame.mediaIndicator === 'W' }">
            <template v-if="isBowlWeek || isMbkPostseason">
              <PostseasonMbkEvent :tv-game="tvGame" :season="season" />
            </template>
            <template v-else>
              <WeekGameRow :season="season" :show-p-p-v-column="showPpvColumn" :tv-game="tvGame" />
            </template>
          </tr>
        </template>
      </tbody>
    </table>
    <br />
  </div>
</template>

<style scoped>
.webGame {
  display: table-row;
}
.header {
  text-align: center;
}

.noTVTable {
  background-color: #fff;
  border-color: #fff;
  border-style: ridge;
  border-width: 2px;
  border-spacing: 1px;
  border-collapse: collapse;
}
</style>
