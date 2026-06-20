import { type WeekInfo } from '#/graphQl.mjs';
import { useMemo } from 'react';
import { useSeasonContents } from '#hooks/index.mjs';

const isFirstWeek = (contents: WeekInfo[], week: number): boolean => {
  return contents[0].week === week;
};

const isBowlGameWeek = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'football' && contents[contents.length - 1].week === week;
};

const isBasketballPostseason = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'basketball' && contents.some((x) => x.week === week && x.postseasonInd);
};

const EMPTY_ARRAY: WeekInfo[] = [];

export const useWeekScheduleNav = (sport: string, year: string, week: number) => {
  const {
    result: seasonContentsResult,
    loading: seasonContentsLoading,
    error: seasonContentsError
  } = useSeasonContents(year);

  const nextWeek = useMemo(() => week + 1, [week]);
  const previousWeek = useMemo(() => week - 1, [week]);

  const seasonContents = seasonContentsResult?.seasonContents?.seasonContents ?? EMPTY_ARRAY;

  const isBowlWeek = useMemo(
    () => (seasonContents.length ? isBowlGameWeek(sport, seasonContents, week) : false),
    [sport, seasonContents, week]
  );

  const isMbkPostseason = useMemo(
    () => isBasketballPostseason(sport, seasonContents, week),
    [sport, seasonContents, week]
  );

  const isWeekOne = useMemo(
    () => (seasonContents.length ? isFirstWeek(seasonContents, week) : false),
    [seasonContents, week]
  );

  const isNextWeekMbkPostseason = useMemo(
    () => isBasketballPostseason(sport, seasonContents, nextWeek),
    [sport, seasonContents, nextWeek]
  );

  const isNextWeekBowlWeek = useMemo(
    () => (seasonContents.length ? isBowlGameWeek(sport, seasonContents, nextWeek) : false),
    [sport, seasonContents, nextWeek]
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
};
