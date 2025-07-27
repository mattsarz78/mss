import type { WeekInfo } from '#/graphQl.mjs';
import { useSeasonContents } from '#composables/useSeasonContents.mjs';
import { computed } from 'vue';

const isFirstWeek = (contents: WeekInfo[], week: number): boolean => {
  return contents[0].week === week;
};

const isBowlGameWeek = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'football' && contents[contents.length - 1].week === week;
};

const isBasketballPostseason = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'basketball' && contents.some((x) => x.week === week && x.postseasonInd);
};

export const useWeekScheduleNav = (sport: string, year: string, week: number) => {
  const {
    result: seasonContentsResult,
    loading: seasonContentsLoading,
    error: seasonContentsError
  } = useSeasonContents(year);

  const nextWeek = computed(() => week + 1);
  const previousWeek = computed(() => week - 1);

  const isBowlWeek = computed(() =>
    seasonContentsResult.value?.seasonContents
      ? isBowlGameWeek(sport, seasonContentsResult.value.seasonContents.seasonContents, week)
      : false
  );
  const isMbkPostseason = computed(() =>
    isBasketballPostseason(sport, seasonContentsResult.value?.seasonContents.seasonContents ?? [], week)
  );
  const isWeekOne = computed(() => isFirstWeek(seasonContentsResult.value?.seasonContents.seasonContents ?? [], week));
  const isNextWeekMbkPostseason = computed(() => {
    const nextWeek = week + 1;
    return isBasketballPostseason(sport, seasonContentsResult.value?.seasonContents.seasonContents ?? [], nextWeek);
  });
  const isNextWeekBowlWeek = computed(() => {
    const nextWeek = week + 1;
    return isBowlGameWeek(sport, seasonContentsResult.value?.seasonContents.seasonContents ?? [], nextWeek);
  });

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
};
