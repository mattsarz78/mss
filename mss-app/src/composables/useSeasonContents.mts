import { SEASON_CONTENTS, type SeasonContentsData } from '#/graphQl.mjs';
import { useQuery } from '@vue/apollo-composable';

export const useSeasonContents = (year: string) => {
  const { result, loading, error } = useQuery<{ seasonContents: SeasonContentsData }>(SEASON_CONTENTS, {
    input: { season: year }
  });

  return { result, loading, error };
};
