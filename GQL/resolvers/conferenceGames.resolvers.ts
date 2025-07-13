import { IContext } from '@/context';
import { FootballServiceKey } from '@database/football';
import { SeasonServiceKey } from '@database/seasonData';
import { ConferenceGame, ConferenceGameData, ConferenceGamesInput, ContractData } from '@generated/graphql';
import { football } from '@generated/prisma/client';
import contractData from '@staticData/contractData.json';
import { BadRequestError, handleError } from '@utils/errorHandler';
import { formatNetworkJpgAndCoverage } from '@utils/image';
import { DateTime } from 'luxon';

export interface ConferenceGamesArgs {
  input: ConferenceGamesInput;
}

export interface ConferenceData {
  id: string;
  data: string;
}

export const conferenceGamesResolver = async (
  _1: unknown,
  { input }: ConferenceGamesArgs,
  context: IContext
): Promise<ConferenceGameData> => {
  try {
    if (!input.conference || !input.season || !input.id) {
      throw new BadRequestError('Conference and season are required');
    }

    let conferences: string[] = [];
    if (input.conference === 'independents') {
      conferences =
        (await context.services[SeasonServiceKey].getSeasonData(input.season)).independents?.split('|') ?? [];
    } else {
      conferences = input.conference.split('|');
    }

    const conferenceResults = await Promise.all(
      conferences.map((conference) =>
        context.services[FootballServiceKey].getConferenceGames({ conference, season: input.season })
      )
    );

    let contractYearData: ContractData[] = [];

    if (input.conference === 'independents') {
      contractYearData = conferences.map((conference) => {
        const data = getConferenceContractData(input.season, conference);
        return { conference, contractText: data };
      });
    } else {
      const data = getConferenceContractData(input.season, input.id);
      contractYearData = [{ conference: input.conference, contractText: data }];
    }

    const conferenceGames: ConferenceGame[] = conferenceResults
      .flat()
      .map((conferenceGame: football) => ({
        gameTitle: conferenceGame.gametitle?.trim() ?? '',
        visitingTeam: conferenceGame.visitingteam?.trim().split(',') ?? [],
        homeTeam: conferenceGame.hometeam?.trim().split(',') ?? [],
        location: conferenceGame.location?.trim() ?? '',
        timeWithOffset: conferenceGame.timewithoffset
          ? (DateTime.fromJSDate(conferenceGame.timewithoffset).toISO() ?? '')
          : '',
        mediaIndicator: conferenceGame.mediaindicator?.trim() ?? '',
        network: formatNetworkJpgAndCoverage(conferenceGame.networkjpg?.trim() ?? '', input.season),
        tvtype: conferenceGame.tvtype?.trim() ?? '',
        conference: conferenceGame.conference?.trim() ?? ''
      }));

    return { conferences, conferenceGames, contractYearData } as ConferenceGameData;
  } catch (err: unknown) {
    throw handleError(err);
  }
};

const getConferenceContractData = (season: string, conference: string) => {
  return (
    contractData
      .find((contract) => contract.season === season)
      ?.data.find((seasonData: ConferenceData) => seasonData.id === conference)?.data ??
    `Data not found for ${conference} for ${season} season`
  );
};

export default { Query: { conferenceGames: conferenceGamesResolver } };
