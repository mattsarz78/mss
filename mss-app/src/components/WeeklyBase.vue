<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { adjustNavBar } from '@/utils';
import { DateTime } from 'luxon';
import { computed, onMounted } from 'vue';
import WeekGamesTable from '../components/weekly/WeekGamesTable.vue';

const props = defineProps<{
  tvGames: TvGame[];
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  showPpvColumn: boolean;
  season: string;
}>();

const { tvGames, isBowlWeek, isMbkPostseason, showPpvColumn, season } = props;

const datesList = computed(() => {
  const dates = new Set<string>();
  tvGames.forEach((value) => {
    const date = DateTime.fromISO(value.timeWithOffset!).toLocal().toISODate()!;
    dates.add(date);
  });
  return Array.from(dates);
});

onMounted(() => adjustNavBar());
</script>

<template v-if="datesList.length">
  <div id="Main">
    <div id="WeeksBase">
      <template v-if="tvGames.length === 0">
        <p>There are no televised games at this time</p>
      </template>
      <template v-else>
        <p><b>All start times displayed are based on your device's location.</b></p>
        <div v-for="(weekDate, index) in datesList" :key="index">
          <WeekGamesTable :season="season" :weekDate="weekDate" :isBowlWeek="isBowlWeek"
            :isMbkPostseason="isMbkPostseason" :showPpvColumn="showPpvColumn"
            :tvGamesForDate="tvGames.filter((x) => DateTime.fromISO(x.timeWithOffset!).toLocal().toISODate() === weekDate)" />
        </div>
      </template>
    </div>
  </div>
</template>
