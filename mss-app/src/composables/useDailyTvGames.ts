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

  const currentSeason = computed(() => result.value?.dailyTvGames.tvGames[0]?.season ?? '');

  const season = computed(() => {
    const paramYear = currentSeason.value;
    return paramYear
      ? sport === 'football'
        ? paramYear
        : `${paramYear.substring(0, 4)}-${paramYear.substring(5)}`
      : '';
  });

  const flexLink = computed(() =>
    currentSeason.value
      ? (flexScheduleLinks.find((link: FlexScheduleLink) => link.season === currentSeason.value)?.url ?? '')
      : ''
  );

  return { result, loading, error, season, flexLink, startDate };
}
