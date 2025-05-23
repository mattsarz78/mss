import { TV_GAMES, type TvGame } from '@/graphQl';
import type { ValidSportYear } from '@/staticData/exportTypes';
import validSportYears from '@/staticData/validSportYears.json';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';

const hasNoTVGames = (year: string): boolean => {
  return (
    validSportYears.find((validSportYear: ValidSportYear) => validSportYear.season === year)?.hasNoTVGames ?? false
  );
};

export function useWeekSchedule(sport: string, year: string, week: number) {
  const showNoTvGames = computed(() => hasNoTVGames(year));

  const {
    result: tvGameResult,
    loading: tvGameLoading,
    error: tvGameError
  } = useQuery<{ tvGames: TvGame[] }>(TV_GAMES, { input: { season: year, sport, week } });

  return { tvGameResult, tvGameLoading, tvGameError, showNoTvGames };
}
