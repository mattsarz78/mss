import { IContext } from '../context';
import { ConferenceGame, ConferenceGamesInput } from '../__generated__/graphql';
import { FootballServiceKey } from '../database/football';
import { football } from '../__generated__/prisma';
import { DateTime } from 'luxon';
import { handleError, BadRequestError } from '../utils/errorHandler';

export interface ConferenceGamesArgs {
  input: ConferenceGamesInput;
}

export const conferenceGamesResolver = async (
  _1: unknown,
  { input }: ConferenceGamesArgs,
  context: IContext
): Promise<ConferenceGame[]> => {
  try {
    if (!input.conference || !input.season) {
      throw new BadRequestError('Conference and season are required');
    }

    const conferences = input.conference.split('|');

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
        network: conferenceGame.networkjpg?.trim() ?? '',
        tvtype: conferenceGame.tvtype?.trim() ?? '',
        conference: conferenceGame.conference?.trim() ?? ''
      }));

    return conferenceGames;
  } catch (err: unknown) {
    throw handleError(err);
  }
};

export default { Query: { conferenceGames: conferenceGamesResolver } };
