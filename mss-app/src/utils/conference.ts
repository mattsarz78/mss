import { validSportYears } from '../constants/validSportYears';
import { contractData } from '../constants/conference-data';

export const getConferenceContractData = (conference: string, season: string) => {
  return contractData
    .find((contract) => contract.season === season)
    ?.conferenceData.find((data) => data.id === conference)?.data;
};

export const shouldShowPpvColumn = (year: string): boolean => {
  return validSportYears.find((x) => x.season === year)?.showPPVColumn ?? false;
};
