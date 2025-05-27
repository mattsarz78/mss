import { SEASON_DATA, type SeasonData } from '@/graphQl';
import { useQuery } from '@vue/apollo-composable';

export function useSeasonData(year: string) {
  const {
    result: seasonDataResult,
    loading: seasonDataLoading,
    error: seasonDataError
  } = useQuery<{ seasonData: SeasonData }>(SEASON_DATA, { input: { season: year } });

  return { seasonDataResult, seasonDataLoading, seasonDataError };
}
