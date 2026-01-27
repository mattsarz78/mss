import { TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { useQuery } from '@vue/apollo-composable';

export const useWeekSchedule = (sport: string, year: string, week: number) => {
  const variables = { input: { season: year, sport, week } };

  const {
    result: tvGameResult,
    loading: tvGameLoading,
    error: tvGameError
  } = useQuery<{ tvGames: TvGameData }>(TV_GAMES, { variables });

  return { tvGameResult, tvGameLoading, tvGameError };
};
