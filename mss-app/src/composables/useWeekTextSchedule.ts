import { TV_GAMES, type TvGame } from '@/graphQl';
import { useQuery } from '@vue/apollo-composable';

export function useWeekTextSchedule(sport: string, year: string, week: number) {
  const {
    result: tvGameResult,
    loading: tvGameLoading,
    error: tvGameError
  } = useQuery<{ tvGames: TvGame[] }>(TV_GAMES, { input: { season: year, sport, week } });

  return { tvGameResult, tvGameLoading, tvGameError };
}
