<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { adjustNavBar } from '@/utils';
import { DateTime } from 'luxon';
import { onMounted } from 'vue';
import WeekGamesTable from '../components/weekly/WeekGamesTable.vue';

const props = defineProps(['tvGames', 'isBowlWeek', 'isMbkPostseason', 'showPpvColumn', 'season']);
const tvGames = props['tvGames'] as TvGame[];
const isBowlWeek = props['isBowlWeek'] as boolean;
const isMbkPostseason = props['isBowlWeek'] as boolean;
const datesList: string[] = [];
const showPpvColumn = props['showPpvColumn'] as boolean;
const season = props['season'] as string;

tvGames.map((value) => {
  const date = DateTime.fromISO(value.timeWithOffset!).toLocal().toISODate()!;
  if (!datesList.some((dateFromList) => dateFromList === date)) {
    datesList.push(date);
  }
});

onMounted(() => adjustNavBar());
</script>

<template v-if="datesList">
  <div id="Main">
    <div id="WeeksBase">
      <template v-if="tvGames.length === 0">
        <p>There are no televised games at this time</p>
      </template>
      <template v-else>
        <div v-for="(weekDate, index) of datesList" :key="index">
          <WeekGamesTable :season="season" :weekDate="weekDate" :isBowlWeek="isBowlWeek"
            :isMbkPostseason="isMbkPostseason" :showPpvColumn="showPpvColumn"
            :tvGamesForDate="tvGames.filter((x) => DateTime.fromISO(x.timeWithOffset!).toLocal().toISODate() === weekDate)" />
        </div>
      </template>
    </div>
  </div>
</template>
