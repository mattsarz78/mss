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
      if (value.timeWithOffset) {
        const easternTime = DateTime.fromISO(value.timeWithOffset).setZone('America/New_York').toFormat('t');
        if (easternTime === '12:00 AM') {
          const easternDate = DateTime.fromISO(value.timeWithOffset).setZone('America/New_York').toISODate();
          if (easternDate) {
            dates.add(easternDate);
          }
        } else {
          const date = DateTime.fromISO(value.timeWithOffset).toLocal().toISODate();
          if (date) {
            dates.add(date);
          }
        }
      }
    });
    return Array.from(dates);
  });

  return { noTvGamesResults, noTvGamesLoading, noTvGamesError, datesList };
}
