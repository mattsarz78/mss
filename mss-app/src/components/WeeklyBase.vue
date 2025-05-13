<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { adjustNavBar } from '@/utils/navBar';
import { DateTime } from 'luxon';
import { computed, onMounted } from 'vue';
import WeekGamesTable from '@/components/weekly/WeekGamesTable.vue';
import { formatNetworkJpgAndCoverage } from '@/utils/image';

const props = defineProps<{
  tvGames: TvGame[];
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  showPpvColumn: boolean;
  season: string;
}>();

const { tvGames, isBowlWeek, isMbkPostseason, showPpvColumn, season } = props;

const updatedGames = computed(() =>
  tvGames.map((tvGame) => {
    const networkJpg = tvGame.networkJpg ? formatNetworkJpgAndCoverage(tvGame.networkJpg, season) : '';
    const coverageNotes = tvGame.coverageNotes ? formatNetworkJpgAndCoverage(tvGame.coverageNotes, season) : '';
    const ppv = tvGame.ppv ? formatNetworkJpgAndCoverage(tvGame.ppv, season) : '';
    return { ...tvGame, networkJpg, coverageNotes, ppv } as TvGame;
  })
);

const datesList = computed(() => {
  const dates = new Set<string>();
  updatedGames.value.forEach((value) => {
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
    gamesByDate[date] = updatedGames.value.filter(
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
  <div id="Main" v-reset-adsense-height>
    <div id="WeeksBase">
      <template v-if="tvGames.length === 0">
        <p>There are no televised games at this time</p>
      </template>
      <template v-else>
        <p>
          <strong>All start times displayed are based on your device's location.</strong>
        </p>
        <div v-for="(weekDate, index) in datesList" :key="index">
          <WeekGamesTable
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
