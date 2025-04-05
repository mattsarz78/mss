import { FootballServiceKey } from '../database/football';
import { IContext } from '../context';
import { NoTvGame, NoTvGamesInput } from '../__generated__/graphql';
import { DateTime } from 'luxon';

export interface NoTvGamesArgs {
  input: NoTvGamesInput;
}

export const getNoTvGames = async (
  _1: unknown,
  { input }: NoTvGamesArgs,
  context: IContext
): Promise<NoTvGame[] | string> => {
  try {
    const results =
      await context.services[FootballServiceKey].getNoTvGames(input);

    return results.map((result) => ({
      gameTitle: result.gametitle?.trim() ?? '',
      visitingTeam: result.visitingteam?.trim() ?? '',
      homeTeam: result.hometeam?.trim() ?? '',
      location: result.location?.trim() ?? '',
      conference: result.conference?.trim() ?? '',
      tvOptions: result.tvoptions?.trim() ?? '',
      timeWithOffset: result.timewithoffset
        ? (DateTime.fromJSDate(result.timewithoffset).toISODate() ?? '')
        : '',
      fcs: result.fcs?.trim() ?? ''
    }));
  } catch (err: unknown) {
    console.error(`Error fetching no TV games: ${(err as Error).message}`);
    return (err as Error).message;
  }
};

export default { Query: { noTvGames: getNoTvGames } };
