import { useQuery } from '@apollo/client/react';
import { DAILY_TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

export const useDailyTvGames = (sport: string) => {
  const startDateET = DateTime.now().setZone('America/New_York').toISODate();
  const startDateLocal = DateTime.now().toISODate();

  const startDate = startDateET === startDateLocal ? startDateET : startDateLocal;

  const { data, loading, error } = useQuery<{ dailyTvGames: TvGameData }>(
    DAILY_TV_GAMES,
    {
      variables: { input: { sport, startDate } }
    }
  );

  const season = useMemo(() => {
    const paramYear = data?.dailyTvGames?.tvGames?.[0]?.season ?? '';
    return paramYear
      ? sport === 'football'
        ? paramYear
        : `${paramYear.substring(0, 4)}-${paramYear.substring(4, 6)}`
      : '';
  }, [data?.dailyTvGames?.tvGames, sport]);

  return {
    result: { dailyTvGames: data?.dailyTvGames },
    loading,
    error,
    season,
    startDate
  };
};
