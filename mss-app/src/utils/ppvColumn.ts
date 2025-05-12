import type { ValidSportYear } from '@/staticData/exportTypes';
import validSportYears from '@/staticData/validSportYears.json';

export const shouldShowPpvColumn = (year: string): boolean => {
  return validSportYears.find((x: ValidSportYear) => x.season === year)?.showPPVColumn ?? false;
};
