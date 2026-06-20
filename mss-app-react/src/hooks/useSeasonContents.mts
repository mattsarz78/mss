import { useQuery } from '@apollo/client/react';
import { SEASON_CONTENTS, type SeasonContentsData } from '#/graphQl.mjs';

export const useSeasonContents = (year: string) => {
  const { data, loading, error } = useQuery<{ seasonContents: SeasonContentsData }>(SEASON_CONTENTS, {
    variables: { input: { season: year } }
  });

  return { result: { seasonContents: data?.seasonContents }, loading, error };
};
