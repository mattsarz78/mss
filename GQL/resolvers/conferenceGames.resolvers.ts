import { IContext } from '../context';
import { ConferenceGame, ConferenceGamesInput } from '../__generated__/graphql';
import { FootballServiceKey } from '../database/football';
import { Football } from '../__generated__/prisma';
import { DateTime } from 'luxon';
import { TimeZoneOffsets } from '../utils/constants';

export type ConferenceGamesArgs = {
  input: ConferenceGamesInput;
};

export const conferenceGamesResolver = async (
  _1: unknown,
  { input }: ConferenceGamesArgs,
  context: IContext
): Promise<ConferenceGame[] | string> => {
  try {
    const conferences = input.conference.split('|');

    const conferenceResults = await Promise.all(
      conferences.map((conference) =>
        context.services[FootballServiceKey].getConferenceGames({ conference, season: input.season })
      )
    );

    const conferenceGames: ConferenceGame[] = conferenceResults.flat().map((conferenceGame: Football) => ({
      gameTitle: conferenceGame.GameTitle?.trim(),
      visitingTeam: conferenceGame.VisitingTeam?.trim().split(',') ?? [],
      homeTeam: conferenceGame.HomeTeam?.trim().split(',') ?? [],
      location: conferenceGame.Location?.trim(),
      timeWithOffset: DateTime.fromJSDate(conferenceGame.TimeWithOffset as Date).toISO()!,
      mediaIndicator: conferenceGame.MediaIndicator.trim(),
      network: conferenceGame.NetworkJPG?.trim(),
      tvtype: conferenceGame.TVType?.trim(),
      conference: conferenceGame.Conference?.trim()
    }));

    return conferenceGames;
  } catch (err: unknown) {
    return (err as Error).message;
  }
};

export default {
  Query: {
    conferenceGames: conferenceGamesResolver
  }
};
