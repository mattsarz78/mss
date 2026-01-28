import { NO_TV_GAMES, type NoTvGame } from '#/graphQl.mjs';
import { useLazyQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { computed } from 'vue';

export const useNoTvSchedule = (week: string, year: string) => {
  const weekInt = parseInt(week);

  const {
    result: noTvGamesResults,
    loading: noTvGamesLoading,
    error: noTvGamesError,
    load
  } = useLazyQuery<{ noTvGames: NoTvGame[] }>(NO_TV_GAMES, { variables: { input: { season: year, week: weekInt } } });

  const getGameDate = (timeWithOffset: string): string => {
    const eastern = DateTime.fromISO(timeWithOffset).setZone('America/New_York');
    return (
      (eastern.toFormat('t') === '12:00 AM'
        ? eastern.toISODate()
        : DateTime.fromISO(timeWithOffset).toLocal().toISODate()) ?? ''
    );
  };

  const hasValidTime = (game: Partial<NoTvGame>): game is NoTvGame & { timeWithOffset: string } =>
    typeof game.timeWithOffset === 'string' && game.timeWithOffset !== '';

  const datesList = computed(() => {
    const games = noTvGamesResults.value?.noTvGames ?? [];
    const dates = new Set<string>();
    for (const game of games) {
      if (hasValidTime(game)) {
        const date = getGameDate(game.timeWithOffset);
        if (date) dates.add(date);
      }
    }
    return Array.from(dates).sort();
  });

  return { noTvGamesResults, noTvGamesLoading, noTvGamesError, datesList, load };
};
