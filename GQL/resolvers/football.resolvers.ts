import { FootballServiceKey } from '../database/football';
import { IContext } from '../context';
import { NoTvGame, NoTvGamesInput } from '../__generated__/graphql';
import { DateTime } from 'luxon';

export type NoTvGamesArgs = {
  input: NoTvGamesInput;
};

export const getNoTvGames = async (
  _1: unknown,
  args: NoTvGamesArgs,
  context: IContext
): Promise<NoTvGame[] | string> => {
  try {
    const results = await context.services[FootballServiceKey].getNoTvGames(args.input);

    return results.map((result) => ({
      gameTitle: result.gametitle ?? '',
      visitingTeam: result.visitingteam ?? '',
      homeTeam: result.hometeam ?? '',
      location: result.location ?? '',
      conference: result.conference ?? '',
      tvOptions: result.tvoptions ?? '',
      timeWithOffset: DateTime.fromJSDate(result.timewithoffset!).toISODate()!,
      fcs: result.fcs ?? ''
    }));
  } catch (err: unknown) {
    return (err as Error).message;
  }
};

export default {
  Query: {
    noTvGames: getNoTvGames
  }
};
