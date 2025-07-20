import { TV_GAMES, type TvGameData } from '@/graphQl';
import { useQuery } from '@vue/apollo-composable';

export const useWeekTextSchedule = (sport: string, year: string, week: number) => {
  const {
    result: tvGameResult,
    loading: tvGameLoading,
    error: tvGameError
  } = useQuery<{ tvGames: TvGameData }>(TV_GAMES, { input: { season: year, sport, week } });

  return { tvGameResult, tvGameLoading, tvGameError };
};
