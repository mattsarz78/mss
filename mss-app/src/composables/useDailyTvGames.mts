import { DAILY_TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { computed } from 'vue';

export const useDailyTvGames = (sport: string) => {
  const startDate = DateTime.now().setZone('America/New_York').toISODate();

  const { result, loading, error } = useQuery<{ dailyTvGames: TvGameData }>(DAILY_TV_GAMES, {
    input: { sport, startDate }
  });

  const currentSeason = computed(() => result.value?.dailyTvGames.tvGames[0]?.season ?? '');

  const season = computed(() => {
    const paramYear: string = currentSeason.value;
    return paramYear
      ? sport === 'football'
        ? paramYear
        : `${paramYear.substring(0, 4)}-${paramYear.substring(5)}`
      : '';
  });

  return { result, loading, error, season, startDate };
};
