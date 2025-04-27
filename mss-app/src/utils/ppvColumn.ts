import { validSportYears } from '../constants/validSportYears';

export const shouldShowPpvColumn = (year: string): boolean => {
  return validSportYears.find((x) => x.season === year)?.showPPVColumn ?? false;
};
