import { NO_TV_GAMES, type NoTvGame } from '#/graphQl.mjs';
import { DateTime } from 'luxon';
import { computed } from 'vue';
import { useApolloLazyQuery } from '#/composables/useApolloLazyQuery.mjs';

export const useNoTvSchedule = (week: string, year: string) => {
  const weekInt = parseInt(week);

  const lazy = useApolloLazyQuery<{ noTvGames: NoTvGame[] }>(NO_TV_GAMES);

  const noTvGamesResults = lazy.data;
  const noTvGamesLoading = lazy.loading;
  const noTvGamesError = lazy.error;

  // expose a load function that uses the composable's week/year when no args are provided
  const load = (vars?: Record<string, unknown>) => {
    const variables = vars ?? { input: { season: year, week: weekInt } };
    return lazy.load(variables as unknown as Record<string, unknown>);
  };

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
          .map((game: { timeWithOffset: string }) => getGameDate(game.timeWithOffset))
          .filter(Boolean)
      )
    ).sort();
  });

  return { noTvGamesResults, noTvGamesLoading, noTvGamesError, datesList, load };
};
