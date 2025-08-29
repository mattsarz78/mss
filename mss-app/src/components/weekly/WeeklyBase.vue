<script setup lang="ts">
import type { TvGame } from '#/graphQl.mjs';
import WeekGamesTable from '#weekly/WeekGamesTable.vue';
import { DateTime } from 'luxon';
import { computed } from 'vue';

const props = defineProps<{
  tvGames: TvGame[];
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  showPpvColumn: boolean;
}>();

const { tvGames, isBowlWeek, isMbkPostseason, showPpvColumn } = props;

const getGameDate = (timeWithOffset: string): string => {
  const eastern = DateTime.fromISO(timeWithOffset).setZone('America/New_York');
  return eastern.toFormat('t') === '12:00 AM'
    ? (eastern.toISODate() ?? '')
    : (DateTime.fromISO(timeWithOffset).toLocal().toISODate() ?? '');
};

const hasValidTime = (game: TvGame): game is TvGame & { timeWithOffset: string } =>
  typeof game.timeWithOffset === 'string';

const tvGamesByDate = computed(() =>
  tvGames.filter(hasValidTime).reduce<Record<string, TvGame[]>>((acc, game) => {
    const date = getGameDate(game.timeWithOffset);
    if (date) {
      acc[date] ??= [];
      acc[date].push(game);
    }
    return acc;
  }, {})
);

const datesList = computed(() => Object.keys(tvGamesByDate.value).sort());
</script>

<template v-if="datesList.length">
  <div
    id="Main"
    v-reset-adsense-height
    :class="[isMbkPostseason || isBowlWeek ? 'short-main-padding' : 'main-padding']">
    <div id="WeeksBase">
      <template v-if="tvGames.length === 0">
        <p>There are no televised games at this time</p>
      </template>
      <template v-else>
        <p>
          <strong>All start times displayed are based on your device's location.</strong>
        </p>
        <div v-for="weekDate in datesList" :key="weekDate">
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

<style scoped>
.main-padding {
  padding-top: 140px;
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
