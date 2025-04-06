import { SEASON_CONTENTS, type WeekInfo } from '@/graphQl';
import { useQuery } from '@vue/apollo-composable';

export function useSeasonContents(year: string) {
  const { result, loading, error } = useQuery<{ seasonContents: WeekInfo[] }>(SEASON_CONTENTS, {
    input: { season: year }
  });

  return { result, loading, error };
}
