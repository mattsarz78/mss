import { validSportYears } from './constants/validSportYears';
import { conferenceCasing } from './constants/conferenceCasing';
import { contractData } from './constants/conference-data';

export const getConferenceCasing = (conference: string) => conferenceCasing.find((x) => x.id === conference);

export const getConferenceCasingBySlug = (conference: string) => conferenceCasing.find((x) => x.slug === conference);

export const getConferenceContractData = (conference: string, season: string) => {
  return contractData
    .find((contract) => contract.season === season)
    ?.conferenceData.find((data) => data.id === conference)?.data;
};

export const hasBasketballPostseason = (year: string): boolean => {
  return validSportYears.find((validSportYear) => validSportYear.season === year)?.hasPostseason ?? false;
};

export const hasNoTVGames = (year: string): boolean => {
  return validSportYears.find((validSportYear) => validSportYear.season === year)?.hasNoTVGames ?? false;
};

export const shouldShowPpvColumn = (year: string): boolean => {
  return validSportYears.find((x) => x.season === year)?.showPPVColumn ?? false;
};
