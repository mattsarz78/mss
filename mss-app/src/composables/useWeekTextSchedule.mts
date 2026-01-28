import { TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { useQuery } from '@vue/apollo-composable';

export const useWeekTextSchedule = (sport: string, year: string, week: number) => {
  const {
    result: tvGameResult,
    loading: tvGameLoading,
    error: tvGameError
  } = useQuery<{ tvGames: TvGameData }>(TV_GAMES, { variables: { input: { season: year, sport, week } } });

  return { tvGameResult, tvGameLoading, tvGameError };
};
