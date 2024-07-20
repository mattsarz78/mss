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
    return (await context.services[FootballServiceKey].getNoTvGames(args.input)).map((result: any) => {
      return {
        gameTitle: result.GameTitle,
        visitingTeam: result.VisitingTeam,
        homeTeam: result.HomeTeam,
        location: result.Location,
        conference: result.Conference,
        tvOptions: result.TVOptions,
        timeWithOffset: DateTime.fromJSDate(result.TimeWithOffset as Date).toISODate(),
        fcs: result.FCS
      } as NoTvGame;
    });
  } catch (err: unknown) {
    return (err as Error).message;
  }
};

export default {
  Query: {
    noTvGames: getNoTvGames
  }
};
