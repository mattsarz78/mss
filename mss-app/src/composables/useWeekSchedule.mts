import { TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { useApolloQuery } from '#/composables/useApolloQuery.mjs';

export const useWeekSchedule = (sport: string, year: string, week: number) => {
  const variables: { input: { season: string; sport: string; week: number } } = {
    input: { season: year, sport, week }
  };

  const { data, loading, error } = useApolloQuery<{ tvGames: TvGameData }>(TV_GAMES, variables);

  // keep previous naming so callers don't need to change
  const tvGameResult = data;
  const tvGameLoading = loading;
  const tvGameError = error;

  return { tvGameResult, tvGameLoading, tvGameError };
};
