import { NO_TV_GAMES, type NoTvGame } from '@/graphQl';
import { useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { computed } from 'vue';

export function useNoTvSchedule(week: string, year: string) {
  const weekInt = parseInt(week);

  const {
    result: noTvGamesResults,
    loading: noTvGamesLoading,
    error: noTvGamesError
  } = useQuery<{ noTvGames: NoTvGame[] }>(NO_TV_GAMES, { input: { season: year, week: weekInt } });

  const datesList = computed(() => {
    const dates = new Set<string>();
    noTvGamesResults.value?.noTvGames.forEach((value) => {
      const date = DateTime.fromISO(value.timeWithOffset).toLocal().toISODate();
      if (date) {
        dates.add(date);
      }
    });
    return Array.from(dates);
  });

  return { noTvGamesResults, noTvGamesLoading, noTvGamesError, datesList };
}
