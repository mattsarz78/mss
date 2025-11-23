import { useApolloQuery } from '#/composables/useApolloQuery.mjs';
import { DAILY_TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { DateTime } from 'luxon';
import { computed } from 'vue';

export const useDailyTvGames = (sport: string) => {
  const startDateET = DateTime.now().setZone('America/New_York').toISODate();
  const startDateLocal = DateTime.now().toISODate();

  const startDate = startDateET === startDateLocal ? startDateET : startDateLocal;

  const {
    data: result,
    loading,
    error
  } = useApolloQuery<{ dailyTvGames: TvGameData }>(DAILY_TV_GAMES, { input: { sport, startDate } });

  const currentSeason = computed(() => result.value?.dailyTvGames.tvGames[0]?.season ?? '');

  const season = computed(() => {
    const paramYear: string = currentSeason.value;
    return paramYear
      ? sport === 'football'
        ? paramYear
        : `${paramYear.substring(0, 4)}-${paramYear.substring(5, 6)}`
      : '';
  });

  return { result, loading, error, season, startDate };
};
