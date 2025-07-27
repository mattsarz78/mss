import { SEASON_DATA, type SeasonData } from '#/graphQl.mjs';
import { useQuery } from '@vue/apollo-composable';

export const useSeasonData = (year: string) => {
  const { result, loading, error } = useQuery<{ seasonData: SeasonData }>(SEASON_DATA, { input: { season: year } });

  return { result, loading, error };
};
