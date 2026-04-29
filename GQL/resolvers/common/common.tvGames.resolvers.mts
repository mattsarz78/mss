import type { IContext } from '#/context.mjs';
import { CommonServiceKey } from '#database/common.mjs';
import { SeasonServiceKey } from '#database/seasonData.mjs';
import type { TvGameData, TvGamesInput } from '#generated/graphql.mjs';
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';
import { transformTvGamesResponse } from '#utils/tvGamesTransform.mts';

export interface TvGamesArgs {
  input: TvGamesInput;
}

export const tvGames = async (_1: unknown, { input }: TvGamesArgs, context: IContext): Promise<TvGameData> => {
  try {
    if (!input.season || !input.sport || (!input.week && input.week !== 0)) {
      throw new BadRequestError('Season, sport, and week are required');
    }

    // Parallelize independent queries to eliminate N+1 pattern and reduce latency
    const [seasonDataResult, results] = await Promise.all([
      context.services[SeasonServiceKey].getSeasonData(input.season),
      context.services[CommonServiceKey].getTvGames(input)
    ]);

    // Transform results using shared utility
    return transformTvGamesResponse(results, input.season, seasonDataResult);
  } catch (err: unknown) {
    throw handleError(err);
  }
};
