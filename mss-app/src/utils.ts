import { validSportYears } from './constants/validSportYears';
import { flexScheduleLinks } from './constants/flexScheduleLinks';
import type { WeekInfo } from './graphQl';

export const conferenceListBase = (sport: string, year: string): string => {
  return sport === 'football' && year !== '2021s'
    ? (validSportYears.find((validSportYear) => validSportYear.season === year)?.conferenceListBase ?? '')
    : '';
};

export const getIndependentSchools = (year: string): string => {
  return validSportYears.find((validSportYear) => validSportYear.season === year)?.independents ?? '';
};

export const flexScheduleLink = (year: string): string => {
  return flexScheduleLinks.find((link) => link.season === year)?.url ?? '';
};

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
