import contractData from '@/staticData/conference-data/contractData.json';
import type { ConferenceData } from '@/staticData/exportTypes';

export const getConferenceContractData = (conference: string, season: string) => {
  return (
    contractData
      .find((contract) => contract.season === season)
      ?.data.find((seasonData: ConferenceData) => seasonData.id === conference)?.data ??
    `Data not found for ${conference} for ${season} season`
  );
};
