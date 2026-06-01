import { useQuery } from '@apollo/client/react';
import { DAILY_TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

export const useDailyTvTextGames = (sport: string) => {
  const startDate = DateTime.now().setZone('America/New_York').toISODate();

  const {
    data: dailyTvGameData,
    loading: dailyTvGameLoading,
    error: dailyTvGameError
  } = useQuery<{ dailyTvGames: TvGameData }>(DAILY_TV_GAMES, {
    variables: { input: { sport, startDate } }
  });

  const [season, setSeason] = useState<string>('');
  const [paramYear, setParamYear] = useState<string>('');

  useEffect(() => {
    if (dailyTvGameData?.dailyTvGames?.tvGames?.length) {
      const year = dailyTvGameData.dailyTvGames.tvGames[0].season;
      setParamYear(year);
      setSeason(
        sport === 'football'
          ? year
          : `${year.slice(0, 4)}-${year.slice(5)}`
      );
    }
  }, [dailyTvGameData?.dailyTvGames?.tvGames, sport]);

  return {
    dailyTvGameResult: { dailyTvGames: dailyTvGameData?.dailyTvGames },
    dailyTvGameLoading,
    dailyTvGameError,
    season,
    paramYear,
    sport,
    startDate
  };
};
