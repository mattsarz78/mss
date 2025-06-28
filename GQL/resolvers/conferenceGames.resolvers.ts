import { DateTime } from 'luxon';
import { ConferenceGame, ConferenceGameData, ConferenceGamesInput } from '../__generated__/graphql';
import { football } from '../__generated__/prisma/client';
import { IContext } from '../context';
import { FootballServiceKey } from '../database/football';
import { SeasonServiceKey } from '../database/seasonData';
import { BadRequestError, handleError } from '../utils/errorHandler';
import { formatNetworkJpgAndCoverage } from '../utils/image';

export interface ConferenceGamesArgs {
  input: ConferenceGamesInput;
}

export const conferenceGamesResolver = async (
  _1: unknown,
  { input }: ConferenceGamesArgs,
  context: IContext
): Promise<ConferenceGameData> => {
  try {
    if (!input.conference || !input.season) {
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

    return { conferences, conferenceGames } as ConferenceGameData;
  } catch (err: unknown) {
    throw handleError(err);
  }
};

export default { Query: { conferenceGames: conferenceGamesResolver } };
