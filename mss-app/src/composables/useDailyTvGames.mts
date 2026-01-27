import { DAILY_TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { computed } from 'vue';

export const useDailyTvGames = (sport: string) => {
  const startDateET = DateTime.now().setZone('America/New_York').toISODate();
  const startDateLocal = DateTime.now().toISODate();

  const startDate = startDateET === startDateLocal ? startDateET : startDateLocal;

  const { result, loading, error } = useQuery<{ dailyTvGames: TvGameData }>(DAILY_TV_GAMES, {
    variables: { input: { sport, startDate } }
  });

  const currentSeason = computed(() => result.value?.dailyTvGames.tvGames[0]?.season ?? '');

  const season = computed(() => {
    const paramYear: string = currentSeason.value;
    return paramYear
      ? sport === 'football'
        ? paramYear
        : `${paramYear.substring(0, 4)}-${paramYear.substring(4, 6)}`
      : '';
  });

  return { result, loading, error, season, startDate };
};
