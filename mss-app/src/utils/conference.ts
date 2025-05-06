import { contractData } from '../constants/conference-data';

export const getConferenceContractData = (conference: string, season: string) => {
  return (
    contractData.find((contract) => contract.season === season)?.conferenceData.find((data) => data.id === conference)
      ?.data ?? `Data not found for ${conference} for ${season} season`
  );
};
