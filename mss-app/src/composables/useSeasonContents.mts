import { SEASON_CONTENTS, type SeasonContentsData } from '#/graphQl.mjs';
import { useApolloQuery } from '#/composables/useApolloQuery.mjs';

export const useSeasonContents = (year: string) => {
  const {
    data: result,
    loading,
    error
  } = useApolloQuery<{ seasonContents: SeasonContentsData }>(SEASON_CONTENTS, { input: { season: year } });

  return { result, loading, error };
};
