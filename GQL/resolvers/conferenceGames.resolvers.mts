import type { IContext } from '#/context.mjs';
import { FootballServiceKey } from '#database/football.mjs';
import { SeasonServiceKey } from '#database/seasonData.mjs';
import type { ConferenceGame, ConferenceGameData, ConferenceGamesInput, ContractData } from '#generated/graphql.mjs';
import type { football } from '#generated/prisma/client.mjs';
import contractData from '#staticData/contractData.json' with { type: 'json' };
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';
import { formatNetworkBatch } from '#utils/image.mjs';
import { splitBy, splitComma } from '#utils/string.mjs';

export interface ConferenceGamesArgs {
  input: ConferenceGamesInput;
}

export interface ConferenceData {
  id: string;
  data: string;
}

// Build contract data index once for O(1) lookups instead of linear search
const contractDataIndex = new Map<string, Map<string, string>>();
contractData.forEach((contract) => {
  const seasonMap = new Map<string, string>();
  contract.data.forEach((seasonData: ConferenceData) => {
    seasonMap.set(seasonData.id, seasonData.data);
  });
  contractDataIndex.set(contract.season, seasonMap);
});

export const conferenceGames = async (
  _1: unknown,
  { input }: ConferenceGamesArgs,
  context: IContext
): Promise<ConferenceGameData> => {
  try {
    if (!input.conference || !input.season || !input.id) {
      throw new BadRequestError('Conference and season are required');
    }

    let conferences: string[] = [];
    let seasonData;

    if (input.conference === 'independents') {
      seasonData = await context.services[SeasonServiceKey].getSeasonData(input.season);
      conferences = splitBy(seasonData.independents ?? '', '|') ?? [];
    } else {
      conferences = splitBy(input.conference, '|');
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

    // Batch fetch formatted network strings to avoid many concurrent promises
    const flattened = conferenceResults.flat();
    const pairs: Array<{ input: string; season: string }> = flattened.map((cg: football) => ({
      input: cg.networkjpg ?? '',
      season: input.season
    }));

    const batch = await formatNetworkBatch(pairs);

    const conferenceGames: ConferenceGame[] = flattened.map((conferenceGame: football) => ({
      gameTitle: conferenceGame.gametitle ?? '',
      visitingTeam: splitComma(conferenceGame.visitingteam ?? ''),
      homeTeam: splitComma(conferenceGame.hometeam ?? ''),
      location: conferenceGame.location ?? '',
      timeWithOffset: conferenceGame.timewithoffset ? conferenceGame.timewithoffset.toISOString() : '',
      mediaIndicator: conferenceGame.mediaindicator ?? '',
      network: batch.get(`${conferenceGame.networkjpg ?? ''}::${input.season}`) ?? '',
      tvtype: conferenceGame.tvtype ?? '',
      conference: conferenceGame.conference ?? ''
    }));

    return { conferences, conferenceGames, contractYearData } as ConferenceGameData;
  } catch (err: unknown) {
    throw handleError(err);
  }
};

const getConferenceContractData = (season: string, conference: string) => {
  // Use pre-built index for O(1) lookup instead of linear search
  return contractDataIndex.get(season)?.get(conference) ?? `Data not found for ${conference} for ${season} season`;
};
