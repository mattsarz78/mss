import { DAILY_TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { useQuery } from '@apollo/client/react';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export const useDailyTvTextGames = () => {
  // 1. Grab parameters via React Router DOM hook
  const { sport } = useParams<{ sport: string }>() as { sport: string };

  // 2. Resolve the Eastern Time timezone string safely
  const startDate = useMemo(() => {
    return DateTime.now().setZone('America/New_York').toISODate();
  }, []);

  const variables = useMemo(() => {
    return { input: { sport, startDate } };
  }, [sport, startDate]);

  // 3. Fire the native React Apollo Client data query hook
  const { data, loading, error } = useQuery<{ dailyTvGames: TvGameData }>(DAILY_TV_GAMES, {
    variables,
    skip: !sport, // Safety gate: skip query if parameters are missing during mount
  });

  // 4. Replicate Vue's watch reactive sync logic inside a clean useMemo boundary
  const { paramYear, season } = useMemo(() => {
    const firstGame = data?.dailyTvGames?.tvGames?.[0];

    if (!firstGame?.season) {
      return { paramYear: '', season: '' };
    }

    const rawSeason = firstGame.season;
    const formattedSeason = sport === 'football' ? rawSeason : `${rawSeason.slice(0, 4)}-${rawSeason.slice(5)}`;

    return {
      paramYear: rawSeason,
      season: formattedSeason,
    };
  }, [data, sport]);

  // 5. Return payload maintaining precise property name symmetry with your view template
  return {
    dailyTvGameResult: data,
    dailyTvGameLoading: loading,
    dailyTvGameError: error,
    season,
    paramYear,
    sport,
    startDate,
  };
};
