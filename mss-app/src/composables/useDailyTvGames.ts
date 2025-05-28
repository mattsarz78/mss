import { DAILY_TV_GAMES, type TvGameData } from '@/graphQl';
import type { FlexScheduleLink } from '@/staticData/exportTypes';
import flexScheduleLinks from '@/staticData/flexScheduleLinks.json';
import { useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { computed } from 'vue';

export function useDailyTvGames(sport: string) {
  const startDate = DateTime.now().setZone('America/New_York').toISODate();

  const { result, loading, error } = useQuery<{ dailyTvGames: TvGameData }>(DAILY_TV_GAMES, {
    input: { sport, startDate }
  });

  const season = computed(() => {
    if (result.value?.dailyTvGames.tvGames.length) {
      const paramYear = result.value.dailyTvGames.tvGames[0].season;
      return sport === 'football' ? paramYear : `${paramYear.substring(0, 4)}-${paramYear.substring(5)}`;
    }
    return '';
  });

  const flexLink = computed(() => {
    if (result.value?.dailyTvGames.tvGames.length) {
      const paramYear = result.value.dailyTvGames.tvGames[0].season;
      return flexScheduleLinks.find((link: FlexScheduleLink) => link.season === paramYear)?.url ?? '';
    }
    return '';
  });

  return { result, loading, error, season, flexLink, startDate };
}
