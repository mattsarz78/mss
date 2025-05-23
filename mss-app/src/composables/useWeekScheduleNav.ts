import type { WeekInfo } from '@/graphQl';
import { computed } from 'vue';
import { useSeasonContents } from './useSeasonContents';

const isFirstWeek = (contents: WeekInfo[], week: number): boolean => {
  return contents[0].week === week;
};

const isNextWeekBasketballPostseason = (sport: string, contents: WeekInfo[], week: number): boolean => {
  const nextWeek = week + 1;
  return sport === 'basketball' && contents.some((x) => x.week === nextWeek && x.postseasonInd);
};

const isNextWeekBowlGameWeek = (sport: string, contents: WeekInfo[], week: number): boolean => {
  const nextWeek = week + 1;
  return sport === 'football' && contents[contents.length - 1].week === nextWeek;
};

const isBowlGameWeek = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'football' && contents[contents.length - 1].week === week;
};

const isBasketballPostseason = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'basketball' && contents.some((x) => x.week === week && x.postseasonInd);
};

export function useWeekScheduleNav(sport: string, year: string, week: number) {
  const {
    result: seasonContentsResult,
    loading: seasonContentsLoading,
    error: seasonContentsError
  } = useSeasonContents(year);

  const nextWeek = computed(() => week + 1);
  const previousWeek = computed(() => week - 1);

  const isBowlWeek = computed(() =>
    seasonContentsResult.value?.seasonContents
      ? isBowlGameWeek(sport, seasonContentsResult.value.seasonContents, week)
      : false
  );
  const isMbkPostseason = computed(() =>
    isBasketballPostseason(sport, seasonContentsResult.value?.seasonContents ?? [], week)
  );
  const isWeekOne = computed(() => isFirstWeek(seasonContentsResult.value?.seasonContents ?? [], week));
  const isNextWeekMbkPostseason = computed(() =>
    isNextWeekBasketballPostseason(sport, seasonContentsResult.value?.seasonContents ?? [], week)
  );
  const isNextWeekBowlWeek = computed(() =>
    isNextWeekBowlGameWeek(sport, seasonContentsResult.value?.seasonContents ?? [], week)
  );

  return {
    seasonContentsResult,
    seasonContentsLoading,
    seasonContentsError,
    nextWeek,
    previousWeek,
    isBowlWeek,
    isMbkPostseason,
    isWeekOne,
    isNextWeekMbkPostseason,
    isNextWeekBowlWeek
  };
}
