import type { ConferenceData } from '@/staticData/exportTypes';
import { contractData } from '../staticData/conference-data/contractData';

export const getConferenceContractData = (conference: string, season: string) => {
  return (
    contractData
      .find((contract) => contract.season === season)
      ?.conferenceData.find((data: ConferenceData) => data.id === conference)?.data ??
    `Data not found for ${conference} for ${season} season`
  );
};
