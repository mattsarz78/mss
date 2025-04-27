<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { adjustNavBar } from '@/utils/navBar';
import { DateTime } from 'luxon';
import { computed, onMounted } from 'vue';
import WeekGamesTable from '@/components/weekly/WeekGamesTable.vue';

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
    if (value.timeWithOffset) {
      const date = DateTime.fromISO(value.timeWithOffset).toLocal().toISODate();
      if (date) {
        dates.add(date);
      }
    }
  });
  return Array.from(dates);
});

const tvGamesByDate = computed(() => {
  const gamesByDate: Record<string, TvGame[]> = {};
  datesList.value.forEach((date) => {
    gamesByDate[date] = tvGames.filter(
      (game) => game.timeWithOffset && DateTime.fromISO(game.timeWithOffset).toLocal().toISODate() === date
    );
  });
  return gamesByDate;
});

onMounted(() => {
  adjustNavBar();
});
</script>

<template v-if="datesList.length">
  <div id="Main">
    <div id="WeeksBase">
      <template v-if="tvGames.length === 0">
        <p>There are no televised games at this time</p>
      </template>
      <template v-else>
        <p>
          <b>All start times displayed are based on your device's location.</b>
        </p>
        <div v-for="(weekDate, index) in datesList" :key="index">
          <WeekGamesTable
            :season="season"
            :week-date="weekDate"
            :is-bowl-week="isBowlWeek"
            :is-mbk-postseason="isMbkPostseason"
            :show-ppv-column="showPpvColumn"
            :tv-games-for-date="tvGamesByDate[weekDate]" />
        </div>
      </template>
    </div>
  </div>
</template>
