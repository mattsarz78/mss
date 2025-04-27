import type { WeekInfo } from '../graphQl';

export const getBasketballSeason = (year: string): string => {
  return `${year.substring(0, 4)}${year.substring(5)}`;
};

export const isFirstWeek = (contents: WeekInfo[], week: number): boolean => {
  return contents[0].week === week;
};

export const isNextWeekBasketballPostseason = (sport: string, contents: WeekInfo[], week: number): boolean => {
  const nextWeek = week + 1;
  return sport === 'basketball' && contents.some((x) => x.week === nextWeek && x.postseasonInd);
};

export const isNextWeekBowlGameWeek = (sport: string, contents: WeekInfo[], week: number): boolean => {
  const nextWeek = week + 1;
  return sport === 'football' && contents[contents.length - 1].week === nextWeek;
};

export const isBowlGameWeek = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'football' && contents[contents.length - 1].week === week;
};

export const isBasketballPostseason = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'basketball' && contents.some((x) => x.week === week && x.postseasonInd);
};
