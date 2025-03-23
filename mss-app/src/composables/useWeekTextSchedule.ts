import { SEASON_CONTENTS, TV_GAMES, type TvGame, type WeekInfo } from '@/graphQl';
import { useQuery } from '@vue/apollo-composable';
import { computed } from 'vue';
import {
  getBasketballSeason,
  isBasketballPostseason,
  isBowlGameWeek,
  isFirstWeek,
  isNextWeekBasketballPostseason,
  isNextWeekBowlGameWeek
} from '@/utils';

export function useWeekTextSchedule(sport: string, paramYear: string, week: string) {
  const weekInt = parseInt(week);
  const year = computed(() => (sport === 'football' ? paramYear : getBasketballSeason(paramYear)));

  const nextWeek = computed(() => weekInt + 1);
  const previousWeek = computed(() => weekInt - 1);

  const {
    result: tvGameResult,
    loading: tvGameLoading,
    error: tvGameError
  } = useQuery<{ tvGames: TvGame[] }>(TV_GAMES, {
    input: {
      season: year.value,
      sport,
      week: weekInt
    }
  });

  const {
    result: seasonContentsResult,
    loading: seasonContentsLoading,
    error: seasonContentsError
  } = useQuery<{ seasonContents: WeekInfo[] }>(SEASON_CONTENTS, {
    input: {
      season: year.value
    }
  });

  const isBowlWeek = computed(() => isBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
  const isMbkPostseason = computed(
    () => isBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, weekInt) //eslint-disable-line
  );
  const isWeekOne = computed(() => isFirstWeek(seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
  const isNextWeekMbkPostseason = computed(
    () => isNextWeekBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, weekInt) //eslint-disable-line
  );
  const isNextWeekBowlWeek = computed(
    () => isNextWeekBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, weekInt) //eslint-disable-line
  );

  return {
    tvGameResult,
    tvGameLoading,
    tvGameError,
    seasonContentsResult,
    seasonContentsLoading,
    seasonContentsError,
    year,
    nextWeek,
    previousWeek,
    isBowlWeek,
    isMbkPostseason,
    isWeekOne,
    isNextWeekMbkPostseason,
    isNextWeekBowlWeek
  };
}
