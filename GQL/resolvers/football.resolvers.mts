import type { IContext } from '#/context.mjs';
import { FootballServiceKey, type NoTVGames } from '#database/football.mjs';
import type { NoTvGame, NoTvGamesInput } from '#generated/graphql.mjs';
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';

export interface NoTvGamesArgs {
  input: NoTvGamesInput;
}

export const noTvGames = async (_1: unknown, { input }: NoTvGamesArgs, context: IContext): Promise<NoTvGame[]> => {
  try {
    if (!input.season || (!input.week && input.week !== 0)) {
      throw new BadRequestError('Season is required');
    }

    const results = await context.services[FootballServiceKey].getNoTvGames(input);
    return results.map((result) => ({
      gameTitle: result.gametitle ?? '',
      visitingTeam: result.visitingteam ?? '',
      homeTeam: result.hometeam ?? '',
      location: result.location ?? '',
      conference: result.conference ?? '',
      tvOptions: updatedTvOptions(result),
      timeWithOffset: result.timewithoffset ? result.timewithoffset.toISOString() : '',
      fcs: result.fcs ?? ''
    }));
  } catch (err: unknown) {
    throw handleError(err);
  }
};

const updatedTvOptions = (game: NoTVGames): string => {
  if (game.conference === 'American' && game.hometeam === 'Navy') {
    return game.tvoptions?.replace(' or ESPN+', ', CBS or CBS Sports Network') ?? 'Unknown';
  }

  if (game.conference === 'American' && game.hometeam === 'Army West Point') {
    return 'CBS or CBS Sports Network';
  }

  return game.tvoptions ?? 'Unknown';
};
