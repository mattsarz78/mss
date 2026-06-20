import { DAILY_TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { useQuery } from '@apollo/client/react';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

export const useDailyTvGames = (sport: string) => {
  const startDate = useMemo(() => {
    const startDateET = DateTime.now().setZone('America/New_York').toISODate();
    const startDateLocal = DateTime.now().toISODate();
    return startDateET === startDateLocal ? startDateET : startDateLocal;
  }, []);

  const { data, loading, error } = useQuery<{ dailyTvGames: TvGameData }>(DAILY_TV_GAMES, {
    variables: { input: { sport, startDate } },
    // Optional: safe guard fallback if you change sport params in mid-session
    skip: !sport
  });

  const currentSeason = useMemo(() => {
    return data?.dailyTvGames?.tvGames?.[0]?.season ?? '';
  }, [data]);

  const season = useMemo(() => {
    const paramYear = currentSeason;
    if (!paramYear) return '';

    return sport === 'football' ? paramYear : `${paramYear.substring(0, 4)}-${paramYear.substring(4, 6)}`;
  }, [currentSeason, sport]);

  return { result: data, loading, error, season, startDate };
};
