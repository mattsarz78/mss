import { useQuery } from '@apollo/client/react';
import { SEASON_DATA, type SeasonData } from '#/graphQl.mjs';

export const useSeasonData = (year: string) => {
  const { data, loading, error } = useQuery<{ seasonData: SeasonData }>(SEASON_DATA, {
    variables: { input: { season: year } },
  });

  return {
    result: { seasonData: data?.seasonData },
    loading,
    error,
  };
};
