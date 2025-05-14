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
    const dates = new Set(
      noTvGamesResults.value?.noTvGames
        .filter((game) => game.timeWithOffset)
        .map((game) => {
          const easternTime = DateTime.fromISO(game.timeWithOffset).setZone('America/New_York');
          return easternTime.toFormat('t') === '12:00 AM'
            ? easternTime.toISODate()
            : DateTime.fromISO(game.timeWithOffset).toLocal().toISODate();
        })
        .filter((date) => !!date) // Remove any potentially undefined dates
    ) as Set<string>;
    return Array.from(dates);
  });

  return { noTvGamesResults, noTvGamesLoading, noTvGamesError, datesList };
}
