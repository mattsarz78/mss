import { NO_TV_GAMES, type NoTvGame } from '#/graphQl.mjs';
import { getDateForGame } from '#utils/dateFormatting.mjs';
import { useLazyQuery } from '@apollo/client/react';
import { useEffect, useMemo } from 'react';

export const useNoTvSchedule = (week: string, year: string) => {
  const weekInt = parseInt(week);

  const [getNoTvGames, { data: noTvGamesData, loading: noTvGamesLoading, error: noTvGamesError }] = useLazyQuery<{
    noTvGames: NoTvGame[];
  }>(NO_TV_GAMES);

  useEffect(() => {
    getNoTvGames({ variables: { input: { season: year, week: weekInt } } });
  }, [week, year, weekInt, getNoTvGames]);

  const hasValidTime = (game: Partial<NoTvGame>): game is NoTvGame & { timeWithOffset: string } =>
    typeof game.timeWithOffset === 'string' && game.timeWithOffset !== '';

  const datesList = useMemo(() => {
    const games = noTvGamesData?.noTvGames ?? [];
    const dates = new Set<string>();
    for (const game of games) {
      if (hasValidTime(game)) {
        const date = getDateForGame(game.timeWithOffset);
        if (date) dates.add(date);
      }
    }
    return Array.from(dates).sort();
  }, [noTvGamesData?.noTvGames]);

  const load = () => {
    getNoTvGames({ variables: { input: { season: year, week: weekInt } } });
  };

  return {
    noTvGamesResults: { noTvGames: noTvGamesData?.noTvGames },
    noTvGamesLoading,
    noTvGamesError,
    datesList,
    load,
  };
};
