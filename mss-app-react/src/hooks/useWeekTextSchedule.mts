import { useQuery } from '@apollo/client/react';
import { TV_GAMES, type TvGameData } from '#/graphQl.mjs';

export const useWeekTextSchedule = (sport: string, year: string, week: number) => {
  const {
    data: tvGameData,
    loading: tvGameLoading,
    error: tvGameError
  } = useQuery<{ tvGames: TvGameData }>(TV_GAMES, {
    variables: { input: { season: year, sport, week } }
  });

  return {
    tvGameResult: { tvGames: tvGameData?.tvGames },
    tvGameLoading,
    tvGameError
  };
};
