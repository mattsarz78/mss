import { TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';

export const useWeekTextSchedule = (sport: string, year: string, week: number) => {
  // 1. Memoize the input parameters to maintain reference stability across paints
  const variables = useMemo(() => {
    return { input: { season: year, sport, week } };
  }, [year, sport, week]);

  // 2. Fire the native React Apollo Client data query line hook
  const { data, loading, error } = useQuery<{ tvGames: TvGameData }>(TV_GAMES, {
    variables,
    skip: !sport || !year || !week, // Safety gate: don't fire if arguments are empty
  });

  // 3. Return the payload matching your exactly structured property names
  return { tvGameResult: data, tvGameLoading: loading, tvGameError: error };
};
