import { TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { useApolloQuery } from '#/composables/useApolloQuery.mjs';

export const useWeekTextSchedule = (sport: string, year: string, week: number) => {
  const {
    data: tvGameResult,
    loading: tvGameLoading,
    error: tvGameError
  } = useApolloQuery<{ tvGames: TvGameData }>(TV_GAMES, { input: { season: year, sport, week } });

  return { tvGameResult, tvGameLoading, tvGameError };
};
