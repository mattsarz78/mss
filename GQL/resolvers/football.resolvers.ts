import { FootballServiceKey } from '../database/football';
import { IContext } from '../context';
import { NoTvGame, NoTvGamesInput } from '../__generated__/graphql';
import { handleError, BadRequestError } from '../utils/errorHandler';
import { DateTime } from 'luxon';

export interface NoTvGamesArgs {
  input: NoTvGamesInput;
}

export const getNoTvGames = async (_1: unknown, { input }: NoTvGamesArgs, context: IContext): Promise<NoTvGame[]> => {
  try {
    if (!input.season || (!input.week && input.week !== 0)) {
      throw new BadRequestError('Season is required');
    }

    const results = await context.services[FootballServiceKey].getNoTvGames(input);
    return results.map((result) => ({
      gameTitle: result.gametitle?.trim() ?? '',
      visitingTeam: result.visitingteam?.trim() ?? '',
      homeTeam: result.hometeam?.trim() ?? '',
      location: result.location?.trim() ?? '',
      conference: result.conference?.trim() ?? '',
      tvOptions: result.tvoptions?.trim() ?? '',
      timeWithOffset: result.timewithoffset ? (DateTime.fromJSDate(result.timewithoffset).toISO() ?? '') : '',
      fcs: result.fcs?.trim() ?? ''
    }));
  } catch (err: unknown) {
    throw handleError(err);
  }
};

export default { Query: { noTvGames: getNoTvGames } };
