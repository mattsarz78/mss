import { shouldShowPpvColumn } from '@/utils/ppvColumn';
import { DateTime } from 'luxon';
import { computed } from 'vue';
import { useSeasonContents } from './useSeasonContents';
import type { WeekInfo } from '@/graphQl';
import type { FlexScheduleLink } from '@/staticData/exportTypes';
import flexScheduleLinks from '@/staticData/flexScheduleLinks.json';

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

export function useWeekScheduleNav(sport: string, paramYear: string, week: string) {
  const weekInt = parseInt(week);
  const year = computed(() =>
    sport === 'football' ? paramYear : `${paramYear.substring(0, 4)}${paramYear.substring(5)}`
  );

  const {
    result: seasonContentsResult,
    loading: seasonContentsLoading,
    error: seasonContentsError
  } = useSeasonContents(year.value);

  const nextWeek = computed(() => weekInt + 1);
  const previousWeek = computed(() => weekInt - 1);

  const isBowlWeek = computed(() =>
    seasonContentsResult.value?.seasonContents
      ? isBowlGameWeek(sport, seasonContentsResult.value.seasonContents, weekInt)
      : false
  );
  const isMbkPostseason = computed(() =>
    isBasketballPostseason(sport, seasonContentsResult.value?.seasonContents ?? [], weekInt)
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
  const isWeekOne = computed(() => isFirstWeek(seasonContentsResult.value?.seasonContents ?? [], weekInt));
  const isNextWeekMbkPostseason = computed(() =>
    isNextWeekBasketballPostseason(sport, seasonContentsResult.value?.seasonContents ?? [], weekInt)
  );
  const isNextWeekBowlWeek = computed(() =>
    isNextWeekBowlGameWeek(sport, seasonContentsResult.value?.seasonContents ?? [], weekInt)
  );
  const showPpvColumn = computed(() => shouldShowPpvColumn(year.value));

  const flexLink = computed(
    () => flexScheduleLinks.find((link: FlexScheduleLink) => link.season === year.value)?.url ?? ''
  );

  return {
    seasonContentsResult,
    seasonContentsLoading,
    seasonContentsError,
    nextWeek,
    previousWeek,
    isBowlWeek,
    isMbkPostseason,
    gamesToday,
    isWeekOne,
    isNextWeekMbkPostseason,
    isNextWeekBowlWeek,
    showPpvColumn,
    weekInt,
    year,
    flexLink
  };
}
