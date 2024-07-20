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
  args: ConferenceGamesArgs,
  context: IContext
): Promise<ConferenceGame[] | string> => {
  try {
    const conferences = args.input.conference.split('|');
    let conferenceResponse: ConferenceGame[] = [];
    for (const conference of conferences) {
      (await context.services[FootballServiceKey].getConferenceGames({ conference, season: args.input.season })).map(
        (conferenceGame: Football) => {
          conferenceResponse.push({
            gameTitle: conferenceGame.GameTitle?.trim(),
            visitingTeam: conferenceGame.VisitingTeam?.trim().split(',') ?? [],
            homeTeam: conferenceGame.HomeTeam?.trim().split(',') ?? [],
            location: conferenceGame.Location?.trim(),
            time: setTimeString(conferenceGame.TimeWithOffset!, TimeZoneOffsets.Eastern),
            mediaIndicator: conferenceGame.MediaIndicator.trim(),
            network: conferenceGame.NetworkJPG?.trim(),
            tvtype: conferenceGame.TVType?.trim(),
            conference: conferenceGame.Conference?.trim()
          } as ConferenceGame);
        }
      );
    }
    return conferenceResponse;
  } catch (err: unknown) {
    return (err as Error).message;
  }
};

export default {
  Query: {
    conferenceGames: conferenceGamesResolver
  }
};
function setTimeString(gameTime: Date, zone: TimeZoneOffsets): string {
  const timeWithZone = DateTime.fromJSDate(gameTime, { zone: 'UTC' }).setZone(zone);
  const timeString = timeWithZone.hour === 0 && timeWithZone.minute === 0 ? 'TBA' : timeWithZone.toFormat('t');
  return `${timeWithZone.toFormat('cccc LL/dd ')}${timeString}`;
}
