import { SEASON_DATA, type SeasonData } from '#/graphQl.mjs';
import { useApolloQuery } from '#/composables/useApolloQuery.mjs';

export const useSeasonData = (year: string) => {
  const {
    data: result,
    loading,
    error
  } = useApolloQuery<{ seasonData: SeasonData }>(SEASON_DATA, { input: { season: year } });

  return { result, loading, error };
};
