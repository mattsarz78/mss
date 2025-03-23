import { NO_TV_GAMES, SEASON_CONTENTS, TV_GAMES, type NoTvGame, type TvGame, type WeekInfo } from '@/graphQl';
import { useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { computed } from 'vue';
import {
  getBasketballSeason,
  flexScheduleLink,
  isBowlGameWeek,
  isBasketballPostseason,
  hasNoTVGames,
  isFirstWeek,
  isNextWeekBasketballPostseason,
  isNextWeekBowlGameWeek,
  shouldShowPpvColumn
} from '@/utils';

export function useWeekSchedule(sport: string, paramYear: string, week: string) {
  const weekInt = parseInt(week);
  const year = computed(() => (sport === 'football' ? paramYear : getBasketballSeason(paramYear)));
  const flexLink = computed(() => flexScheduleLink(year.value));
  const showNoTvGames = computed(() => hasNoTVGames(year.value));

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

  const {
    result: noTvGamesResult,
    loading: noTvGamesLoading,
    error: noTvGamesError
  } = useQuery<{ noTvGames: NoTvGame[] }>(NO_TV_GAMES, {
    input: {
      season: year.value,
      week: weekInt
    }
  });

  const nextWeek = computed(() => weekInt + 1);
  const previousWeek = computed(() => weekInt - 1);

  const isBowlWeek = computed(() => isBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
  const isMbkPostseason = computed(
    () => isBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, weekInt) //eslint-disable-line
  );
  const gamesToday = computed(() => {
    return (
      seasonContentsResult.value?.seasonContents
        .filter((x) => x.week === weekInt)
        .some((x) => {
          const dateToCompare = DateTime.now().setZone('America/New_York');
          return DateTime.fromISO(x.endDate) >= dateToCompare && DateTime.fromISO(x.startDate) <= dateToCompare;
        }) ?? false
    );
  });
  const isWeekOne = computed(() => isFirstWeek(seasonContentsResult.value?.seasonContents!, weekInt)); //eslint-disable-line
  const isNextWeekMbkPostseason = computed(
    () => isNextWeekBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, weekInt) //eslint-disable-line
  );
  const isNextWeekBowlWeek = computed(
    () => isNextWeekBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, weekInt) //eslint-disable-line
  );
  const showPpvColumn = computed(() => shouldShowPpvColumn(year.value));

  return {
    tvGameResult,
    tvGameLoading,
    tvGameError,
    seasonContentsResult,
    seasonContentsLoading,
    seasonContentsError,
    noTvGamesResult,
    noTvGamesLoading,
    noTvGamesError,
    year,
    flexLink,
    showNoTvGames,
    nextWeek,
    previousWeek,
    isBowlWeek,
    isMbkPostseason,
    gamesToday,
    isWeekOne,
    isNextWeekMbkPostseason,
    isNextWeekBowlWeek,
    showPpvColumn
  };
}
