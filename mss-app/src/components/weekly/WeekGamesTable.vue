<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import PostseasonMbkEvent from '@weekly/PostseasonMbkEvent.vue';
import WeekGameRow from '@weekly/WeekGameRow.vue';
import { DateTime } from 'luxon';
import { computed } from 'vue';

const props = defineProps<{
  weekDate: string;
  tvGamesForDate: TvGame[];
  isMbkPostseason: boolean;
  isBowlWeek: boolean;
  showPpvColumn: boolean;
}>();

const { weekDate, tvGamesForDate, isMbkPostseason, isBowlWeek, showPpvColumn } = props;

const formattedDate = computed(() => DateTime.fromISO(weekDate).toFormat('DDDD'));
</script>

<template>
  <div>
    <h3>{{ formattedDate }}</h3>
    <table class="noTVTable">
      <thead>
        <tr class="header">
          <th scope="col">Game</th>
          <th scope="col">Network</th>
          <th scope="col">Coverage Notes / Network Streaming</th>
          <th v-if="!isBowlWeek && !isMbkPostseason && showPpvColumn" scope="col">PPV</th>
          <th scope="col">Time</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(tvGame, index) in tvGamesForDate" :key="index">
          <tr :class="{ webGame: tvGame.mediaIndicator === 'W' }">
            <template v-if="isBowlWeek || isMbkPostseason">
              <PostseasonMbkEvent :tv-game="tvGame" />
            </template>
            <template v-else>
              <WeekGameRow :key="index" :show-p-p-v-column="showPpvColumn" :tv-game="tvGame" />
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
  transition: opacity 0.2s ease-in-out;
}

.webGame[style*='display: none'] {
  opacity: 0;
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
  width: 100%;
  max-width: 800px;
  table-layout: auto;
  /* Prevent column width changes */
}
</style>
