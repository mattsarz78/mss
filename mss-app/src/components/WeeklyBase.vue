<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { DateTime } from 'luxon';
import { computed } from 'vue';
import WeekGamesTable from '@/components/weekly/WeekGamesTable.vue';

const props = defineProps<{
  tvGames: TvGame[];
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  showPpvColumn: boolean;
}>();

const { tvGames, isBowlWeek, isMbkPostseason, showPpvColumn } = props;

const datesList = computed(() => {
  const dates = new Set(
    tvGames
      .filter((game) => game.timeWithOffset)
      .map((game) => {
        const easternTime = DateTime.fromISO(game.timeWithOffset as unknown as string).setZone('America/New_York');
        return easternTime.toFormat('t') === '12:00 AM'
          ? easternTime.toISODate()
          : DateTime.fromISO(game.timeWithOffset as unknown as string)
            .toLocal()
            .toISODate();
      })
      .filter((date) => !!date) // Optional: Ensure no undefined dates
  ) as Set<string>;
  return Array.from(dates);
});

const tvGamesByDate = computed(() => {
  return tvGames.reduce((acc: Record<string, TvGame[]>, game) => {
    if (game.timeWithOffset) {
      const easternTime = DateTime.fromISO(game.timeWithOffset).setZone('America/New_York');
      const gameDate =
        easternTime.toFormat('t') === '12:00 AM'
          ? easternTime.toISODate()
          : DateTime.fromISO(game.timeWithOffset).toLocal().toISODate();

      if (gameDate) {
        acc[gameDate] = acc[gameDate] ?? [];
        acc[gameDate].push(game);
      }
    }
    return acc;
  }, {});
});
</script>

<template v-if="datesList.length">
  <div id="Main" :class="`${isMbkPostseason || isBowlWeek ? 'short-main-padding' : 'main-padding'}`"
    v-reset-adsense-height>
    <div id="WeeksBase">
      <template v-if="tvGames.length === 0">
        <p>There are no televised games at this time</p>
      </template>
      <template v-else>
        <p>
          <strong>All start times displayed are based on your device's location.</strong>
        </p>
        <div v-for="(weekDate, index) in datesList" :key="index">
          <WeekGamesTable :week-date="weekDate" :is-bowl-week="isBowlWeek" :is-mbk-postseason="isMbkPostseason"
            :show-ppv-column="showPpvColumn" :tv-games-for-date="tvGamesByDate[weekDate]" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.main-padding {
  padding-top: 135px;
}

.short-main-padding {
  padding-top: 79.5px;
}

@media only screen and (max-width: 640px) {
  .main-padding {
    padding-top: 110px;
  }

  .short-main-padding {
    padding-top: 59.5px;
  }
}
</style>
