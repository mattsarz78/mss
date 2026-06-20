import { useQuery } from '@apollo/client/react';
import { TV_GAMES, type TvGameData } from '#/graphQl.mjs';

export const useWeekSchedule = (sport: string, year: string, week: number) => {
  const variables = { input: { season: year, sport, week } };

  const {
    data: tvGameData,
    loading: tvGameLoading,
    error: tvGameError
  } = useQuery<{ tvGames: TvGameData }>(TV_GAMES, { variables });

  return { tvGameResult: { tvGames: tvGameData?.tvGames }, tvGameLoading, tvGameError };
};
