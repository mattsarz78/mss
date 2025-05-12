import { TV_GAMES, type TvGame } from '@/graphQl';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';
import validSportYears from '@/staticData/validSportYears.json';
import type { ValidSportYear } from '@/staticData/exportTypes';

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
