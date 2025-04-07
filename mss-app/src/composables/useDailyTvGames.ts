import { DAILY_TV_GAMES, type TvGame } from '@/graphQl';
import { useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { computed } from 'vue';
import { flexScheduleLink } from '@/utils/base';

export function useDailyTvGames(sport: string) {
  const startDate = DateTime.now().setZone('America/New_York').toISODate();

  const { result, loading, error } = useQuery<{ dailyTvGames: TvGame[] }>(DAILY_TV_GAMES, {
    input: { sport, startDate }
  });

  const season = computed(() => {
    if (result.value?.dailyTvGames.length) {
      const paramYear = result.value.dailyTvGames[0].season;
      return sport === 'football' ? paramYear : `${paramYear.substring(0, 4)}-${paramYear.substring(5)}`;
    }
    return '';
  });

  const flexLink = computed(() => {
    if (result.value?.dailyTvGames.length) {
      const paramYear = result.value.dailyTvGames[0].season;
      return flexScheduleLink(paramYear);
    }
    return '';
  });

  return { result, loading, error, season, flexLink, startDate };
}
