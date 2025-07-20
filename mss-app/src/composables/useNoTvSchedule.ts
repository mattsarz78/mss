import { NO_TV_GAMES, type NoTvGame } from '@/graphQl';
import { useLazyQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { computed } from 'vue';

export const useNoTvSchedule = (week: string, year: string) => {
  const weekInt = parseInt(week);

  const {
    result: noTvGamesResults,
    loading: noTvGamesLoading,
    load,
    error: noTvGamesError
  } = useLazyQuery<{ noTvGames: NoTvGame[] }>(NO_TV_GAMES, { input: { season: year, week: weekInt } });

  const getGameDate = (timeWithOffset: string): string => {
    const eastern = DateTime.fromISO(timeWithOffset).setZone('America/New_York');
    return (
      (eastern.toFormat('t') === '12:00 AM'
        ? eastern.toISODate()
        : DateTime.fromISO(timeWithOffset).toLocal().toISODate()) ?? ''
    );
  };

  const hasValidTime = (game: NoTvGame): game is NoTvGame & { timeWithOffset: string } =>
    typeof game.timeWithOffset === 'string' && game.timeWithOffset !== '';

  const datesList = computed(() => {
    const games = noTvGamesResults.value?.noTvGames ?? [];
    return Array.from(
      new Set(
        games
          .filter(hasValidTime)
          .map((game) => getGameDate(game.timeWithOffset))
          .filter(Boolean)
      )
    ).sort();
  });

  return { noTvGamesResults, noTvGamesLoading, noTvGamesError, datesList, load };
};
