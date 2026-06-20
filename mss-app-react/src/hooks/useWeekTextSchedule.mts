import { TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';

export const useWeekTextSchedule = (sport: string, year: string, week: number) => {
  const variables = useMemo(() => {
    return { input: { season: year, sport, week } };
  }, [year, sport, week]);

  const { data, loading, error } = useQuery<{ tvGames: TvGameData }>(TV_GAMES, {
    variables,
    // 👈 FIXED: Explicitly check that week isn't null/undefined, allowing 0 to pass!
    skip: !sport || !year || week === undefined || week === null
  });

  return { tvGameResult: data, tvGameLoading: loading, tvGameError: error };
};
