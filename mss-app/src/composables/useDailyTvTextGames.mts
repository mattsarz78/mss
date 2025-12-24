import { DAILY_TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { DateTime } from 'luxon';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useApolloQuery } from '#/composables/useApolloQuery.mjs';

export const useDailyTvTextGames = () => {
  const route = useRoute();
  const { sport } = route.params as { sport: string };

  const startDate = DateTime.now().setZone('America/New_York').toISODate();

  const {
    data: dailyTvGameResult,
    loading: dailyTvGameLoading,
    error: dailyTvGameError
  } = useApolloQuery<{ dailyTvGames: TvGameData }>(DAILY_TV_GAMES, { input: { sport, startDate } });

  const season = ref<string>('');
  const paramYear = ref<string>('');

  watch(
    dailyTvGameResult,
    (dailyTvGameValue) => {
      if (dailyTvGameValue?.dailyTvGames.tvGames.length) {
        paramYear.value = dailyTvGameValue.dailyTvGames.tvGames[0].season;
        season.value =
          sport === 'football' ? paramYear.value : `${paramYear.value.slice(0, 4)}-${paramYear.value.slice(5)}`;
      }
    },
    { immediate: true }
  );

  return { dailyTvGameResult, dailyTvGameLoading, dailyTvGameError, season, paramYear, sport, startDate };
};
